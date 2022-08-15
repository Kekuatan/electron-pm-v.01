import Home from "./pages/Home.svelte";
// import Blog from "./pages/Blog.svelte";
// import Article from "./pages/Article.svelte";
// import Private from "./pages/Private.svelte";
import Login from "./pages/Login.svelte";
import Error from "./pages/Error.svelte";
import { user } from "./stores";
import {blank} from "../helpers/helper";

const routes = {
    home: {
        component: Home,
        user : null
    },
    login: {
        component: Login
    },
    error: {
        component: Login
    }
}



export const Route = (url, user) => {
    if (blank(user) || !user['auth']) {
        return routes['login']['component']
    }
    if (typeof (routes[url]) == 'undefined') {
        return routes['error']['component']
    } else {
        return routes[url]['component']
    }
}

export const SetUser = (url, data) => {
    if (blank(data)) {
        return routes[url]['user']
    } else {
        console.log(data)
        let user = { }
        user['auth'] = !blank(data['auth']) ? data['auth'] : false;
        user['access_token'] = !blank(data['access_token']) ? data['access_token'] : false;
        user['token_type'] = !blank(data['token_type']) ? data['token_type'] : false;
        user['data'] = !blank(data['user']) ? data['user'] : false;
        return user;
    }
}

