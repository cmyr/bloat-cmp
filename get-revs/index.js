const core = require('@actions/core');
const github = require('@actions/github');

try {
    const context = github.context;
    switch (context.eventName) {
        case "pull_request":
            core.setOutput('base', context.payload.pull_request.base.ref);
            core.setOutput('head', context.payload.pull_request.head.sha);
            break;
        case "issue_comment":
            let cmd = core.getInput('command');
            if (!context.payload.comment.body.startsWith(cmd)) {
                core.setFailed(`ignoring comment that doesn't begin with ${cmd}`);
                return;
            }

            let maybeRevs = maybeGetRevsFromComment(context.payload.comment.body);
            if (maybeRevs != null) {
                console.log(`using manual revs: ${maybeRevs}`);
                core.setOutput('base', maybeRevs[0]);
                core.setOutput('head', maybeRevs[1]);
            } else if ('pull_request' in context.payload.issue) {

                const myToken = core.getInput('myToken');
                const octokit = new github.GitHub(myToken, { log: console });
                octokit.pulls.get({
                    owner: context.payload.repository.owner.login,
                    repo: context.payload.repository.name,
                    pull_number: context.payload.issue.number,
                }).then(({ data }) => {
                    core.setOutput('base', data.base.ref);
                    core.setOutput('head', data.head.sha);
                }).catch(({ err }) => {
                    console.log(`ERR: ${err}`);
                    core.setFailed(err);
                });
            } else {
                core.setFailed('ignoring non PR comment');
            }
            break;
        default:
            core.setFailed(`Unhandled event type ${context.eventName}`);
            return;
    }
} catch (error) {
    core.setFailed(error.message);
}

//async function getBaseRev(pull_number) {
//try {
//const myToken = core.getInput('myToken');
//const octokit = new github.GitHub(myToken, { log: console });
//const { data: pullRequest } = await octokit.pulls.get({ owner: github.context.payload.repository.owner.login, repo: github.context.payload.repository.name, pull_number });
//return pullRequest.base.ref;
//} catch (e) {
//console.log(e);
//throw e;
//}
//}

// we accept comments in the form of '/bloat master..438afbd
function maybeGetRevsFromComment(comment) {
    console.log(`trying to get revs from comment '${comment}'`);
    let words = comment.split(' ');
    if (words.length == 3) {
        return [words[1], words[2]];
    } else {
        return null;
    }
}
