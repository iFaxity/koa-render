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

    ctx.render = ctx.response.render = async (name, locals = {}) => {
      // Default the extension to global extension
      let [filename, extname] = `${name}.${ext}`.split('.');
      filename += `.${extname}`;

      if (PUG_EXT.includes(extname)) {
        Object.assign(locals, globals, ctx.state = {}, {
          filename,
          basedir: root,
        });

        ctx.body = pug.renderFile(`${root}/${filename}`, locals);
        ctx.type = 'html';
      } else if (HTML_EXT.includes(extname)) {
        return send(ctx, filename, { root });
      } else {
        throw new Error(`ctx.render no engine for the extension '${extname}'`);
      }
    };

    await next();
  }
}
