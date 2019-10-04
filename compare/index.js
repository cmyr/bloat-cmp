const core = require('@actions/core');
const bloatcmp = require('./bloat');

try {
  const oldSizes = core.getInput('old');
  const newSizes = core.getInput('new');

  const result = bloatcmp.bloatcmp(oldSizes, newSizes);
  core.setOutput("stats", result);

} catch (error) {
  core.setFailed(error.message);
}
