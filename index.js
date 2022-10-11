const { TemplatingManager } = require("./func/classes");

const manager = new TemplatingManager({
  variables: {
    prefix: "{{",
    suffix: "}}"
  }
});

const res = manager.compile("./out/index.html", {
  user: {
    name: "email@email",
    id: "123456789"
  }
});

console.log(res);