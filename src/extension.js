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
    'Congratulations, your extension "better-thief-book" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  // 老板键
  let displayCode = commands.registerCommand(
    "better-thief-book.displayCode",
    () => {
      let books = new Book(context);
      window.setStatusBarMessage(books.displayCode());
    }
  );

  // 下一页
  let getNextPage = commands.registerCommand(
    "better-thief-book.getNextPage",
    () => {
      let books = new Book(context);
      window.setStatusBarMessage(books.getNextPage());
    }
  );

  // 上一页
  let getPreviousPage = commands.registerCommand(
    "better-thief-book.getPreviousPage",
    () => {
      let books = new Book(context);
      window.setStatusBarMessage(books.getPreviousPage());
    }
  );

  // 跳转某个页面
  let getJumpingPage = commands.registerCommand(
    "better-thief-book.getJumpingPage",
    async () => {
      let books = new Book(context);
      const content = await books.getJumpingPage();
      window.setStatusBarMessage(content);
    }
  );

  // 重新加载数据
  let reloadBook = commands.registerCommand(
    "better-thief-book.reloadBook",
    async () => {
      let books = new Book(context);
      window.setStatusBarMessage(await books.reloadBook());
    }
  );

  // 添加书签
  let addBookMark = commands.registerCommand(
    "better-thief-book.addBookMark",
    async () => {
      let books = new Book(context);
      // 调用添加书签的方法
      // 在vscode中显示提示信息
      window.showInformationMessage(await books.addBookMark());
    }
  );

  // 展示书签列表
  let showBookMarkList = commands.registerCommand(
    "better-thief-book.showBookMarkList",
    async () => {
      let books = new Book(context);
      // 打开下拉列表，展示书签列表
      const content = await books.getBookMarkList();
      window.setStatusBarMessage(content);
    }
  );

  context.subscriptions.push(displayCode);
  context.subscriptions.push(getNextPage);
  context.subscriptions.push(getPreviousPage);
  context.subscriptions.push(getJumpingPage);
  context.subscriptions.push(reloadBook);
  context.subscriptions.push(addBookMark);
  context.subscriptions.push(showBookMarkList);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
