const core = require('@actions/core');
const fs = require('fs');
const bloatcmp = require('./bloat');

try {
  const oldSizes = core.getInput('old');
  const newSizes = core.getInput('new');

  let oldObj = JSON.parse(oldSizes);
  let newObj = JSON.parse(newSizes);

  const result = JSON.stringify(bloatcmp.bloatcmp(oldObj, newObj));

  core.setOutput("stats", result);

} catch (error) {
  core.setFailed(error.message);
}
