# Hypertext templating
Hypertext templating is a node module used for compiling html with custom user variables.

## Getting started

1. First install the module with:

```
npm install hypertext-templating
```

2. Then include the module in your main file, and create a new instance of the class

   When you create a new instance, you can change some parameters, like the prefix or suffix you want to use.

```js:index.js
...
const TemplatingManager = require("hypertext-templating");
const templating = new TemplatingManager({
  variables: {
    prefix: "{{",
    suffix: "}}"
  }
});
...
```

3. Create a HTML file and use your variables
  
   When using variables make sure you use the correct prefix and suffic, otherwise it will not work!

```html:index.html
...
<div>
  <p>{{user.name}}<p>
<div>
  ...
```
In this case I used the variable user.name so when compiling it, make sure you define the variable! For example:

```js:index.js
...
templating.compile("path-to-you-html-file", {
  user: {
    name: "Codefoxdev"
  }
});
...
```
Here the first parameter is the path to your html file, and the second is your variables, here I created an object called "user" with an item called "name" which I used in my HTML file, but you can use whatever you want!

## Compile times
After compiling a certain file, it will be put in cache and the next time it will be even faster.
For compiling a html file of about 100 lines:
- 1st Time: about 7ms
- After the 1st time: mostly less than 2ms
If a file isn't accessed for more than 300 seconds, or there are to many files in cache, it will be removed and it needs to read straight from the file again. (TTL: 300)

## Future plans
In the future I would like to add more features, like:
- Express middleware, for adding a res.compile function, that compiles and sends the result immediately.
- Configurable ttl, and more caching options, like size limit

If you have a problem, ask it on the github repo: 
https://github.com/CodeFoxDev/Hypertext-templating
