<template>
    <div>
        <span>PICK MULTIPLE DATES</span>
        <datePicker :format="'DD dd MMMM'" style="margin: 10px 0 20px 0; width: 100%;" />
        <scheduleArea title="DATE" @get-data="getData" :tripType="tripType" v-show="true" :type="false" />
        <div class="round-area" style="margin-top: 20px;">
            <div @click="rideMethod" class="round-btn">
                <div :class="rideTypeFlag?'inline-area': 'single-area'"></div>
            </div>
            <span>Different time of day</span>
        </div>
    </div>  
</template>

<script>
// import components for this
import scheduleArea from '../elements/ScheduleArea';
import datePicker from '../DatePicker';

export default {
    name: 'specific',
    data () {
        return {
            rideData: null,
            tripType: false,
            rideTypeFlag: false
        }
    },
    methods: {
        getData: function (data) {
            this.rideData = data;
        },
        rideMethod: function () {
            this.rideTypeFlag = !this.rideTypeFlag;
        }
    },
    watch: {
        rideType: function () {
            this.tripType = this.rideType;
        }
    },
    props: {
        rideType: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    components: {
        scheduleArea,
        datePicker
    }
};
</script>