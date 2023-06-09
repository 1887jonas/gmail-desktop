const { app, BrowserWindow, Notification } = require("electron");
const path = require("path");

let mainWindow

// Fenster erstellen
function createWindow () {
    // wenn Fenster schon offen schließen
    mainWindow?.close;

    // Fenster mit Einstellungen erstellen
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
        autoHideMenuBar: true,
        icon: path.join(__dirname, "../assets/mail.png"),
        show: false
    });

    // Fenster maximieren
    mainWindow.maximize();
    // Fenster anzeigen
    mainWindow.show();

    if(process.platform === "win32") app.setAppUserModelId("Gmail Desktop");

    // Gmail laden
    (async () => {
        try {
            await mainWindow.loadURL("https://mail.google.com");
        }catch(error){
            console.log("Failed to load URL:" + error);
        }
    })();

    function sendNotification(title, body){
        new Notification({
            title: title,
            body: body,
            icon: path.join(__dirname, "../assets/mail.png")
        }).show();
    }

    // Mainwindow nullen, wenn geschlossen
    mainWindow.on("closed", () => mainWindow = null);

    // Neue Fenster verhindern
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        mainWindow.loadURL(url);
        return { action: "deny" }
    });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if(process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if(mainWindow === null){
        createWindow();
    }else{
        mainWindow?.close;
        createWindow();
    }
});