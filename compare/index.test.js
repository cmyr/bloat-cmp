const bloat = require('./bloat');
const process = require('process');
const cp = require('child_process');
const path = require('path');

test('smoke test', async () => {
    let one = 'abc 200\nhello 346';
    let two = 'abc 220\nmissing 59';

    let result = bloat.bloatcmp(one, two);
    expect(result.abc.diff).toEqual(20);
    expect(result.abc.percent).toEqual('10.00%');
    expect(result.missing).toEqual(null);
});

test('single item', async () => {
    let one = 'abc 200';
    let two = 'abc 220';

    let result = bloat.bloatcmp(one, two);

    expect(result.abc.diff).toEqual(20);
    expect(result.abc.percent).toEqual('10.00%');
    expect(Object.keys(result)).toEqual(['abc']);
});

// shows how the runner will run a javascript action with env / stdout protocol
// test('test runs', () => {
//     process.env['INPUT_MILLISECONDS'] = 500;
//     const ip = path.join(__dirname, 'index.js');
//     console.log(cp.execSync(`node ${ip}`).toString());
// })
