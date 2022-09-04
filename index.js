const {app, BrowserWindow, ipcMain} = require("electron");
const {NFCService} = require("./services/NFCService")
const { ipcRenderer } = require('electron')
const {TicketDataService} = require("./services/TicketDataService")
const {Print} = require("./services/PrintService")
const {Gate} = require('./services/SerialportService')
const ip = require("ip");
const dbConfig = require('./models/dbconfig')
const userModel = require('./models/users')

console.dir ( ip.address() );



try {
    require('electron-reloader')(module)
} catch (_) {
}

let a = async() =>{
    await userModel.insertMany([
        { id: 'Joey', name: 2, password : 'test', email :'test' },
        { id: 'd', name: 2, password : 'test', email :'test' },
        { id: 'e', name: 2, password : 'test', email :'test' },
    ]);
}
a()

const path = require("path");

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {

            preload: path.join(process.cwd(), 'preload.js')
        },
        width: 1360,
        height: 768,
        frame: false
    });

    const printWindow = new BrowserWindow({
        webPreferences: {

            preload: path.join(process.cwd(), 'preload.js')
        },
        width: 1360,
        height: 768,
        frame: false
    });

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
                // Close and set current active window
                // ipcMain.emit('renew-active-win', 'HomeWindow', {
                //     'user.name' :  Store.get('user').name??null,
                //     'user.shift' :  Store.get('user').description??null,
                // })
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

    Print.ipcMain = ipcMain;
    Gate.ipcMain = ipcMain;
    NFCService.ipcMain = ipcMain;
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