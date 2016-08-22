# Reactron

React and Electron tutorial.

[React](https://facebook.github.io/react/) is a UI templating library backed by Facebook and the open source community. It's a declarative and lightweight tool which makes it super easy to build modular and reusable UI components.

[Electron](http://electron.atom.io/) is a JavaScript runtime which combines Node and Chromium so you can write desktop applications in a similar way you would develop web applications.

One great thing about Electron applications is that you only have to develop for Chrome - so no need to worry about browser compatability issues or the IE's...   

In this tutorial we are going to build a desktop bulletin board. The user will be able to create lists, manage which lists are on the bulletin board, resize the lists on the board and download/print the bulletin boards.

### Table of Contents

1. [Up and running](https://github.com/applegrain/reactron/blob/master/README.md#1-up-and-running)
2. [Introducing React](https://github.com/applegrain/reactron/blob/master/README.md#2-introducing-react)
3. [Adding a post](https://github.com/applegrain/reactron/blob/master/README.md#3-adding-a-post)
4. [Post: adding and editing the body](https://github.com/applegrain/reactron/blob/master/README.md#4-post-adding-and-editing-the-body)

### 1. Up and running

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

### 2. Introducing React

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

### 3. Adding a post

The first step is to be able to add a post. For now, we will keep all posts in a sidebar to the right. At the top of the sidebar there will be an `add` button a new unnamed post will be added to the sidebar. When we click the unnamed post, it will expand and be editable for the user.

First, let's create the `Sidebar` component.

```shell
$ mkdir lib/components
$ touch lib/components/Sidebar.js
```

For now, add an empty class in both files.

**lib/components/Sidebar.js**
```javascript
import React, { Component } from 'react';

export default class Sidebar extends Component {
  render() {
    return (
      <div>
        <h1>I am a Sidebar</h1>
      </div>
    )
  }
}
```

Let's render the `Sidebar` component in the `main.js` file.

**lib/main.js**
```javascript
...

import Sidebar from './components/Sidebar'

class Main extends Component {
  render () {
    return (
      <div>
        <Sidebar />
      </div>
    )
  }
}

...
```

Start up your app and make sure it renders properly.

Next, we should add the `Add New` button and attach a listener to it so we know when to add posts. ES6 classes do not implicitly bind the context to the component. In order to avoid a bunch of `bind()` functions, we can use arrow functions in the constructor which do bind the context to the function we are calling. //TODO: explain this better

The posts won't only be used in the `Sidebar` component, they will also be used in the main body of our application, in the bulletin board. In order to maintain a *Single Source of Truth* - aka not maintaining the same state in multiple places in our application - we should read and write our data at the same place. In this case, since we will most likely render the bulletin board in `main.js` as well, that's where we should read/write posts to the file system.    

**lib/components/Sidebar.js**
```javascript
...

export default class Sidebar extends Component {
  constructor() {
    super();

    this.handleAddNew = () => this._handleAddNew();
  }

  _handleAddNew() {
    // in here we are going to call up to the Sidebar's parent and have it add a new post.
  }

  render() {
    return (
      <div>
        <button onClick={this.handleAddNew}>Add New</button>
      </div>
    )
  }
}
```

So, in the `_handleAddNew` function we should call a function passed down to us as a `prop` from `main.js` to signal that a new post should be added.

**lib/components/Sidebar.js**
```javascript
_handleAddNew() {
  this.props.onAddNewPost();
}
```  

And pass down that function as a prop to the `Sidebar` component from `main.js`.

**lib/main.js**
```javascript
class Main extends Component {
  constructor() {
    super();

    this.handleAddNewPost = () => this._handleAddNewPost();
  }

  _handleAddNewPost() {
    // here we should create a new Post, store it and render
  }

  render () {
    return (
      <div>
        <Sidebar onAddNewPost={this.handleAddNewPost} />
      </div>
    )
  }
}
```

In `_handleAddNewPost` in the `Main` component is where we should add the new post. A post should have a unique id and a body. Later each post should probably also have a `pin state` so we can keep track of which posts are pinned to the bulletin board. We can store the properties of each post in objects, which we can keep in an array as local state in the `Main` component. Since we'll track an array of properties, or rather `props`, we could create posts on the fly by just passing the relevant `props` object to the `Post` component and render the post.

**main.js**
```javascript
_handleAddNewPost() {
 // create unique id
 // compose post objects
 // add new Post object and add it to the local state of `Main`
    // pass down this.state.posts to the `Sidebar` component
}
```

Let's start with by adding state to `Main`.

**main.js**
```javascript
constructor() {
  super();

  this.state = { posts: [] }

  this.handleAddNewPost = () => this._handleAddNewPost();
}
```

Great!

Now we can start working with the `_handleAddNewPost` function. Our pseudo code also doubles as a TODO-list:  

- create unique id

We can take advantage of the fact that we at any given point know how many posts there are, and use the count of posts as the unique id: `let id = this.state.posts.length;`.

- compose post objects

A post object has an id and a body: `let post = { id: id, body: '' }`.

- add new Post object and add it to the local state of `Main`

We add the new `post` object to the state: `this.setState({ posts: this.state.posts.concat(post) });`.

  - pass down this.state.posts to the `Sidebar` component: `<Sidebar onAddNewPost={this.handleAddNewPost} posts={this.state.posts} />`.



**main.js**
```javascript
_handleAddNewPost() {
  let id = this.state.posts.length;
  let post = { id: id, body: '' }

  this.setState({ posts: this.state.posts.concat(post) });
}

...

render () {
  return (
    <div>
      <Sidebar onAddNewPost={this.handleAddNewPost} posts={this.state.posts} />
    </div>
  )
}

```

Before we can render anything in the `Sidebar` component, we actually need to add the `Post` component.

```shell
$ touch lib/components/Post.js
```

For now, let's just add enough code to get it working.

```javascript
import React from 'react';

export default React.createClass({
  render() {
    return (
      <div>
        <p>I am a Post</p>
      </div>
    )
  }
});
```

Require the component in `Sidebar`...

**main.js.**
```javascript
import Post from './Post'
```

And the last step is to render the posts in the `render` function of `Sidebar`.

[Go here](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Spread_operator) to read more about the spread syntax (`...object`).

```javascript
render() {
  let posts = this.props.posts.map(p => <Post key={p.id} {...p} />);
  return (
    <div>
      <button onClick={this.handleAddNew}>Add New</button>
      {posts}
    </div>
  )
}
```

Try it out in your app and when you click the `Add New` button, you should see your posts rendering.

### 4. Post: Adding and editing the body

Currently, when we click the `Add New` button, we are just adding multiple post components with the same body.

We need to do two things:

- create a better default body
- allow the user to inline edit and save the post

When you are adding a new post, you are probably intending to add your message right away. A great user experience would be to move the cursor to the body so the user can start typing right away.

Instead of having a default body, we could display a placeholder if *there is not* a body. Let's swap the paragraph tag with an input field. We also add a `defaultValue`, set to the body of the post, so that the body of the post shows up if there is one.

**lib/components/Post.js**
```javascript
<div>
  <input placeholder={this.props.body ? "" : "Write sth..."} defaultValue={this.props.body} />
</div>
```

Nice. With this in place, we have a placeholder instead of an actual value that the user have to remove before adding their own text. Next, in order to make the newly added Post focused, we can leverage [refs](https://facebook.github.io/react/docs/more-about-refs.html). In their documentation, they have an [example](https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute) that achieves exactly what we're trying to do.

First, we need to tag our input. We do that with a ref callback. The ref callback takes the component itself as a first argument, and then we assign it to `this._input`.

**lib/components/Post.js**
```javascript
<input placeholder={this.props.body ? "" : "Write sth..."} defaultValue={this.props.body} ref={(c) => this._input = c} />
```

Later, we can use our `_input` attribute in a `componentDidMount` lifecycle method.

**lib/components/Post.js**
```javascript
componentDidMount() {
  this._input.focus();
},
```

Try it out by running `npm start`... when you add a new post it should be focused and ready for you to edit!

Next thing we should take a look at is saving whatever text the user enters in the input field. We need to take the input value, pass it up to `main` where we keep track of the posts as state, update the body of the relevant post, and set the state so it is translated down to the `Sidebar`.

To allow for a very "fluid" user experience, instead of having a `Save` button next to the input fields, we update the body whenever it's changed. We use React's `onChange` event to register everytime the input field is being modified.

**lib/components/Post.js**
```javascript
<input onChange={this.handleChange}
       defaultValue={this.props.body}
       placeholder={this.props.body ? "" : "Write sth..."}
       ref={(c) => this._input = c} />
```

Our eventhandler, `this.handleChange` is a function local to this component. There, we can capture the current value of the input field and then pass that up to our parent and update the props passed down to the post.

After adding the `handleChange` function to our `Post` component and logging the the target value from the [event](https://developer.mozilla.org/en-US/docs/Web/API/Event) object, open up your dev tools in the app and see that it will log all text you enter.

**lib/components/Post.js**
```javascript
handleChange(e) {
  console.log(e.target.value);
},
```

Next, we need to call a function that's (not yet) passed down as a prop. Note that we are passing both the id of the post and the text we'd like to set as the body.

**lib/components/Post.js**
```javascript
handleChange(e) {
  this.props.handlePostChange(this.props.id, e.target.value)
},
```

Let's add this function to the props passed down to `Post`.

**lib/main.js**
```javascript
_handleAddNewPost() {
  let id = this.state.posts.length;
  let props = { id: id, body: '', handlePostChange: this.handlePostChange };

  this.setState({ posts: this.state.posts.concat(<Post {...props} />) });
}
```

And then add the implementation (just `console.log` the arguments passed through for now so we can verify that it works)...

**lib/main.js**
```javascript

class Main extends Component {
  constructor() {
    super();

    .....

    this.handlePostChange = (id, body) => this._handlePostChange(id, body);
  }


  ....

  _handlePostChange(id, body) {
    console.log(id, body);
  }

....
}
```

Try it out with your dev tools open and you should be able to see the arguments come through.

To actually implement the functionality in `handlePostChange`, here's the pseudo code I came up with:

```javascript
_handlePostChange(id, body) {
  // iterate over the posts and find the one with matching id
  // update it's `body` attribute to the value received as an argument
  // update the state `posts` to the updated array of posts (the return value of the iteration)
}
```

You are of course free to use the pseudo code as a starting point and go with an implementation of your own, but this is what I came up with:

```javascript
_handlePostChange(id, body) {
  let posts = this.state.posts.map((post) => {
    if (post.id === id) {
      post.body = body;
    }
    return post;
  })

  this.setState({ posts });
}
```

If you add a few `console.log` statements in your code to inspect the state in `main`, verify that it actually updates. Next step is to write the posts to the filesystem so that we can save them across sessions!
