<template>
    <div class="row" :style="date_filter_style">
        <div class="row">
            <label for="from">Du:</label>
            <input type="date" id="from" v-model="from">
        </div>
        <div class="row">
            <label for="to">Au:</label>
            <input type="date" id="to" v-model="to">
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            flexDirection: {
                type: String,
                default: 'row'
            }
        },
        data() {
            return {
                from: '',
                to: ''
            }
        },
        computed: {
            date_filter_style() {
                return {
                    flexDirection: this.flexDirection
                }
            }
        }
    }
</script>
<!-- <style scoped>
.row {
    display: flex;
    justify-content: space-between;
    flex: 1;
    width: 100%;
}
</style> -->