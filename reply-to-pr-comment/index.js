const core = require('@actions/core');
const github = require('@actions/github');
const comment = require('./comment');

try {

    const myInput = core.getInput('stats', { required: true });
    const myToken = core.getInput('myToken');
    const markdownText = comment.formatComment(myInput);

    console.log(markdownText);

    const context = github.context;

    //const payload = JSON.stringify(context.payload, undefined, 2);
    //console.log(`The event payload: ${payload}`);

    const postArgs = {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        issue_number: context.payload.issue.number,
        body: markdownText,
    };
    let response = postComment(myToken, postArgs);
    console.log(response);

} catch (error) {
    core.setFailed(error.message);
}

async function postComment(token, postArgs) {
    const octokit = new github.GitHub(token, {log: console});
    var response = await octokit.issues.createComment(postArgs).then(ok => console.log('okay? ' + ok)).catch(err => console.log('error? :( ' + err));
    return response;
}
