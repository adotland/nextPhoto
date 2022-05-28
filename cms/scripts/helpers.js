module.exports = {
  formatImageFileName: function (fileName) {
    const tmp = fileName.split('.');
    const ext = tmp.pop();
    let retval = tmp.join('.');
    const spaces_re = /['.,]/g;
    const dashes_re = /[\s\(\)]/g;
    retval = retval.replaceAll(spaces_re, ' ');
    retval = retval.replaceAll(dashes_re, '-');
    return retval + '.' + ext;
  },
}
