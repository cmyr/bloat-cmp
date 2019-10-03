
let bloatcmp = function (oldStats, newStats) {
  const oldMap = objify(oldStats);
  const newMap = objify(newStats);

  var results = {};

  for (var [key, newSize] of newMap) {
    var oldSize = oldMap.get(key);
    if (oldSize === undefined) {
      results[key] = null;
      console.log('item ' + key + ' does not exist in baseline.');
    } else {
      results[key] = makeStats(oldSize, newSize);
    }
  }
  return results
}

let makeStats = function (oldSize, newSize) {
  let diff = newSize - oldSize;
  let perc = (diff / oldSize) * 100;
  return {
    oldSize: oldSize,
    newSize: newSize,
    diff: diff,
    percent: perc.toFixed(2) + '%'
  }
}

function objify(string) {
  return new Map(string.split('\n').map(line => line.split(' ')))
}

module.exports = {
  bloatcmp: bloatcmp,
  makeStats: makeStats
}
