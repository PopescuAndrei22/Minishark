const { app, BrowserWindow, Menu, ipcMain, dialog} = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const getPcapData = require("./NAPI/build/Release/operations");

function createWindow(){
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        minWidth: 500,
        minHeight: 500,
        maxWidth: 1920,
        maxHeight: 1080,
        icon: __dirname + '/marinel.ico',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
          }
    });

    win.loadFile('src/HTML/index.html');

    function createMenu() {
      const template = [
        {
          label: 'File',
          submenu: [
            {
              label: 'Save',
              accelerator: 'CmdOrCtrl+S',
              click: () => {
                // Handle the "Save" button click event
                win.webContents.send('save');
              },
            },
            { role: 'quit' }, // Add the default "Quit" menu item
          ],
        },
        { role: 'editMenu' }, // Add the default "Edit" menu items
        { role: 'viewMenu' }, // Add the default "View" menu items
        {
          label: 'Capture',
          submenu: [
            {
              label: 'Start',
              click: () => {
                // Handle "Start" button click event
                win.webContents.send('startCapture');
              },
            },
            {
              label: 'Stop',
              click: () => {
                // Handle "Stop" button click event
                win.webContents.send('stopCapture');
              },
            },
            {
              label: 'Restart',
              click: () => {
                // Handle "Restart" button click event
                win.webContents.send('restartCapture');
              },
            },
          ],
        },
        {
          label: 'Packets',
          submenu: [
            {
              label: 'Move packets',
              click: () => {
                win.webContents.send('movePackets');
              },
            },
          ],
        },
      ];
    
      const menu = Menu.buildFromTemplate(template);
      Menu.setApplicationMenu(menu);
    
      win.webContents.on('did-finish-load', () => {
        win.webContents.send('window-loaded'); // Notify the window that it has finished loading
      });
    }

    createMenu();
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.handle('showSaveDialog', async (event, options) => {
      const result = await dialog.showSaveDialog(options);
      return result;
    });

    ipcMain.handle('getInterfaceNames', async (event) => {
        return getPcapData.getInterfaceNames();
    });

    ipcMain.handle('Operations', async (event, filePath) => {
        return getPcapData.Operations(filePath);
    });

    ipcMain.handle('OperationsLiveCapture', async (event, networkInterfaceIndex, tabIndex) => {
        return getPcapData.OperationsLiveCapture(networkInterfaceIndex, tabIndex);
    });

    ipcMain.handle('SavePCAP', async (event, data, filePath) => {
      return getPcapData.SavePCAP(data, filePath);
    });

    ipcMain.handle('StopLiveCapture', async (event, tabIndex) => {
      return getPcapData.StopLiveCapture(tabIndex);
    });

    ipcMain.handle('StartLiveCapture', async (event, tabIndex) => {
      return getPcapData.StartLiveCapture(tabIndex);
    });
 });
  
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit();
})
