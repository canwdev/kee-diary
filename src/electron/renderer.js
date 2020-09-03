// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require('fs')
const content = document.getElementById('content')
const button = document.getElementById('button')

button.addEventListener('click', function (e) {
  fs.readFile('package.json', 'utf8', function (err, data) {
    content.textContent = data;
    console.log(data);
  });
});
