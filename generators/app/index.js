'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const glob = require('glob');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the bedazzling ${chalk.red('generator-gin')} generator!`)
    );

    const prompts = [
      {
        type: 'confirm',
        name: 'someAnswer',
        message: 'Would you like to enable this option?',
        default: true
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {

    this.fs.copyTpl(glob.sync(this.templatePath('**/*'), { dot: true }), this.destinationPath(), {/*context*/});

    // this.fs.copyTpl(
    //   this.templatePath('index.html'),
    //   this.destinationPath('public/index.html'),
    //   { title: 'Templating with Yeoman' }
    // );
  }

  install() {
    this.installDependencies();
  }
};
