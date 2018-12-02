const through = require('through');
const htmlclean = require('htmlclean');

module.exports = function(file, { htmlclean : options = true } = {}) {

  if (options === true) {
    options = {};
  }

	let chunks = [];

	return /\.(tpl|html)/.test(file) ? through(onwrite, onend) : through();

  function onwrite(chunk) {
    return chunks.push(chunk);
  }

  function onend() {
    let jst = chunks.map(c => c.toString()).join('');

    if (options) {
      jst = htmlclean(jst, options);
    }

    const compiled = `module.exports = ${JSON.stringify(jst)};\n`;
    this.queue(compiled);
    return this.queue(null);
  }
};
