const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const ScriptUpdater = require('./script-updater');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {

    // Create the browser window.
    win = new BrowserWindow({
        width: 1334,
        height: 750,
        backgroundColor: '#000000',
        icon: path.join(__dirname, 'icons/png/64x64.png')
    })

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'splash.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    // win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })

    setTimeout(()=> { //let the splash screen show for a moment
        const scriptUpdater = new ScriptUpdater(app);
        scriptUpdater.update(()=> {
            win.loadURL(url.format({
                pathname: path.join(__dirname, '..', 'www', 'index.html'),
                protocol: 'file:',
                slashes: true
            }))
        });
    }, 500);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
        app.quit()
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.