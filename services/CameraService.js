const FormData = require("form-data");
const path = require("path");
const fs = require("fs");
const Axios = require("axios");
const modelParameters = require("../models/parameters");

class Camera{
    constructor() {
        this.config = () => {
            this.camera_url  = modelParameters.select('camera_url')['value']
            this.camera_username = modelParameters.select('camera_username')['value']
            this.camera_password= modelParameters.select('camera_password')['value']
            this.camera_auth = 'Basic ' + Buffer.from(this.camera_username + ':' + this.camera_password).toString('base64')
            return this
        }

        this.takeImage = () => {
            console.log('// Camera cctv')
            return new Promise(async (resolve, reject) => {
                Axios.get(this.camera_url, {
                    responseType: 'stream',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json',
                        'Authorization': this.camera_auth,
                        'username': this.camera_username,
                        'password': this.camera_password
                    },
                }).then((response) => {
                    console.log('image ok')
                    resolve(response.data)
                }).catch((e)=>{
                    console.log('// CCTV error')
                    resolve(false)
                })
            })
        }
    }
}



// const camera = () => {
//     console.log('// Camera cctv')
//     return new Promise(async (resolve, reject) => {
//         let form = new FormData();
//         for (var k in payload) {
//             if (payload.hasOwnProperty(k)) {
//                 if (k === 'picture_vehicle_in') {
//                     payload[k] = path.join(__dirname, '../../..' + payload[k])
//                     console.log(payload[k])
//                     form.append(k, fs.createReadStream(payload[k]));
//                 } else {
//                     form.append(k, payload[k]);
//                 }
//
//             }
//         }
//
//         Axios.get(this.camera_url, {
//             responseType: 'stream',
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//                 'Accept': 'application/json',
//                 'Authorization': this.camera_auth,
//                 'username': this.camera_username,
//                 'password': this.camera_password
//             },
//         }).then((response) => {
//             console.log('image ok')
//             payloadForm.append('picture_vehicle_in', response.data, 'test.jpeg');
//             payloadForm.append('area_position_in_id', this.area_position);
//             resolve()
//         }).catch((e)=>{
//             console.log('// CCTV error')
//             resolve()
//         })
//     })
// }


module.exports = {
    Camera: new Camera()
}