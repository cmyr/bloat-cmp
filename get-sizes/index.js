const core = require('@actions/core');
const fs = require('fs');

try {
    const paths = core.getInput('paths', { required: true });
    console.log('paths: ' + paths);
    const sha = require('child_process')
        .execSync('git rev-parse HEAD')
        .toString().trim();

    var sizes = new Object();
    for (var path of paths.split(' ')) {
        const stats = fs.statSync(path);
        const fileSizeInBytes = stats.size;
        sizes[path] = fileSizeInBytes;
    }

    const result = JSON.stringify({commit: sha, sizes: sizes });
    console.log(result);
    core.setOutput('rawSizes', result);

} catch (error) {
    core.setFailed(error.message);
}
