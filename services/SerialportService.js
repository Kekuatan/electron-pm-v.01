const {SerialPort, ReadlineParser} = require("serialport");
const path = require("path");
const {ipcRenderer} = require("electron");
const fs = require("fs");
const Axios = require('axios');
const FormData = require('form-data');
const {Print} = require('./PrintService')

// const {Base64} = require("../helpers/helper");

class Gate {
    constructor() {
        this.option = {
            path: 'COM4',
            echo: true,
            record: true,
            baudRate: 9600,
            dataBits: 8,
            parity: 'none',
            stopBits: 1,
            rtscts: false
        }
        this.ipcMain = null;
        this.sensorIn = false;
        this.sensorOut = false;
        this.serialPort = new SerialPort(this.option);
        this.access_token = false
        this.printTicket = 'asem;'
        this.open = () => {
            return new Promise((resolve, reject) => {
                this.serialPort.write('TRIG1#');
                setTimeout(() => {
                    resolve()
                }, 300)
            })
        }

        this.showPortOpen = () => {
            console.log('port open. Port: ' + this.serialPort.path + ', Data rate: ' + this.serialPort.baudRate + ', Data bits: ' + this.serialPort.dataBits + ', parity: ' + this.serialPort.parity);
        }

        this.readSerialData = (data) => {
            console.log('aaaa')
            console.log(this.printTicket)
            // Print.ticket(this.ipcMain)
            let str = data.toString()
            if (str === '*IN1ON#') {
                if (this.sensorIn && this.sensorOut) {
                    console.log('button')
                    this.sensorIn = false
                    this.sensorOut = false
                } else {
                    let responseData = [];
                    if (!this.sensorIn && !this.sensorIn) {
                        console.log('button, sensor keluar dan masuk belum terinjak')
                    }
                    if (!this.sensorIn) {
                        const base_url = process.env.BASE_URL;
                        console.log(base_url)
                        console.log('button, sensor masuk belum terinjak')
                    } else if (!this.sensorOut) {
                        const base_url = process.env.BASE_URL;
                        console.log(base_url)
                        console.log('button, sensor keluar belum terinjak')
                    } else{
                        Print.ticket(this.ipcMain)
                    }
                }

            } else if (str === '*IN3OFF#') {
                this.sensorOut = true
                console.log('sensor kendaraan  keluar')
            } else if (str === '*IN2OFF#') {
                this.sensorOut = true
                console.log('sensor kendaraan masuk ')
            } else {
                console.log(data.toString());
                console.log(data);
            }

            // return;
        }

        this.showPortClose = () => {
            console.log('port closed.');
        }

        this.showError = (error) => {
            console.log('Serial port error: ' + error);
        }


        const parser = new ReadlineParser()
        this.serialPort.pipe(parser);

        this.serialPort.on('open', this.showPortOpen);
        this.serialPort.on('data', this.readSerialData);
        this.serialPort.on('close', this.showPortClose);
        this.serialPort.on('error', this.showError);

        // this.axios = (url, type, payload, query) => {
        //     let form = new FormData();
        //     console.log(payload)
        //     for (var k in payload) {
        //         if (payload.hasOwnProperty(k)) {
        //             if (k === 'picture_vehicle_in') {
        //                 payload[k] = path.join(__dirname, '../../..' + payload[k])
        //                 form.append(k, fs.createReadStream(payload[k]));
        //             } else {
        //                 form.append(k, payload[k]);
        //             }
        //
        //
        //         }
        //     }
        //     // const file =  fs.readFile(pathName);
        //     console.log('b')
        //     // form.append('file', file, 'my-image.jpg')
        //
        //     let key = this.token
        //     if (type.toLowerCase() === 'post') {
        //         return Axios.post(url, form, {
        //             headers: {
        //                 'Accept': 'application/json',
        //                 'Authorization': "Bearer " + key,
        //                 'Content-Type': `multipart/form-data`,
        //             }
        //         })
        //     }
        // }
    }


}


module.exports = {
    Gate: new Gate()
}


SerialPort.list().then(ports => {
    ports.forEach(function (port) {
        console.log(port.path)
    })
})

