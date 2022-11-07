const path = require("path");
const bwipjs = require('bwip-js');
const FormData = require("form-data");
const fs = require("fs");
const Axios = require("axios");
const {ipcRenderer} = require("electron");
const modelParameters = require("../models/parameters");
const {Camera} = require("./CameraService")

const env = {
    base_url : 'http://parkir-server.test',
    client_id : '9658726c-164a-42ec-ac5f-f34d8ebc81e3',
    client_secret : 'SZbiLA6T8F9Wf3NrAp1uJNHuYi2aihPLFPiDa64r',
    camera_url : 'http://192.168.110.51//ISAPI/Streaming/channels/1/picture',
    camera_username : 'admin',
    camera_password : 'ADMIN123',
}

class Print {
    constructor() {
        this.option = {
            silent: true,
            printBackground: false,
            color: false,
            margin: {
                marginType: 'custom',
                top: 0,
                right: 0,
                left: 0,
                bottom: 0
            },
            pageSize: 'A5',
            landscape: false,
            pagesPerSheet: 1,
            collate: false,
            copies: 1,
        }

        this.barcodeConfig = {
            bcid: 'qrcode',//'code128',       // Barcode type
            text: '',    // Text to encode
            scaleX: 2,               // 3x scaling factor
            scaleY: 3,
            height: 10,              // Bar height, in millimeters
            includetext: false,            // Show human-readable text
            textxalign: 'center',        // Always good to set this
        }

        this.init = () =>{
            this.access_token = modelParameters.select('access_token')['value']
            this.base_url = modelParameters.select('base_url')['value']
            this.camera_url  = modelParameters.select('camera_url')['value']
            this.camera_username = modelParameters.select('camera_username')['value']
            this.camera_password= modelParameters.select('camera_password')['value']
            this.area_position= modelParameters.select('area_position')['value']
            this.camera_auth = 'Basic ' + Buffer.from(this.camera_username + ':' + this.camera_password).toString('base64')
        }

        this.struck =  (printWindow, html, content) => {
            const options = this.option
            return new Promise((resolve, reject) => {
                printWindow.loadFile(html, {
                    query: {queryKey: JSON.stringify(content)},
                    hash: "hashValue",
                });

                setTimeout(() => {
                    printWindow.webContents.print(options, (success, failureReason) => {
                        console.log(success);
                        console.log(failureReason);
                        if (!success) {
                            console.log('Print failled');
                            console.log(failureReason);
                        } else {
                            if (printWindow) {
                                // setTimeout(()=> {
                                //     this.win.close();
                                // }, 200)
                            }
                            console.log('Print success');

                        }
                        resolve()
                    });
                }, 300)
            })
        }

        this.getBarcodeDataImage = async (content) => {
            this.barcodeConfig['text'] = content['barcode_no']
            let imageData = ''
            const barcode = () => {
                return new Promise((resolve, reject) => {
                    bwipjs.toBuffer(this.barcodeConfig, (err, png) => {
                        if (err) {
                            console.log('Print Ticket failled', content, this.barcodeConfig);
                            console.log(err);
                        } else {
                            let gifBase64 = `data:image/png;base64,${png.toString('base64')}`
                            // gifBase64 = `<img src="` + gifBase64 + `" alt="Red dot" />`
                            imageData = gifBase64
                            console.log('base64');
                            console.log(gifBase64)
                            resolve()
                        }
                    });
                })
            }
            await barcode()
            return imageData;
        }

        this.requestTicket = (payloadForm) => {
            return new Promise(async (resolve, reject) => {
                Axios.post(this.base_url + '/api/ticket/in', payloadForm, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': "Bearer " + this.access_token,
                        'Content-Type': `multipart/form-data`,
                    }
                }).then((response) => {
                    console.log('api ok')
                    if (response.status === 200) {
                        console.log(response.data)
                        resolve(response.data)
                    }
                }).catch(function (error) {
                    if (error.response) {
                        // Request made and server responded
                        console.log(error.response.data);
                    } else if (error.request) {
                        // The request was made but no response was received
                        console.log(error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                    }
                    resolve(false)
                });
            })
        }

