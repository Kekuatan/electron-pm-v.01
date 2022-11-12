<script>
    import {user, vehicles} from "../stores";
    import {Camera, doPostWithFormData} from "../../services/Api";
    import {
        Column,
        Grid,
        ImageLoader,
        InlineLoading,
        Modal,
        Row,
        Select,
        SelectItem,
        Tag,
        TextInput,
        Tile,
        TimePicker
    } from "carbon-components-svelte";
    import {blank,barcodeNumber} from '../../helpers/helper'
    import "@fontsource/orbitron";
    import {onMount} from 'svelte';
    import {Button} from "carbon-components-svelte";

    import * as alertify from 'alertifyjs'
    /*
        * @Todo : Kurang jam (Done)
        * @Todo : Jenis pembayaran
        * @Todo : Nampilin data dari Database saat habis scan barcode (Done)
        * @Todo : Urutan ke 2 scan barcode ke 3 jenis kendaraan (Done)
        * @Todo : Saat pilih jenis kendaraan ada penjelasan key nya (Done)
        * @Todo : Vehicle selection box bisa pilih dengan key(Done)
        * @Todo : Tampilin data user : nama shift pos (Done)
        * @Todo : f4 manual jam masuk kendaraan noplat
        * @Todo : f5 Ticket hilang : sam kaya manual cuma plus dendas
        * @Todo : Logout
        * @Todo : Logo
        * @Todo : Tiap mesin punya ID token dan pos_id
        * @Todo : Buat Api baru POST saat scan barcode
        * @Todo : Response API kurang menit
        * @Todo : Pos ambil dari DB
        * @Todo : vALIDASI & ERROR HANDLING
        * @Todo : Gak ada spasi di plat no DB
     */

    let progress = {};
    let poller;
    let time = new Date();
    let isFocus


    const descriptionMap = {
        active: "Submitting...",
        finished: "Success",
        inactive: "Cancelling...",
    };

    const stateMap = {
        active: "finished",
        inactive: "dormant",
        finished: "dormant",
    };

    let state = "dormant";


    export let page;
    export let params;
    export let isLoading;
    let results;


    let defaultSelectedBox = 'blank'
    let vehicleName
    let exclude = ['area_position_out_id']
    let input = {
        'picture_vehicle_out': null,
        'barcode_no': '20220527154316PK',
        'vehicle_id': null,
        'plat_no': 'AB 1234 CD',
        'member_card_no': '',
        'area_position_out_id': process.env.AREA_POSITION,
    }

    let modalInput = {
        'base_url': null,
    };

    function getStruckData() {

        let struck = {
            'start_at': '-',
            'end_at': '-',
            'staff_name': '-',
            'duration': '-',
            'price': '0',
            'price_penalty': '0',
            'total_price': '0',
            'vehicle': '-',
            'plat_no': '-',
        }

        if (!blank(results)) {
            struck['start_at'] = results?.['ticket']?.['start_at']
            struck['end_at'] = results?.['ticket']?.['end_at']
            struck['staff_name'] = results?.['staff_name']
            struck['duration'] = results?.['day'] + ' hari : ' + results?.['hour'] + ' jam : ' + results?.['minute'] + ' minute '
            struck['price'] = results?.['price']
            struck['bypass_type'] = results?.['bypass_type']
            struck['price_penalty'] = results?.['price_penalty']
            struck['total_price'] = results?.['total_price']
            struck['vehicle'] = vehicleName
            struck['plat_no'] = results?.['ticket']?.['plat_no']

        }

        return struck;
    }


    let modalTitle = ""
    let indexForm = 1;
    let img = ''
    let showTicketPeriode = false;
    let showTicketRice = false;
    let open = false;

    const setupPoller = (id) => {
        if (poller) {
            clearInterval(poller);
        }
        poller = setInterval(doPoll(id), 2000)
    }

    // $: setupPoller(1);
    const doPoll = (id) => async () => {
        console.log(`polling ${id}`)
        progress[id] = await new Promise(resolve => setTimeout(async () => {
            input['member_card_no'] = await window.api.getMemberCardUid('post_data')
            console.log('member_card_no', input)
            if (!blank(input['plat_no'])) {
                input['picture_vehicle_out'] = await Camera(input['barcode_no'])
                let data = await doPostWithFormData('/api/ticket/find-member', input, $user['access_token'])
                state = 'finished';

                if (!blank(data)) {
                    results = data
                    state = 'dormant';
                    vehicleName = getVehicleName(results?.['vehicle']?.['id']).toUpperCase()
                    clearInterval(poller);
                    indexForm = 4;
                } else {
                    state = 'dormant';
                }
            }
            resolve((progress[id] || 0) + 1)
        }, 500))
    }

    $: hours = (time.getHours() < 10) ? "0" + time.getHours() : time.getHours();
    $: minutes = (time.getMinutes() < 10) ? "0" + time.getMinutes() : time.getMinutes();
    $: seconds = (time.getSeconds() < 10) ? "0" + time.getSeconds() : time.getSeconds();


    function getFormattedDate(date) {
        var date = new Date();
        if (!blank(date)) {
            date = new Date(date);
        }

        var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

        return str;
    }

    function setAutoFocus(isFocus) {
        if (open) return;
        console.log(isFocus)
        isFocus = isFocus?.['$$']?.['ctx']

        if (!blank(isFocus)) {
            console.log('--->', (typeof isFocus))
            console.log('--->', (isFocus))
            if (blank(isFocus[0]) || typeof isFocus[0] == "string") {
                isFocus = isFocus[1]
            } else {
                isFocus = isFocus[0]
            }
            console.log('--->', (isFocus))
            isFocus.focus()
            isFocus.autofocus = true
        }
        console.log('--->', isFocus)
    }

    onMount(() => {
        console.log(document.getElementById('test'))
        // console.log(isFocus.$$.ctx[1])
        // isFocus.$$.ctx[1].autofocus = true
        // console.log(isFocus.$$.ctx[1].focus())
        // isFocus.focus = true
        setAutoFocus(isFocus)
        const interval = setInterval(() => {
            time = new Date();
        }, 1000);

        return () => {
            clearInterval(interval);
        };

    });
    console.log('data user ', $user)

    function filterIt(arr, searchKey) {
        return arr.filter(function (obj) {
            return Object.keys(obj).some(function (key) {
                return obj[key].includes(searchKey);
            })
        });
    }

    function getVehicleName(vehicle_id) {
        if (blank(vehicle_id)) {
            return ''
        }
        let arr = $vehicles.filter(function (obj) {
            return obj['id'] === vehicle_id
        });
        console.log(arr, vehicle_id)
        return arr[0]['name']
    }

    function clearData() {
        results = null;
        modalInput = clearInput(modalInput)
        input = clearInput(input)
        window.removeEventListener("scroll", onkeydown);

    }

    function clearInput(input) {
        vehicleName = null;
        Object.keys(input).forEach((d) => {
            if (!blank(input[d]) || d === 'hour' || d === 'minute') {
                if (exclude.indexOf(d) === -1) {
                    input[d] = null
                }
                if (d === 'vehicle_id') {
                    input[d] = 'blank'
                }
            }
        })
        return input
    }

    async function handleSubmit(index) {
        state = 'active';
        console.log('aaaaaa', index)
        if (index === 3) {
            clearInterval(poller);
            input['picture_vehicle_out'] = await Camera(input['barcode_no'])
            results = await doPostWithFormData('/api/ticket/find-barcode', input, $user['access_token'])
            state = 'finished';
            console.log('results', results)
            if (results?.['status_code'] === 200) {
                state = 'dormant';
                indexForm = index;
            } else if (results?.['status_code'] === 201) {
                state = 'dormant';
                vehicleName = getVehicleName(results?.['vehicle']?.['id']).toUpperCase()
                indexForm = 4;
            } else {
                state = 'dormant';
            }
        } else if (index === 4) {
            input['picture_vehicle_out'] = await Camera(input['barcode_no'])
            results = await doPostWithFormData('/api/ticket/out', input, $user['access_token'])
            state = 'finished';
            if (!blank(results)) {
                state = 'dormant';
                indexForm = index;
            } else {
                state = 'dormant';
            }
        } else {
            console.log
            indexForm = index;
            state = 'dormant';
        }
    }

    async function handleSubmitModal() {
        modalInput['picture_vehicle_out'] = await Camera(modalInput['bypasser_id'])
        console.log('modal_input ', modalInput)
        results = await doPostWithFormData('/api/ticket/baypass', modalInput, $user['access_token'])
        state = 'finished';
        if (!blank(results)) {
            vehicleName = getVehicleName(results?.['vehicle']?.['id']).toUpperCase()
            state = 'dormant';
            indexForm = 4;
            console.log('modal_input ', modalInput)
        } else {
            state = 'dormant';
            console.log('modal_input ', modalInput)
            alertify.error('Database error')
        }
    }

    async function handleClick(arg) {
        switch (arg) {
            case 'captureImage':
                console.log('ok')
                state = 'active';
                results = {'ticket': {}}
                img = await window.api.camera()
                console.log('img', img)
                console.log('test', img)
                results['ticket']['vehicle_in_url'] = img
                console.log('img', img)
                console.log('test', img)
                state = 'dormant'
                break;
            case 'printTicket':
                console.log (barcodeNumber())
                let a = await window.api.getParameter('token')
                await window.api.printTicket({'barcode_no' : barcodeNumber()})
                break;
            case 'modal':
                let baseUrl = await window.api.getParameter('base_url')
                let clientId = await window.api.getParameter('client_id')
                let clientSecret = await window.api.getParameter('client_secret')
                let cameraUrl = await window.api.getParameter('camera_url')
                let cameraUsername = await window.api.getParameter('camera_username')
                let cameraPassword = await window.api.getParameter('camera_password')
                let areaPosition = await window.api.getParameter('area_position')

                modalInput['base_url'] = baseUrl['value']
                modalInput['client_id'] = clientId['value']
                modalInput['client_secret'] = clientSecret['value']
                modalInput['camera_url'] = cameraUrl['value']
                modalInput['camera_username'] = cameraUsername['value']
                modalInput['camera_password'] = cameraPassword['value']
                modalInput['area_position'] = areaPosition['value']
                open = !open
                break;
            case 'modalClose':
                open = !open
                break;

            case 'modalSubmit':
                let c = await window.api.updateParameter('area_position', 2)
                console.log(c)
                open = !open
                break;
        }


    }


    function onKeyUp(e) {
        console.log(e.keyCode)
        switch (e.keyCode) {

        }
    }


