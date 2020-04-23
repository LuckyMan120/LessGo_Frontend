<template>
    <div class="driver-detail">
        <div>
            <div class="driver-detail-area">
                <closeIcon :size="10" :classes="'close-message'" />
            </div>

            <!-- driver ticket -->
            <div class="driver-ticket">
                <TripTicket :joinFlag="true" :data="tripDetail" />
            </div>

            <!-- map -->
            <div style="margin-top: 40px">
                <gmap-map
                    :center="center"
                    :zoom="12"
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
                        {{ this.data.trip.description }}
                    </span>
                    
                    <!-- preferences -->
                    <h3>PREFERENCES</h3>
                    <preferences :data="preferences" />
                    
                    <!-- amenties -->
                    <h3>AMENTIES</h3>
                    <amenties :data="amenities" />

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
                    <i>{{ this.tripDetail.distance }}&nbsp;km</i>
                    <h3>ESTIMATE TRAVEL TIME</h3>
                    <i>
                        {{ this.estimated_time }}
                    </i>
                    <h3>APPROX. CARBON FOOTPRINT</h3>
                    <i>{{ this.CO2 }}&nbsp;kg&nbsp;CO<i style="font-size: 10px; display: contents;">2eq</i></i>
                </div>
            </div>
                
            <!-- button area -->
            <div v-if="!zoomFlag" class="button-area">
                <button class="offer-ride" @click="editTrip">
                    <carIcon :size="15" :color="'white'" />
                    <span>Edit</span>
                </button>
                <button class="share-btn" @click="deleteTrip" :disabled="sending">
                    <shareIcon :size="15" :color="'#000000'" />
                    <span>
                        Delete
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

// import components for this
import closeIcon from '../../icon/CloseIcon';
import TripTicket from '../sections/TripTicket';
import arrowDownIcon from '../../icon/ArrowDownIcon';
import greySeatIcon from '../../icon/GreySeatIcon';
import shareIcon from '../../icon/ShareIcon';
import carIcon from '../../icon/CarIcon';
import preferences from '../sections/Preferences'
import amenties from '../sections/Amenties';

// import json for test
import json from '../../jsons/searchTrips.json';

export default {
    name: 'tripInfo',
    props: {
        data: {
            type: Object,
            required: false,
            default: null
        }
    },
    data () {
        return {
            center: { lat: 31.953940000000003, lng: 35.910630000000005 },
            tripDetail: null,
            passengers: null,
            amenities: null,
            preferences: null,
            zoomFlag: false,
            path: [],
            from_town_latlng: null,
            to_town_latlng: null,
            estimated_time: '',
            CO2: '',
            sending: false
        }
    },
    computed: {
        ...mapGetters({
            selectedTrip: 'trips/selectedTrip'
        })
    },
    mounted () {
        console.log('mounted', this.data);
        this.tripDetail = this.data.trip;
        console.log('json', json);

        // test data from json
        this.passengers = json.searchTrips[1].passengers;
        this.preferences = json.searchTrips[1].trips.preferences;
        this.amenities = json.searchTrips[1].trips.amenities;

        // draw route
        let fromLatlng = {
            'lat': this.data.trip.points[0].lat,
            'lng': this.data.trip.points[0].lng
        };

        let toLatlng = {
            'lat': this.data.trip.points[1].lat,
            'lng': this.data.trip.points[1].lng
        };
        this.drawRoute(fromLatlng, toLatlng);

        // // set time format
        // let time = this.data.trip.estimated_time.split(':');
        // this.estimated_time = parseInt(time[0]) + 'h' + parseInt(time[1]) + 'm';
    },
    methods: {
        ...mapActions({
            remove: 'trips/remove'
        }),
        editTrip: function () {
            // this.$router.push({name: ''})
        },
        deleteTrip: function () {
            if (window.confirm('Are you sure you want to cancel the trip?')) {
                this.sending = true;
                this.remove(this.tripDetail.id).then(() => {
                    this.$router.replace({name: 'your-trips'});
                }).catch(() => {
                    this.sending = false;
                });
            }
        },
        zoomMap: function () {
            this.zoomFlag = !this.zoomFlag;
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
                    VueComp.CO2 = (result.routes[0].legs[0].distance.value / 1000 * 0.15).toFixed(2);

                    // claculate time
                    let duration = result.routes[0].legs[0].duration.value;
                    let h = Math.floor(duration / 3600);
                    let m = ((duration % 3600) / 60).toFixed();

                    if (h.toString().length < 2) {
                        if (m.toString().length < 2) {
                            if (h === 0) {
                                VueComp.estimated_time = '0' + m + 'm';
                            } else {
                                VueComp.estimated_time = '0' + h + 'h ' + '0' + m + 'm';
                            }
                        } else {
                            if (h === 0) {
                                VueComp.estimated_time = m + 'm';
                            } else {
                                VueComp.estimated_time = '0' + h + 'h ' + m + 'm';
                            }
                        }
                    } else {
                        if (m.toString().length < 2) {
                            if (m === 0) {
                                VueComp.estimated_time = h + 'h';
                            } else {
                                VueComp.estimated_time = h + 'h ' + '0' + m + 'm';
                            }
                        } else {
                            VueComp.estimated_time = h + 'h ' + m + 'm';
                        }
                    }
                }
            });
        }
    },
    components: {
        closeIcon,
        TripTicket,
        arrowDownIcon,
        greySeatIcon,
        shareIcon,
        carIcon,
        preferences,
        amenties
    }
}
</script>