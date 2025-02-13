import * as types from '../mutation-types';
import { AuthApi, UserApi } from '../../services/api';
import router from '../../router';
import cache, {keys} from '../../services/cache';

import globalStore from '../index';

let authApi = new AuthApi();
let userApi = new UserApi();

const state = {
    auth: false,
    user: null,
    token: null,
    firstTime: false,
    appConfig: null,
    users: null,
    singupData: null,
    searchUser: null,
    localstoreData: null
};

// getters
const getters = {
    checkLogin: state => state.auth,
    authHeader: state => state.auth ? { 'Authorization': 'Bearer ' + state.token } : {},
    user: state => state.user,
    firstTime: state => state.firstTime,
    appConfig: state => state.appConfig,
    users: state => state.users,
    singupData: state => state.singupData,
    searchUser: state => state.searchUser,
    getLocalStore: state => state.localstoreData
};

// actions

function onLoggin (store, token) {
    store.commit(types.AUTH_SET_TOKEN, token);
    fetchUser(store);
    if (globalStore.state.cordova.device) {
        globalStore.dispatch('device/register');
    }
    console.log('dispatch trips/tripsSearch on Loggin');
    // router.replace({ name: 'search' });
    router.replace({name: 'main'});
    globalStore.dispatch('myTrips/tripAsDriver');
    globalStore.dispatch('myTrips/tripAsPassenger');
    globalStore.dispatch('rates/pendingRates');
    globalStore.dispatch('cars/index');
    globalStore.dispatch('passenger/getPendingRequest');
    globalStore.dispatch('startThread');
    console.log('store.firstTime');
    console.log(store.getters.firstTime);
    if (store.getters.firstTime) {
        router.replace({ name: 'profile_update' });
    } else {
        // router.replace({ name: 'search' });
        router.replace({name: 'main'});
    }
}

function login (store, { phoNumber, password }) {
    let creds = {};
    creds.mobile_phone = phoNumber;
    creds.password = password;

    return authApi.login(creds).then((response) => {
        onLoggin(store, response.token);
        return Promise.resolve();
    }, ({data, status}) => {
        return Promise.reject(data);
    });
}

function firstTime (store, firstTime) {
    store.commit(types.AUTH_FIRST_TIME, firstTime);
}

// store = { commit, state, rootState, rootGetters }
function activate (store, activationToken) {
    console.log('activate action');
    firstTime(store, true);
    return authApi.activate(activationToken, {}).then((response) => {
        onLoggin(store, response.token);
    }).catch((err) => {
        if (err) {

        }
    });
}

// get signup data for activate
function getSignupFromLocal (store) {
    store.commit(types.GET_LOCAL_DATA);
}

function resetPassword (store, email) {
    return authApi.resetPassword({email}).then(() => {
        return Promise.resolve();
    }).catch((err) => {
        if (err) {
            return Promise.reject();
        }
    });
}

function changePassword (store, {token, data}) {
    return authApi.changePassword(token, data).then(() => {
        router.push({ name: 'login' });
        return Promise.resolve();
    }).catch((err) => {
        if (err) {
            return Promise.reject();
        }
    });
}

function register (store, { gender, active, mobile, email, password, passwordConfirmation, name, birthday, termsAndConditions }) {
    let data = {};
    data.gender = gender;
    data.email = email;
    data.password = password;
    data.password_confirmation = passwordConfirmation;
    data.name = name;
    data.terms_and_conditions = termsAndConditions;
    data.birthday = birthday;
    data.active = active;
    data.mobile_phone = mobile;

    return userApi.register(data).then((data) => {
        store.commit(types.SAVE_TO_LOCAL_STORAGE, data);
        return Promise.resolve();
    }).catch((err) => {
        if (err.response) {
        } else {
            if (err.message === 'Could not create new user.') {

            }
        }
        return Promise.reject(err);
    });
}

function fetchUser (store) {
    return userApi.show().then((response) => {
        console.log('fetch user', response.data);
        store.commit(types.AUTH_SET_USER, response.data);
    }).catch(({data, status}) => {
        console.log(data, status);
    });
}

function searchUser (store, id) {
    return userApi.show(id).then((response) => {
        store.commit(types.SEARCH_USER, response.data);
    }).catch(({data, status}) => {
        console.log(data, status);
    });
}

