const { app, Menu, dialog, BrowserWindow, ipcMain, nativeTheme, shell, webFrame, Tray } = require('electron')
const path = require('path')
const fs = require('fs');


// Frameless Window, movable, draggable, can interact with only button
// can decide to tag allowed to click in styles.css 
class FramelessWindow extends BrowserWindow {
    constructor(options) {
      options.titleBarStyle = 'hidden';
      options.titleBarOverlay = true;
      super(options);
    }
}

// Customizable title bar window, still working
// this one is nice to use >> https://www.npmjs.com/package/custom-electron-titlebar
class CustomTitleBarWindow extends BrowserWindow {
  constructor(options) {
    super(options);
  }
}

const iconPath = path.resolve(__dirname, 'logo.png')


const createWindow = () => {
  // default
  const win = new BrowserWindow({
    icon: iconPath,
    // width: 800,
    // height: 600,
    // titleBarStyle: 'hidden',
    // titleBarOverlay: true,
    // // autoHideMenuBar: true,
    // // webPreferences: {
    // //     preload: path.join(__dirname, 'preload.js')
    // },
  });

  // frameless (no window buttons at all, movable, can click button)
  // const win = new BrowserWindow({
  //   frame: false,
  // });

  // see the description above
  // const win = new FramelessWindow({})

  // still working
  // const win = new CustomTitleBarWindow({})
  
  const zoom_init_val = win.webContents.getZoomFactor();

  function resetZoom() {
    win.webContents.setZoomFactor(zoom_init_val);
  }

  function zoomIn() {
    win.webContents.setZoomFactor(win.webContents.getZoomFactor() + 0.1)
  }

  function zoomOut() {
    win.webContents.setZoomFactor(win.webContents.getZoomFactor() - 0.1)
  }

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
          label: 'Actual Size',
          accelerator: 'Ctrl+0',
          click() {
            resetZoom()
          }
        },
        {
          label: 'Zoom In',
          accelerator: 'Ctrl+=',
          click() {
            zoomIn()
          }
        },
        {
          label: 'Zoom Out',
          accelerator: 'Ctrl+-',
          click() {
            zoomOut()
          }
        },
        {
          type: 'separator',
        },
        {
          label: 'Full Screen',
          type: 'checkbox',
          checked: win.isFullScreen(),
          accelerator: 'F11',
          click() {
            win.setFullScreen(!win.isFullScreen());
          }
        },
        {
          label: 'Always on Top',
          type: 'checkbox',
          checked: win.isAlwaysOnTop(),
          click() {
            win.setAlwaysOnTop(!win.isAlwaysOnTop());
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

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' }
})

  win.loadURL('https://www.perplexity.ai/');

  // add stylesheet 
  
  // let stylesheet = fs.readFileSync("styles.css", "utf-8");

  // win.webContents.insertCSS(stylesheet);

  // tray icon
  
  let tray = new Tray('logo.png');

  tray.on('click', () => {
    win.show();
  }); 
  

  app.on('activate', () => {
    win.show();
  });

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

  win.on('close', (event) => {
    const shouldQuit = showConfirmationDialog();
    
    if(!shouldQuit) {
      event.preventDefault();
      win.hide();
      // Minimize the window to the system tray
      // win.hide();
    } else {

    }
  });

  // Handling the quit event
  // app.on('before-quit', event => {
  //   event.preventDefault();
  // });
}

app.whenReady().then(() => {
  createWindow()
})