const axios = require("axios");
const { JSDOM } = require("jsdom");
const fs = require("fs/promises");

const sources = require("./sources");

const MAX_ITEMS = 20;
const FILENAME = "headlines.json";

async function getHeadlines({ url, selector, extraRequestParams }) {
  //Leer el HTML de la url
  const { data } = await axios.get(url, {
    ...extraRequestParams,
  });

  //Convertir ese HTML a una estructura de DOM
  const dom = new JSDOM(data);

  //Extraer todos los titulares de esa estructura de DOM (titulo, url)

  const headlineElements = dom.window.document.querySelectorAll(selector);

  const headlines = Array.from(headlineElements).map((headline) => {
    const link = headline.getAttribute("href");
    return {
      title: headline.textContent.trim(),
      link: link.startsWith(url) ? link : `${url}${link}`,
    };
  });

  return headlines.slice(0, MAX_ITEMS);
}

async function main() {
  try {
    const payload = await Promise.all(
      sources.map(async (source) => {
        return {
          url: source.url,
          name: source.name,
          headlines: await getHeadlines({
            url: source.url,
            selector: source.selector,
            extraRequestParams: source.extraRequestParams,
          }),
        };
      })
    );

    await fs.writeFile(FILENAME, JSON.stringify(payload, null, 4));

    console.log(`Titulares guardados en ${FILENAME}`);
  } catch (error) {
    console.error(error);
  }
}

main();
