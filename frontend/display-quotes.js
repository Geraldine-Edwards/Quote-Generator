async function fetchAndDisplayQuote() {
    const response = await fetch('http://localhost:3000/api/quote');
    const data = await response.json();
    
  //display the random quote and author in the HTML elements
  document.querySelector("#quote").innerText = data.quote;
  document.querySelector("#author").innerText = data.author;
}

//initial random quote when page loads
window.addEventListener("load", fetchAndDisplayQuote)

//add an event listener to the button to generate a new random quote
document.querySelector("#new-quote").addEventListener("click", fetchAndDisplayQuote);

