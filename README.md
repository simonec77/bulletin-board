# Reactron

React and Electron tutorial.

[React](https://facebook.github.io/react/) is a UI templating library backed by Facebook and the open source community. It's a declarative and lightweight tool which makes it super easy to build modular and reusable UI components.

[Electron](http://electron.atom.io/) is a JavaScript runtime which combines Node and Chromium so you can write desktop applications in a similar way you would develop web applications.

One great thing about Electron applications is that you only have to develop for Chrome - so no need to worry about browser compatability issues or the IE's...   

In this tutorial we are going to build a desktop bulletin board. The user will be able to create lists, manage which lists are on the bulletin board, resize the lists on the board and download/print the bulletin boards.

## Table of Contents

1. [Up and running](https://github.com/applegrain/reactron/blob/master/README.md#1-up-and-running)
2. [Introducing React](https://github.com/applegrain/reactron/blob/master/README.md#2-introducing-react)

## 1. Up and running

In this section, we are going to get ourselves set up with a running Electron application. If you don't want to do all the configurations, clone this repo and check out the `up-and-running` branch.

Create a new git directory anywhere you see fit on your machine.

```sh
$ mkdir bulletin-board
$ cd bulletin-board
$ git init
```

**A note on the dollar sign**: it's used to denote that the commands are supposed to be run in your terminal.

Great! Now we need to create a `package.json` file. Run `npm init` in your terminal and answer the prompts.

```sh
$ npm init
```

Let's also install some packages we'll need.

```sh
$ npm i --save-dev electron-prebuilt react react-dom
```

Once you have generated a `package.json` file, add a `start` script. The `electron` command will come from the `electron-prebuilt` package we'll install.

**package.json**
```json
...
"scripts": {
  "start": "electron ."
},
```

If you get an `command not found: electron` error when trying out the start script by running `npm start` in your terminal, you need to install the `electron-prebuilt` globally in order to be able to use it as an executable.

```sh
$ npm i -g electron-prebuilt
```

Cool. Just like any other web application, we need to serve up an html file. Let's create an `index.html` in the root of our directory.

```sh
$ touch index.html
```

For now, let's just add a `Hello, World` in an `h1` tag.

**index.html**
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Bulletin Board</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```

We have a bit more word to do with Electron before we can start our application and be greeted by our `Hello, World`. Just as you have a server and a client in a JavaScript web application, when building Electron applications, you have a renderer process and a main process. The main process is basically functioning as your server - that's where we put code that will start up your application and interact with your machine's file system among other things.

Create a `main.js` file in your repository. In `main.js` we are going to write code that pertains to our *main* process.

First, let's import a few things from the electron library.

**main.js**
```javascript
import { app, BrowserWindow, ipcMain as ipc } from 'electron';
```

* [app](https://github.com/electron/electron/blob/master/docs/api/app.md) represents our application * [BrowserWindow](https://github.com/electron/electron/blob/master/docs/api/browser-window.md) creates and controls browser windows
* [ipcMain](https://github.com/electron/electron/blob/master/docs/api/ipc-main.md) performs async communication between the renderer and the main process

Now, when the application starts up we want to spawn a new browser window, and in that browser window we want to render our `index.html` file. Also, when the `ipc` receives the `close` event we want to quit the app.

```javascript
app.on('ready', () => {
  console.log('The Bulletin Board is starting up...');

  let mainWindow = new BrowserWindow({ width: 1000,
                                       height: 600,
                                       frame: false });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
});

ipc.on('close', () => {
  app.quit();
});
```

Run `npm start` in your terminal and.... we are up and running!

![](http://i.giphy.com/26tPbkPf26wcwQfIY.gif)

## 2. Introducing React

We have a super sweet Electron application that currently doesn't do much. Let's add React to our project and make it even better. In this section, our goal is to render our `Hello, World` greeting in a React component instead.

React uses [jsx](https://facebook.github.io/react/docs/jsx-in-depth.html) which needs to be transpiled using Babel. Let's add some Babel packages.

```sh
$ npm i --save-dev babel-register babel-preset-es2015 babel-preset-react
```

In order to get Babel running properly, add a `.babelrc` file.

**.babelrc**
```
{ "presets": ["es2015", "react"] }
```

Usually when developing web applications using React we also use [webpack](https://webpack.github.io/). Webpack will bundle your code and can run it through different loaders before doing so - and transpiling our code from es5 to es6 is one of those steps. In our desktop application, we won't be using Webpack.

Instead, to take advantage of all of Babels' features, we are going to wrap our entry point `main.js` in another file which loads Babel and the actual entry point.

Create a file `bootstrapper.js` and add it as the entry point in your `package.json` file.

```json
{
  "name": "reactron",
  "version": "1.0.0",
  "description": "react and electron tutorial",
  "main": "bootstrapper.js",
  "scripts": {
    .....
  }
}
```

Require Babel and our actual entry point in `bootstrapper.js`.

**bootstrapper.js**

```js
require('babel-register');
require('./main.js');
```

In our `index.html` file, we need to add `script` tag in which we load Babel hooks in the renderer process and require our main script file. We should also swap our current `h1` tag to a `div` in which we can render our React components.

**index.html**
```html
....

<body>
  <div id="main"></div>
</body>

<script>
  require('babel-register');
  require('./lib/main');
</script>
</html>
```

Next, we should add a folder called `lib` and in that folder, a file called `main.js`. `main.js` will serve as the entry point to all of our UI code.

```sh
$ mkdir lib
$ touch lib/main.js
```

Last step is to add a simple React component to `main.js` that we render into the div with id `main`.

```javascript
'use babel';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Main extends Component {
  render () {
    return (
      <div>
        <h1>Hello, World!</h1>
      </div>
    )
  }
}

ReactDOM.render(<Main />, document.getElementById('main'));
```

Start the application from your terminal and you should see `Hello, World!` again - but this time it's way fancier since it's rendered with React. :smirk: 
