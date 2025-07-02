<template>
    <div class="main_overlay_container">
        <div class="main_img_container">
            <img src="/network_error.png" alt="">
            <h3>Vous êtes actuellement hors ligne.</h3>
            <div class="btn" @click="refresh">Reéssayer</div>
        </div>
    </div>
</template>
<script>
export default {
    methods : {
        refresh(){
            this.$store.state.online = navigator.onLine 
        }
    }
}
</script>
<style scoped>
.main_overlay_container{
    background-color: var(--second);
    position: absolute;
    display: grid;
    place-content: center;
    height: 100%;
    width: 100%;
    z-index: 1000000000;
}
.main_img_container{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}
.btn{
    padding: 10px 40px;
}
</style>