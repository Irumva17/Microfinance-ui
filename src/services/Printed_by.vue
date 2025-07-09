<template>
    <div>
        <p class="printer">Imprimé par : {{ user_name }} </p>
        <!-- <h3>Date et heure {{ date_time }}</h3> -->
    </div>
</template>
<script>
export default {
    computed: {
        user_name() {
            return this.$store.state.user.fullname != "" ? this.$store.state.user.fullname : this.$store.state.user.username;
        }
    },
}
</script>
<style scoped>
    p.printer{
        margin-top: 0;
        display: none;
    }
    @media print{
        p.printer{
            display: block;
        }
    }
</style>