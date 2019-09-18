@ifaxity/koa-render
===================

## A minimal koa@2 pug/html render engine

Minimal dependencies & code is cut down to not take so much space.
Because node_modules hell is something i want to avoid.
This module was for private purposes but making it public wont do any harm.

Code heavily based on the [koa-views package](https://www.npmjs.com/package/koa-views)

------------------
## Installation:

`npm install @ifaxity/koa-render --save`

or if you use yarn

`yarn add @ifaxity/koa-render`

--------
## Usage

To use the module just require it like this

`const jwt = require('@ifaxity/koa-render');`

And then you need to add it to your koa server like this:

```js
const render = require('@ifaxity/koa-render');

// or whatever folder you use for your views
app.use(render(__dirname + '/views'), {
  ext: 'pug',
  globals: {
    title: 'Default title',
  }
});


// Example route
app.use(async ctx => {
  // Render state object
  ctx.state = {
    title: 'Index page title',
  };

  await ctx.render('index', {
    foo: 'bar',
  });
});

// You can also switch between .pug and .html files like this
// As the option 'ext' only specifies the default extension
app.use(async ctx => {
  await ctx.render('index.html');
});
```


-----------------
## About the variables

So the precedence of those local variables are like this.

locals <-- ctx.state <-- globals

The globals are the variables supplied first when constructing the module.

While locals are the ones supplied as second parameter in ctx.render.

Consider this example:
```js
const render = require('@ifaxity/koa-render');

// or whatever folder you use for your views
app.use(render(__dirname + '/views'), {
  globals: {
    title: 'Default title',
    secret: 'shh secret',
  }
});


// Example route
app.use(async ctx => {
  // Render state object
  ctx.state = {
    title: 'Index page title',
    hello: 'Hello world!',
  };

  await ctx.render('index', {
    hello: 'Hello universe!',
    production: false,
  });
});
```

So then when the ctx.render function runs the variables will finally be:

```js
{
  title: 'Index page title',
  secret: 'shh secret',
  hello: 'Hello universe!',
  production: false,
}
```

-----------------
## API

To use the module just require it like this

`const render = require('@ifaxity/koa-render');`

Then you need to add it as a middleware before your routes in your koa app.

### `render(root [, opts])`

* `root {String}` - The path to the view files root directory
* `opts {Object}` - Optional options
  * `opts.ext {String}` - Extension to use. html, pug & jade is supported. Defaults to pug
  * `opts.globals {Object}` - Global variables for the render function

  When using .html files the variables get ignored because it just render the html file directly, great when you have static html files and dynamic content with pug.
  So options are not needed when you render a html file.
  
