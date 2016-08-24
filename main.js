import { app, BrowserWindow, ipcMain as ipc, dialog } from 'electron';
import fs from 'fs';

let mainWindow = null;
let posts = null;

app.on('ready', () => {
  console.log('The Bulletin Board is starting up...');

  mainWindow = new BrowserWindow({ width: 1000,
                                   height: 600,
                                   frame: false });

  mainWindow.loadURL(`file://${__dirname}/index.html`);


  mainWindow.webContents.on('did-finish-load', () => {
    sendExistingPosts();
  });
});

ipc.on('data', (event, payload) => {
  posts = payload;
});

app.on('before-quit', () => {
  posts.forEach(writePost);
});

ipc.on('close', () => {
  app.quit();
});

const writePost = (post) => {
  let fileName = `${app.getPath('documents')}/BulletinBoard/${post.id}-note.txt`;
  fs.writeFileSync(fileName, post.body);
};

const sendExistingPosts = () => {
  const path = `${app.getPath('documents')}/BulletinBoard`;
  ensureDirExists(path);

  let existingPosts = fs.readdirSync(path).map((file, index) => {
    let content = fs.readFileSync(path + '/' + file).toString();
    return { id: index, body: content };
  });

  mainWindow.webContents.send('data', existingPosts);
};

const ensureDirExists = (path) => {
  try {
    fs.mkdirSync(path);
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
  }
};
