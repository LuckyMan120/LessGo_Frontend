<template>
    <div class="details-body-common">
        <!-- sanitizer -->
        <div @click="selectAmens('sanitizer')" :style="(offerFlag && !select.sanitizer)?'opacity: .3': 'opacity: 1'" v-if="sanitizer !== ''" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + sanitizerIcon + ')'}"></div>
            <p>{{ sanitizer }}</p>
        </div>

        <!-- wifi -->
        <div @click="selectAmens('wifi')" :style="(offerFlag && !select.wifi)?'opacity: .3': 'opacity: 1'" v-if="wifi !== ''" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + wifiIcon + ')'}"></div>
            <p>{{ wifi }}</p>
        </div>

        <!-- comfort -->
        <div @click="selectAmens('comfort')" :style="(offerFlag && !select.comfort)?'opacity: .3': 'opacity: 1'" v-if="comfort !== ''" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + comfortIcon + ')'}"></div>
            <p>{{ comfort }}</p>
        </div>

        <!-- aux -->
        <div @click="selectAmens('aux')" :style="(offerFlag && !select.aux)?'opacity: .3': 'opacity: 1'" v-if="aux !== ''" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + auxIcon + ')'}"></div>
            <p>{{ aux }}</p>
        </div>

        <!-- charger -->
        <div @click="selectAmens('charger')" :style="(offerFlag && !select.charger)?'opacity: .3': 'opacity: 1'" v-if="charger !== ''" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + chargerIcon + ')'}"></div>
            <p>{{ charger }}</p>
        </div>

        <!-- snacks -->
        <div v-if="reverse">
            <div @click="selectAmens('snacks')" :style="(offerFlag && !select.snacks)?'opacity: .3': 'opacity: 1'" v-if="snacks !== ''" class="details-body-common-area">
                <div class="amenties-img" :style="{'background': 'url(' + snacksIcon + ')'}"></div>
                <p>{{ snacks }}</p>
            </div>
        </div>

        <!-- arrow icon -->
        <div :style="reverse?'transform: rotate(180deg)': ''" class="amen-arrow" @click="reverseBtn">
            <v-icon icon="angle-down" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'amenties',
    data () {
        return {
            wifi: '',
            snacks: '',
            charger: '',
            aux: '',
            comfort: '',
            sanitizer: '',
            wifiIcon: process.env.ROUTE_BASE + 'static/img/wifi.png',
            snacksIcon: process.env.ROUTE_BASE + 'static/img/snacks.png',
            chargerIcon: process.env.ROUTE_BASE + 'static/img/charger.png',
            auxIcon: process.env.ROUTE_BASE + 'static/img/aux1.png',
            comfortIcon: process.env.ROUTE_BASE + 'static/img/x-comfort.png',
            sanitizerIcon: process.env.ROUTE_BASE + 'static/img/sanitizer.png',
            select: {
                'wifi': false,
                'snacks': false,
                'charger': false,
                'aux': false,
                'comfort': false,
                'sanitizer': false
            },
            reverse: false
        }
    },
    props: {
        data: {
            type: Array,
            required: false,
            default: null
        },
        offerFlag: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    methods: {
        selectAmens: function (amens) {
            this.select[amens] = !this.select[amens];
        },
        reverseBtn: function () {
            this.reverse = !this.reverse;
        }
    },
    mounted () {
        if (this.offerFlag) {
            this.wifi = 'Wifi';
            this.snacks = 'Snacks';
            this.charger = 'Charger';
            this.aux = 'Aux';
            this.comfort = 'X-Comfort';
            this.sanitizer = 'Sanitizer';
        } else {
            this.data.forEach(item => {
                switch (item) {
                    case 'Wifi':
                        this.wifi = item;
                        break;
                    case 'Snacks':
                        this.snacks = item;
                        break;
                    case 'Charger':
                        this.charger = item;
                        break;
                    case 'Aux':
                        this.aux = item;
                        break;
                    case 'X-Comfort':
                        this.comfort = item;
                        break;
                    case 'Sanitizer':
                        this.sanitizer = item;
                        break;
                    default:
                        break;
                }
            });
        }
    }
};
</script>