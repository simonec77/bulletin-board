import { app, BrowserWindow, ipcMain as ipc } from 'electron';

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
