const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("jarvisPC", {
    abrirPrograma: function(programa) {
        return ipcRenderer.invoke("abrir-programa", programa);
    },

    obterStatus: function() {
        return ipcRenderer.invoke("status-sistema");
    }
});