# Ploper

> Perform [plop](https://github.com/amwmedia/plop) more freely

## Installation

```sh
> npm i ploper
```

## Usage

```js
var ploper = require('ploper');

// load plopfile and specify custom output target
var plop = ploper.plop(__dirname + '/generator/plopfile', __dirname + '/temp');

plop.prompt('[EXAMPLE] Select an action to perform').then(plop.run).then(plop.report).catch(function (err) {
  console.error('[ERROR]'.red, err.message, err.stack);
  process.exit(1);
});
```

## License

MIT © [Yuan Tao](http://github.com/taoyuan)


