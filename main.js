const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const os = require("os");

function criarJanela() {
    const janela = new BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: "#000000",
        icon: path.join(__dirname, "icone.png"),

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

if (programa === "modo-dev") {
    await shell.openExternal(
        "vscode://file/C:/Users/Gustavo/Documents/VSCODE/Jarvis-Desktop"
    );

    await shell.openExternal(
        "https://github.com/Gukoyama/Jarvis-Desktop"
    );

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

ipcMain.handle("status-sistema", function() {
    const totalRam = os.totalmem();
    const memoriaLivre = os.freemem();
    const memoriaUsada = totalRam - memoriaLivre;

    return {
        sistema: os.platform(),
        processador: os.cpus()[0].model,
        nucleos: os.cpus().length,
        ramTotal: (totalRam / 1073741824).toFixed(1),
        ramUsada: (memoriaUsada / 1073741824).toFixed(1),
        tempoLigado: Math.floor(os.uptime() / 3600)
    };
});

app.on("window-all-closed", function() {
    if (process.platform !== "darwin") {
        app.quit();
    }
});