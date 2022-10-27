const { readFileSync, readFile, existsSync } = require('fs');
const { Search } = require("./engine");

class TemplatingManager {
  /**
   * @param {Object} options Extra options to provide
   * 
   * @param {String} options.mdSourceDir Absolute path to markdown source directory
   * @param {String} options.svgSourceDir Absolute path to svg source directory
   * @param {String} options.htmlSourceDir Absolute path to html source directory
   * 
   * @param {Object} options.variables
   * @param {String} options.variables.prefix
   * @param {String} options.variables.suffix
   * 
   * @param {Object} options.functions
   * @param {String} options.functions.prefix
   * @param {String} options.functions.suffix
   */
  constructor(options) {
    if (options == null) { throw new Error("Please provide options when creating a new TemplatingManager!"); }
    this.options = {
      mdSourceDir: options.mdSourceDir,
      svgSourceDir: options.svgSourceDir,
      htmlSourceDir: options.htmlSourceDir,
      variables: {
        prefix: (options.variables != null) ? (options.variables.prefix ?? "{{") : "{{",
        suffix: (options.variables != null) ? (options.variables.suffix ?? "}}") : "}}",
      },
      functions: {
        prefix: (options.functions != null) ? (options.functions.prefix ?? "(") : "(",
        suffix: (options.functions != null) ? (options.functions.suffix ?? ")") : ")",
      }
    }
  }
  /**
   * 
   * @param {String} srcFile Relative path to the file you want to compile
   * @param {Object} variables Define variables to use when compiling html file
   * @returns {String} Compiled version of the src file
   */
  compile(srcFile, variables) {
    if (srcFile == null) { throw new Error("Please provide a source file!"); }
    if (!existsSync(srcFile)) { throw new Error("File does not exist"); }
    const src = readFileSync(srcFile, 'utf-8');
    // Create Search object
    const search = new Search(src, this.options);
    search.match();
    return search.replace(variables);
  }
}

module.exports = TemplatingManager;