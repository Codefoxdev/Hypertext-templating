const { readFileSync, readFile, existsSync } = require('fs');

const types = {
  none: 0,
  default: 1,
  variables: 2
}

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
  compile(srcFile, variables) {
    if (srcFile == null) { throw new Error("Please provide a source file!"); }
    if (!existsSync(srcFile)) { throw new Error(""); }
    const src = readFileSync(srcFile, 'utf-8');
    const res = this.search(src, types.variables).replace(variables);
    return res;
  }
  search(src, type) {
    let regexp;
    const varOptions = this.variables;
    switch (type) {
      case types.variables:
        regexp = new RegExp(`${this.variables.prefix}(.*?)${this.variables.suffix}`, 'g');
        break;
    }
    const found = src.match(regexp);
    return {
      src: src,
      found: found,
      replace: (variables) => {
        let compiled = src;
        found.forEach(item => {
          const variable = item.replace(varOptions.prefix, '').replace(varOptions.suffix, '');

          const res = resolve(variable, variables);

          compiled = compiled.replace(item, res);
          
        });
        return {
          src: src,
          compiled: compiled
        };
      }
    }
  }
}

/*
    Thanks to @abahet on stackoverflow for this amazing function!
    (https://stackoverflow.com/questions/4244896/dynamically-access-object-property-using-variable/45322101#45322101)
*/
function resolve(path, obj) {
  return path.split('.').reduce(function(prev, curr) {
      return prev ? prev[curr] : null
  }, obj || self)
}

module.exports = { TemplatingManager }