const axios = require("axios");
const { JSDOM } = require("jsdom");
const fs = require("fs/promises");

const URL = "https://elpais.com";
const SELECTOR = "article.c-d";
const MAX_ITEMS = 20;
const FILENAME = "elpais-full.json";

async function main() {
  try {
    //Leer el HTML de elpais.com
    const { data } = await axios.get(URL);

    //Convertir ese HTML a una estructura de DOM
    const dom = new JSDOM(data);

    //Extraer todos los titulares de esa estructura de DOM (titulo, url)

    const articleElements = dom.window.document.querySelectorAll(SELECTOR);

    const items = Array.from(articleElements).map((article) => {
      const headline = article.querySelector("h2.c_t a");
      const intro = article.querySelector("p.c_d");
      const img = article.querySelector("img");

      const link = headline.getAttribute("href");

      const item = {
        title: headline.textContent,
        link: link.startsWith(URL) ? link : `${URL}${link}`,
      };

      if (intro) {
        item.intro = intro.textContent;
      }

      if (img) {
        item.image = img.getAttribute("src");
      }

      return item;
    });

    //Guardar los primeros 20 titulares en un JSON en el disco
    const payload = items.slice(0, MAX_ITEMS);

    await fs.writeFile(FILENAME, JSON.stringify(payload, null, 4));

    console.log(`Titulares de ${URL} guardados en ${FILENAME}`);
  } catch (error) {
    console.error(error);
  }
}

main();
