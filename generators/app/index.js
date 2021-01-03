"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const glob = require("glob");

function git(ptr) {
  ptr.spawnCommandSync("git", ["init", "--quiet"], {
    cwd: ptr.destinationPath()
  });

  ptr.spawnCommandSync("git", ["add", "."], {
    cwd: ptr.destinationPath()
  });

  ptr.spawnCommandSync("git", ["ci", "-m", "Initial commit: yo gin"], {
    cwd: ptr.destinationPath()
  });

  const remote = `git@${ptr.props.package}.git`;
  ptr.spawnCommandSync("git", ["remote", "add", "origin", remote], {
    cwd: ptr.destinationPath()
  });
}

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option("git", { desc: "Git init", type: Boolean, default: true });
    this.argument("package", { desc: "Package URL", type: String, required: false });

    this.props = {
      git: this.options.git,
      package: this.options.package
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

    if (!this.props.package) {
      prompts.push({
        type: "input",
        name: "package",
        message: "Your golang package url",
        default: "github.com/openware/" + this.appname
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
    this.log(`package: ${this.props.package}`);

    this.fs.copyTpl(
      glob.sync(this.templatePath("**/*"), { dot: true }),
      this.destinationPath(),
      this.props
    );
  }

  end() {
    if (this.props.git) {
      git(this);
    }

    this.spawnCommandSync("make", [], {
      cwd: this.destinationPath()
    });
  }
};
