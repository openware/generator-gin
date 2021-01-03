"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const glob = require("glob");
const mkdirp = require("mkdirp");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the bedazzling ${chalk.red("generator-gin")} generator!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "project",
        message: "Your project name",
        default: this.appname // Default to current folder name
      },
      {
        type: "input",
        name: "organization",
        message: "Your Organization name",
        default: "openware"
      },
      {
        type: "input",
        name: "git_domain",
        message: "Your git hosting domain name",
        default: "github.com"
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.log(`project: ${this.props.project}`);
    this.log(`organization: ${this.props.organization}`);
    this.log(`git_domain: ${this.props.git_domain}`);

    this.fs.copyTpl(
      glob.sync(this.templatePath("**/*"), { dot: true }),
      this.destinationPath(),
      this.props
    );
  }

  end() {
    this.spawnCommandSync("git", ["init", "--quiet"], {
      cwd: this.destinationPath()
    });

    this.spawnCommandSync("git", ["add", "."], {
      cwd: this.destinationPath()
    });

    this.spawnCommandSync("git", ["ci", "-m", "Initial commit: yo gin"], {
      cwd: this.destinationPath()
    });

    const remote = `git@${this.props.git_domain}:${this.props.organization}/${this.props.project}.git`;
    this.spawnCommandSync("git", ["remote", "add", "origin", remote], {
      cwd: this.destinationPath()
    });

    this.spawnCommandSync("make", [], {
      cwd: this.destinationPath()
    });
  }
};
