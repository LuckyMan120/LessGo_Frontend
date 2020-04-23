<template>
    <div class="details-body-common">
        <!-- smoking -->
        <div @click="selPreference('smoke')" :style="(offerFlag && !smoke)?'opacity: .5' : ''" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + smokeIcon + ')'}"></div>
            <p>Smoking</p>
        </div>

        <!-- pets -->
        <div @click="selPreference('pets')" :style="(offerFlag && !pets)?'opacity: .5' : ''" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + petsIcon + ')'}"></div>
            <p>Pets</p>
        </div>

        <!-- luggage -->
        <div @click="selPreference('luggage')" :style="(offerFlag && !luggage)?'opacity: .5' : ''" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + luggageIcon + ')'}"></div>
            <p>Luggage</p>
        </div>

        <!-- food -->
        <div @click="selPreference('food')" :style="(offerFlag && !food)?'opacity: .5' : ''" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + foodIcon + ')'}"></div>
            <p>Food</p>
        </div>

        <!-- speak -->
        <div @click="selPreference('speak')" :style="(offerFlag && !speak)?'opacity: .5' : ''" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + speakIcon + ')'}"></div>
            <p>Speaking</p>
        </div>

        <!-- protection -->
        <div @click="selPreference('protect')" :style="(offerFlag && !protect)?'opacity: .5' : ''" class="details-body-common-area">
            <div class="amenties-img" :style="{'background': 'url(' + protectIcon + ')'}"></div>
            <p>Protection</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'preferences',
    data () {
        return {
            smoke: false,
            pets: false,
            food: false,
            speak: false,
            luggage: false,
            protect: false,
            smokeIcon: process.env.ROUTE_BASE + 'static/img/smoke.png',
            petsIcon: process.env.ROUTE_BASE + 'static/img/pets.png',
            luggageIcon: process.env.ROUTE_BASE + 'static/img/luggage.png',
            foodIcon: process.env.ROUTE_BASE + 'static/img/food.png',
            speakIcon: process.env.ROUTE_BASE + 'static/img/speaking.png',
            protectIcon: process.env.ROUTE_BASE + 'static/img/protection.png'
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
    mounted () {
        this.data.forEach(item => {
            switch (item) {
                case 'Smoking':
                    this.smoke = true;
                    break;
                case 'Pets':
                    this.pets = true;
                    break;
                case 'Food':
                    this.food = true;
                    break;
                case 'Luggage':
                    this.luggage = true;
                    break;
                case 'Speaking':
                    this.speak = true;
                    break;
                case 'Protection':
                    this.protect = true;
                    break;
                default:
                    break;
            }
        });
    },
    methods: {
        selPreference: function (item) {
            this[item] = !this[item];
        }
    }
}
</script>