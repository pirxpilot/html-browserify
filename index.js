const through = require('through2');
const htmlclean = require('htmlclean');

module.exports = function(file, { htmlclean : options = true } = {}) {

  if (options === true) {
    options = {};
  }

  let chunks = [];

  return /\.(tpl|html)/.test(file) ? through(onwrite, onend) : through();

  function onwrite(chunk, enc, next) {
    chunks.push(chunk);
    next();
  }

  function onend(next) {
    let jst = chunks.map(c => c.toString()).join('');

    if (options) {
      jst = htmlclean(jst, options);
    }

    const compiled = `module.exports = ${JSON.stringify(jst)};\n`;
    this.push(compiled);
    next();
  }
};
