const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

try {
  // `who-to-greet` input defined in action metadata file
  const base_sizes_path = core.getInput('base_sizes');
  const new_sizes_path = core.getInput('new_sizes');

  //let base_sizes = fs.readFileSync(process.cwd() + "/" + filename).toString()
  const base_sizes = fs.readFileSync(base_sizes_path).toString();
  const new_sizes = fs.readFileSync(new_sizes_path).toString();

  console.log('base: ' + base_sizes);
  console.log('new: ' + new_sizes);

  const base_map = objify(base_sizes);
  const new_map = objify(new_sizes);

  for (var [key, new_size] of new_map) {
    var prev_size = base_map.get(key);
    if (prev_size === undefined) {
      console.log('item ' + key + ' does not exist in baseline.');
    } else {
      var diff = new_size - prev_size;
      console.log(key + 'size change is ' + diff + 'bytes.');
    }
}


  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  //const payload = JSON.stringify(github.context.payload, undefined, 2)
  //console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}

function objify(string) {
  return new Map(string.split('\n').map(line => line.split(' ')))
}
