<template>
    <svg :width="size" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
     viewBox="0 0 472.618 472.618" style="enable-background:new 0 0 472.618 472.618;" xml:space="preserve">
<g>
    <g>
        <path :style="{'fill': color}" d="M443.609,0.001H293.584V58.02h79.994L271.724,159.873l0.954,0.953c-28.3-20.409-62.942-32.569-100.499-32.569
            C77.087,128.257,0,205.345,0,300.437s77.087,172.18,172.18,172.18s172.18-77.088,172.18-172.18
            c0-37.558-12.161-72.201-32.572-100.502l0.959,0.959L414.599,99.041v79.994h58.019V29.01V0.001H443.609z M172.183,414.596
            c-62.948,0-114.159-51.211-114.159-114.159c0-62.948,51.211-114.159,114.159-114.159s114.158,51.211,114.158,114.159
            C286.341,363.386,235.131,414.596,172.183,414.596z"/>
    </g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
</template>

<script>
export default {
    name: 'maleIcon',
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
}
</script>