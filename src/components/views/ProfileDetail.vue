<template>
    <div>
        <div class="messages-area profile-detail">
            <closeIcon :size="12" :classes="'close-message'" />
            <!-- title area -->
            <div class="title-area">
                <div class="img-profile-detail" v-imgSrc:profile="user.image">
                </div>
                <div style="margin-left: 20px;">
                    <h3>{{ user.name }}</h3>
                    <div v-for="num in redRating" style="float: left; margin-right: 5px;">
                        <ratingStarIcon :size="10" :color="'#e65a5b'" />
                    </div>
                    <div v-if="!no_review" v-for="num in greyRating" style="float: left; margin-right: 5px;">
                        <ratingStarIcon :size="10" />
                    </div>
                    <div v-if="no_review">
                        <span>No Reviews</span>
                    </div>
                </div>
            </div>

            <!-- bio area -->
            <h4>Bio</h4>
            <p>"{{  userData.description }}"</p>
        </div>
        <!-- profile detail content -->
        <div class="profile-detail-content">
            <!-- contribution -->
            <h2>Contribution</h2>
            <contribution :data="contributionData" />

            <!-- reviews -->
            <h2>Reviews&nbsp;-&nbsp;{{ reviewCount }}</h2>
            <div class="review-img">
                <img :src="review_bk" />
                <h3 v-if="no_review">No one has reviewed {{ review_name[0] }} yet.</h3>
                <h3 v-else>{{ review_name[0] }} has been reviewed</h3>
            </div>

            <!-- edit profile btn -->
            <button @click="editProfile">Edit profile</button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

// import components for this
import closeIcon from '../../icon/CloseIcon';
import ratingStarIcon from '../../icon/RatingStarIcon';

// import json for this
import profileJson from '../../jsons/profile.json';
import contribution from '../sections/Contribution';

let totalCount = 5;
export default {
    name: 'profileDetail',
    data () {
        return {
            userData: null,
            redRating: [],
            greyRating: [],
            no_review: false,
            reviewCount: null,
            contributionData: null,
            review_bk: process.env.ROUTE_BASE + 'static/svg/norating.svg',
            review_name: ''
        }
    },
    props: {
        id: {
            type: String,
            required: false,
            default: 'me'
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user'
        }),
        initData: function () {
            console.log('userData', this.user);
            this.userData = this.user;
            this.review_name = this.user.name.split(' ', 1); // get first name
            this.redRating = [];
            this.greyRating = [];
            let profileData = profileJson.profile;
            let ratingCount = this.user.positive_ratings + this.user.negative_ratings;
            this.reviewCount = ratingCount;
            // rating count
            if (ratingCount !== 0) {
                for (let i = 0; i < ratingCount; i++) {
                    this.redRating.push(i);
                }

                for (let j = 0; j < (totalCount - ratingCount); j++) {
                    this.greyRating.push(j);
                }
            } else {
                this.no_review = true;
            }
            this.contributionData = profileData;
        }
    },
    methods: {
        editProfile: function () {
            this.$router.push({name: 'edit-profile', params: {id: 'me'}});
        }
    },
    watch: {
        initData: function () {

        }
    },
    components: {
        closeIcon,
        ratingStarIcon,
        contribution
    }
}
</script>