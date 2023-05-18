// import { ExtensionContext, workspace, window } from "vscode";
// import * as fs from "fs";
const { workspace, window } = require("vscode");
const fs = require("fs");

class Book {
  constructor(extensionContext) {
    this.curr_page_number = 1;
    this.page_size = 50;
    this.page = 0;
    this.start = 0;
    this.end = this.page_size;
    this.filePath = "";
    this.extensionContext;
    this.extensionContext = extensionContext;

    if (!Book.instance) {
      console.log("Book.instance init");
      this.init();
      Book.instance = this;
    }

    return Book.instance;
  }

  getSize(text) {
    let size = text.length;
    this.page = Math.ceil(size / this.page_size);
  }

  getFileName() {
    var file_name = this.filePath.split("/").pop();
    console.log(file_name);
  }

  getPage(type) {
    var curr_page = workspace
      .getConfiguration()
      .get("thief-mud-game.currPageNumber");
    var page = 0;

    if (type === "previous") {
      if (curr_page <= 1) {
        page = 1;
      } else {
        page = curr_page - 1;
      }
    } else if (type === "next") {
      if (curr_page >= this.page) {
        page = this.page;
      } else {
        page = curr_page + 1;
      }
    } else if (type === "curr") {
      page = curr_page;
    }

    this.curr_page_number = page;
    // this.curr_page_number = this.extensionContext.globalState.get("book_page_number", 1);
  }

  updatePage() {
    workspace
      .getConfiguration()
      .update("thief-mud-game.currPageNumber", this.curr_page_number, true);
  }

  getStartEnd() {
    this.start = this.curr_page_number * this.page_size;
    this.end = this.curr_page_number * this.page_size + this.page_size;
  }

  readFile() {
    if (this.filePath === "" || typeof this.filePath === "undefined") {
      window.showWarningMessage(
        "请填写TXT格式的小说文件路径 & Please fill in the path of the TXT format novel file"
      );
    }

    var data = fs.readFileSync(this.filePath, "utf-8");

    var line_break = workspace
      .getConfiguration()
      .get("thief-mud-game.lineBreak");

    return data
      .toString()
      .replace(/\n/g, line_break)
      .replace(/\r/g, " ")
      .replace(/　　/g, " ")
      .replace(/ /g, " ");
  }

  init() {
    this.filePath = workspace.getConfiguration().get("thief-mud-game.filePath");
    var is_english = workspace
      .getConfiguration()
      .get("thief-mud-game.isEnglish");
    const pageSize = workspace
      .getConfiguration()
      .get("thief-mud-game.pageSize");

    if (is_english === true) {
      this.page_size = pageSize * 2;
    } else {
      this.page_size = pageSize;
    }
  }

  getPreviousPage() {
    let text = this.readFile();

    this.getSize(text);
    this.getPage("previous");
    this.getStartEnd();

    var page_info =
      this.curr_page_number.toString() + "/" + this.page.toString();

    this.updatePage();
    return text.substring(this.start, this.end) + "    " + page_info;
  }

  getNextPage() {
    let text = this.readFile();

    this.getSize(text);
    this.getPage("next");
    this.getStartEnd();
    console.log("text =", this.curr_page_number);

    var page_info =
      this.curr_page_number.toString() + "/" + this.page.toString();

    this.updatePage();

    return text.substring(this.start, this.end) + "    " + page_info;
  }

  getJumpingPage() {
    let text = this.readFile();

    this.getSize(text);
    this.getPage("curr");
    this.getStartEnd();

    var page_info =
      this.curr_page_number.toString() + "/" + this.page.toString();

    this.updatePage();

    return text.substring(this.start, this.end) + "    " + page_info;
  }
}

module.exports = Book;
