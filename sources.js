module.exports = [
  {
    url: "https://elpais.com",
    name: "El País",
    selector: "h2.c_t a",
  },
  {
    url: "https://www.elmundo.es",
    name: "El Mundo",
    selector: ".ue-c-cover-content__link",
    extraRequestParams: {
      responseType: "arraybuffer",
    },
  },
  {
    url: "https://www.eldiario.es",
    name: "El Diario",
    selector: "h2.ni-title a",
  },
  {
    url: "https://as.com",
    name: "Diario AS",
    selector: "h2.s__tl a",
  },
  {
    url: "https://www.xataka.com",
    name: "Xataka",
    selector: ".poster-title a, .abstract-title a",
  },
];
