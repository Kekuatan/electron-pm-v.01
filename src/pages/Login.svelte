<script>
    import {user, vehicles} from "../stores";
    import {doGet, doPost, basicAuth} from "../../services/api";
    import {Route, SetUser} from "../routes.js";
    import {blank} from '../../helpers/helper'
    import * as alertify from 'alertifyjs'
    import {TextInput} from "carbon-components-svelte";
    import {Button, ButtonSet, InlineLoading} from "carbon-components-svelte";
    import Login from "carbon-icons-svelte/lib/Login.svelte";
    import Home from "./Home.svelte";

    export let page;
    export let params;
    export let isLoading;

    let username = 'admin@admin.com';
    let password = 'admin';
    let results;
    let invalidInput = false;


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


    // let progress = {};
    // let poller;
    //
    // const setupPoller = (id) => {
    //     if (poller) {
    //         clearInterval(poller);
    //     }
    //     poller = setInterval(doPoll(id), 2000)
    // }
    //
    // const doPoll = (id) => async () => {
    //     console.log(`polling ${id}`)
    //     progress[id] = await new Promise(resolve => setTimeout(async () => {
    //             const response = await window.api.getMemberCardUid('post_data')
    //             console.log('-----dari login-------')
    //             console.log(response)
    //         resolve((progress[id] || 0) + 1)
    //     }, 500))
    // }
    //
    // $: setupPoller(1);
    // handleSubmit()
    function handleSubmit() {
        // (async () => {
        //     const response = await window.api.getMemberCardUid('post_data')
        //     console.log('-----dari login-------')
        //     console.log(response)
        //     console.log('--------------------')
        // })();

        state = 'active';
        console.log('aaa');
        doGet('/api/myapi', '', '')
            .then(function (response) {
                console.log('ssss', response)
            })
        // results = doGet('/api/vehicles').then(function (response) {
        //         console.log(response)
        //         $vehicles = response;
        //         console.log($vehicles)
        //     basicAuth()
        //         .then(function (response) {
        //             console.log(response, SetUser('home',response))
        //             response['auth'] = true
        //             $user = SetUser('home',response)
        //             params =  user
        //             page = Route('home',$user)
        //             state = 'finished';
        //         }).catch((e)=>{
        //         state = 'finished';
        //         results = e
        //         state = 'dormant';
        //     })
        //     })
    }

    console.log('aa');
    page = Route('home', {auth: true})
    handleSubmit()

</script>

<div class="login-form">

    <!--    <Loading-->
    <!--            description="Active loading indicator" withOverlay={false}-->
    <!--    />-->
</div>


<style>

    h1 {
        margin-bottom: 20px;
        text-align: left;
    }

    .login-form {
        padding: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
        /*background-color: green;*/
    }

    .submit-btn {
        text-align: end;
        /*text-align: center;*/
        margin: 20px 0px;
        /*position: absolute;*/
        /*top: 50%;*/
        /*left: 50%;*/
        /*-ms-transform: translate(50%, 0%);*/
        /*transform: translate(20%, 0%);*/

    }


</style>

