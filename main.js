const { app, BrowserWindow, ipcMain } = require('electron');

function createWindow(){
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        minWidth: 500,
        minHeight: 500,
        maxWidth: 1920,
        maxHeight: 1080,
        icon: __dirname + '/marinel.ico',
    });

    win.loadFile('src/index.html');
}

app.whenReady().then(() => {
    createWindow();
  
    
 });
  
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit();
})
