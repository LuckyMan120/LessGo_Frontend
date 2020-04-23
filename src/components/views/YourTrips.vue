<template>
    <div class="your-trips">
        <!-- trip header -->
        <div class="messages-area">
            <closeIcon :size="12" :classes="'close-message'" />

            <!-- title -->
            <div class="trip-title">
                <div @click="setTitle('upcoming')" class="col-xs-12 text-center" style="display: flex; justify-content: center;">
                    <span :style="setUpcoming? 'color: black': 'color: #a3a3a7'">UPCOMING</span>
                    <oneNumberIcon :size="15" :color="setUpcoming? '#eb5557' : '#f1a3a3'" style="margin-left: 7px; margin-bottom: 3px" />
                </div>
                <div @click="setTitle('history')" class="col-xs-12 text-center">
                    <span :style="setHistory? 'color: black': 'color: #a3a3a7'">HISTORY</span>
                </div>
            </div>
        </div>

        <!-- trip body -->
        <div class="trip-area">
            <!-- upcoming area -->
            <div v-if="setUpcoming" class="upcoming-area">
                <!-- member type bar -->
                <div class="member-type">
                    <div @click="selectItem('passenger')">
                        <userIcon :size="10" :color="selPassenger? '#1C8983': '#c5c6cb'" />
                        <span :style="selPassenger? 'color: #1C8983': ''">PASSENGER</span>
                    </div>
                    <div @click="selectItem('driver')">
                        <carIcon :size="10" :fillcolor="selDriver? '#1C8983': '#c5c6cb'" />
                        <span :style="selDriver? 'color: #1C8983': ''">DRIVER</span>
                    </div>
                </div>

                <!-- trip detail -->
                <!-- as passenger -->
                <div class="animation-div" v-if="selPassenger">
                    <tripDetail v-for="data in upcomingPassengerData" :data="data" />
                    <!-- after trip -->
                    <Loading :data="laterPassengerData">
                        <span class="divide-trip">Later Rides</span>   
                        <tripDetail v-for="data in laterPassengerData" :data="data" />
                        <p slot="no-data" class="alert alert-warning"  role="alert">You Don't have any trips joined as passenger</p>
                        <p slot="loading" class="alert alert-info" role="alert">
                            <img src="/static/img/loader.gif" alt="" class="ajax-loader" />
                            Loading trips ...
                        </p>
                    </Loading>
                </div>
                
                <!-- as driver -->
                <div class="driver-animation-div" v-if="selDriver">
                    <tripDetail v-for="data in upcomingDriverData" :data="data" :tripActiveFlag="true" />
                    <!-- after trip -->
                    <Loading :data="laterDriverData">
                        <span class="divide-trip">Later Rides</span>
                        <tripDetail v-for="data in laterDriverData" :data="data" />
                        <p slot="no-data" class="alert alert-warning"  role="alert">You Don't have any trips created</p>
                        <p slot="loading" class="alert alert-info" role="alert">
                            <img src="/static/img/loader.gif" alt="" class="ajax-loader" />
                            Loading trips ...
                        </p>
                    </Loading>
                </div>
            </div>

            <!-- history area -->
            <div v-else="setHistory" class="history-area animation-div">
                <Loading :data="historyData">
                    <tripDetail v-for="data in historyData" :data="data" />
                    <p slot="no-data" class="alert alert-warning"  role="alert">You Don't have any history trips</p>
                    <p slot="loading" class="alert alert-info" role="alert">
                        <img src="/static/img/loader.gif" alt="" class="ajax-loader" />
                        Loading trips ...
                    </p>
                </Loading>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';
import Loading from '../Loading.vue';
import ProfileTicket from '../views/ProfileTicket';

// import components for this
import closeIcon from '../../icon/CloseIcon.vue';
import oneNumberIcon from '../../icon/OneNumberIcon.vue';
import carIcon from '../../icon/CarIcon.vue';
import userIcon from '../../icon/UserIcon.vue';
import tripDetail from '../sections/TripDetail.vue';

let currentDate = new Date();
let passengerCount = 0;
let driverCount = 0;

export default {
    name: 'yourTrips',
    data () {
        return {
            upcomingPassengerData: null,
            laterPassengerData: null,
            upcomingDriverData: null,
            laterDriverData: null,
            historyData: null,
            setUpcoming: true,
            setHistory: false,
            selPassenger: true,
            selDriver: false
        };
    },
    async mounted () {
        await this.tripAsDriver();
        await this.tripAsPassenger();
        await this.pendingRate();
        await this.getPendingRequest();
        await this.oldTripsAsDriver();
        await this.oldTripsAsPassenger();
        await this.findSubscriptions();

        this.trips.forEach(trip => {
            console.log('trips', trip);
        });
        if (this.trips.length !== 0) {
            // active trip as driver
            let driverTrip = [];
            driverTrip.push(this.trips[0]);
            this.upcomingDriverData = driverTrip;

            // later trips as driver
            this.laterDriverData = this.trips.splice(1, this.trips.length - 1);    
        } else {
            this.upcomingDriverData = [];
            this.laterDriverData = [];
        }
        
        // history driver trips
        if (this.oldTrips.length !== 0) {
            if (this.oldPassengerTrips.length !== 0) {
                this.historyData = this.oldTrips.concat(this.oldPassengerTrips);
            } else {
                this.historyData = this.oldTrips;
            }
        } else {
            if (this.oldPassengerTrips.length !== 0) {
                this.historyData = this.oldPassengerTrips;
            } else {
                this.historyData = [];
            }
        }

        if (this.passengerTrips.length !== 0) {
            // active trip as passenger
            let passTrip = [];
            passTrip.push(this.passengerTrips[0]);
            this.upcomingPassengerData = passTrip;

            // later trips as passenger
            this.laterPassengerData = this.passengerTrips.splice(1, this.passengerTrips.length - 1);
        } else {
            this.upcomingPassengerData = [];
            this.laterPassengerData = [];
        }
    },
    computed: {
        ...mapGetters({
            trips: 'myTrips/myTrips',
            passengerTrips: 'myTrips/passengerTrips',
            pendingRates: 'rates/pendingRates',
            pendingRequest: 'passenger/pendingRequest',
            user: 'auth/user',
            oldTrips: 'myTrips/myOldTrips',
            oldPassengerTrips: 'myTrips/passengerOldTrips',
            subscriptions: 'subscriptions/subscriptions',
            appConfig: 'auth/appConfig'
        })
    },
    methods: {
        ...mapActions({
            tripAsDriver: 'myTrips/tripAsDriver',
            tripAsPassenger: 'myTrips/tripAsPassenger',
            pendingRate: 'rates/pendingRates',
            getPendingRequest: 'passenger/getPendingRequest',
            oldTripsAsDriver: 'myTrips/oldTripsAsDriver',
            oldTripsAsPassenger: 'myTrips/oldTripsAsPassenger',
            findSubscriptions: 'subscriptions/index'
        }),
        setTitle: function (type) {
            if (type === 'upcoming') {
                this.setUpcoming = true;
                this.setHistory = false;
            } else {
                this.setUpcoming = false;
                this.setHistory = true;
            }
        },
        selectItem: function (item) {
            if (item === 'passenger') {
                this.selPassenger = true;
                this.selDriver = false;
            } else {
                this.selPassenger = false;
                this.selDriver = true;
            }
        }
    },
    components: {
        closeIcon,
        oneNumberIcon,
        carIcon,
        userIcon,
        tripDetail,
        Loading,
        ProfileTicket
    }
};
</script>