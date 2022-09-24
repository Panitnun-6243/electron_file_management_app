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
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// when app activates, open a window
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    openWindow();
  }
});

//get all files on app directory
ipcMain.handle("app:get-files", () => {
  return io.getFile();
});

//add files by drag and drop
ipcMain.handle("app:on-file-add", (event, files = []) => {
  io.addFiles(files);
});

//add files by choosing from dialog
ipcMain.handle("app:on-fs-dialog-open", (event) => {
  const files = dialog.showOpenDialogSync({
    properties: ["openFile", "multiSelections"],
  });

  io.addFiles(
    files.map((filepath) => {
      return {
        name: path.parse(filepath).base,
        path: filepath,
      };
    })
  );
});

//delete file
ipcMain.on("app:on-file-delete", (event, file) => {
  io.deleteFile(file.filepath);
});

//open file
ipcMain.on("app:on-file-open", (event, file) => {
  io.openFile(file.filepath);
});

//copy file
ipcMain.on("app:on-file-copy", (event, file) => {
  event.sender.startDrag({
    file: file.filepath,
    icon: path.resolve(__dirname, "../resources/paper.png"),
  });
});
