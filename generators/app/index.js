"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const glob = require("glob");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option("nogit");
    this.argument("project", { type: String, required: false });
    this.argument("organization", { type: String, required: false });
    this.argument("githost", { type: String, required: false });

    this.props = {
      nogit: this.options.nogit,
      project: this.options.project,
      organization: this.options.organization,
      githost: this.options.githost
    };
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the bedazzling ${chalk.red("generator-gin")} generator!`
      )
    );

    const prompts = [];

    if (!this.props.project) {
      prompts.push({
        type: "input",
        name: "project",
        message: "Your project name",
        default: this.appname // Default to current folder name
      });
    }

    if (!this.props.organization) {
      prompts.push({
        type: "input",
        name: "organization",
        message: "Your Organization name",
        default: "openware"
      });
    }

    if (!this.props.githost) {
      prompts.push({
        type: "input",
        name: "githost",
        message: "Your git hosting domain name",
        default: "github.com"
      });
    }

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = {
        ...this.props,
        ...props
      };
    });
  }

  writing() {
    this.log(`project: ${this.props.project}`);
    this.log(`organization: ${this.props.organization}`);
    this.log(`githost: ${this.props.githost}`);

    this.fs.copyTpl(
      glob.sync(this.templatePath("**/*"), { dot: true }),
      this.destinationPath(),
      {
        ...this.props,
        gopkg: `${this.props.githost}/${this.props.organization}/${this.props.project}`
      }
    );
  }

  git() {
    this.spawnCommandSync("git", ["init", "--quiet"], {
      cwd: this.destinationPath()
    });

    this.spawnCommandSync("git", ["add", "."], {
      cwd: this.destinationPath()
    });

    this.spawnCommandSync("git", ["commit", "-m", "Initial commit: yo gin"], {
      cwd: this.destinationPath()
    });

    const remote = `git@${this.props.githost}:${this.props.organization}/${this.props.project}.git`;
    this.spawnCommandSync("git", ["remote", "add", "origin", remote], {
      cwd: this.destinationPath()
    });
  }

  end() {
    if (!this.props.nogit) {
      this.git();
    }

    this.spawnCommandSync("make", [], {
      cwd: this.destinationPath()
    });
  }
};
