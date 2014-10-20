var fs   = require('fs'),
    ini  = require('ini'),
    path = require('path');

function HomeConfig(filename, defaultData) {
    var self = this;

    var data;

    try {
        data = ini.decode(fs.readFileSync(
            path.resolve(HomeConfig.homeDir, filename), 'utf8'));
    } catch (err) {
        data = defaultData || {};
    }

    for (var k in data) {
        if (!(k in HomeConfig.prototype)) {
            self[k] = data[k];
        }
    }

    self.__filename = filename;
}

module.exports = exports = HomeConfig;

HomeConfig.homeDir = (process.platform == 'win32'
    ? process.env.USERPROFILE
    : process.env.HOME);

if (!fs.existsSync(HomeConfig.homeDir)) {
    throw new Error('Cannot find home directory: ' + HomeConfig.homeDir);
}

HomeConfig.load = function(filename, defaultData) {
    return new HomeConfig(filename, defaultData);
};

HomeConfig.prototype.__filename = null;

HomeConfig.prototype.save = function(filename) {
    var self = this;

    fs.writeFileSync(
        path.resolve(HomeConfig.homeDir, filename || self.__filename),
        ini.encode(self.getAll()));
};

HomeConfig.prototype.getAll = function() {
    var self = this;

    var ret = {};

    for (var k in self) {
        if (!(k in HomeConfig.prototype)) {
            ret[k] = self[k];
        }
    }

    return ret;
};
