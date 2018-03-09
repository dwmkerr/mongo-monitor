function longestString(strs) {
  return strs.reduce((acc, s) => s.length > acc ? s.length : acc, 0);
}

module.exports = longestString;
