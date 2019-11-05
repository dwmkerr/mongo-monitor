const { expect } = require('chai');
const chalk = require('chalk');
const printConnections = require('./print-connections');

describe('print-connections', () => {
  it('should return "na" for invalid input', () => {
    expect(printConnections(0, 0)).to.equal('na');
  });

  it('should show connections under or equal to 40% utilzation in green', () => {
    expect(printConnections(40, 100)).to.equal(`${chalk.green(40)} / ${chalk.white(100)}`);
  });

  it('should show connections under or equal to 70% utilzation in orange', () => {
    expect(printConnections(70, 100)).to.equal(`${chalk.yellow(70)} / ${chalk.white(100)}`);
  });

  it('should show connections above 70% utilzation in red', () => {
    expect(printConnections(71, 100)).to.equal(`${chalk.red(71)} / ${chalk.white(100)}`);
    expect(printConnections(170, 100)).to.equal(`${chalk.red(170)} / ${chalk.white(100)}`);
  });
});

