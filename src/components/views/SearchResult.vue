<template>
    <div class="searchResult">
        <!-- trip search head -->
        <div class="messages-area">
            <closeIcon :size="10" :classes="'close-message'" />

            <!-- search title -->
            <div class="search-trip-title">
                <span>{{ this.from_town }}</span>
                <arrowIcon :color="'#abe5c4'" />
                <span>{{ this.to_town }}</span>
            </div>

            <!-- time and users -->
            <div class="search-trip-date-user">
                <div>
                    <calendarBlueIcon :size="17" :color="'#abe5c4'" style="margin-top: -4px" />
                    <span>{{ this.day }}</span>
                    <span>{{ this.date }}</span>
                    <span>{{ this.month }}</span>
                </div>
                <div>
                    <userIcon :size="15" :color="'#abe5c4'" />
                    <span style="padding-right: 5px; font-size: 16px;">1</span>
                </div>
                <minusIcon :size="15" :color="'#abe5c4'" style="margin-right: 15px;" />
                <plusIcon :size="15" :color="'#abe5c4'" />
            </div>
        </div>

        <!-- searched drivers detail -->
        <div class="search-trip-area">
            <!-- drivers -->
            <div v-for="trip in trips">
                <profileTicketIcon :infoFlag="true" :data="trip" @driver-detail="driverDetail" />
            </div>

            <!-- return btn area -->
            <div style="text-align: center;">
                <span class="return-title">
                    That's the end of this search <span style="font-size: 15px">:&nbsp;(</span>
                </span>
                <button @click="returnMain" class="return-btn">Search for somewhere else?</button>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';

// import components for this
import profileTicketIcon from '../../icon/ProfileTicketIcon';
import closeIcon from '../../icon/CloseIcon';
import arrowIcon from '../../icon/ArrowIcon';
import calendarBlueIcon from '../../icon/CalendarBlueIcon';
import userIcon from '../../icon/UserIcon';
import minusIcon from '../../icon/MinusIcon';
import plusIcon from '../../icon/PlusIcon';

// days, months and totalCount for ratings
let totalCount = 5;
let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let days = ['Sun', 'Mon', 'Tus', 'Wen', 'Thu', 'Fri', 'Sat'];

export default {
    name: 'searchResult',
    data () {
        return {
            from_town: '',
            to_town: '',
            trips: null,
            day: '',
            date: '',
            month: ''
        }
    },
    computed: {
        ...mapGetters({
            driverTrips: 'trips/driverTrips'
        }),
        getData: function () {
            console.log('searchResult', this.driverTrips);
            this.from_town = this.driverTrips.from_town;
            this.to_town = this.driverTrips.to_town;
            this.trips = this.driverTrips.trips;
            this.month = months[moment(this.driverTrips.date).toDate().getMonth()];
            this.date = moment(this.driverTrips.date).toDate().getDate() + 1;
            this.day = days[moment(this.driverTrips.date).toDate().getDay()];
        }
    },
    methods: {
        returnMain: function () {
            this.$router.push({name: 'main'});
        },
        driverDetail: function (name) {
            this.$router.push({name: 'detail', params: {name: name}});
        }
    },
    watch: {
        getData: function () {

        }
    },
    components: {
        profileTicketIcon,
        closeIcon,
        arrowIcon,
        calendarBlueIcon,
        userIcon,
        plusIcon,
        minusIcon
    }
};
</script>