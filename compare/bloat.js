
let bloatcmp = function (oldSizes, newSizes) {
  //const oldMap = oldSizes.sizes
  //const newMap = objify(newSizes);


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

//function objify(string) {
  //return new Map(string.split('\n').map(line => line.split(' ')).filter(arr => arr.length == 2 && arr[0].length > 0))
//}

module.exports = {
  bloatcmp: bloatcmp,
  makeStats: makeStats
  //objify: objify
}
