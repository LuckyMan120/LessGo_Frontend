<template>
    <div class="messages">
        <!-- messages area -->
        <div class="messages-area">
            <h1>Messages</h1>
            <closeIcon :size="12" :classes="'close-message'" />
            <div class="divide-messages">
                <div @click="selectItem('inbox')">
                    <v-icon icon="inbox" class="v-icons-message" :style="inbox?'color: #1C8983': 'color: #B5B6BC'" />
                    <span :style="inbox? 'color: #1C8983': 'color: #B5B6BC'">INBOX</span>
                </div>
                <div @click="selectItem('notification')">
                    <v-icon icon="bell" class="v-icons-message" :style="notification?'color: #d7eae9': 'color: #c5c6cb'" />
                    <span :style="notification? 'color: #1C8983': 'color: #B5B6BC'">NOTIFICATIONS</span>
                </div>
            </div>

            <!-- search conversation -->
            <div class="search-conversation" v-if="inbox">
                <v-icon icon="search" class="v-icons-message" style="width: 15px !important; height: 15px; margin-top: 4px" />
                <input @keyup="conSearch" v-model="conversation" type="text" name="" placeholder="Search conversations" />
            </div>
        </div>

        <!-- members area -->
        <div class="members-area">
            <!-- Inbox -->
            <div class="d-m-a" v-if="inbox">
                <div v-for="driver in drivers" class="member-content">
                    <div class="img-circle" v-imgSrc:src="driver.img"></div>
                    <div class="circle-icon">
                        <v-icon icon="car" />
                    </div>
                    <div class="member-detail">
                        <h3>{{ driver.name }}</h3>
                        <span>{{ driver.message }}</span>
                    </div>
                </div>
                <div v-for="passenger in passengers" class="member-content">
                    <div class="img-circle" v-imgSrc:src="passenger.img"></div>
                    <div class="circle-icon">
                        <v-icon icon="user" />
                    </div>
                    <div class="member-detail">
                        <h3>{{ passenger.name }}</h3>
                        <span>{{ passenger.message }}</span>
                    </div>
                </div>
            </div>
            <!-- support -->
            <div class="s-m-a" v-else="notification">
                <div v-for="support in supports" class="member-content">
                    <div class="img-circle">
                        <div class="support-mark">
                            <p>G</p><p>Q</p>
                        </div>
                    </div>
                    <div>
                        <h3>{{ support.name }}</h3>
                        <span>{{ support.title }}</span>
                    </div>
                </div>
            </div>
        </div>    
    </div>
</template>

<script>
// import components for this
import closeIcon from '../../icon/CloseIcon.vue';

// import json for this
import detailJson from '../../jsons/messages.json';

export default {
    name: 'messages',
    data () {
        return {
            inbox: true,
            notification: false,
            drivers: detailJson.drivers,
            sourceDrivers: detailJson.drivers,
            passengers: detailJson.passengers,
            sourcePassengers: detailJson.passengers,
            supports: detailJson.supports,
            conversation: ''
        };
    },
    methods: {
        selectItem: function (item) {
            if (item === 'inbox') {
                this.inbox = true;
                this.notification = false;
            } else {
                this.inbox = false;
                this.notification = true;
            }
        },
        conSearch: function (v) {
            let searchValue = v.target.value;
            let regex = new RegExp('^' + searchValue + '|' + searchValue + '.|.' + searchValue, 'i');
            let searchDriverData = [];
            let searchPassengerData = [];

            // search for drivers
            this.sourceDrivers.forEach(driver => {
                if (regex.test(driver.message)) {
                    searchDriverData.push(driver);
                }
            });

            // search for passengers
            this.sourcePassengers.forEach(passenger => {
                if (regex.test(passenger.message)) {
                    searchPassengerData.push(passenger);
                }
            });

            this.drivers = searchDriverData;
            this.passengers = searchPassengerData;
        }
    },
    components: {
        closeIcon
    }
};
</script>