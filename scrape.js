const axios = require("axios");
const { JSDOM } = require("jsdom");
const fs = require("fs/promises");

const URL = "https://elpais.com";
const SELECTOR = "h2.c_t a";
const MAX_ITEMS = 20;
const FILENAME = "elpais.json";

async function main() {
  try {
    //Leer el HTML de elpais.com
    const { data } = await axios.get(URL);

    //Convertir ese HTML a una estructura de DOM
    const dom = new JSDOM(data);

    //Extraer todos los titulares de esa estructura de DOM (titulo, url)

    const headlineElements = dom.window.document.querySelectorAll(SELECTOR);

    const headlines = Array.from(headlineElements).map((headline) => {
      const link = headline.getAttribute("href");
      return {
        title: headline.textContent,
        link: link.startsWith(URL) ? link : `${URL}${link}`,
      };
    });

    //Guardar los primeros 20 titulares en un JSON en el disco
    const payload = headlines.slice(0, MAX_ITEMS);

    await fs.writeFile(FILENAME, JSON.stringify(payload, null, 4));

    console.log(`Titulares de ${URL} guardados en ${FILENAME}`);
  } catch (error) {
    console.error(error);
  }
}

main();
