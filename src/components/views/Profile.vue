<template>
    <tabset ref="tabs" :keytabset="'profile'" :rememberTab="isMyOwnProfile">
        <tab :header="viajesHeaderTitle">
            <component :is="currentView"></component>
        </tab>
        <tab header="Profile">
            <ProfileInfo></ProfileInfo>
        </tab>
        <tab header="Ratings">
            <ProfileRates :id="id"></ProfileRates>
        </tab>
    </tabset>
</template>


<style>

ul.nav.nav-tabs.active-1
{
    display: none;
}
.active-1 + .tab-content {
    margin-top: -2rem !important;
}
</style>

<script>
import Tab from '../elements/Tab';
import Tabset from '../elements/Tabset';
import {mapActions, mapGetters} from 'vuex';
import ProfileInfo from '../sections/ProfileInfo';
import ProfileRates from '../sections/ProfileRates';
import MyTrips from './MyTrips';
import ProfileTrip from '../sections/ProfileTrip';
import router from '../../router';

export default {
    components: {
        Tab,
        Tabset,
        ProfileInfo,
        ProfileRates,
        MyTrips,
        ProfileTrip
    },

    props: {
        id: {
            required: false,
            default: 'me'
        },
        userProfile: {
            required: false
        },
        activeTab: {
            required: false
        }
    },

    data () {
        return {
            currentView: null
        };
    },

    computed: {
        ...mapGetters({
            'user': 'auth/user',
            'profile': 'profile/user'
        }),
        viajesHeaderTitle () {
            return (this.id === 'me' || this.id === this.user.id) ? 'My trips' : 'Rides';
        },
        isMyOwnProfile () {
            return (this.id === 'me' || this.id === this.user.id);
        }
    },

    methods: {
        ...mapActions({
            setTitle: 'actionbars/setTitle',
            setProfile: 'profile/setUser',
            setProfileByID: 'profile/setUserByID',
            setUserByID: 'userTrips/setUserByID'

        }),
        updateProfile () {
            if (this.id === 'me' || this.id === this.user.id) {
                this.setTitle('My Profile');
                this.setProfile(this.user);
                this.currentView = 'my-trips';
            } else {
                if (this.userProfile) {
                    this.setTitle(this.userProfile.name);
                }
                this.setProfileByID({id: this.id, userProfile: this.userProfile}).then(() => {
                    this.setTitle(this.profile.name);
                }).catch(() => {
                    this.$router.replace({name: 'trips'});
                });
                this.setUserByID(this.id);
                this.currentView = 'profile-trip';
            }
        }
    },
    watch: {
        '$route': function () {
            console.log('watch');
            this.updateProfile();
        }
    },

    mounted () {
        let index = 1;
        if (router.history && router.history.current && router.history.current.hash) {
            index = parseInt(router.history.current.hash.replace('#', ''), 10);
        }
        if (this.activeTab) {
            index = parseInt(this.activeTab, 10);
        } else {
            index = this.$refs.tabs.getRememberedTab(1);
        }
        this.$refs.tabs.activateTab(index);
        this.updateProfile();
    }
};
</script>
