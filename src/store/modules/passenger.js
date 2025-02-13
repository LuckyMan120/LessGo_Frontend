import {PassengerApi} from '../../services/api';
import * as types from '../mutation-types';
import globalStore from '../index';

/* eslint-disable no-undef */

// initial state
let passengerApi = new PassengerApi();

const state = {
    pendingRequest: null
};

// getters
const getters = {
    pendingRequest: state => state.pendingRequest
};

// actions
const actions = {
    getPendingRequest (store) {
        return passengerApi.allRequest().then(response => {
            store.commit(types.PASSENGER_SET_PENDING, response.data);
        });
    },

    makeRequest (store, tripId) {
        return passengerApi.make(tripId).then(response => {
            console.log('addPassenger', response.data);
            globalStore.commit('trips/' + types.TRIPS_SET_REQUEST, {id: tripId, value: 'send'});
            return Promise.resolve();
        }).catch(error => {
            return Promise.reject(error);
        });
    },

    accept (store, {user, trip}) {
        return passengerApi.accept(trip.id, user.id).then(response => {
            let data = {
                user_id: user.id,
                trip_id: trip.id
            };
            store.commit(types.PASSENGER_REMOVE_PENDING, data);
            globalStore.commit('trips/' + types.TRIPS_ADD_PASSENGER, {id: trip.id, user});
            globalStore.commit('myTrips/' + types.MYTRIPS_ADD_PASSENGER, {id: trip.id, user});
        }).catch(error => {
            return Promise.reject(error);
        });
    },

    reject (store, {user, trip}) {
        return passengerApi.reject(trip.id, user.id).then(response => {
            let data = {
                user_id: user.id,
                trip_id: trip.id
            };
            store.commit(types.PASSENGER_REMOVE_PENDING, data);
        }).catch(error => {
            return Promise.reject(error);
        });
    },

    cancel (store, {user, trip}) {
        return passengerApi.cancel(trip.id, user.id).then(response => {
            if (trip.request !== 'send') {
                globalStore.commit('trips/' + types.TRIPS_REMOVE_PASSENGER, {id: trip.id, user});
                globalStore.commit('myTrips/' + types.MYTRIPS_REMOVE_PASSENGER, {id: trip.id, user});
                if (trip.user.id !== user.id) {
                    globalStore.commit('myTrips/' + types.MYTRIPS_REMOVE_PASSENGER_TRIP, trip.id);
                }
            } else {
                globalStore.commit('trips/' + types.TRIPS_SET_REQUEST, {id: trip.id, value: ''});
            }
        }).catch(error => {
            return Promise.reject(error);
        });
    }

};

// mutations
const mutations = {
    [types.PASSENGER_SET_PENDING] (state, list) {
        state.pendingRequest = list;
    },

    [types.PASSENGER_REMOVE_PENDING] (state, data) {
        let index = 0;
        if (state.pendingRequest && state.pendingRequest.length) {
            state.pendingRequest.forEach((item, i) => {
                if (item.user.id === data.user_id & item.trip_id === data.trip_id) {
                    index = i;
                    return;
                }
            });
            state.pendingRequest.splice(index, 1);
        }
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
