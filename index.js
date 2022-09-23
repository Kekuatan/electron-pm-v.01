const {app, BrowserWindow, ipcMain, ipcRenderer} = require("electron");
const {NFCService} = require("./services/NFCService")
const {TicketDataService} = require("./services/TicketDataService")
const {Print} = require("./services/PrintService")
const {Gate} = require('./services/SerialportService')
const ip = require("ip");
const path = require("path");

console.dir ( ip.address() );



try {
    require('electron-reloader')(module)
} catch (_) {
}


app.on("ready", () => {
    console.log('ready')
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(process.cwd(), 'preload.js')
        },
        width: 1360,
        height: 768,
        frame: true
    });

    const printWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(process.cwd(), 'preload.js')
        },
        width: 1360,
        height: 768,
        frame: true
    });

    Print.ipcMain = ipcMain;
    Gate.ipcMain = ipcMain;
    NFCService.ipcMain = ipcMain;

    mainWindow.loadFile(path.join(__dirname, "public/index.html"));
    mainWindow.webContents.openDevTools();

    printWindow.webContents.openDevTools();
    printWindow.loadFile(  path.join(process.cwd(), 'public', 'ticket.html'), {
        query: {queryKey: JSON.stringify()},
        hash: "hashValue",
    });


    ipcMain.handle('login', async (event, payload) => {
        const login = () => {
            return new Promise((resolve, reject) => {
                console.log(payload)
                resolve()
            })
        }

        await login()

        return payload;
    })

    ipcMain.handle('getMemberCardUid', async (event, payload) => {
        const login = () => {
            return new Promise((resolve, reject) => {
                console.log('expose to main word', NFCService.card)
                resolve()
            })
        }
        await login()
        if (NFCService.card == null) {
            console.log('expose to main word', null)
            return NFCService.card
        } else {
            console.log('expose to main word', NFCService.card.uid)
            return NFCService.card.uid;
        }

    })

    ipcMain.handle('printStruck', async (event, payload) => {
        let html = path.join(process.cwd(), 'public', 'ticket.html')
        await Print.struck(printWindow, html, payload)
        return payload
    })

    ipcMain.handle('printTicket', async (event, payload) => {
        let html = path.join(process.cwd(), 'public', 'ticket.html')
        payload['barcode_data_image'] = await Print.getBarcodeDataImage(payload);
        payload['start_at'] = new Date().toLocaleString(['id'], {day:'2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute:'2-digit', second:'2-digit'} ) + " PM-1"
        console.log(payload)
        await Print.struck(printWindow, html, payload)
        return payload
    })

    ipcMain.on('emit-print-struck', async (event, payload) => {
        payload['barcode_data_image'] = await Print.getBarcodeDataImage(payload);
        console.log('emit-printStruck',payload)
        let html = path.join(process.cwd(), 'public', 'ticket.html')
        await Print.struck(printWindow, html, payload)
        return payload
    })
});


app.on("window-all-closed", function () {
    console.log('try to close')

    if (process.platform !== "darwin") {
        app.quit();
    }

});
app.on("exit", function () {
    console.log('closed')
});