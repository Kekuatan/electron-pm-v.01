
<script>
    // build/extra.css is fed from css files imported here
    import "../node_modules/alertifyjs/build/css/alertify.css";
    import "../node_modules/alertifyjs/build/css/themes/semantic.min.css";


    // export let name;
    // let response;
    // let payload;
    //
    let results;
    let isLoading = false;
    // let operatorId = '341'
    // let recipientPhone = {
    // 	'countryCode' : 'NG',
    // 	'number' : ''
    // }
    // let amount = ''
    // let customIdentifier = ''
    import {doPost, doGet} from "../services/api";
    // // console.log(process.env.NODE_ENV)
    // // console.log(access_token)
    // console.log(process.env.ACCESS_TOKEN)
    // function handleClick(payload){
    // 	results = doPost(payload)
    // }
    import {user, modal, vehicles} from "./stores";
    import {Route} from "./routes.js";
    import "carbon-components-svelte/css/g80.css";
    import {Grid, Row, Column} from "carbon-components-svelte";
    import {Tag} from "carbon-components-svelte";

    let params;
    let page = Route('home', $user)

    function setUser() {
        isLoading = true;
        results = doGet('/api/vehicles')
            .then(function (response) {
                console.log(response)
                $vehicles = response;
                console.log($vehicles)
                isLoading = false;
            })
    }
</script>


<!--<header>-->
<!--    &lt;!&ndash;    <nav>&ndash;&gt;-->
<!--    &lt;!&ndash;        <a href="#" on:click={()=>{Route('home',$user)}}>Home</a>&ndash;&gt;-->
<!--    &lt;!&ndash;        <a href="#" on:click={()=>{Route('login', $user)}}>Login</a>&ndash;&gt;-->
<!--    &lt;!&ndash;        <a href="#" on:click={setUser}>set user</a>&ndash;&gt;-->
<!--    &lt;!&ndash;        &lt;!&ndash;		<a href="/private">Secret Page</a>&ndash;&gt;&ndash;&gt;-->
<!--    &lt;!&ndash;    </nav>&ndash;&gt;-->
<!--</header>-->
<main>
    {#if isLoading}
        <p>Loading....</p>
    {:else}
        <svelte:component this={page} {...params} bind:page bind:params bind:isLoading/>
    {/if}

    <!--    <p>{page}</p>-->
</main>

{#if $user?.['auth']}
    <footer>
        <Row>
<!--            <Column>-->
<!--                <div class="user-data">-->
<!--                    <p>-->
<!--                        Kasir :-->
<!--                        <Tag type="outline">{($user['data']['name']).toUpperCase()}</Tag>-->
<!--                        Shift :-->
<!--                        <Tag type="outline">{($user['data']['shift']['description']).toUpperCase()}</Tag>-->
<!--                        Pos :-->
<!--                        <Tag type="outline">PK-1</Tag>-->
<!--                    </p>-->
<!--                </div>-->
<!--            </Column>-->
<!--            <Column>-->

<!--                    <div class="user-data">-->
<!--                        <p>-->
<!--                            Manual :-->
<!--                            <Tag type="outline">F5</Tag>-->
<!--                            Ticket Hilang :-->
<!--                            <Tag type="outline">F4</Tag>-->
<!--                            Logout-->
<!--                            <Tag type="outline">F9</Tag>-->
<!--                        </p>-->

<!--                </div>-->
<!--            </Column>-->
        </Row>
    </footer>
{/if}
<style>
    main,
    header {
        padding: 20px;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }

    nav a {
        margin-right: 10px;
        text-decoration: none;
    }

    footer {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        letter-spacing: 3px;

        background-color: #525252;
        font-family: var(---font-cosmetic);
        color: var(--color-cosmetic-blue);
        text-align: center;
    }

    .user-data {
        padding: 10px;
    }

</style>

<!--<main>-->

<!--	<h1>Hellazoaas {name}!</h1>-->
<!--	<button on:click={ () => handleClick({'aaa' : "sdfsf"}) }> RECHARGE-->
<!--	</button>-->
<!--&lt;!&ndash;	<h1>Hellazoaas {accessToken}!</h1>&ndash;&gt;-->
<!--	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>-->
<!--</main>-->


<!--<style>-->
<!--	main {-->
<!--		text-align: center;-->
<!--		padding: 1em;-->
<!--		max-width: 240px;-->
<!--		margin: 0 auto;-->
<!--	}-->

<!--	h1 {-->
<!--		color: #ff3e00;-->
<!--		text-transform: uppercase;-->
<!--		font-size: 4em;-->
<!--		font-weight: 100;-->
<!--	}-->

<!--	@media (min-width: 640px) {-->
<!--		main {-->
<!--			max-width: none;-->
<!--		}-->
<!--	}-->
<!--</style>-->