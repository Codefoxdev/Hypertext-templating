import { readFileSync, readFile, existsSync } from "fs";

class TemplatingManager {
  /**
   * @param {Object} options Extra options to provide
   * @param {Object} options.variables
   * @param {String} options.variables.prefix
   * @param {String} options.variables.suffix
   */
  constructor(options) {
    if (options == null) { throw new Error("Please provide options when creating a new TemplatingManager!"); }
    this.variables = {
      prefix: (options.variables != null) ? (options.variables.prefix ?? "{") : "{",
      suffix: (options.variables != null) ? (options.variables.suffix ?? "{") : "{",
    }
  }
  compile(srcFile) {
    if (srcFile == null) { throw new Error("Please provide a source file!"); }
    if (!existsSync(srcFile)) { throw new Error(""); }
  }
}