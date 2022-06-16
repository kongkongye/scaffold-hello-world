#!/usr/bin/env node

import {program} from 'commander';
import download from 'download-git-repo';
import inquirer from 'inquirer';
import * as fs from "fs";
import Handlebars from 'handlebars';
import path from "path";
import ora from "ora";
import chalk from "chalk";
import {fileURLToPath} from "url";

program.version('1.0.0')

program.command('init')
  .description('initialize a new project')
  .option('-n, --name <name>', 'name of the project')
  .action( (source, destination) => {
    const branch = 'hello-world1'
    console.log(chalk.yellow('initializing a new project...'));

    //交互式输入
    inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'name of the project',
        default: 'my-project',
      },
      {
        type: 'input',
        name: 'description',
        message: 'description of the project',
      },
      {
        type: 'list',
        name: 'type',
        message: 'type of the project',
        choices: ['hello-world1', 'hello-world2'],
        default: 'hello-world1',
      },
    ]).then(answers => {
      const branch = {
        "hello-world1": 'hello-world1',
        "hello-world2": 'hello-world2',
      }[answers.type]
      //spinner
      const spinner = ora('正在下载模板, 请稍后...').start()
      //下载
      download('direct:https://github.com/kongkongye/scaffold-hello-world#'+branch, './'+answers.name, {
        clone: true
      }, err => {
        if (!err) {
          spinner.succeed();
          console.log(chalk.cyan('下载成功'))

          //写入模版
          console.log(chalk.yellow('正在写入模版...'));
          const templateParams = {
            name: answers.name,
            description: answers.description,
          }

          const __filename = fileURLToPath(import.meta.url);
          const __dirname = path.dirname(__filename);
          const jsonPath = path.join(__dirname, './package-template.json');
          const content = fs.readFileSync(jsonPath, 'utf8');
          const template = Handlebars.compile(content.toString())
          const result = template(templateParams)
          fs.writeFileSync(`./${answers.name}/package.json`, result)

          console.log(chalk.green('全部成功'))
        }else {
          spinner.fail(err.toString())
        }
      })
    })
  });

program.parse();
