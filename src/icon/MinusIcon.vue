<template>
    <svg :width="size" style="cursor: pointer;" viewBox="0 -192 469.33333 469" xmlns="http://www.w3.org/2000/svg"><path :style="{'fill': color}" d="m437.332031.167969h-405.332031c-17.664062 0-32 14.335937-32 32v21.332031c0 17.664062 14.335938 32 32 32h405.332031c17.664063 0 32-14.335938 32-32v-21.332031c0-17.664063-14.335937-32-32-32zm0 0"/></svg>
</template>

<script>
export default {
    name: 'minusIcon',
    props: {
        size: {
            type: Number,
            required: false,
            default: 10
        },
        color: {
            type: String,
            required: false,
            default: 'grey'
        }
    }
};
</script>