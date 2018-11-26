const pug = require('pug');
const send = require('koa-send');
const DEFAULT_OPTS = {
  ext: 'pug',
  globals: {
    cache: true,
    debug: false,
  },
};

// Use pug to render file
function renderPug(ctx, filepath, locals) {
  try {
    ctx.body = pug.renderFile(filepath, locals);
    ctx.type = 'html';
  } catch (ex) {
    throw ex;
  }
}

/**
 * @param root - Root folder for all view files
 * @param [options] - Optional options
 */
module.exports = function (root, options = {}) {
  const opts = Object.assign({}, DEFAULT_OPTS, options);

  return async (ctx, next) => {
    if (ctx.render) {
      return await next();
    }

    ctx.render = ctx.response.render = async (filename, locals = {}) => {
      // Read file data
      const ext = opts.ext;
      const filepath = `${filename}.${ext}`;

      // Render file as html
      if (ext == 'pug' || ext == 'jade') {
        Object.assign(locals, opts.globals, ctx.state = {});
        locals.filename = filename;
        locals.basedir = root;

        return renderPug(ctx, `${root}/${filepath}`, locals);
      } else if (ext == 'html' || ext == 'htm') {
        return send(ctx, filepath, { root });
      } else {
        throw new Error('ctx.render no engine for that extension');
      }
    };

    await next();
  }
}
