/* jshint esversion: 6 */
import Vue from 'vue';
import VueRouter from 'vue-router';

import routes from './routes.js';
import store from '../store';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: routes,
    mode: process.env.HISTORY_MODE,
    base: process.env.ROUTE_BASE

});

router.rememberRoute = null;

router.beforeEach((to, from, next) => {
    let actionbar = to.meta.actionbar || {};
    let background = to.meta.background || {};
    let user = store.getters['auth/checkLogin'];
    if (user && actionbar.footer) {
        if (actionbar.footer.show) {
            store.dispatch('actionbars/showFooter', true);
        } else {
            store.dispatch('actionbars/showFooter', false);
        }
        if (actionbar.footer.active_id) {
            store.dispatch('actionbars/setActiveFooter', actionbar.footer.active_id);
        }
    } else {
        store.dispatch('actionbars/showFooter', false);
    }

    if (actionbar.header) {
        store.dispatch('actionbars/setSubTitle', '');
        store.dispatch('actionbars/setImgTitle', '');
        if (actionbar.header.title) {
            store.dispatch('actionbars/setTitle', actionbar.header.title);
        } else {
            store.dispatch('actionbars/setTitle', 'LessGo');
        }
        if (actionbar.header.buttons) {
            store.dispatch('actionbars/setHeaderButtons', actionbar.header.buttons);
        } else {
            store.dispatch('actionbars/setHeaderButtons', []);
        }
        if (actionbar.header.logo) {
            store.dispatch('actionbars/showHeaderLogo', actionbar.header.logo.show);
        } else {
            store.dispatch('actionbars/showHeaderLogo', true);
        }
    } else {
        store.dispatch('actionbars/setTitle', 'LessGo');
        store.dispatch('actionbars/setHeaderButtons', []);
        store.dispatch('actionbars/showHeaderLogo', true);
    }
    if (background.style) {
        store.dispatch('background/setBackgroundStyle', background.style);
    } else {
        store.dispatch('background/setBackgroundStyle', 'gray');
    }
    window.scrollTo(0, 0);
    next();
});

router.stack = [];
router._push = router.push;
router._replace = router.replace;
router._go = router.go;

router.rememberBack = function () {
    if (router.rememberRoute) {
        router.push(router.rememberRoute);
        router.rememberRoute = null;
    } else {
        router.replace({name: 'search'});
    }
};

router.push = function (data, fnSuccess, fnFailure) {
    // console.log('push', JSON.stringify(router.stack), JSON.stringify(data));
    if (data.name !== 'search') {
        router.stack.push(data);
    } else {
        router.stack = [];
    }
    router._push(data, fnSuccess, fnFailure);
};

router.replace = function (data) {
    // console.log('replace', JSON.stringify(router.stack), JSON.stringify(data));
    if (data.name !== 'search') {
        router.stack.pop();
        router.stack.push(data);
    } else {
        router.stack = [];
    }
    router._push(data);
};

router.go = function (number) {
    // console.log('go', JSON.stringify(router.stack), number);
    router.stack.splice(-1, -number);
    router._go(number);
};

export default router;
