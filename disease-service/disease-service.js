const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 8085

const path = require('path');

const readline = require('readline');

var fs = require('fs');

let symptomsToDiseases = initSymptomsToDiseasesMap()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/api/v1/diseases', (req, res) => {

  let symptoms = req.body;

  return res.json(getDiseases(symptoms));
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

function getDiseases(symptoms) {
  let response = []

  for (symptom of symptoms){
    let diseases = symptomsToDiseases.get(symptom);

    Array.prototype.push.apply(response, diseases);
  }

  return [...new Set(response)];
}

function initSymptomsToDiseasesMap(){
  let sToDMap = new Map();

  
  var files = fs.readdirSync('symptomsToDiseases/');
  
  for (file of files) {
    const readInterface = readline.createInterface({
      input: fs.createReadStream(path.resolve('symptomsToDiseases/', file)),
      output: process.stdout,
      console: false
    });
    let diseases = []
    readInterface.on('line', function(line) {
      diseases.push(line)
    });

    sToDMap.set(file, diseases)
  }

  return sToDMap;
}




