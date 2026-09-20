const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");

function criarJanela() {
    const janela = new BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: "#000000",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    janela.loadFile("index.html");
}

ipcMain.handle("abrir-programa", async function(evento, programa) {
   if (programa === "steam") {
    await shell.openExternal("steam://open/main");
    return true;
}
 if (programa === "calculadora") {
    await shell.openExternal("calculator:");
    return true;
}   
    if (programa === "cmd") {
    await shell.openPath("C:\\Windows\\System32\\cmd.exe");
    return true;
}

    return false;
});

/* iniciar o Jarvis junto com o Windows. */
// Iniciar o Jarvis
app.whenReady().then(function() {
    app.setLoginItemSettings({
        openAtLogin: false, // true = ativar a inicialização automática e false = desativar 
        path: process.execPath,
        args: [app.getAppPath()]
    });

    criarJanela();

    app.on("activate", function() {
        if (BrowserWindow.getAllWindows().length === 0) {
            criarJanela();
        }
    });
});

app.on("window-all-closed", function() {
    if (process.platform !== "darwin") {
        app.quit();
    }
});