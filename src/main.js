/* jshint esversion: 6 */

let cordovaTag = document.createElement('script');
cordovaTag.setAttribute('src', process.env.ROUTE_BASE + 'cordova.js');
document.head.appendChild(cordovaTag);

import 'babel-polyfill';

var moment = require('moment-timezone');
moment.tz.setDefault('Asia/Amman');

import Vue from 'vue';
import App from './App';

import VueResource from 'vue-resource';
import VueAnalytics from 'vue-analytics';
import VueMoment from 'vue-moment';

import router from './router';
import store from './store';

/* eslint-disable no-unused-vars */
import cordova from './cordova';
import directives from './directives';
require('font-awesome-webpack');

import bootstrapCss from './styles/bootstrap/css/bootstrap.min.css';

import cssHelpers from './styles/helpers.css';
import css from './styles/main.css';
import searchCss from './styles/search.css';
import './styles/icons.css';
import './styles/other.css';

import 'mdbvue/lib/css/mdb.min.css';
import 'vue2-timepicker/dist/VueTimepicker.css'
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

import bus from './services/bus-event';
import { DebugApi } from './services/api';
import { library } from '@fortawesome/fontawesome-svg-core';
// import { faEllipsisH, faArrowLeft, faMapMarkedAlt, faUserCircle, faHistory } from '@fortawesome/free-solid-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vue2Leaflet from 'vue2-leaflet';
import firebase from 'firebase/app';

let debugApi = new DebugApi();

// library.add(faEllipsisH, faArrowLeft, faMapMarkedAlt);
library.add(fas);
Vue.component('v-icon', FontAwesomeIcon);
Vue.use(VueResource);

Vue.use(VueAnalytics, {
    id: 'UA-128187723-3'
});

Vue.use(VueMoment);
require('./filters.js');

import * as VueGoogleMaps from 'vue2-google-maps';

Vue.use(VueGoogleMaps, {
    load: {
        key: process.env.MAPS_API,
        libraries: 'places,drawing,geometry',
        installComponents: true
    }
});

Vue.config.errorHandler = function (err, vm, info) {
    let data = {};
    data.log = err.stack;
    debugApi.log(data);
};

window.handleOpenURL = function (url) {
    setTimeout(_ => {
        window.alert(url);
    });
};

window.store = store;

if (process.env.NODE_ENV === 'development') {
    console.log('In development wait for cordova');
    setTimeout(function () {
        if (!window.cordova) {
            console.log('Not running in cordova');
            store.dispatch('init');
        }
    }, 2000);
}

bus.on('system-ready', () => {
    let app = new Vue({
        el: '#app',
        router,
        store,
        template: '<App/>',
        components: { App },
        data () {
            return {
                user: {}
            };
        },
        methods: {
            getLoginStatus: function () {
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        this.user = user;
                        console.log('// User is signed in by Phone Number : ', user.phoneNumber);
                    } else {
                        this.user = null;
                        console.log('// No user is signed in.');
                    }
                });
            },
            initFirebase: function () {
                const firebaseApp = firebase.initializeApp({
                    apiKey: 'AIzaSyCfg1_w9EId4ikRKtPf8EvSm0MmPEBKgcI',
                    authDomain: 'phone-verify-25d7d.firebaseapp.com',
                    databaseURL: 'https://phone-verify-25d7d.firebaseio.com',
                    projectId: 'phone-verify-25d7d',
                    storageBucket: 'phone-verify-25d7d.appspot.com',
                    messagingSenderId: '963282220515',
                    appId: '1:963282220515:web:9a5b571ab34857a6ec1cd6',
                    measurementId: 'G-21F6VLQMD6'
                });
            }
        },
        created () {
            this.initFirebase();
            this.getLoginStatus();
        },
        update () {
            this.getLoginStatus();
        }
    });
});
/* eslint-enable no-unused-vars */
