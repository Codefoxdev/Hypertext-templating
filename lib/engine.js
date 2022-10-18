const { readFileSync, readFile, existsSync } = require('fs');
const { markdown } = require("markdown");

const types = {
  none: 0,
  default: 1,
  variables: 2,
  functions: 3
}

const engine = {
  baseDir: "",
  loadMD: (relativeSrcFile) => {
    if (engine.baseDir.charAt(engine.baseDir.length - 1) != "/") { engine.baseDir = engine.baseDir + "/"; }
    let srcFile = engine.baseDir + relativeSrcFile;
    if (!existsSync(srcFile)) { throw new Error(`Can't load markdown src file, file: ${srcFile}, does not exist!`); }
    const src = readFileSync(srcFile, 'utf-8');
    return markdown.toHTML(src);
  }
}

class Search {
  /**
   * Creates a new Search Object, which can handle variable and function replacing
   * @param {String} src The sourch in wHich to search
   * @param {Object} options
   * 
   * @param {String} options.mdSourceDir Absolute path to markdown source directory
   * 
   * @param {Object} options.variables
   * @param {String} options.variables.prefix
   * @param {String} options.variables.suffix
   * 
   * @param {Object} options.functions
   * @param {String} options.functions.prefix
   * @param {String} options.functions.suffix
   */
  constructor(src, options) {
    this.src = src;
    this.options = options;

    engine.baseDir = options.mdSourceDir;

    this.found = null;
    this.regexp = {
      variables: new RegExp(`${this.options.variables.prefix}(.*?)${this.options.variables.suffix}`, 'g'),
      engine: new RegExp(`\\${this.options.functions.prefix}(.*?)\\((.*?)\\)\\${this.options.functions.suffix}`, 'g'),  // /\((.*?)\((.*?)\)\)/g
    }
  }
  match() {
    this.found = {
      engine: this.src.match(this.regexp.engine),
      variables: this.src.match(this.regexp.variables),
    };
    return this.found;
  }
  replace(variables) {
    if (!this.found) { this.match(); }
    if (this.found.engine) {
      this.found.engine.forEach(item => {
        let val = "";
        let baseFunc = this.removeBaseFunction(item);
        if (engine[baseFunc.type]) { val = engine[baseFunc.type](baseFunc.params[0].replaceAll('"', '')); }
        this.src = this.src.replace(item, val);
      });
    }
    if (this.found.variables && variables) {
      this.found.variables.forEach(item => {
        const variable = item.replace(this.options.variables.prefix, "").replace(this.options.variables.suffix, "");
        const res = resolve(variable, variables);

        this.src = this.src.replace(item, res);
      })
    }
    return this.src;
  }
  removeBaseFunction(func) {
    let type = "";
    let params = [];
    if (func.includes("engine")) {
      func = func.replace(this.options.functions.prefix, "");
      func = func.replace(this.options.functions.suffix, "");
      if (func.includes("engine.loadMD")) {
        let funcParams = func.replace("engine.loadMD", "");
        funcParams = funcParams.replace("(", "");
        funcParams = funcParams.replace(")", "");
        params = funcParams.split(",");
        type = "loadMD";
      }
    }
    return {
      type: type,
      params: params
    }
  }
}

//regexp = new RegExp(`${this.variables.prefix}(.*?)${this.variables.suffix}`, 'g');
//regexp = new RegExp(`${this.functions.prefix}(.*?)${this.functions.suffix}`, 'g');

function resolve(path, obj) {
  return path.split('.').reduce(function (prev, curr) {
    return prev ? prev[curr] : null
  }, obj || self)
}

module.exports = { Search };