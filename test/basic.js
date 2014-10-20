var HomeConfig = require('..'),
    fs         = require('fs'),
    mocha      = require('mocha'),
    path       = require('path'),
    should     = require('should'),
    temp       = require('temp');

var eol = (process.platform == 'win32' ? '\r\n' : '\n'), // same logic as ini
    tempSettings = {
        dir    : HomeConfig.homeDir,
        suffix : 'rc'
    },
    cfgDefaults = {
        someSetting : 'defaultValue'
    };

describe('HomeConfig', function() {
    var fn  = temp.path(tempSettings),
        cfg = HomeConfig.load(fn, cfgDefaults);

    after(function() {
        fs.unlinkSync(fn);
    });

    it('should load defaults for non-existent files', function() {
        cfg.should.have.property('someSetting', 'defaultValue');
        cfg.save.should.be.type('function');
        cfg.__filename.should.equal(fn);
        fs.existsSync(fn).should.equal(false);
    });

    it('should save new and old properties', function() {
        cfg.anotherSetting = 'someValue';
        cfg.save();
        fs.readFileSync(fn, 'utf8').should.equal([
            'someSetting=defaultValue',
            'anotherSetting=someValue',
            ''
        ].join(eol));
    });

    it('should save sections', function() {
        cfg.section = {
            a : 1,
            b : 2
        };
        cfg.save();
        fs.readFileSync(fn, 'utf8').should.equal([
            'someSetting=defaultValue',
            'anotherSetting=someValue',
            '',
            '[section]',
            'a=1',
            'b=2',
            ''
        ].join(eol));
    });

    it('should resolve and save to other files', function() {
        var fn2 = temp.path(tempSettings);
        cfg.save(path.basename(fn2));
        var c1 = fs.readFileSync(fn , 'utf8'),
            c2 = fs.readFileSync(fn2, 'utf8');
        c1.should.equal(c2);
        cfg.__filename.should.equal(fn);
        fs.unlinkSync(fn);
        fn = fn2;
    });

    it('should resolve and load existing config files', function() {
        cfg = HomeConfig.load(path.basename(fn));
        cfg.getAll().should.eql({
            someSetting    : 'defaultValue',
            anotherSetting : 'someValue',
            section : {
                a : '1',
                b : '2'
            }
        });
    });

    it('should not load or save prohibited names', function() {
        var prohibited = Object.keys(HomeConfig.prototype);

        prohibited.sort()
        prohibited.should.eql([
            '__filename',
            'getAll',
            'save'
        ]);

        fs.writeFileSync(fn, prohibited.map(function(k) {
            return k + ' = test';
        }).join('\n'));

        cfg = HomeConfig.load(fn);

        prohibited.forEach(function(k) {
            if (k == '__filename') {
                cfg[k].should.equal(fn);
            } else {
                (typeof cfg[k]).should.equal('function', 'typeof cfg.' + k);
            }
        });

        cfg.save();

        fs.readFileSync(fn, 'utf8').should.equal('');
    });
});