        this.ticket = async (ipcMain, memberCardNo = null) => {
<<<<<<< Updated upstream
            const url = env.base_url + '/oauth/token';
            const clientId = env.client_id
            const clientSecret = env.client_secret
            const payload = {'grant_type': 'client_credentials'}
            let img = null
            const camera_url = env.camera_url
            let key = Buffer.from(clientId + ':' + clientSecret).toString('base64')
=======
            await this.init()
            let responseApi = null;
            let image = await Camera.config().takeImage()
>>>>>>> Stashed changes
            let payloadForm = new FormData();
            payloadForm.append('area_position_in_id', this.area_position);

            if(memberCardNo){
                payloadForm.append('member_card_no',memberCardNo)
            }

<<<<<<< Updated upstream
            let responseApi = null;
            console.log(key)

            const login = () => {
                console.log('// Login to Server')
                return new Promise(async (resolve, reject) => {
                    let form = new FormData();
                    for (var k in payload) {
                        if (payload.hasOwnProperty(k)) {
                            if (k === 'picture_vehicle_in') {
                                payload[k] = path.join(__dirname, '../../..' + payload[k])
                                console.log(payload[k])
                                form.append(k, fs.createReadStream(payload[k]));
                            } else {
                                form.append(k, payload[k]);
                            }

                        }
                    }
                    Axios.post(url, form, {
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': "Basic " + key,
                            'Content-Type': `multipart/form-data`,
                        }
                    }).then((response) => {
                        if (response.status === 200) {
                            this.access_token = response.data.access_token
                            resolve()
                        }
                    }).catch((e)=>{
                        this.access_token = null
                        console.log('// Server error')
                        resolve()
                    })
                })
            }

            const camera = () => {
                console.log('// Camera cctv')
                let key = Buffer.from(env.camera_username + ':' + env.camera_password).toString('base64')
                return new Promise(async (resolve, reject) => {
                    let form = new FormData();
                    for (var k in payload) {
                        if (payload.hasOwnProperty(k)) {
                            if (k === 'picture_vehicle_in') {
                                payload[k] = path.join(__dirname, '../../..' + payload[k])
                                console.log(payload[k])
                                form.append(k, fs.createReadStream(payload[k]));
                            } else {
                                form.append(k, payload[k]);
                            }

                        }
                    }

                    Axios.get(camera_url, {
                        responseType: 'stream',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Accept': 'application/json',
                            'Authorization': 'Basic ' + key,
                            'username': env.camera_username,
                            'password': env.camera_password
                        },
                    }).then((response) => {
                        console.log('image ok')
                        payloadForm.append('picture_vehicle_in', response.data, 'test.jpeg');
                        payloadForm.append('area_position_in_id', 1);
                        resolve()
                    }).catch((e)=>{
                        console.log('// CCTV error')
                        resolve()
                    })
                })
            }

            const requestTicket = () => {
                return new Promise(async (resolve, reject) => {
                    Axios.post(env.base_url + '/api/ticket/in', payloadForm, {
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': "Bearer " + this.access_token,
                            'Content-Type': `multipart/form-data`,
                        }
                    }).then((response) => {
                        console.log('api ok')
                        if (response.status === 200) {
                            console.log(response.data)
                            responseApi = response.data
                            resolve()
                        }
                    }).catch(function (error) {
                        if (error.response) {
                            // Request made and server responded
                            console.log(error.response.data);
                        } else if (error.request) {
                            // The request was made but no response was received
                            console.log(error.request);
                        } else {
                            // Something happened in setting up the request that triggered an Error
                            console.log('Error', error.message);
                        }

                    });
                })
=======
            if(image){
                payloadForm.append('picture_vehicle_in',image, 'test.jpeg');
>>>>>>> Stashed changes
            }

            if(this.access_token){
                // await camera()
                responseApi = await this.requestTicket(payloadForm)
            } else {

            }

            await ipcMain.emit('emit-print-struck', null, responseApi)

            console.log('button, sensor masuk belum terinjak')
        }

    }
}


module.exports = {
    Print: new Print()
}
