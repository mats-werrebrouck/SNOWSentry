const fs = require('fs');
const config = require('./config');

let manifestTemplate = fs.readFileSync('./manifest.template.json', 'utf8');

manifestTemplate = manifestTemplate.replace('{{extensionURL}}', config.extensionURL);

fs.writeFileSync('./manifest.json', manifestTemplate);