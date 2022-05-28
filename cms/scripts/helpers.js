module.exports = {
  formatImageFileName: function (fileName) {
    const tmp = fileName.split('.');
    const ext = tmp.pop().toLowerCase();
    let sanitizedName = tmp.join('.');
    const spaces_re = /['.,]/g;
    const dashes_re = /[\s\(\)]/g;
    sanitizedName = sanitizedName.replaceAll(spaces_re, ' ');
    sanitizedName = sanitizedName.replaceAll(dashes_re, '-');
    const slug = sanitizedName.toLowerCase();
    return {
      name: sanitizedName,
      slug,
      ext
    }
  },
  findDuplicates: function (arr) {
    let sorted_arr = arr.slice().sort();
    let results = [];
    for (let i = 0; i < sorted_arr.length - 1; i++) {
      if (sorted_arr[i + 1] == sorted_arr[i]) {
        results.push(sorted_arr[i]);
      }
    }
    return results;
  },
}
