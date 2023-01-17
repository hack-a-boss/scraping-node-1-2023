const express = require("express");
const fs = require("fs/promises");
const scraper = require("./scrape");

const app = express();

//Esto muestra como contenido estático los contenidos de la carpeta static
app.use(express.static("./static"));

//Devuelve el contenido de headlines.json
app.get("/headlines.json", async (req, res) => {
  try {
    const headlines = await fs.readFile("./headlines.json");

    return res.send(JSON.parse(headlines));
  } catch (e) {
    return res
      .status(500)
      .send({ status: "error", message: "Error leyendo los titulares" });
  }
});

app.listen(3000, () => {
  setInterval(async () => {
    scraper();
  }, 1000 * 60 * 5);

  scraper();

  console.log(`Servidor funcionando 👌`);
});
