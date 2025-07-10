<template>
    <div class="microfinance_header">
        <div class="header">
            <div class="left">
                <img src="/static/logo.png" alt="">
            </div>
            <div class="info_container">
                <h3>MCIROFINANCE</h3>
                <h3>SIEGE : BUJUMBURA, MUKAZA, ROHERO</h3>
                <h3>TEL : +257 62626268</h3>
            </div>
            <div class="info_container">
                <h3>Numero : {{ infos.compte?.numero }}</h3>
                <h3>Nom & prenom : {{ infos.compte?.First_name }} {{ infos.compte?.Fast_name }}</h3>
                <!-- <h3>Agence {{ this.$store.state.user.agence.nom }}</h3> -->
            </div>
        </div>
        <span class="date">Date et heure {{ date_time }}</span>
        <div class="title_cont">
            <h3 class="title">{{ title }}</h3>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            infos : ''
        }
    },
    props: {
        title: {
            type: [String, Number], 
            required: true,
        },
    },
    computed: {
        date_time() {
            const now = new Date();
            const date = now.toLocaleDateString();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const milliseconds = String(now.getMilliseconds()).padStart(2, '0');
            return `${date} ${hours}:${minutes}:${seconds}:${milliseconds}`;
        }
    },
    mounted(){
        localStorage?.getItem('compte_active') ? this.$store.state.compte_active = JSON.parse(localStorage?.getItem('compte_active')) : ''
        this.$nextTick(()=> this.infos =  this.$store.state.compte_active )
    }
}
</script>
<style scoped>
.date{
    display: flex;
    justify-content: end;

}

.microfinance_header {
    display: none;
    margin: 0;
}

.header {
    display: flex;
    gap: 40px;
    align-items: center;
    width: 100%;
    padding: 20px;
}

.header img {
    width: 100px;
    height: auto;
}

h3 {
    margin: 0;
}

.title_cont {
    margin: auto;
    text-align: center;
}

.title {
    display: inline-block;
    margin: 10px 0 15px 0;
    padding: 10px 20px;
    border-bottom: 1px solid var(--primary);
}

@media print {
    .header {
        padding: 10px !important;
        max-width: 100%;
        box-sizing: border-box;
        border: 1px solid var(--primary) !important;
    }

    .microfinance_header {
        display: block;
    }
}
</style>