</script>

<Modal
        bind:open
        modalHeading={modalTitle}
        selectorPrimaryFocus="#input-plat-no"
        primaryButtonDisabled={true}
        hasForm={true}
        on:click:button--secondary={() => (open = false)}
        on:open
        on:close
        on:submit
>
    <br/>
    <div class="modal-box">
        <Grid>
            <Row>
                <Column>

                    <TextInput bind:value={modalInput['base_url']} labelText="Base url : " id="input-plat-no" size="sm"
                               placeholder=""/>
                    <TextInput bind:value={modalInput['client_id']} labelText="Client id : " id="input-plat-no" size="sm"
                               placeholder=""/>
                    <TextInput bind:value={modalInput['client_secret']} labelText="Client secret : " id="input-plat-no" size="sm"
                               placeholder=""/>
                    <TextInput bind:value={modalInput['camera_url']} labelText="Camera url : " id="input-plat-no" size="sm"
                               placeholder=""/>
                    <TextInput bind:value={modalInput['camera_username']} labelText="Camera username : " id="input-plat-no" size="sm"
                               placeholder=""/>
                    <TextInput bind:value={modalInput['camera_password']} labelText="Camera password : " id="input-plat-no" size="sm"
                               placeholder=""/>
                    <TextInput bind:value={modalInput['area_position']} labelText="Area position : " id="input-plat-no" size="sm"
                               placeholder=""/>

                    <Button kind="tertiary" on:click={() => handleClick("modalSubmit")}>Save</Button>
                    <Button kind="tertiary" on:click={() => handleClick("modalClose")}>Close</Button>

                </Column>

            </Row>
        </Grid>
    </div>

