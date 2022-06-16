#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const download_git_repo_1 = __importDefault(require("download-git-repo"));
const inquirer_1 = __importDefault(require("inquirer"));
const fs = __importStar(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const path_1 = __importDefault(require("path"));
commander_1.program.version('1.0.0');
commander_1.program.command('init')
    .description('initialize a new project')
    .option('-n, --name <name>', 'name of the project')
    .action((source, destination) => {
    const branch = 'hello-world1';
    console.log('initializing a new project...');
    //交互式输入
    inquirer_1.default.prompt([
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
        }[answers.type];
        //下载
        (0, download_git_repo_1.default)('direct:https://github.com/kongkongye/scaffold-hello-world#' + branch, './' + answers.name, {
            clone: true
        }, err => {
            if (!err) {
                console.log('download success');
                const templateParams = {
                    name: answers.name,
                    description: answers.description,
                };
                const jsonPath = path_1.default.join(__dirname, './package-template.json');
                const content = fs.readFileSync(jsonPath, 'utf8');
                const template = handlebars_1.default.compile(content.toString());
                const result = template(templateParams);
                fs.writeFileSync(`./${answers.name}/package.json`, result);
                console.log('success');
            }
            else {
                console.error(err);
            }
        });
    });
});
commander_1.program.parse();
//# sourceMappingURL=index.js.map