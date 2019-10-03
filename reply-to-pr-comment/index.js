const core = require('@actions/core');
const github = require('@actions/github');
const comment = require('./comment');

try {

    const myInput = core.getInput('bloat_stats', { required: true });
    const myToken = core.getInput('myToken');
    const markdownText = comment.formatComment(myInput);

    console.log(markdownText);

    const octokit = new github.GitHub(myToken);
    const newComment = await octokit.pulls.createCommentReply({
        owner: context.payload.pull_request.repo.owner.id,
        repo: context.payload.pull_request.repo.id,
        pull_number: context.payload.pull_request.number,
        commit_id: context.payload.comment.commit_id,
        body: markdownText,
        path: context.payload.comment.path,
        position: context.payload.comment.position,
        in_reply_to: context.payload.comment.id
    });
    console.log(newComment);
    // Get the JSON webhook payload for the event that triggered the workflow
    //const payload = JSON.stringify(github.context.payload, undefined, 2)
    //console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}
