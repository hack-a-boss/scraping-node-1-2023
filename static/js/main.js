const app = document.querySelector("section.app");
const header = document.querySelector("body > header");

function writeHeadlines(headlines) {
  const blocks = document.createElement("ul");
  blocks.classList.add("blocks");

  for (const source of headlines) {
    const block = document.createElement("li");

    const title = document.createElement("h2");
    const link = document.createElement("a");
    link.setAttribute("href", source.url);
    link.textContent = source.name;

    const headlinesList = document.createElement("ul");

    for (const headline of source.headlines) {
      const headLineLi = document.createElement("li");
      const headLineLink = document.createElement("a");
      headLineLink.setAttribute("href", headline.link);
      headLineLink.textContent = headline.title;

      headLineLi.append(headLineLink);
      headlinesList.append(headLineLi);
    }

    title.append(link);
    block.append(title);
    block.append(headlinesList);
    blocks.append(block);
  }

  app.append(blocks);
}

function writeKeywords(keywords) {
  const keywordsList = document.createElement("ul");
  for (const keyword of keywords) {
    const keywordLi = document.createElement("li");
    keywordLi.textContent = keyword[0];

    keywordsList.append(keywordLi);
  }

  header.append(keywordsList);
}

async function main() {
  try {
    const response = await fetch("/headlines.json");

    const { tags, data } = await response.json();

    writeHeadlines(data);
    writeKeywords(tags);
  } catch (error) {
    console.error(error);
  }
}

main();
