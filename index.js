const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;

const movie = "https://www.imdb.com/title/tt0242519/";

(async () => {
  let imdbData = [];
  const response = await request({
    uri: movie,
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
    },
    gzip: true,
  });

  let $ = cheerio.load(response);
  let title = $('div[class="title_wrapper"] > h1').text().trim();
  let rating = $('div[class="ratingValue"] > strong > span').text().trim();
  let summary = $('div[class="plot-text"]').text();
  let releaseDate = $('a[title="See more release dates"]').text().trim();

  imdbData.push({
    title,
    rating,
    summary,
    releaseDate,
  });
  const j2cp = new json2csv();
  const csv = j2cp.parse(imdbData);

  fs.writeFileSync("./imdb.csv", csv, "utf-8");
})();
