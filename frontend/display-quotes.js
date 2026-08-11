const BACKEND_URL = ["localhost", "127.0.0.1"].includes(
  window.location.hostname
)
  ? "http://localhost:3000/"
  : "https://ge-quote-generator-backend.trainees.hosting.cyf.academy/";

async function fetchAndDisplayQuote() {
  const quoteEl = document.getElementById("quote");
  const authorEl = document.getElementById("author");
  if (!quoteEl || !authorEl) return;

  quoteEl.textContent = "Loading...";

  try {
    const response = await fetch(BACKEND_URL);
    if (!response.ok) throw new Error("Error fetching quotes");

    const data = await response.json();

    //display the random quote and author in the HTML elements
    quoteEl.textContent = data.quote;
    authorEl.textContent = data.author || "";
  } catch (error) {
    quoteEl.textContent = "Sorry, could not load a quote.";
    authorEl.textContent = "";
    console.error(error);
  }
}

//initial random quote when page loads
window.addEventListener("load", fetchAndDisplayQuote);

//add an event listener to the button to generate a new random quote
document
  .getElementById("new-quote")
  .addEventListener("click", fetchAndDisplayQuote);

async function addQuote(quote, author) {
  const messageElem = document.getElementById("add-quote-message");

  if (!messageElem) return;

  try {
    // set the Content-Type header to application/json so the backend knows to expect JSON data
    // browser sends data as raw binary (bytes) over the network
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quote, author }),
    });

    // clear previous success/error style
    messageElem.classList.remove("add-quote-success", "add-quote-error");

    if (response.ok) {
      messageElem.textContent = "Quote added!";
      // if success add the bootstrap style
      messageElem.classList.add("add-quote-success");
      //reset the form
      if (formElem) formElem.reset();
    } else {
      // when the server HTTP response is not 200-299
      const error = await response.text();
      messageElem.textContent =
        error ||
        "Could not add your quote. Please check your input and try again.";
      messageElem.classList.add("add-quote-error");
    }

    setTimeout(() => {
      messageElem.textContent = "";
      messageElem.classList.remove("add-quote-success", "add-quote-error");
    }, 4000);
  } catch (error) {
    if (!messageElem) return;
    messageElem.textContent =
      "Network error: Unable to reach the server. Please try again later.";
    messageElem.classList.remove("add-quote-success");
    messageElem.classList.add("add-quote-error");
    setTimeout(() => {
      messageElem.textContent = "";
      messageElem.classList.remove("add-quote-error");
    }, 4000);
  }
}

// Add submit event handler to the form
const formElem = document.getElementById("add-quote-form");
if (formElem) {
  formElem.addEventListener("submit", function (event) {
    event.preventDefault();
    const quoteEl = document.getElementById("new-text");
    const authorEl = document.getElementById("new-author");
    if (!quoteEl || !authorEl) return;
    const quote = quoteEl.value.trim();
    const author = authorEl.value.trim();
    if (!quote || !author) return;
    addQuote(quote, author);
  });
}
