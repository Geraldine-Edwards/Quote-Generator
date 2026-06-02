import cors from "cors";
import express from "express";
import { quotes } from './quotes.js'
import { allowedOrigins } from './config.js';

const app = express();
const port = process.env.PORT || 3000;


// validation outputs helper function
function validateQuoteBody(body) {
  if (body == null || typeof body !== 'object' || Array.isArray(body) || !('quote' in body) || !('author' in body)) {
    return "Missing data: Please include both 'quote' and 'author' fields.";
  }
  if (typeof body.quote !== 'string' || typeof body.author !== 'string') {
    return "Both 'quote' and 'author' must be strings.";
  }

  const quote = body.quote.trim();
  const author = body.author.trim();

  if (!quote) return "The 'quote' field must be a non-empty string.";
  if (!author) return "The 'author' field must be a non-empty string.";

  if (quote.length > 1000) return "The 'quote' is too long";
  if (author.length > 200) return "The 'author' is too long";

  // when valid
  return null; 
}


function pickFromArray(choices) {
  return choices[Math.floor(Math.random() * choices.length)];
}


//  ensure that CORS is restricted to allow requests only from the deployed frontend
// const allowedDomain = [
//   "https://geraldine-edwards-quote-generator-frontend.hosting.codeyourfuture.io",
//   "http://localhost:5501",
//   "http://127.0.0.1:5501"
// ];

// app.use(cors({
//   origin: allowedDomain
// }));
app.use(cors());

app.get('/', (req, res) => {
  res.json(pickFromArray(quotes));
});

app.post('/', (req, res) => {
  //immediately stop if the request is not correct format
  if (!req.is('application/json')) {
    return res.status(400).send('Expected application/json');
  }
  // collect all incoming raw binary data chunks (bytes) from the request body in addQuote() function from display-quotes.js
  const bodyChunks = [];
  req.on("data", chunk => bodyChunks.push(chunk));

  // 'end' signals all data has been received, so can then process the complete body
  req.on("end", () => {
      //concatenate the chunks of raw binary data to get the string then parse
      const bodyText = Buffer.concat(bodyChunks).toString();
      let body;
      try {
        body = JSON.parse(bodyText);
      } catch (error) {
        // Log the error/stack
        console.error(`Failed to parse body as JSON: `, error);
        res.status(400).send("Expected body to be JSON.");
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
      quote: body.quote.trim(),
      author: body.author.trim(),
    });
    res.status(201).json({ok: true});
  });
});

app.listen(port, () => {
  console.error(`Quote server listening on port ${port}`);
});