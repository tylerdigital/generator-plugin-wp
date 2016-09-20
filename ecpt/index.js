'use strict';
var yeoman = require('yeoman-generator');
var base = require('../plugin-wp-base');

module.exports = base.extend({
  constructor: function () {
    base.apply(this, arguments);

    this.argument('name', {
      required: false,
      type    : String,
      desc    : 'The CPT name'
    });
  },

  initializing: {
    intro: function () {
      // Have Yeoman greet the user.
      this.log('Welcome to the neat Plugin WP CPT subgenerator!');
    },

    readingYORC: function() {
      this.rc = this.config.getAll() || {};
    },

    readingPackage: function() {
      this.pkg = this.fs.readJSON( this.destinationPath('package.json')) || {};
    },

    settingValues: function() {
      this.version    = this.pkg.version;
      if ( this.name ) {
        this.name     = this._.titleize( this.name.split('-').join(' ') );
        this.nameslug     = this._.slugify( this.name );
      }
      this.pluginname = this.rc.name;
      this.cptname    = this.pluginname + ' ' + this._.capitalize( this.name );
      this.classname  = this.rc.classprefix + this._wpClassify( this.name );
      this.slug       = this.rc.slug;
      this.cptslug    = this._.slugify( this.classname ).substr( 0, 20 );
      this.cptprefix  = this._.underscored( this.cptslug );

      this.composer   = this.fs.exists('composer.json');
    }
  },

  prompting: function () {
    var done = this.async();

    var prompts = [];

    if ( !this.ecptslug ) {
      prompts.push({
        type   : 'input',
        name   : 'ecptslug',
        message: 'Extended CPT Slug',
        default: 'myecpt'
      });
    }

    if ( !this.ecptsingular ) {
      prompts.push({
        type   : 'input',
        name   : 'ecptsingular',
        message: 'Extended CPT Singular Name',
        default: 'My E-CPT'
      });
    }

    if ( !this.ecptplural ) {
      prompts.push({
        type   : 'input',
        name   : 'ecptplural',
        message: 'Extended CPT Plural Name',
        default: 'My E-CPTs'
      });
    }

    if ( !this.version ) {
      prompts.push({
        type   : 'input',
        name   : 'version',
        message: 'Version',
        default: '1.0.0'
      });
    }

    if ( !this.name ) {
      prompts.push({
        type   : 'input',
        name   : 'name',
        message: 'CPT Name',
        default: 'extended-cpt'
      });
    }

    if ( !this.pluginname ) {
      prompts.push({
        type   : 'input',
        name   : 'pluginname',
        message: 'Plugin Name',
        default: 'TylerDigital Plugin Name'
      });
    }

    if ( prompts.length > 0 ) {
      this.log( 'Missing some info about the original plugin, help me out?' );
      this.prompt(prompts, function (props) {
        if ( props.ecptslug ) {
          this.ecptslug = props.ecptslug;
        }
        if ( props.ecptsingular ) {
          this.ecptsingular = props.ecptsingular;
        }
        if ( props.ecptplural ) {
          this.ecptplural = props.ecptplural;
        }

        if ( props.version ) {
          this.version = props.version;
        }

        if ( props.name ) {
          this.name = this._.titleize( props.name.split('-').join(' ') );
          this.nameslug = this._.slugify( this.name );
        }

        if ( props.pluginname ) {
          this.pluginname  = props.pluginname;
          this.slug = this._.slugify( props.pluginname );
        }

        if ( props.name || props.pluginname ) {
          this.cptname   = this.pluginname + ' ' + this._.capitalize( this.name );
          this.classname    = this._wpClassPrefix( this.pluginname ) + this._wpClassify( this.name );
          this.cptslug   = this.slug + '-' + this._.slugify( this.name );
          this.cptprefix  = this._.underscored( this.slug + ' ' + this.name );
        }

        done();
      }.bind(this));
    } else {
      done();
    }
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('cpt.php'),
      this.destinationPath('includes/class-' + this._.slugify( this.name ) + '.php'),
      this
    );

    this._addIncludeClass( this._.slugify( this.name ), this.classname );
  },

  install: function () {
    if ( this.options['skip-install'] ) {
      return;
    }

    this.mkdir('vendor/extended-cpts');
    if ( !this.fs.exists('vendor/extended-cpts/extended-cpts.php') ) {
      this.fs.copyTpl(
        this.templatePath('extended-cpts.php'),
        this.destinationPath('vendor/extended-cpts/extended-cpts.php'),
        this
      );
    }

  }
});
