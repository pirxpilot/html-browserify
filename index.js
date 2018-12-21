const { Transform, PassThrough } = require('stream');
const htmlclean = require('htmlclean');

module.exports = function(file, { htmlclean : options = true } = {}) {

  if (options === true) {
    options = {};
  }

  let chunks = [];

  return /\.(tpl|html)/.test(file) ? new Transform({ transform, flush }) : new PassThrough();

  function transform(chunk, enc, next) {
    chunks.push(chunk);
    next();
  }

  function flush(next) {
    let jst = chunks.map(c => c.toString()).join('');

    if (options) {
      jst = htmlclean(jst, options);
    }

    const compiled = `module.exports = ${JSON.stringify(jst)};\n`;
    this.push(compiled);
    next();
  }
};
