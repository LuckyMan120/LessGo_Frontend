<template>
    <div class="main-body">
        <div :style="giveReviewFlag?'filter: blur(5px)': ''">
            <img :src="main_bk_img" class="main_img" />
            <dropdownMenu @reverse="reverse" />
            <!-- <div class="go-title">
                <div class="col-xs-6 go-title-margin" style="background: #eb5557">
                    <span style="color: #f4a1a2">GQ</span>
                    <span style="color: white">Pool</span>
                </div>
                <div class="col-xs-8 col-xs-offset-2 go-title-margin" style="padding: 3px">
                    <span style="color: #eb5557">GQ</span>
                    <span>Experiences</span>
                </div>
                <div class="col-xs-8 go-title-margin">
                    <span style="color: #eb5557">GQ</span>
                    <span>FIFA&nbsp;22</span>
                </div>
            </div> -->

            <!-- search area -->
            <div class="searchArea" :style="reserveFlag? 'margin-top: 45px; box-shadow: 0px -6px 10px #d9e7e5;': ''">
                <span class="search-title">
                    Where do you want to go?
                </span>
                <span v-if="!activeFlag" class="trips-head" @click="showTrips">
                    Popular trips
                </span>

                <div v-if="!activeFlag" class="trips-area">
                    <!-- first area card -->
                    <div class="amman">
                        <div class="trip-area-title">
                            <span>
                                Amman
                            </span>
                            <arrowIcon :size="10" :color="'#707070'" />
                            <span>
                                Madaba
                            </span>
                            <span style="color: #9CD076; float: right; font-weight: bold;">
                                JD&nbsp;4
                            </span>
                        </div>
                    </div>
                    <!-- second area card -->
                    <div class="aqaba">
                        <div class="trip-area-title">
                            <span>
                                Jarash
                            </span>
                            <arrowIcon :size="10" :color="'#707070'"/>
                            <span>
                                Aquba
                            </span>
                            <span style="color: #9CD076; float: right; font-weight: bold;">
                                JD&nbsp;4
                            </span>
                        </div>
                    </div>
                </div>

                <!-- active ticket area -->
                <span v-if="activeFlag" style="position: absolute; z-index: 2" class="trips-head" @click="showTrips">Active Trip</span>
                <div v-if="activeFlag && !giveReviewFlag" style="margin-top: 25px">
                    <profileTicketIcon :activeFlag="true" :data="currentData" @finish-trip="giveReview" />
                </div>

                <!-- search body -->
                <div :style="activeFlag?'margin-top: -50px': ''" class="search-body">
                    <span class="some-span">Somewhere else?</span>
                    <tripSearch @searchResult="result" />
                </div>

                <!-- button areas -->
                <div class="button-area">
                    <button class="search-btn" @click="searchNewTrip">
                        <span>
                            Search
                        </span>
                        <arrowUpIcon />
                    </button>
                    <button class="offer-ride" @click="offerRide">
                        <carIcon :size="20" :color="'#D5E9E8'" style="margin-top: -3px;" />
                        <carPlusIcon :size="15" />
                        <span>Offer ride</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- give review section -->
        <div class="review-page" v-if="giveReviewFlag">
            <div class="virtual-bk"></div>
            <div class="review-ticket">
                <profileTicketIcon :reviewFlag="true" :data="currentData" :activeFlag="true" />

                <!-- write review panel -->
                <div class="write-review">
                    <div style="text-align: center;">
                        <div @click="starSelect(num.id)" class="star-area" v-for="num in greyRating" style="">
                            <ratingStarIcon :size="20" :color="num.selected?'#e65a5b': 'grey'" />
                        </div>
                    </div>
                    <input type="text" v-model="reviewText" placeholder="Write a review (optional)" />
                    <button @click="setReview">Thanks!</button>
                </div>
            </div>
                
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import dialogs from '../../services/dialogs.js';
import moment from 'moment';

// import components for this
import arrowIcon from '../../icon/ArrowIcon';
import tripSearch from '../sections/TripSearch';
import arrowUpIcon from '../../icon/ArrowUpIcon';
import dropdownMenu from '../../icon/DropdownMenu';
import profileTicketIcon from '../../icon/ProfileTicketIcon';
import ratingStarIcon from '../../icon/RatingStarIcon';
import carIcon from '../../icon/CarIcon';
import carPlusIcon from '../../icon/CarPlusIcon';

