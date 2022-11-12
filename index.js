const {app, BrowserWindow, ipcMain, ipcRenderer} = require("electron");
const {NFCService} = require("./services/NFCService")
const modelParameters = require('./models/parameters')
const {TicketDataService} = require("./services/TicketDataService")
const {Print} = require("./services/PrintService")
const {Gate} = require('./services/SerialportService')
const ip = require("ip");
const dbConfig = require('./models/dbconfig')
const modelUsers = require('./models/users')


const Axios = require('axios');
console.dir(ip.address());

let a2 = async () => {
    await modelParameters.insertMany([
        {id: 1, name: 'access_token', value: 'access_token'},
        {id: 2, name: 'base_url', value: 'http://parkir-server.test'},
        {id: 3, name: 'client_id', value: '97ad17c3-9d68-411a-a6e9-a1ea99be913e'},
        {id: 4, name: 'client_secret', value: 'mm1l6P5QA4cIEVDlQcPtTp0lYaSI4ZELE1XNcBsZ'},
        {id: 5, name: 'camera_url', value: 'http://192.168.110.51//ISAPI/Streaming/channels/1/picture'},
        {id: 6, name: 'camera_username', value: 'admin'},
        {id: 7, name: 'camera_password', value: 'ADMIN123'},
        {id: 8, name: 'area_position', value: '1'},
    ]);
}
a2()
// try {
//     const ignored1 = /resources|[/\\]\./; // all folder resorces => resources
//     require('electron-reloader')(__dirname, {ignored: [ignored1, ignored2, ignoredNode] });
//     require('electron-reloader')(module,'',)
// } catch (_) {
// }

// let a1 = async () => {
//     await modelUsers.insertMany([
//         {id: 'Joey', name: 2, password: 'test', email: 'test'},
//         {id: 'd', name: 2, password: 'test', email: 'test'},
//         {id: 'e', name: 2, password: 'test', email: 'test'},
//     ]);
// }
// a1()
//



const path = require("path");
const {Camera} = require("./services/CameraService");

let a=1
ipcMain.handle('loginBasic', async (event) => {
    const base_url = modelParameters.select('base_url')['value'] + '/oauth/token'
    const clientId = modelParameters.select('client_id')['value']
    const clientSecret = modelParameters.select('client_secret')['value']

    let access_token = ''
    let loginBasic = () => {
        return new Promise((resolve, reject) => {
            let basicAuth = 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
            Axios.post(base_url, {'grant_type': 'client_credentials'}, {
                headers: {'Authorization': basicAuth}
            }).then(function (response) {
                console.log('Authenticated' + a++);
                access_token = response.data.access_token;
                modelParameters.update('access_token', access_token)
                resolve(response.data)

            }).catch(function (error) {
                console.log('Error on Authentication', error, base_url, clientId, clientSecret, basicAuth);
                resolve(error)
            });
        })
    }
    return await loginBasic()
})

app.on("ready", () => {
    BrowserWindow.getAllWindows().forEach(window => {
        window.close()
    })
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
    printWindow.loadFile(path.join(process.cwd(), 'public', 'ticket.html'), {
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

    ipcMain.handle('getParameter', async (event, coloum) => {

        let getParameter = (coloum) => {
            return new Promise((resolve, reject) => {
                let payload = modelParameters.select(coloum)
                resolve(payload)
            })
        }
        return await getParameter(coloum)
    })

    ipcMain.handle('updateParameter', async (event, coloum) => {

        let getParameter = (coloum) => {
            return new Promise((resolve, reject) => {
                let payload = modelParameters.update(coloum[0], coloum[1])
                resolve(payload)
            })
        }
        return await getParameter(coloum)
    })


    ipcMain.handle('camera', async (event, coloum) => {
        let image = await Camera.config().takeImage()
        let camera = (image) => {
            return new Promise((resolve, reject) => {
                image.on('data', data => {
                    resolve('data:image/png;base64,' + data.toString('base64'))
                })

            })
        }
        console.log('index ok')

        console.log(image)
        return await camera(image)
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

        payload['start_at'] = new Date().toLocaleString(['id'], {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }) + " PM-1"
        await Print.ticket(printWindow, html, payload)
        await Print.struck(printWindow, html, payload)
        return payload
    })

    ipcMain.on('emit-print-struck', async (event, payload) => {
        payload['barcode_data_image'] = await Print.getBarcodeDataImage(payload);
        console.log('emit-printStruck', payload)
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