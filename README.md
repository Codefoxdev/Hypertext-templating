# Hypertext templating (v0.2.0)
Hypertext templating is a node module used for compiling html with custom user variables.

# Getting started

1. First install the module with:

```
npm install hypertext-templating
```

2. Then include the module in your main file, and create a new instance of the class

   When you create a new instance, you need to specify the absolute directory the folder where you keep your html files and you can change some parameters, like the prefix or suffix you want to use.

```js:index.js
...
const templating = require("hypertext-templating");
app.use(templating({
  pagesDirectory: "absolute/path/to/directory",
  variables: {
    prefix: "{",
    suffix: "}"
  }
}))
...
```

3. Create a HTML file and use your variables
  
   When using variables make sure you use the correct prefix and suffic, otherwise it will not work!
   The default are as shown below, and you can overwrite them in the middleware function.

```html:index.html
...
<div>
  <p>{user.name}<p>
<div>
  ...
```
In this case I used the variable user.name so when compiling it, make sure you define the variable! To compile it you can call res.compile if you are using express with the middleware.

```js:index.js
...
app.get("/", (req, res) => {
  res.compile("relative/path/to/htmlfile", {
    user: {
      name: "Bob"
    }
  })
});
...
```
Here the first parameter is the relative path to your html file compared to the path you specified when initializing the middleware, and the second is your variables, here I created an object called "user" with an item called "name" which I used in my HTML file, if you forget to specify the variable it will result in 'null'.

If you have a problem, ask it on the github repo: 
https://github.com/CodeFoxDev/Hypertext-templating