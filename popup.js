

// Run our kitten generation script as soon as the document's DOM is ready.


var greeting = "hola, ";

var button = document.getElementById("mybutton");

button.person_name = "Roberto";

button.addEventListener("click", function() {

  console.log(greeting + button.person_name + ".");
  chrome.tabs.executeScript(null, {file: "jquery.min.js"});
  chrome.tabs.executeScript(null, {file: "contentscript.js"});

}, false);