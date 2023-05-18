// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// const vscode = require('vscode');
// import { commands, window } from "vscode";
// import * as book from "./bookUtil";
const Book = require("./bookUtils");
const { commands, window } = require("vscode");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "thief-mud-game" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = commands.registerCommand(
    "thief-mud-game.helloWorld",
    function () {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      window.showInformationMessage("Hello thief-mud-game!!!");
    }
  );

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  // 老板键
  let displayCode = commands.registerCommand(
    "thief-mud-game.displayCode",
    () => {
      let lauage_arr_list = ['Run Extension "Thief Mud Game" Success!'];

      // var index = Math.floor(Math.random() * lauage_arr_list.length);
      var index = 0;
      window.setStatusBarMessage(lauage_arr_list[index]);
    }
  );

  // 下一页
  let getNextPage = commands.registerCommand(
    "thief-mud-game.getNextPage",
    () => {
      let books = new Book(context);
      window.setStatusBarMessage(books.getNextPage());
    }
  );

  // 上一页
  let getPreviousPage = commands.registerCommand(
    "thief-mud-game.getPreviousPage",
    () => {
      // let books = new book.Book(context);
      window.setStatusBarMessage("123123");
    }
  );

  // 跳转某个页面
  let getJumpingPage = commands.registerCommand(
    "thief-mud-game.getJumpingPage",
    () => {
      let books = new Book(context);
      window.setStatusBarMessage(books.getJumpingPage());
    }
  );

  context.subscriptions.push(displayCode);
  context.subscriptions.push(getNextPage);
  context.subscriptions.push(getPreviousPage);
  context.subscriptions.push(getJumpingPage);
  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
