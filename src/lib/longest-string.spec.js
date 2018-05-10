const { expect } = require('chai');
const longestString = require('./longest-string');

describe('longest-string', () => {
  it('should return zero for an empty array', () => {
    expect(longestString([])).to.equal(0);
  });

  it('should be able to identify the longest string', () => {
    expect(longestString([
      'one',
      'two',
      'three',
      'four'
    ])).to.equal(5);
  });
});

