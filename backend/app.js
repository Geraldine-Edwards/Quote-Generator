
import cors from "cors";
import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import {quotes, pickFromArray} from './quotes-data.js'

const app = express();
app.use(cors());
const port = 3000;

// Local Dev only: get the absolute path of this file and its directory (ES module equivalent of __filename and __dirname)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.json(pickFromArray(quotes));
});

app.post('/', (req, res) => {
  // collect incoming data chunks from the request body
  const bodyBytes = [];
  req.on("data", chunk => bodyBytes.push(...chunk));

  // 'end' signals all data has been received, we can then process the complete body
  req.on("end", () => {
    const bodyString = String.fromCharCode(...bodyBytes);
    let body;
    try {
      body = JSON.parse(bodyString);
    } catch (error) {
      console.error(`Failed to parse body ${bodyString} as JSON: ${error}`);
      res.status(400).send("Expected body to be JSON.");
      return;
    }
    // validate that the parsed object has both 'quote' and 'author'
    if (typeof body != "object" || !("quote" in body) || !("author" in body)) {
      console.error(`Failed to extract quote and author from post body: ${bodyString}`);
      res.status(400).send("Expected body to be a JSON object containing keys quote and author.");
      return;
    }
    // add the new quote to the quotes array
    quotes.push({
      quote: body.quote,
      author: body.author,
    });
    res.send("ok");
  });
});

app.listen(port, () => {
  console.error(`Quote server listening on port ${port}`);
});