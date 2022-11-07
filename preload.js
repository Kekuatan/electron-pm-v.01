const {contextBridge, ipcRenderer} = require("electron");
const path = require("path");
const {exec} = require("child_process");
// const {Gate} = require('./services/SerialportService')
// const port = new SerialPort('COM3',
//     {
//         // echo: true,
//         // record: true,
//         // baudRate:9600,
//         // dataBits : 8,
//         // parity:'none',
//         // stopBits: 1,
//         // rtscts: false
//     })
//
//
// port.on('data', function (data) {
//     console.log('Data port  data:', data)
//     console.log('Data port  data:', data.toString())
//     //
//     // if (data.toString() == '*IN1ON#'){
//     //     port.write('TRIG1#');
//     //     a()
//     //     exec(makeMp3, (err) => {
//     //         if (err) {
//     //             console.error(err)
//     //             process.exit(1)
//     //         } else {
//     //             console.info('done!')
//     //         }
//     //     })
//     // }
//
// })
console.log('load preload')

contextBridge.exposeInMainWorld(
    "api", {
        login: async (payload) => {
            // port.write('TRIG1#');
            return await ipcRenderer.invoke('login', payload)
                .then((result) => {
                console.log(payload,result)
                return result
            })

        },
        // openGate: async (payload) => {
        //     console.log(payload)
        //     await Gate.open();
        // },
        loginBasic:async (payload) => {
            // port.write('TRIG1#');
            return await ipcRenderer.invoke('loginBasic', payload)
                .then((result) => {
                    console.log(payload,result)
                    return result
                })
        },
        printStruck:async (payload) => {
            return await ipcRenderer.invoke('printStruck', payload)
                .then((result) => {
                    console.log(payload,result)
                    return result
                })
        },
        printTicket:async (payload) => {
            return await ipcRenderer.invoke('printTicket', payload)
                .then((result) => {
                    console.log(payload,result)

                    return result
                })
        },
        camera :async (payload) => {
            return await ipcRenderer.invoke('camera', payload)
                .then((result) => {
                    console.log(payload,result)

                    return result
                })
        },
        getMemberCardUid: async (payload) => {
            return await ipcRenderer.invoke('getMemberCardUid', payload)
                .then((result) => {
                    console.log(payload,result)
                    return result
                })
        },
        getParameter: async (coloum) => {
            return await ipcRenderer.invoke('getParameter', coloum)
                .then((result) => {
                    console.log(coloum,result)
                    return result
                })
        },
    }
);