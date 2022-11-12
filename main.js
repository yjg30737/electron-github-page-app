const { app, BrowserWindow, ipcMain, nativeTheme, shell } = require('electron')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    // webPreferences: {
    //     preload: path.join(__dirname, 'preload.js')
    // },
  })
  
  // ipcMain.handle('dark-mode:toggle', () => {
  //   if (nativeTheme.shouldUseDarkColors) {
  //     nativeTheme.themeSource = 'light'
  //   } else {
  //     nativeTheme.themeSource = 'dark'
  //   }
  //   return nativeTheme.shouldUseDarkColors
  // })

  // ipcMain.handle('dark-mode:system', () => {
  //   nativeTheme.themeSource = 'dark'
  // })

  win.webContents.on('new-window', function (e, url) {
    e.preventDefault();
    shell.openExternal(url);
  });

  win.loadURL('https://yjg30737.github.io/')

}

app.whenReady().then(() => {
  createWindow()
})