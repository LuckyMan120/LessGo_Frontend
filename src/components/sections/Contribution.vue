<template>
    <div class="contribution">
        <div class="col-xs-6">
            <div class="con-icons">
                <v-icon icon="gas-pump" class="v-icons-contribution" />
            </div>
            <span>{{ data.saved_distance }}<span class="unit">&nbsp;km</span></span>
            <p>saved</p>
        </div>
        <div class="col-xs-6">
            <div class="con-icons">
                <v-icon icon="cloud" class="v-icons-contribution" style="width: 25px !important" />
            </div>
            <span>{{ data.saved_co2 }}<span class="unit">&nbsp;kg</span></span>
            <p>CO2eq saved</p>    
        </div>
        <div class="col-xs-6">
            <div class="con-icons">
                <v-icon icon="user" class="v-icons-contribution" />
            </div>
            <span>{{ data.as_passenger_trips }}<span class="unit">&nbsp;trips</span></span>
            <p>as passenger</p>    
        </div>
        <div class="col-xs-6">
            <div class="con-icons">
                <v-icon icon="car" class="v-icons-contribution" />
            </div>
            <span>{{ data.as_driver_trips }}<span class="unit">&nbsp;trips</span></span>
            <p>as driver</p>
        </div>
        
    </div>
</template>

<script>
export default {
    name: 'contribution',
    props: {
        data: {
            type: Object,
            required: false,
            default: null
        }
    }
};
</script>