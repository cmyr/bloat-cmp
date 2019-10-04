const core = require('@actions/core');
const github = require('@actions/github');
const comment = require('./comment');

try {

    const myInput = core.getInput('stats', { required: true });
    const myToken = core.getInput('myToken');
    const markdownText = comment.formatComment(myInput);

    console.log(markdownText);

    const context = github.context;
    console.log(context.event_name)
    if (context.event_name = "push") {
        postCommitComment(myToken, context, markdownText);
    } else if (context.event_name = "pull_request") {
        postPullRequestComment(myToken, context, markdownText);
    } else if (context.event_name = "issue_comment") {
        postIssueComment(myToken, context, markdownText);
    } else {
        core.setFailed('unhandled event type "' + context.event_name + '"');
    }

    //const payload = JSON.stringify(context.payload, undefined, 2);
    //console.log(`The event payload: ${payload}`);

    //let response = postComment(myToken, postArgs);
    //console.log(response);

} catch (error) {
    core.setFailed(error.message);
}

async function postIssueComment(token, context, body) {
    const postArgs = {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        issue_number: context.payload.issue.number,
        body: body,
    };
    const octokit = new github.GitHub(token, {log: console});
    var response = await octokit.issues.createComment(postArgs).then(ok => console.log('okay? ' + ok)).catch(err => console.log('error? :( ' + err));
    return response;
}

async function postPullRequestComment(token, context, body) {
    const postArgs = {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        issue_number: context.payload.number,
        body: body,
    };
    const octokit = new github.GitHub(token, {log: console});
    var response = await octokit.issues.createComment(postArgs).then(ok => console.log('okay? ' + ok)).catch(err => console.log('error? :( ' + err));
    return response;
}

async function postCommitComment(token, context, body) {

    const postArgs = {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        commit_sha: context.sha,
        body: body,
    };
    const octokit = new github.GitHub(token, {log: console});
    var response = await octokit.repos.createCommitComment(postArgs).then(ok => console.log('okay? ' + ok)).catch(err => console.log('error? :( ' + err));
    return response;
}
