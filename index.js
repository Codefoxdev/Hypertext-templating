/*!
 * Hypertext-Templating
 * Copyright(c) 2022 Robin de Vos
 *
 * Made by Codefoxdev
 * MIT Licensed
 */

"use strict";

const { readFileSync, existsSync } = require("fs");
let options = {};

/**
 * @param {Object} options
 * @param {Object} options.variables
 * @param {String} options.variables.prefix
 * @param {String} options.variables.suffix
 * @param {String} options.pagesDirectory
 */
function middleware(compileOptions) {
  if (!compileOptions.pagesDirectory) {
    return new Error("Please specify a directory for your html pages!");
  }
  options = compileOptions;
  let _rootSrc = compileOptions.pagesDirectory;

  return (req, res, next) => {
    let _res = res;

    /**
     * @param {String} relSrcFile
     * @param {Object} variables
     * @returns {String}
     */

    const _compile = (relSrcFile, variables) => {
      let _src = _rootSrc;
      if (relSrcFile.charAt(0) == "/") {
        _src += relSrcFile;
      } else {
        _src += "/" + relSrcFile;
      }

      let compiled = compile(_src, variables);
      _res.send(compiled);
      return compiled;
    };
    res.compile = _compile;
    next();
  };
}

module.exports = middleware;
module.exports.debug = { compile };

// Engine

/**
 * @param {String} srcFile Relative path to the file you want to compile
 * @param {Object} variables Define variables to use when compiling html file
 * @returns {String} Compiled version of the src file
 */
function compile(srcFile, variables) {
  if (srcFile == null) {
    throw new Error("Please provide a source file!");
  }
  if (!existsSync(srcFile)) {
    throw new Error("File does not exist");
  }
  const src = readFileSync(srcFile, "utf-8");
  // Create Search object
  const search = new Search(src, options);
  search.match();
  return search.replace(variables);
}

class Search {
  /**
   * Creates a new Search Object, which can handle variable and function replacing
   * @param {String} src The sourch in wHich to search
   * @param {Object} options
   *
   * @param {String} options.svgSourceDir Absolute path to svg source directory
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
    this.options = {
      svgSourceDir: options.svgSourceDir,
      variables: {
        prefix:
          options.variables != null ? options.variables.prefix ?? "{" : "{",
        suffix:
          options.variables != null ? options.variables.suffix ?? "}" : "}",
      },
      functions: {
        prefix:
          options.functions != null ? options.functions.prefix ?? "(" : "(",
        suffix:
          options.functions != null ? options.functions.suffix ?? ")" : ")",
      },
    };
    this.baseDir = {
      svgSource: options.svgSourceDir,
    };

    this.found = null;
    this.regexp = {
      variables: new RegExp(
        `${this.options.variables.prefix}(.*?)${this.options.variables.suffix}`,
        "g"
      ),
      engine: new RegExp(
        `\\${this.options.functions.prefix}(.*?)\\((.*?)\\)\\${this.options.functions.suffix}`,
        "g"
      ), // /\((.*?)\((.*?)\)\)/g
    };
  }
  match() {
    this.found = {
      engine: this.src.match(this.regexp.engine),
      variables: this.src.match(this.regexp.variables),
    };
    return this.found;
  }
  replace(variables) {
    if (!this.found) {
      this.match();
    }
    if (this.found.engine) {
      this.found.engine.forEach((item) => {
        let val = "";
        let baseFunc = this.removeBaseFunction(item);
        if (engine[baseFunc.type]) {
          if (baseFunc.type == "loadSVG") {
            val = engine[baseFunc.type](
              baseFunc.params[0].replaceAll('"', ""),
              this.baseDir.svgSource
            );
          }
        }
        this.src = this.src.replace(item, val);
      });
    }
    if (this.found.variables && variables) {
      this.found.variables.forEach((item) => {
        const variable = item
          .replace(this.options.variables.prefix, "")
          .replace(this.options.variables.suffix, "");
        const res = resolve(variable, variables);

        this.src = this.src.replace(item, res);
      });
    }
    return this.src;
  }
  removeBaseFunction(func) {
    let type = "";
    let params = [];
    if (func.includes("engine")) {
      func = func.replace(this.options.functions.prefix, "");
      func = func.replace(this.options.functions.suffix, "");

      if (func.includes("engine.loadSVG")) {
        let funcParams = func.replace("engine.loadSVG", "");
        funcParams = funcParams.replace("(", "");
        funcParams = funcParams.replace(")", "");
        params = funcParams.split(",");
        type = "loadSVG";
      }
    }
    return {
      type: type,
      params: params,
    };
  }
}

function resolve(path, obj) {
  return path.split('.').reduce(function (prev, curr) {
    return prev ? prev[curr] : null
  }, obj || self)
}