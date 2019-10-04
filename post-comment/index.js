const core = require('@actions/core');
const github = require('@actions/github');
const comment = require('./comment');

try {

    const myInput = core.getInput('stats', { required: true });
    const myToken = core.getInput('myToken');
    const commentBody = comment.formatComment(myInput);
    //console.log(commentBody);

    const context = github.context;
    const owner = context.payload.repository.owner.login;
    const repo = context.payload.repository.name;
    const octokit = new github.GitHub(myToken, {log: console});
    console.log(context.eventName);
    //console.log(context);
    console.log(owner, repo);
    //if (context.eventName = "push") {
        //postCommitComment(myToken, context, markdownText);
    if (context.eventName == "push") {
        waitFor(function() { return octokit.repos.createCommitComment(owner, repo, context.sha, commentBody) })
    } else if (context.eventName == "issue_comment" || context.eventName == "pull_request") {
        var issueNumber = context.payload.issue.number;
        if (context.eventName == "pull_request") {
            issueNumber = context.payload.number;
        }
        waitFor(function() { return octokit.issues.createComment(owner, repo, issueNumber, commentBody ) })
    } else {
        core.setFailed('unhandled event type "' + context.eventName + '"');
    }

    //const payload = JSON.stringify(context.payload, undefined, 2);
    //console.log(`The event payload: ${payload}`);

    //let response = postComment(myToken, postArgs);
    //console.log(response);

} catch (error) {
    core.setFailed(error.message);
}

async function waitFor(anotherFunction) {
    await anotherFunction().then(ok => console.log('okay? ' + ok)).catch(err => console.log('error? :( ' + err));
}

//async function postIssueComment(token, context, body) {
    //const postArgs = {
        //owner: context.payload.repository.owner.login,
        //repo: context.payload.repository.name,
        //issue_number: context.payload.issue.number,
        //body: body,
    //};
    //const octokit = new github.GitHub(token, {log: console});
    //var response = await octokit.issues.createComment(postArgs).then(ok => console.log('okay? ' + ok)).catch(err => console.log('error? :( ' + err));
    //return response;
//}

//async function postPullRequestComment(token, context, body) {
    //const postArgs = {
        //owner: context.payload.repository.owner.login,
        //repo: context.payload.repository.name,
        //issue_number: context.payload.number,
        //body: body,
    //};
    //const octokit = new github.GitHub(token, {log: console});
    //var response = await octokit.issues.createComment(postArgs).then(ok => console.log('okay? ' + ok)).catch(err => console.log('error? :( ' + err));
    //return response;
//}

//async function postCommitComment(token, context, body) {

    //const postArgs = {
        //owner: context.payload.repository.owner.login,
        //repo: context.payload.repository.name,
        //commit_sha: context.sha,
        //body: body,
    //};
    //const octokit = new github.GitHub(token, {log: console});
    //var response = await octokit.repos.createCommitComment(postArgs).then(ok => console.log('okay? ' + ok)).catch(err => console.log('error? :( ' + err));
    //return response;
//}
