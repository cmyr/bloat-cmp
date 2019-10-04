const core = require('@actions/core');
const fs = require('fs');
const bloatcmp = require('./bloat');

try {
  const oldSizes = core.getInput('old');
  const newSizes = core.getInput('new');

  console.log('old ' + oldSizes);
  console.log('new ' + newSizes);

  let oldObj = JSON.parse(oldSizes);
  let newObj = JSON.parse(newSizes);

  //const base_sizes = fs.readFileSync(inDir + '/old.txt').toString();
  //const new_sizes = fs.readFileSync(inDir + '/new.txt').toString();

  //console.log('base: \'' + base_sizes + '\'');
  //console.log('new: \'' + new_sizes + '\'');

  const result = JSON.stringify(bloatcmp.bloatcmp(oldObj, newObj));

  core.setOutput("bloat_stats", result);
  // Get the JSON webhook payload for the event that triggered the workflow
  //const payload = JSON.stringify(github.context.payload, undefined, 2)
  //console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
