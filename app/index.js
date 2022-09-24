const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
//check program logs
const io = require("./main/io");

//create new window
const openWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
  });
  //full screen window
  win.maximize();
  //display index.html file
  win.loadFile(path.resolve(__dirname, "render/html/index.html"));
  return win;
};

app.on("ready", () => {
  const win = openWindow();

  //watch file logs
  io.watchFiles(win);
});

//quit app when all window closed
app.on('window-all-closed', () => {
    if( process.platform !== 'darwin' ) {
        app.quit();
    }
});

// when app activates, open a window
app.on( 'activate', () => {
    if( BrowserWindow.getAllWindows().length === 0 ) {
        openWindow();
    }
} );
