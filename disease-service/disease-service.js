const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');
const readline = require('readline');
var fs = require('fs');
const disease_app = express();
const port = 8086;

let symptomsToDiseases = initSymptomsToDiseasesMap()

disease_app.use(bodyParser.urlencoded({ extended: false }));
disease_app.use(bodyParser.json());

disease_app.post('/api/v1/diseases', function (req, res) {
  let symptoms = req.body.symptoms;

  return res.json(getDiseases(symptoms));
});

disease_app.listen(port, () => {
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
      input: fs.createReadStream(path.resolve('symptomsToDiseases/', file))
    });
    let diseases = []
    readInterface.on('line', function(line) {
      diseases.push(line)
    });
    sToDMap.set(file, diseases)
  }
  return sToDMap;
}
