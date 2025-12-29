async function fetchAndDisplayQuote() {
  try {
    const response = await fetch('http://localhost:3000/api/quote');
    if (!response.ok) throw new Error('Error fetching quotes');

    const data = await response.json();
    
  //display the random quote and author in the HTML elements
  document.querySelector("#quote").innerText = data.quote;
  document.querySelector("#author").innerText = data.author;
} catch (error) {
    document.querySelector("#quote").innerText = "Sorry, could not load a quote.";
    document.querySelector("#author").innerText = "";
    console.error(error);
  }
}

//initial random quote when page loads
window.addEventListener("load", fetchAndDisplayQuote)

//add an event listener to the button to generate a new random quote
document.querySelector("#new-quote").addEventListener("click", fetchAndDisplayQuote);