</Modal>
<Grid>
    <Row>

        <Column md={{ span: 3, offset: 0 }}>
            <Row>
                <Column md={{ span: 4, offset: 0 }}>
                    <div class="tile-wraper ">
                        <Column>
                            <Row>
                                <Column>

                                    <div class="tile-wraper-image">
                                        <p class="tile-block"> Gambar Pintu Masuk </p>
                                        <div class="image-wraper">
                                            {#if state !== "dormant"}
                                                <ImageLoader
                                                        ratio="16x9"
                                                        src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg"
                                                />

                                            {:else}
                                                <ImageLoader
                                                        ratio="16x9"
                                                        src="{
                                                    blank(results) ?
                                                    'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg'
                                                    : results?.['ticket']?.['vehicle_in_url']
                                                   }"
                                                />
                                            {/if}
                                        </div>
                                    </div>

                                </Column>
                            </Row>

                            <!--{#if !blank(results?.['member']) }-->
                            <!--    <Row>-->
                            <!--        <Column>-->
                            <!--            <div class="tile-wraper">-->
                            <!--                <div class="data-member">-->
                            <!--                    <p>-->
                            <!--                        Member Name :-->
                            <!--                        <Tag type="outline">{results?.['member']?.['name']}</Tag>-->
                            <!--                        Plat no :-->
                            <!--                        <Tag type="outline">{results?.['member']?.['plat_no']}</Tag>-->
                            <!--                        Departement :-->
                            <!--                        <Tag type="outline">{results?.['member']?.['card_no']}</Tag>-->
                            <!--                    </p>-->
                            <!--                </div>-->
                            <!--            </div>-->
                            <!--        </Column>-->
                            <!--    </Row>-->
                            <!--{/if}-->


                        </Column>

                    </div>
                </Column>
            </Row>
        </Column>

        <!--            Row 3-->
        <Column>
            <Row>
                <Column sm={{ span: 4, offset: 0 }}>
                    <div class="">
                        <p class="clock"> {hours} : {minutes} : {seconds}</p>
                        <Button kind="tertiary" on:click={() => handleClick('captureImage')}>Capture Image</Button>
                        <Button kind="tertiary" on:click={() => handleClick("printTicket")}>Print Ticket</Button>
                        <Button kind="tertiary" on:click={() => handleClick("modal")}>Setting</Button>

                    </div>
                </Column>
            </Row>
        </Column>
    </Row>
    <Row>

    </Row>
</Grid>

<style>

</style>
