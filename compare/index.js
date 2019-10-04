const core = require('@actions/core');
const bloatcmp = require('./bloat');

try {
  const oldSizes = core.getInput('old');
  const newSizes = core.getInput('new');
  let oldObj = JSON.parse(oldSizes);
  let newObj = JSON.parse(newSizes);

  let files = bloatcmp.bloatcmp(oldObj, newObj);
    let result = {
        old_sha: oldObj.commit,
        new_sha: newObj.commit,
        files,
    };

  core.setOutput("stats", JSON.stringify(result));

} catch (error) {
  core.setFailed(error.message);
}