/*
    Protocol Interface Serial/USB

Serial settings :
Baud rate 9600 bps
data bit 8
stop bit 1
parity none
RTS CTS disabled
DTR DSR disabled
flowcontrol none

Command :
1. *OUT1ON#
mengaktifkan output 1
response : *OUT1ONOK#

2. *OUT2ON#
mengaktifkan output 2
response : *OUT2ONOK#

3. *OUT3ON#
mengaktifkan output 3
response : *OUT3ONOK#

4. *OUT4ON#
mengaktifkan output 4
response : *OUT4ONOK#

6. *OUT1OFF#
menonaktifkan output 1
response : *OUT1OFFOK#

7. *OUT2OFF#
menonaktifkan output 2
response : *OUT2OFFOK#

8. *OUT3OFF#
menonaktifkan output 3
response : *OUT3OFFOK#

9. *OUT4OFF#
menonaktifkan output 4
response : *OUT4OFFOK#

11. *OPEN1#
mengaktifkan output 1 selama 1 detik, kemudian output 1 off
response : *OPEN1OK#

12. *CLOSE1#
mengaktifkan output 2 selama 1 detik, kemudian output 2 off
response : *CLOSE1OK#

13. *STOP1#
mengaktifkan output 3 selama 1 detik, kemudian output 3 off
response : *STOP1OK#

14. *OPEN2#
mengaktifkan output 1 dan menonaktifkan output 2
response : *OPEN2OK#

15. *CLOSE2#
mengaktifkan output 2 dan menonaktifkan output 1
response : *CLOSE2OK#

16. *STOP2#
menonaktifkan output 1 dan output 2
response : *STOP2OK#

17. *PING#
mengecek apakah interface aktif
response : *PINGOK#

18. *STAT#
meminta status semua input dan semua output saat ini
response : *STATabcdefghi#
a = 1 jika input 1 ON, a = 0 jika input 1 OFF
b = 1 jika input 2 ON, a = 0 jika input 2 OFF
c = 1 jika input 3 ON, a = 0 jika input 3 OFF
d = 1 jika input 4 ON, a = 0 jika input 4 OFF
e = 1 jika output 1 ON, a = 0 jika output 1 OFF
f = 1 jika output 2 ON, a = 0 jika output 2 OFF
g = 1 jika output 3 ON, a = 0 jika output 3 OFF
h = 1 jika output 4 ON, a = 0 jika output 4 OFF
i = 1 jika output 5 ON, a = 0 jika output 5 OFF

19. *TRIG1#
mengaktifkan output 1 selama 1 detik, kemudian output 1 off

20. *TRIG2#
mengaktifkan output 2 selama 1 detik, kemudian output 2 off

21. *TRIG3#
mengaktifkan output 3 selama 1 detik, kemudian output 3 off

22. *TRIG4#
mengaktifkan output 4 selama 1 detik, kemudian output 4 off

Saat interface dinyalakan pertama kali, interface akan mengirimkan data *POWERON#
jika input 1 berubah status dari OFF menjadi ON, interface akan mengirimkan data *IN1ON#
jika input 1 berubah status dari ON menjadi OFF, interface akan mengirimkan data *IN1OFF#
jika input 2 berubah status dari OFF menjadi ON, interface akan mengirimkan data *IN2ON#
jika input 2 berubah status dari ON menjadi OFF, interface akan mengirimkan data *IN2OFF#
jika input 3 berubah status dari OFF menjadi ON, interface akan mengirimkan data *IN3ON#
jika input 3 berubah status dari ON menjadi OFF, interface akan mengirimkan data *IN3OFF#
jika input 4 berubah status dari OFF menjadi ON, interface akan mengirimkan data *IN4ON#
jika input 4 berubah status dari ON menjadi OFF, interface akan mengirimkan data *IN4OFF#
jika interface menerima data valid dari card reader Wiegand-26/34 (auto detect), maka interface akan mengirimkan data *Waaaaaaaa# (channel 1)
*Xaaaaaaaa# (channel 2)
aaaaaaaa = 8/10 digit desimal data nomor UID kartu RFID
(8 digit untuk Wiegand 26, 10 digit untuk Wiegand 34)
     */