// import json for next search
import searchJson from '../../jsons/searchTrips.json';

export default {
    name: 'main',
    data () {
        return {
            main_bk_img: '/static/img/landing-bg.png',
            from_town: '',
            to_town: '',
            date: '',
            reserveFlag: false,
            activeFlag: false,
            currentData: null,
            giveReviewFlag: false,
            greyRating: [],
            reviewText: ''
        };
    },
    components: {
        arrowIcon,
        carPlusIcon,
        tripSearch,
        arrowUpIcon,
        dropdownMenu,
        profileTicketIcon,
        ratingStarIcon,
        carIcon
    },
    methods: {
        ...mapActions({
            getTrips: 'trips/getTrips',
            setTrips: 'trips/setTrips'
        }),
        offerRide: function () {
            this.$router.push({name: 'setCarAndId'});
        },
        searchNewTrip: function () {
            if (this.from_town === '' || this.to_town === '' || this.date === '') {
                dialogs.message('You must correct or complete some fields for search trip.', { duration: 10, state: 'error' });
                return;
            } else {
                let data = {
                    from_town: this.from_town,
                    to_town: this.to_town,
                    date: this.date,
                    trips: []
                };
                this.getTrips(data); // search from backend
                let json = searchJson.searchTrips;
                json.forEach(trip => {
                    if (trip.trips.from_town === this.from_town && trip.trips.to_town === this.to_town && moment(this.date).toDate() < moment(trip.trips.created_at).toDate()) {
                        data.trips.push(trip);
                    }
                });
                this.setTrips(data);
                this.$router.push({name: 'searchResult'});
            }
        },
        result: function (obj) {
            this.from_town = obj.from_town;
            this.to_town = obj.to_town;
            this.date = obj.date;
        },
        reverse: function () {
            this.reserveFlag = !this.reserveFlag;
        },
        giveReview: function () {
            this.giveReviewFlag = true;
        },
        starSelect: function (num) {
            console.log(num);
            let flag = true;
            this.greyRating.forEach(item => {
                if (flag) {
                    if (item.id === num) {
                        item.selected = !item.selected;
                        flag = false;
                    } else {
                        item.selected = true;
                    }
                } else {
                    item.selected = false;
                }
            });
        },
        setReview: function () {
            let ratingCount = 0;
            this.greyRating.forEach(item => {
                if (item.selected) {
                    ratingCount += 1;
                }
            });
            let data = {
                'ratingCount': ratingCount,
                'review': this.reviewText
            };
            console.log('setReview', data);
            this.$router.push({name: 'your-trips'});
        },
        showTrips: function () {
            console.log(this.activeFlag);
            this.activeFlag = !this.activeFlag;
        }
    },
    mounted () {
        let json = searchJson.searchTrips;
        let currentDate = new Date();
        json.forEach(trip => {
            if (moment(trip.trips.created_at).toDate() < currentDate) {
                this.currentData = trip;
            }
        });
        if (this.currentData !== null) {
            this.activeFlag = true;
        } else {
            this.activeFlag = false;
        }

        // set default rating
        for (let i = 1; i <= 5; i++) {
            this.greyRating.push({'id': i, 'selected': false});
        }
    }
};
</script>

<style>
    .main-body {
        position: relative;
    }
    .main-body img {
        width: 100%;
        height: auto;
    }
    .go-title {
        padding: 8px;
        background: #dad8d8;
        border: none;
        border-radius: 20px;
        position: absolute;
        bottom: 6vh;
        left: 5%;
        width: 90%;
        opacity: .9;
    }
    .go-title-margin {
        border-radius: 20px;
        text-align: center;
        color: #000000;
        padding: 3px;
        font-weight: bold;
    }
    .go-title> :last-child {
        margin-right: 0;
        padding-left: 0;
    }
    .searchArea {
        margin-top: -20px;
        background: white;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        z-index: 3;
        position: absolute;
        width: 100%;
    }
</style>