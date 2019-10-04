
let formatComment = function (statsJson) {
  console.log('raw object: ' + statsJson);
  const statsObj = JSON.parse(statsJson);
  console.log('obj: ' + statsObj);
  if (Object.keys(statsObj).length == 0) {
    throw Error('empty stats object');
  }

  var result = 'target|old size|new size|difference\n---|---|---|---\n';
  for (var [key, stats] of Object.entries(statsObj)) {
    console.log(key, stats);
    if (stats === null) {
      result = result + key + '|missing|n/a|n/a\n';
    } else {
      result = result + key + '|' + formatBytes(stats.oldSize) + '|' + formatBytes(stats.newSize) + '|' + stats.percent + '\n';
    }
  }
    return result
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

// thank you internet: https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

module.exports = {
  formatComment: formatComment
}
