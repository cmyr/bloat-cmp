const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const bloatcmp = require('./bloat');

try {
  const inDir = core.getInput('bloat_dir');

  const base_sizes = fs.readFileSync(inDir + '/old.txt').toString();
  const new_sizes = fs.readFileSync(inDir + '/new.txt').toString();

  console.log('base: \'' + base_sizes + '\'');
  console.log('new: \'' + new_sizes + '\'');

  const result = JSON.stringify(bloatcmp.bloatcmp(base_sizes, new_sizes));

  core.setOutput("bloat_stats", result);
  // Get the JSON webhook payload for the event that triggered the workflow
  //const payload = JSON.stringify(github.context.payload, undefined, 2)
  //console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}