
let bloatcmp = function (oldSizes, newSizes) {

  var results = new Object()

  for (var [key, newSize] of Object.entries(newSizes.sizes)) {
    var oldSize = oldSizes.sizes[key];
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

module.exports = {
  bloatcmp: bloatcmp,
  makeStats: makeStats
}
