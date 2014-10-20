# home-config [![Build status](http://img.shields.io/travis/nylen/home-config.svg?style=flat)](https://travis-ci.org/nylen/home-config) [![npm package](http://img.shields.io/npm/v/home-config.svg?style=flat)](https://www.npmjs.org/package/home-config)

This Node.js module provides an easy way to read and write configuration files in
a user's home directory, where many Linux applications store configuration
files.

To install it: `npm install home-config`

The home directory is `process.env.HOME`, unless you are on Windows, in which
case it is `process.env.USERPROFILE`.

Configuration files are stored in ini format as parsed by
[isaacs/ini](https://github.com/isaacs/ini).  `key = value` lines work, and
`[section]` appears as an object with any properties under it as keys.

## Usage

Basic usage is to require the module and call `.load()` with your desired
config filename:

```js
var cfg = require('home-config').load('.myapprc');

// or

var cfg = require('home-config').load('.myapprc', {
    optionName : 'defaultValue'
});
```

You can make changes then save your config file (but any user comments or
indentation will be removed):

```js
cfg.section = {
    property : 'x'
};

cfg.save();

// or

cfg.save('some-other-filename');
```

The following top-level config key names are prohibited and will not be saved
or loaded:
- `save`
- `getAll`
- `__filename`

Finally, this package is designed to work with config files in the current
user's home directory, but all filenames are passed to
[`path.resolve`](http://nodejs.org/api/path.html#path_path_resolve_from_to), so
if you pass an absolute path to `.load()` or `.save()` then it will be used
as-is.
