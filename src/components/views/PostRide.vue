<template>
    <div class="post-ride">
        <div class="detail">
            <div class="car-img"></div>
            <span class="car-type">{{ detail.carType }}</span>
            <span class="plate-id">{{ detail.plateId }}</span>
            <router-link :to="{name: 'setCarAndId'}" class="return-route" >Update...</router-link>
            <closeIcon :size="10" style="position: absolute; right: 9%; top: 9%; cursor: pointer;" />
        </div>

        <!-- ride body -->
        <div class="addictional">
            <span>
                NO. OF PASSENGERS
            </span>
            <div class="car-seat-area">
                <div class="seat-number">
                    <greySeatIcon :size="16" :color="'#abe5c4'" />
                    <p>{{ seat_count }}</p>
                </div>
                <div @click="selectSeat(-1)" class="car-minus">
                    <minusIcon :size="15" :color="'#abe5c4'" style="margin-top: 3px" />
                </div>
                <div @click="selectSeat(1)" class="car-plus">
                    <plusIcon :size="15" :color="'#abe5c4'" style="margin-top: 3px" />
                </div>
            </div>

            <!-- select amenities area -->
            <div class="select-amenities">
                <span>AMENITIES</span>
                <amenities :offerFlag="true" />
            </div>
            
            <!-- select usage for female -->
            <div class="female-usage">
                <v-icon icon="venus" class="usage-female-icon" />
                <h2>Share this ride with females only</h2>
                <switchBtn @toggle="toggleBtn" />
            </div>

            <!-- notes -->
            <span>
                NOTES
                <span class="note-comment">&nbsp;(let the passengers know where you'll be wating)</span>
            </span>

            <!-- writing input -->
            <div class="writing-input">
                <input type="text" v-model="write_detail" placeholder="Write a note for your passengers" />
                <b>{{ bio_count }}/{{ text_counter }}</b>
            </div>
        </div>

        <!-- post btn -->
        <div class="button-area" style="padding-right: 15px; padding-left: 20px; display: flex;">
            <p>By pressing "Post Ride!" you promise not to profit from trips and divide all expenses equally with passengers.</p>
            <button @click="postRide" class="offer-ride" style="margin-right: 0">
                <carIcon :size="20" :color="'#D5E9E8'" style="margin-top: -3px;" />
                <carPlusIcon :size="15" />
                <span style="color: white">Post ride!</span>
                <spinner v-if="postFlag" class="loading" />
            </button>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';

/* import components for this */
import greySeatIcon from '../../icon/GreySeatIcon';
import closeIcon from '../../icon/CloseIcon';
import carPlusIcon from '../../icon/CarPlusIcon';
import minusIcon from '../../icon/MinusIcon';
import plusIcon from '../../icon/PlusIcon';
import amenities from '../sections/Amenties';
import switchBtn from '../elements/SwitchBtn';
import carIcon from '../../icon/CarIcon'
import spinner from '../Spinner';

export default {
    name: 'postRide',
    data () {
        return {
            seat_count: 1,
            write_detail: '',
            bio_count: 0,
            text_counter: 150,
            tripData: null,
            usage: 1,
            postFlag: false,
            latestTripId: 0
        }
    },
    computed: {
        ...mapGetters({
            detail: 'cars/getDetail',
            cars: 'cars/cars',
            user: 'auth/user',
            trips: 'myTrips/myTrips'
        })
    },
    methods: {
        ...mapActions({
            'createTrip': 'trips/create'
        }),
        selectSeat: function (count) {
            if (count === -1) {
                if (this.seat_count === 1) {
                    return;
                } else {
                    this.seat_count += -1;
                }
            } else {
                this.seat_count += 1;
            }
        },
        toggleBtn: function (param) {
            if (param) {
                this.usage = 2;
            } else {
                this.usage = 1;
            }
        },
        postRide: function () {
            // save by trip mode
            if (this.tripData.tripMode === 'Round') {
                Object.keys(this.tripData.tripTime.time).forEach(value => {
                    if (value === 'firstTime') {
                        let rideData = {
                            'is_passenger': 0,
                            'from_town': this.tripData.areas[0].address,
                            'to_town': this.tripData.areas[1].address,
                            'trip_date': this.tripData.tripTime.date + ' ' + this.tripData.tripTime.time.firstTime,
                            'total_seats': this.seat_count.toString(),
                            'friendship_type_id': this.usage,
                            'estimated_time': this.tripData.areas[3],
                            'distance': parseFloat(this.tripData.areas[2]),
                            'co2': parseFloat(this.tripData.areas[4]),
                            'description': this.write_detail,
                            'car_id': this.cars.length > 0 ? this.cars[0].id : undefined,
                            'enc_path': '123',
                            'community': this.user.email,
                            'rating': this.user.positive_ratings + this.user.negative_ratings,
                            'payment': 2,
                            'availability': 'false',
                            'points': [
                                this.tripData.areas[0], this.tripData.areas[1]
                            ],
                            'is_active': 0,
                            'is_recurring': 1
                        };

                        console.log('tripData', rideData);
                        this.postFlag = true;
                        this.createTrip(rideData).then(trip => {
                            this.postFlag = false;
                            this.$router.push({name: 'your-trips'});
                        }).catch(error => { this.postFlag = false; });
                    } else {
                        let rideData = {
                            'is_passenger': 0,
                            'from_town': this.tripData.areas[0].address,
                            'to_town': this.tripData.areas[1].address,
                            'trip_date': this.tripData.tripTime.date + ' ' + this.tripData.tripTime.time.returnTime,
                            'total_seats': this.seat_count.toString(),
                            'friendship_type_id': this.usage,
                            'estimated_time': this.tripData.areas[3],
                            'distance': parseFloat(this.tripData.areas[2]),
                            'co2': parseFloat(this.tripData.areas[4]),
                            'description': this.write_detail,
                            'car_id': this.cars.length > 0 ? this.cars[0].id : undefined,
                            'enc_path': '123',
                            'community': this.user.email,
                            'rating': this.user.positive_ratings + this.user.negative_ratings,
                            'payment': 2,
                            'availability': 'false',
                            'points': [
                                this.tripData.areas[0], this.tripData.areas[1]
                            ],
                            'is_active': 0,
                            'is_recurring': 1,
                            'parent_trip_id': this.latestTripId + 1,
                            'return_trip_id': this.latestTripId + 1
                        };
                        
                        console.log('tripData', rideData);
                        this.postFlag = true;
                        this.createTrip(rideData).then(trip => {
                            this.postFlag = false;
                            this.$router.push({name: 'your-trips'});
                        }).catch(error => { this.postFlag = false; });
                    }
                });
            } else {
                let rideData = {
                    'is_passenger': 0,
                    'from_town': this.tripData.areas[0].address,
                    'to_town': this.tripData.areas[1].address,
                    'trip_date': this.tripData.tripTime.date + ' ' + this.tripData.tripTime.time.time,
                    'total_seats': this.seat_count.toString(),
                    'friendship_type_id': this.usage,
                    'estimated_time': this.tripData.areas[3],
                    'distance': parseFloat(this.tripData.areas[2]),
                    'co2': parseFloat(this.tripData.areas[4]),
                    'description': this.write_detail,
                    'car_id': this.cars.length > 0 ? this.cars[0].id : undefined,
                    'enc_path': '123',
                    'community': this.user.email,
                    'rating': this.user.positive_ratings + this.user.negative_ratings,
                    'payment': 2,
                    'availability': 'false',
                    'points': [
                        this.tripData.areas[0], this.tripData.areas[1]
                    ],
                    'is_active': 0,
                    'is_recurring': 1
                };

                console.log('tripData', rideData);
                this.postFlag = true;
                this.createTrip(rideData).then(trip => {
                    this.postFlag = false;
                    this.$router.push({name: 'your-trips'});
                }).catch(error => { this.postFlag = false; });
            }
        }
    },
    watch: {
        write_detail: function () {
            this.bio_count = this.write_detail.length;
            let desCount = this.bio_count;
            if ((desCount % 150) >= 75) {
                this.text_counter = 150 * ((desCount / 150).toFixed());
            } else if ((desCount % 150) === 0 && desCount !== 0) {
                this.text_counter = 150 * ((desCount / 150).toFixed());
            } else if ((desCount % 150) === 0 && desCount === 0) {
                this.text_counter = 150;
            } else {
                this.text_counter = 150 * (parseInt((desCount / 150).toFixed()) + 1);
            }
        }
    },
    components: {
        closeIcon,
        carPlusIcon,
        minusIcon,
        plusIcon,
        greySeatIcon,
        amenities,
        switchBtn,
        spinner,
        carIcon
    },
    mounted () {
        console.log('data', this.data);
        console.log('trips', this.trips);
        console.log('user', this.user);
        this.tripData = this.data;

        // set latest trip ID
        this.latestTripId = this.trips[this.trips.length - 1].id;
    },
    props: {
        data: {
            type: Object,
            required: false,
            default: null
        }
    }
};
</script>