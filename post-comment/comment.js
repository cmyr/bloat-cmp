
let formatComment = function (statsObj) {

  if (Object.keys(statsObj.files).length == 0) {
    throw Error('no files in stats');
  }

  let oldSha = statsObj.old_sha.substring(0, 8);
  let newSha = statsObj.new_sha.substring(0, 8);

  var result = `### 🗜 Bloat check ⚖️\nComparing ${newSha} against ${oldSha}\n\ntarget|old size|new size|difference\n---|---|---|---\n`;
  for (var [key, stats] of Object.entries(statsObj.files)) {
    console.log(key, stats);
    if (stats === null) {
      result = result + key + '|missing|n/a|n/a\n';
    } else {
      let difference = formatDifference(stats.diff, stats.percent);
      result = result + `${key} | ${formatBytes(stats.oldSize)} | ${formatBytes(stats.newSize)} | ${difference}\n`;
    }
  }
    return result
}

function formatDifference(dSize, percent) {
    if (dSize == 0) {
        return '---';
    } else {
        return `${formatBytes(dSize)} (${percent})`;
    }
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
  var negate = 1.0;
  if (bytes < 0) {
    bytes *= -1.0;
    negate = -1.0;
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return negate * parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

module.exports = {
  formatComment: formatComment
}
