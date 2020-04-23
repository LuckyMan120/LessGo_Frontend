<template>
    <div class="driver-detail">
        <div :style="filterFlag?'filter: blur(5px)': ''">
            <div class="driver-detail-area">
                <closeIcon :size="10" :classes="'close-message'" />
            </div>

            <!-- driver ticket -->
            <div class="driver-ticket">
                <profileTicketIcon @join="joinRide" :joinFlag="true" :data="driverDetail" />
            </div>

            <!-- map -->
            <div style="margin-top: 40px">
                <gmap-map
                    :center="center"
                    :zoom="zoomValue"
                    :class="!zoomFlag?'driver-map': 'zoom-driver-map'"
                >
                    <GmapMarker :position="from_town_latlng" label="Origin" />
                    <GmapMarker :position="to_town_latlng" label="Destination" />
                    <gmap-polyline v-bind:path.sync="path" v-bind:options="{ strokeColor:'#f7645e'}">
                    </gmap-polyline>
                </gmap-map>
            </div>
            
            <!-- details area -->
            <div class="details">
                <!-- map down icon -->
                <div @click="zoomMap" :class="!zoomFlag?'arrow-down-icon': 'arrow-up-icon'">
                    <arrowDownIcon :size="15" :color="'#ec5f61'" :class="'down-icon'" />
                </div>

                <div v-if="!zoomFlag" class="details-body">
                    <h3>NOTES</h3>
                    <span>
                        {{ this.driverDetail.trips.description }}
                    </span>
                    
                    <!-- preferences -->
                    <h3>PREFERENCES</h3>
                    <preferences :data="preferences" />
                    
                    <!-- amenties -->
                    <h3>AMENTIES</h3>
                    <amenties :data="amenties" />

                    <!-- passengers -->
                    <h3>PASSENGERS</h3>
                    <div class="details-body-common">
                        <div v-for="passenger in passengers" class="details-body-common-area">
                            <div v-imgSrc:src="passenger.passenger_avatar   " :class="'img-circle'"></div>
                            <p>{{ passenger.passenger_name }}</p>
                        </div>
                        <div class="details-body-common-area">
                            <div :class="'img-circle'">
                                <greySeatIcon :size="25" :class="'free-seat'" />
                            </div>
                            <p style="margin-top: 10px;">name</p>
                        </div>
                    </div>

                    <!-- other details -->
                    <h3>ESTIMATE DISTANCE</h3>
                    <i>{{ this.driverDetail.trips.distance }}&nbsp;km</i>
                    <h3>ESTIMATE TRAVEL TIME</h3>
                    <i>
                        {{ this.driverDetail.trips.estimated_time }}
                    </i>
                    <h3>APPROX. CARBON FOOTPRINT</h3>
                    <i>{{ this.driverDetail.trips.co2 }}&nbsp;kg&nbsp;CO<i style="font-size: 10px; display: contents;">2eq</i></i>
                </div>
            </div>
                
            <!-- button area -->
            <div v-if="!zoomFlag" class="button-area">
                <button class="offer-ride" @click="joinRide">
                    <carIcon :size="17" :color="'white'" />
                    <span>Join this ride</span>
                </button>
                <button class="share-btn" @click="shareRide">
                    <shareIcon :size="15" :color="'#000000'" />
                    <span>
                        Share
                    </span>
                </button>
            </div>
        </div>

        <!-- joinRideArea -->
        <joinRideArea :show="joinRideFlag" :data="driverDetail" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

// import components for this
import closeIcon from '../../icon/CloseIcon';
import profileTicketIcon from '../../icon/ProfileTicketIcon';
import arrowDownIcon from '../../icon/ArrowDownIcon';
import greySeatIcon from '../../icon/GreySeatIcon';
import shareIcon from '../../icon/ShareIcon';
import carIcon from '../../icon/CarIcon';
import joinRideArea from '../sections/JoinRideArea';
import preferences from '../sections/Preferences'
import amenties from '../sections/Amenties';

export default {
    name: 'driverDetail',
    props: ['data'],
    data () {
        return {
            center: { lat: 31.953940000000003, lng: 35.910630000000005 },
            driverDetail: null,
            joinRideFlag: false,
            passengers: null,
            amenties: null,
            preferences: null,
            zoomFlag: false,
            filterFlag: false,
            path: [],
            from_town_latlng: null,
            to_town_latlng: null,
            zoomValue: 12
        }
    },
    computed: {
        ...mapGetters({
            selectedTrip: 'trips/selectedTrip'
        }),
        initDetail: function () {
            console.log('driverDetail', this.selectedTrip);
            this.driverDetail = this.selectedTrip;
            this.passengers = this.selectedTrip.passengers;
            this.preferences = this.selectedTrip.trips.preferences;
            this.amenties = this.selectedTrip.trips.amenities;

            // draw route
            this.drawRoute(this.selectedTrip.trips.from_town_latlng, this.selectedTrip.trips.to_town_latlng);
        }
    },
    methods: {
        joinRide: function () {
            this.joinRideFlag = true;
            this.filterFlag = true;
            console.log(this.joinRideFlag);
        },
        shareRide: function () {

        },
        zoomMap: function () {
            this.zoomFlag = !this.zoomFlag;
            if (this.zoomFlag) {
                this.zoomValue = 14;
            } else {
                this.zoomValue = 12;
            }
        },
        drawRoute: function (from, to) {
            this.center = from;
            this.from_town_latlng = from;
            this.to_town_latlng = to;
            // select this VueComponent
            let VueComp = this;
            let service = new window.google.maps.DirectionsService();
            let betpoints = [];
            service.route({
                origin: from,
                destination: to,
                travelMode: window.google.maps.TravelMode.DRIVING
            }, function (result, status) {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    console.log('result', result);
                    for (let i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                        let points = {
                            lat: result.routes[0].overview_path[i].lat(),
                            lng: result.routes[0].overview_path[i].lng()
                        };
                        betpoints.push(points);
                    }
                    VueComp.path = betpoints;
                }
            });
        }
    },
    watch: {
        initDetail: function () {
            
        }
    },
    components: {
        closeIcon,
        profileTicketIcon,
        arrowDownIcon,
        greySeatIcon,
        shareIcon,
        carIcon,
        joinRideArea,
        preferences,
        amenties
    }
}
</script>