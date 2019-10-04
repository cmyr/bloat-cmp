const core = require('@actions/core');
const github = require('@actions/github');
const comment = require('./comment');

try {

    const myInputJson = core.getInput('stats', { required: true });
  const myInput = JSON.parse(myInputJson);

    if (myInput.old_sha == myInput.new_sha) {
        //TODO: we should be aborting way earlier in this case?
        console.log('supressing post; commits are equal');
        return;
    }

    const myToken = core.getInput('myToken');
    const body = comment.formatComment(myInput);

    const context = github.context;
    const owner = context.payload.repository.owner.login;
    const repo = context.payload.repository.name;
    const octokit = new github.GitHub(myToken, {log: console});

    if (context.eventName == "push") {
        waitFor(function() { return octokit.repos.createCommitComment({owner, repo, commit_sha: context.sha, body}) })
    } else if (context.eventName == "issue_comment" || context.eventName == "pull_request") {
        var issueNumber = 0;
        if (context.eventName == "pull_request") {
            issueNumber = context.payload.number;
        } else {
            issueNumber = context.payload.issue.number;
        }
        waitFor(function() { return octokit.issues.createComment({owner, repo, issue_number: issueNumber, body}) })
    } else {
        core.setFailed('unhandled event type "' + context.eventName + '"');
    }

} catch (error) {
    core.setFailed(error.message);
}

// TODO: somebody who knows javascript come up with a better way of making these calls sync (or properly async)
async function waitFor(anotherFunction) {
    await anotherFunction().then(ok => console.log('okay? ' + ok)).catch(err => core.setFailed(err));
}
