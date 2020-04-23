<template>
    <div>
        <div class="searchArea-box">
            <div>
                <fromIcon :size="15" color="#ABE5C4" />
                <gmap-autocomplete
                    @place_changed="setFromtownPlace"
                    placeholder="Leaving from"
                    :value="from_address"
                ></gmap-autocomplete>
            </div>
            <div>
                <toIcon :size="15" color="#ABE5C4" />
                <gmap-autocomplete
                    @place_changed="setTotownPlace"
                    placeholder="Going to"
                    :value="to_address"
                ></gmap-autocomplete>    
            </div>
        </div>
        <DatePicker
            ref="datepicker"
            @onChange="changeDate"
            :minDate="minDate"
            :format="'DD dd MMMM'"
        />
    </div>
</template>

<script>
import moment from 'moment';

// import components for this
import fromIcon from '../../icon/FromIcon';
import toIcon from '../../icon/ToIcon';
import DatePicker from '../DatePicker';

export default {
    name: 'tripSearch',
    data () {
        return {
            from_address: '',
            to_address: '',
            date: '',
            minDate: moment().toDate()
        };
    },
    methods: {
        setTotownPlace: function (place) {
            this.to_address = place.formatted_address;
            console.log('setTotownPlace', place);
        },
        setFromtownPlace: function (place) {
            this.from_address = place.formatted_address;
            console.log('setFromtownPlace', place);
        },
        changeDate: function (value) {
            this.date = value;
        }
    },
    watch: {
        from_address: function () {
            if (this.from_address !== '' && this.to_address !== '') {
                let data = {
                    from_town: this.from_address,
                    to_town: this.to_address
                };
                if (this.date !== '') {
                    data.date = this.date;
                } else {
                    data.date = this.minDate;
                }
                this.$emit('searchResult', data);
            }
        },
        to_address: function () {
            if (this.from_address !== '' && this.to_address !== '') {
                let data = {
                    from_town: this.from_address,
                    to_town: this.to_address
                };
                if (this.date !== '') {
                    data.date = this.date;
                } else {
                    data.date = this.minDate;
                }
                this.$emit('searchResult', data);
            }
        },
        date: function () {
            if (this.from_address !== '' && this.to_address !== '') {
                let data = {
                    from_town: this.from_address,
                    to_town: this.to_address
                };
                if (this.date !== '') {
                    data.date = this.date;
                } else {
                    data.date = this.minDate;
                }
                this.$emit('searchResult', data);
            }
        }
    },
    components: {
        fromIcon,
        toIcon,
        DatePicker
    }
};
</script>