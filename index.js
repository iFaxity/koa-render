const path = require('path');
const pug = require('pug');
const send = require('koa-send');

const PUG_EXT = ['pug', 'jade'];
const HTML_EXT = ['html', 'htm'];
const DEFAULT_OPTS = {
  ext: 'pug',
  globals: {
    cache: true,
    debug: false,
  },
};

/**
 * @param {String} root - Root folder for all view files
 * @param {Object} [options] - Optional options
 * @returns {Function} - Middleware function
 */
module.exports = function (root, options = {}) {
  const { ext, globals } = Object.assign({}, DEFAULT_OPTS, options);

  return async (ctx, next) => {
    if (ctx.render) {
      return await next();
    }

    ctx.render = ctx.response.render = async (filename, locals = {}) => {
      // Default the extension to global extension
      let extname = path.extname(filename);
      if (extname.length < 2) {
        extname = `.${ext}`;
      }


      // Render the file
      const filepath = filename + extname;

      if (PUG_EXT.includes(ext)) {
        Object.assign(locals, globals, ctx.state = {}, {
          filename,
          basedir: root,
        });

        ctx.body = pug.renderFile(`${root}/${filepath}`, locals);
        ctx.type = 'html';
      } else if (HTML_EXT.includes(ext)) {
        return send(ctx, filepath, { root });
      } else {
        throw new Error(`ctx.render no engine for the extension '${extname}'`);
      }
    };

    await next();
  }
}
