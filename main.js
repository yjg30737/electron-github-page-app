const { app, Menu, dialog, remote, BrowserWindow, ipcMain, nativeTheme, shell } = require('electron')
const path = require('path')



const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // autoHideMenuBar: true,
    // webPreferences: {
    //     preload: path.join(__dirname, 'preload.js')
    // },
  })
  // Add dialog to confirm 
function showConfirmationDialog() {
  const options = {
    type: 'question',
    buttons: ['Yes', 'No'],
    defaultId: 0,
    title: 'Wait! Are you serious?',
    message: 'Are you really sure about this? Do you really want to quit this thing?'
  };

  const response = dialog.showMessageBoxSync(options);
  return response === 0;
}

// Handling the quit event
app.on('before-quit', event => {
  const shouldQuit = showConfirmationDialog();
  
  if(!shouldQuit) {
    event.preventDefault();
  }
});

// Menu
const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Exit',
        click() {
         app.quit();
        }
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Full Screen',
        type: 'checkbox',
        checked: win.isFullScreen(),
        accelerator: 'F11',
        click() {
          win.setFullScreen(!win.isFullScreen());
        }
      }
    ]
  },
  {
    label: 'Help',
    submenu: [ 
      {
        label: 'About',
        click() {
          dialog.showMessageBox({
            type: 'info',
            title: 'About My App',
            message: 'My App v1.0.0'
          });
        }
      }
    ]
  },
]

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
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