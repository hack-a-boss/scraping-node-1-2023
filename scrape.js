const axios = require("axios");
const { JSDOM } = require("jsdom");
const fs = require("fs/promises");
const ke = require("keyword-extractor");

const sources = require("./sources");

const MAX_ITEMS = 10;
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

function getTags(headlines) {
  //Esta función recibe un array simple con el texto de todos los titulares extraídos

  //Para hacer más fácil el recuento vamos a usar una estructura Map de JS, mirad aquí: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
  const tagMap = new Map();

  //Recorro cada uno de los titulares
  for (const headline of headlines) {
    //Extraigo las palabras clave del titular
    const tags = ke.extract(headline, {
      language: "spanish",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: false,
    });

    //Recorro las palabras clave extraída
    for (const tag of tags) {
      //Si el tag no está en el Map lo añado con un contador que vale 1
      if (!tagMap.get(tag)) {
        tagMap.set(tag, 1);
      } else {
        //Si ya está en el map añado 1 al contador
        tagMap.set(tag, tagMap.get(tag) + 1);
      }
    }
  }

  //Convierto el map en un array con una estructura similar a esta [[tag1, contador], [tag2, contador], [tag3, contador],...]
  // ... y lo ordeno
  const sortedTags = Array.from(tagMap).sort((a, b) => b[1] - a[1]);

  return sortedTags.slice(0, MAX_ITEMS);
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

    const keywords = getTags(
      payload.reduce((accumulator, current) => {
        return [
          ...accumulator,
          ...current.headlines.map((headline) => headline.title),
        ];
      }, [])
    );

    const content = {
      tags: keywords,
      data: payload,
    };

    await fs.writeFile(FILENAME, JSON.stringify(content, null, 4));

    console.log(`Titulares guardados en ${FILENAME}`);
  } catch (error) {
    console.error(error);
  }
}

module.exports = main;
