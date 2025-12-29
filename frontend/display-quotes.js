async function fetchAndDisplayQuote() {
  try {
    const response = await fetch('https://geraldine-edwards-quote-generator-backend.hosting.codeyourfuture.io/');
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


async function addQuote(quote, author) {
  // use deployed backend
  const backendUrl = 'https://geraldine-edwards-quote-generator-backend.hosting.codeyourfuture.io/';
  try {
    // convert JavaScript object { quote, author } into JSON string
    // send that JSON string as body of the POST request
    // set the Content-Type header to application/json so the backend knows to expect JSON data
    // browser automatically sends data as bytes over the network
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quote, author })
    });
    const messageElem = document.getElementById('add-quote-message');
    // clear previous style
    messageElem.classList.remove('add-quote-success', 'add-quote-error');
    if (response.ok) {
      messageElem.innerText = 'Quote added!';
      // if success add the bootstrap style
      messageElem.classList.add('add-quote-success');
      //reset the form
      document.getElementById('add-quote-form').reset();
    } else {
      const error = await response.text();
      messageElem.innerText = 'Failed to add quote: ' + error;
      messageElem.classList.add('add-quote-error');
    }
    setTimeout(() => {
      messageElem.innerText = '';
      messageElem.classList.remove('add-quote-success', 'add-quote-error');
    }, 4000);
  } catch (error) {
    const messageElem = document.getElementById('add-quote-message');
    messageElem.innerText = 'Error: ' + error.message;
    messageElem.classList.remove('add-quote-success');
    messageElem.classList.add('add-quote-error');
    setTimeout(() => {
      messageElem.innerText = '';
      messageElem.classList.remove('add-quote-error');
    }, 4000);
  }
}

// Add submit event handler to the form
document.getElementById('add-quote-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const quote = document.getElementById('new-text').value.trim();
  const author = document.getElementById('new-author').value.trim();
  if (quote && author) {
    addQuote(quote, author);
  }
});

