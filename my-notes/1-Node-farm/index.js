const fs = require("fs");
const http = require("http");
const url = require("url");

/////////////////////////////////////////////
// FILES HANDLING

// Blocking, synchronus way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");

// console.log(textIn);

// const textOut = `This is what we know about avocado: ${textIn}.\nCreate on ${new Date(
//   Date.now()
// ).toString()}`;

// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File is written!");

// Non-blocking,asynchronus way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("Error! 🔥 ");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your filw has been written 😊");
//       });
//     });
//   });
// });

// console.log("will read this file first");

/////////////////////////////////////////////
// SERVER
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return output;
};
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const temProducts = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const productData = JSON.parse(data);

const server = http.createServer((req, res) => {
  console.log(req.url);
  const pathName = req.url;

  // OVERVIEW PAGE
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = productData
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    // console.log(cardsHtml);
    res.end(output);

    // PRODUCT PAGE
  } else if (pathName === "/product") {
    res.end("This is the PRODUCT");

    // API
  } else if (pathName === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    // res.end("API");
    res.end(data);

    // NOT FOUND
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1 >Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000");
});