function retoken (store) {
    let data = {};
    // data.app_version = store.rootState.appVersion;

    return new Promise((resolve, reject) => {
        authApi.retoken(data).then((response) => {
            console.log('retoken response', response);
            store.commit(types.AUTH_SET_TOKEN, response.token);
            store.commit('AUTH_APP_CONFIG', response.config);
            resolve();
        }).catch(({data, status}) => {
            // check for internet problems -> not resolve until retoken finish
            console.log(data, status);
            store.commit(types.AUTH_LOGOUT);
            router.push({ name: 'login' });
            resolve();
        });
    });
}

function logout (store) {
    let device = globalStore.state.device.current;
    if (device) {
        globalStore.dispatch('device/delete', device.id);
    }
    store.commit(types.AUTH_LOGOUT);
    globalStore.commit('device/' + types.DEVICE_SET_DEVICES, []);
    globalStore.dispatch('stopThread');
    router.replace({ name: 'signin' });
}

function update (store, data) {
    return userApi.update(data).then((response) => {
        firstTime(store, false);
        store.commit(types.AUTH_SET_USER, response.data);
        return Promise.resolve(response.data);
    }).catch(({data, status}) => {
        console.log(data, status);
        return Promise.reject(data);
    });
}

function updatePhoto (store, data) {
    return userApi.updatePhoto(data).then((response) => {
        store.commit(types.AUTH_SET_USER, response.data);
        return Promise.resolve(response.data);
    }).catch(({data, status}) => {
        console.log(data, status);
        return Promise.reject(data);
    });
}

function getAllUsers (store) {
    return userApi.list().then((response) => {
        console.log('otherUsers', response.data);
        response.data.forEach(user => {
            globalStore.dispatch('userTrips/tripAsDriver', user.id);
        });
        store.commit(types.SAVE_ALL_USERS, response.data);
        return Promise.resolve(response.data);
    }).catch(({data, status}) => {
        console.log(data, status);
        return Promise.reject(data);
    });
}

function saveSignupData (store, data) {
    store.commit(types.SAVE_SIGNUP_DATA, data);
}

const actions = {
    login,
    activate,
    register,
    fetchUser,
    retoken,
    logout,
    resetPassword,
    changePassword,
    update,
    updatePhoto,
    onLoggin,
    getAllUsers,
    searchUser,
    saveSignupData,
    getSignupFromLocal
};

// mutations
const mutations = {
    [types.AUTH_SET_TOKEN] (state, token) {
        console.log('AUTH_SET_TOKEN', token);
        state.token = token.replace('"', '');
        state.auth = true;
        cache.setItem(keys.TOKEN_KEY, token);
        console.log('Promise', cache.setItem(keys.TOKEN_KEY, token));
    },
    [types.AUTH_SET_USER] (state, user) {
        console.log('mutations', user);
        state.user = user;
        cache.setItem(keys.USER_KEY, user);
    },
    [types.AUTH_LOGOUT] (state) {
        state.token = null;
        state.user = null;
        state.auth = false;
        cache.clear();
    },
    [types.AUTH_FIRST_TIME] (state, firstTime) {
        state.firstTime = firstTime;
    },

    AUTH_APP_CONFIG (state, appConfig) {
        state.appConfig = appConfig;
    },

    [types.DONATION_INTENT_PUSH] (state, donation) {
        if (state.user) {
            if (!state.user.donations) {
                state.user.donations = [];
            }
            state.user.donations.push(donation);
        }
    },

    [types.SAVE_ALL_USERS] (state, users) {
        state.users = users;
    },

    [types.SAVE_SIGNUP_DATA] (state, data) {
        state.singupData = data;
    },

    [types.SEARCH_USER] (state, data) {
        state.searchUser = data;
    },

    [types.SAVE_TO_LOCAL_STORAGE] (state, data) {
        console.log('-----cache', data);
        cache.setItem(keys.SIGNUP_KEY, data);
    },

    [types.GET_LOCAL_DATA] (state) {
        let data = cache.getItem(keys.SIGNUP_KEY);
        console.log('----------GetItem', data);
        state.localstoreData = data;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
