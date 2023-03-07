import {app, BrowserWindow, ipcMain, session} from 'electron';
import {join} from 'path';
import { spawn } from "child_process";
import { Readable } from "stream";

const appName = app.getPath("exe");
const name = "chatgpt-desktop";
const expressAppUrl = "http://127.0.0.1:30002";
let mainWindow: BrowserWindow | null;
let expressPath = "./build/service/index.js";


if (appName.endsWith(`${name}.exe`)) {
	expressPath = join("./resources/app.asar", expressPath);
}
function redirectOutput(x: Readable) {
	x.on("data", function (data: any) {
    console.log(data.toString());
	});
}
function createWindow () {
  const expressAppProcess = spawn(appName, [expressPath], {
		env: {
			ELECTRON_RUN_AS_NODE: "1",
		},
	});
  redirectOutput(expressAppProcess.stdout);
	redirectOutput(expressAppProcess.stderr);
   mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  }
  else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['script-src \'self\'']
      }
    })
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('message', (event, message) => {
  console.log(message);
})