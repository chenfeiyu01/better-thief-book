// import { ExtensionContext, workspace, window } from "vscode";
// import * as fs from "fs";
const { workspace, window } = require("vscode");
const fs = require("fs");

class Book {
  constructor(extensionContext) {
    this.curr_page_number = 1;
    this.page_size = 50;
    this.totalPage = 0; // 总页数
    this.start = 0;
    this.end = this.page_size;
    this.filePath = "";
    this.extensionContext;
    this.extensionContext = extensionContext;

    this.text = "";

    if (!Book.instance) {
      console.log("Book.instance init");
      Book.instance = this;
      this.init();
    }

    return Book.instance;
  }

  getSize() {
    let size = this.text.length;
    this.totalPage = Math.ceil(size / this.page_size);
  }

  getFileName() {
    var file_name = this.filePath.split("/").pop();
    console.log(file_name);
  }

  getPage(type) {
    var curr_page = this.curr_page_number;
    var page = 0;

    if (type === "previous") {
      if (curr_page <= 1) {
        page = 1;
      } else {
        page = curr_page - 1;
      }
    } else if (type === "next") {
      if (curr_page >= this.totalPage) {
        page = this.totalPage;
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

    this.text = data
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
    this.readFile();
    this.getSize();
    this.curr_page_number = workspace
      .getConfiguration()
      .get("thief-mud-game.currPageNumber");
  }

  getPreviousPage() {
    this.getPage("previous");
    this.getStartEnd();

    var page_info =
      this.curr_page_number.toString() + "/" + this.totalPage.toString();

    this.updatePage();
    return this.text.substring(this.start, this.end) + "    " + page_info;
  }

  getNextPage() {
    this.getPage("next");
    this.getStartEnd();

    var page_info =
      this.curr_page_number.toString() + "/" + this.totalPage.toString();

    this.updatePage();

    return this.text.substring(this.start, this.end) + "    " + page_info;
  }

  getJumpingPage(pageNum) {
    // vscode弹出输入框，输入页码
    // 输入页码后，跳转到指定页码
    // 页码输入框，只能输入数字

    if (pageNum) {
      this.curr_page_number = Math.max(
        Math.min(Number(pageNum), this.totalPage),
        1
      );
      this.getPage("curr");
      this.getStartEnd();

      var page_info =
        this.curr_page_number.toString() + "/" + this.totalPage.toString();

      this.updatePage();

      return this.text.substring(this.start, this.end) + "    " + page_info;
    }

    return window
      .showInputBox({
        placeHolder: "请输入页码",
        validateInput: (text) => {
          if (text === "") {
            return "请输入页码";
          }
          if (isNaN(Number(text))) {
            return "请输入数字";
          }
        },
      })
      .then((value) => {
        if (value === undefined) {
          return;
        }
        // this.curr_page_number = 最大不超过总页数，最小不小于1的value
        this.curr_page_number = Math.max(
          Math.min(Number(value), this.totalPage),
          1
        );
        this.getPage("curr");
        this.getStartEnd();

        var page_info =
          this.curr_page_number.toString() + "/" + this.totalPage.toString();

        this.updatePage();

        return this.text.substring(this.start, this.end) + "    " + page_info;
      });
  }

  async reloadBook() {
    // 重置页码
    await workspace
      .getConfiguration()
      .update("thief-mud-game.currPageNumber", 1, true);
    this.init();
    return this.getJumpingPage(1);
  }
}

module.exports = Book;
