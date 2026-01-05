import cors from "cors";
import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import {quotes, pickFromArray} from './quotes-data.js'

const app = express();

//  ensure that CORS is restricted to allow requests only from the deployed frontend
const allowedDomain = [
  "https://geraldine-edwards-quote-generator-frontend.hosting.codeyourfuture.io"
];

// validation outputs helper function
function validateQuoteBody(body) {
  if (typeof body !== "object" || !("quote" in body) || !("author" in body)) {
    return "Missing data: Please include both 'quote' and 'author' fields.";
  }
  if (typeof body.quote !== "string" || body.quote.trim() === "") {
    return "The 'quote' field must be a non-empty string.";
  }
  if (typeof body.author !== "string" || body.author.trim() === "") {
    return "The 'author' field must be a non-empty string.";
  }
  // when valid
  return null; 
}

app.use(cors({
  origin: allowedDomain
}));
const port = 3000;

// Local Dev only: get the absolute path of this file and its directory (ES module equivalent of __filename and __dirname)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.json(pickFromArray(quotes));
});

app.post('/', (req, res) => {
  // collect incoming data chunks (bytes) from the request body in addQuote() function from display-quotes.js
  const bodyBytes = [];
  req.on("data", chunk => bodyBytes.push(...chunk));

  // 'end' signals all data has been received, so can then process the complete body
  req.on("end", () => {
    const bodyString = String.fromCharCode(...bodyBytes);
    let body;
    try {
      body = JSON.parse(bodyString);
    } catch (error) {
      console.error(`Failed to parse body ${bodyString} as JSON: ${error}`);
      res.status(400).send("Invalid data format: Please send valid JSON.");
      return;
    }
    // validation errors
    const validationError = validateQuoteBody(body);
    if (validationError) {
      res.status(400).send(validationError);
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