const core = require('@actions/core');
const github = require('@actions/github');

try {
    const context = github.context;
    var base = "";
    var head = ""
    switch (context.eventName) {
        case "pull_request":
            base = context.payload.pull_request.base.ref;
            head = `pull/${context.payload.pull_request.number}/merge`;
            break;
        case "issue_comment":
            let maybeRevs = maybeGetRevsFromComment(context.payload.issue.body);
            if (maybeRevs != null) {
                console.log(`using manual revs: ${maybeRevs}`);
                head = maybeRevs[0];
                base = maybeRevs[1];
            } else if ('pull_request' in context.payload.issue) {
                head = `pull/${context.payload.issue.number}/merge`;
                base = getBaseRev(context.payload.issue.number);
            } else {
                core.setFailed('ignoring non PR comment');
            }
            break;
        default:
            core.setFailed(`Unhandled event type ${context.eventName}`);
            return;
    }

    core.setOutput('base', base);
    core.setOutput('head', head);

} catch (error) {
    core.setFailed(error.message);
}

async function getBaseRev(pull_number) {
    const octokit = new github.GitHub(myToken, { log: console });
    let result = await octokit.pulls.get({ owner: github.context.payload.repository.owner.login, repo: github.context.payload.repository.name, pull_number });
    return result
}

// we accept comments in the form of '/bloat master..438afbd
function maybeGetRevsFromComment(comment) {
    let words = comment.split(' ');
    if (words.length == 3) {
        return [words[1], words[2]];
    } else {
        return null;
    }
}