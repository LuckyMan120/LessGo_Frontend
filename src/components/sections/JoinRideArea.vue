<template>
    <div v-if="show" class="joinRideArea">
        <div class="virtual-bk" style="height: 205vh;"></div>
        
        <!-- join area -->
        <div class="join-area">
            <profileTicketIcon :data="driverDetail" />
            <div class="ride-payment">
                <span>
                    NO. OF SEATS
                </span>
                <div class="car-seat-area">
                    <div class="seat-number">
                        <greySeatIcon :size="15" :color="'#abe5c4'" />
                        <p>{{ seat_count }}</p>
                    </div>
                    <div @click="selectSeat(-1)" class="car-minus">
                        <minusIcon :size="15" :color="'#abe5c4'" style="margin-top: 3px" />
                    </div>
                    <div @click="selectSeat(1)" class="car-plus">
                        <plusIcon :size="15" :color="'#abe5c4'" style="margin-top: 3px" />
                    </div>
                </div>

                <!-- payment area -->
                <div>
                    <span>PAYMENT METHOD</span>
                    <!-- payments -->
                    <div class="payments" @click="paymentList">
                        <!-- visa -->
                        <div v-if="visa" class="payment-card">
                            <v-icon :icon="['fab', 'cc-visa']" style="color: #344c9f" />
                            <label class="selected-payment">
                                **** 1234
                            </label>
                        </div>
                        <!-- cash -->
                        <div v-if="cash" class="payment-card">
                            <v-icon icon="money-bill" style="color: #abe5c4" />
                            <label class="selected-payment">
                                Cash
                            </label>
                        </div>
                        <!-- mastercard -->
                        <div v-if="mastercard" class="payment-card">
                            <v-icon :icon="['fab', 'cc-mastercard']" style="color: #abe5c4" />
                            <label class="selected-payment">
                                **** 5678
                            </label>
                        </div>
                        <!-- wallet -->
                        <div v-if="wallet" class="payment-card">
                            <v-icon icon="wallet" style="color: #adadad" />
                            <label class="selected-payment">
                                Wallet
                            </label>
                        </div>
                        <!-- down and up icon -->
                        <div class="downUp" :style="list?'transform: scaleY(-1);' : ''">
                            <downIcon :size="15" :color="'black'" />
                        </div>
                    </div>

                    <!-- payments list -->
                    <div v-if="list" class="payment-list">
                        <!-- visa -->
                        <div @click="setPayment('visa')" class="payment-card">
                            <v-icon :icon="['fab', 'cc-visa']" style="color: #344c9f" />
                            <label class="selected-payment">
                                **** 1234
                            </label>
                        </div>
                        <!-- cash -->
                        <div @click="setPayment('cash')" class="payment-card">
                            <v-icon icon="money-bill" style="color: #abe5c4" />
                            <label class="selected-payment">
                                Cash
                            </label>
                        </div>
                        <!-- mastercard -->
                        <div @click="setPayment('mastercard')" class="payment-card">
                            <v-icon :icon="['fab', 'cc-mastercard']" style="color: #abe5c4" />
                            <label class="selected-payment">
                                **** 5678
                            </label>
                        </div>
                        <!-- wallet -->
                        <div @click="setPayment('wallet')" class="payment-card">
                            <v-icon icon="wallet" style="color: #adadad" />
                            <label class="selected-payment">
                                Wallet
                            </label>
                        </div>
                    </div>

                    <span class="payment-des">
                        You will only be charged once the driver has accepted your request.
                    </span>
                </div>

                <!-- join btn area -->
                <div class="subtotal">
                    <div>
                        <span>SUBTOTAL</span>
                        <span class="subtotal-price">JOD&nbsp;{{ this.driverDetail.trips.seat_price }}</span>
                    </div>

                    <!-- Join -->
                    <button @click="joinRide">Join</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import components for this
import profileTicketIcon from '../../icon/ProfileTicketIcon';
import greySeatIcon from '../../icon/greySeatIcon';
import minusIcon from '../../icon/MinusIcon';
import plusIcon from '../../icon/PlusIcon';
import downIcon from '../../icon/DownIcon';

export default {
    name: 'joinRideArea',
    data () {
        return {
            driverDetail: this.data,
            visa: true,
            wallet: false,
            mastercard: false,
            cash: false,
            list: false,
            seat_count: 1,
            total_seat_count: null
        }
    },
    props: {
        data: {
            type: Object,
            required: false,
            default: null
        },
        show: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    computed: {
        initIcons: function () {
            this.total_seat_count = this.data.trips.total_seats;
        }
    },
    methods: {
        setPayment: function (payment) {
            switch (payment) {
                case 'cash':
                    this.cash = true;
                    this.wallet = false;
                    this.visa = false;
                    this.mastercard = false;
                    this.list = !this.list;
                    break;
                case 'wallet':
                    this.cash = false;
                    this.wallet = true;
                    this.visa = false;
                    this.mastercard = false;
                    this.list = !this.list;
                    break;
                case 'visa':
                    this.cash = false;
                    this.wallet = false;
                    this.visa = true;
                    this.mastercard = false;
                    this.list = !this.list;
                    break;
                case 'mastercard':
                    this.cash = false;
                    this.wallet = false;
                    this.visa = false;
                    this.mastercard = true;
                    this.list = !this.list;
                    break;
                default:
                    break;
            }
        },
        paymentList: function () {
            this.list = !this.list;
        },
        selectSeat: function (count) {
            let maxcount = this.total_seat_count;
            let currentcount = this.seat_count;
            currentcount += count;
            if (currentcount > maxcount) {
                this.seat_count = 1;
            } else if (currentcount === 0) {
                this.seat_count = maxcount;
            } else {
                this.seat_count = currentcount;
            }
        },
        joinRide: function () {
            this.$router.push({name: 'main'});
        }
    },
    watch: {
        initIcons: function () {

        }
    },
    components: {
        profileTicketIcon,
        greySeatIcon,
        minusIcon,
        plusIcon,
        downIcon
    }
};
</script>