<template>
    <div class="item">
        <div class="top">
            <div class="header">
                <img src="/static/logo.png" alt="">
                <h1>MICROFINANCE</h1>
            </div>
            <p class="date">Date: <span>{{ datetime(item.created_at) }}</span></p>
        </div>
        <div class="bottom">
            <p>Montant deposé {{ money(item.montant) }} Fbu</p>
            <p>Compte {{ $route.query.number }} de {{ $route.query.name }}</p>
            <p>Motif(Src): {{ item.motif}}</p>
            <p>Details: {{ item.details}}</p>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    }
}
</script>

<style scoped>
* {
    color: black
}
.item {
    box-sizing: border-box;
    border: 1px solid;
    max-height: 360px;
    /* width: 100vw; */
    /* max-width: 340px; */
    /* margin: 0 20px; */
}

.top {
    /* display: flex; */
    /* flex-direction: column;
    align-items: center; */
    justify-content: space-between;
}

.header {
    display: flex;
    align-items: center;
    gap: 20px   ;
}

img {
    width: 60px;
}

.date {
    /* text-decoration: underline;
    min-width: min-content; */
    display: flex;
    gap: 40px;

    /* span {
        border-bottom: 1px solid ;
    } */
}

.actions p {
    display: flex;
    align-items: center;
    gap: 15px;
    margin: 5px;
}



h1 {
    font-size: 22px;
}

h2 {
    font-size: 18px;
}

.bottom {
    font-size: 14px
}

@media print {
    body {
        width: fit-content;
    }

    .item {
        page-break-inside: avoid;
        padding: 20px !important;
    }
}
</style>