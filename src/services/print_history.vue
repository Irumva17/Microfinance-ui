<template>
    <div class="page">
        <div class="header">
            <div class="left">
                <img src="/static/logo.png" alt="">
            </div>
            <div class="info_container">
                <h3>MICROFINANCE</h3>
                <h3>BUJUMBURA, MUKAZA, ROHERO</h3>
                <h3>Compte de: {{ account_name }}</h3>
            </div>
            <div class="date_container" >
                <h3>RELEVE DE COMPTE</h3>
                <span>Du {{from}} au {{to}}</span>
            </div>
        </div>
        <p>HISTORIQUE DU COMPTE {{ account_number }}</p>
        <table class="print">
            <tr>
                <th>Date et Heure</th>
                <th>Details</th>
                <th>Action</th>
                <th>Montant</th>
                <th>Balance</th>
            </tr>
            <tr v-for="history in histories" :key="history.id">
                <td>{{ datetime(history.created_at) }}</td>
                <td>{{ history.details }}</td>
                <td>{{ history.action }}</td>
                <td>{{ money(history.montant) }}</td>
                <td>{{ money(history.balance) }}</td>
            </tr>
        </table>
        <Printed_by />
    </div>
</template>

<script>
import Printed_by from './Printed_by.vue';

export default {
    props: {
        account_name: {
            type: String,
            required: true
        },
        account_number: {
            type: String,
            required: true
        },
        from: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true
        },
        histories: {
            type: Array,
            required: true
        }
    },
    components : {Printed_by}
}
</script>

<style scoped>
*{
    padding: 0;
}
.page{
    position: relative;
    box-sizing: border-box;
    padding: 1.2cm;
    width: 20cm;
    margin: auto;
    background-color: white;
    height: fit-content;
}
.header{
    display: flex;
    gap: 40px;
    align-items: center;
}
.header img{
    width: 100px;
}
tr:nth-child(1){
    position: relative;
}
.page th{
    font-weight: 600
}
th{
    background: white;
    font-weight: 600;
    color: var(--primary);
}
th, td{
    padding:0;
}
.page h3{
    margin: 0;
}
.page p{
    text-align: center;
    font-weight: bold;
}
.date_container{
    padding-top: 20px;
    flex-grow: 1;
    text-align: right;
    margin-bottom: auto;
    display: flex;
    flex-direction: column;
    align-items: end;
}

@media print {
    .date_container h3{
        padding:0 25px;
        width: fit-content;
        background-color: var(--primary) !important;
        color: white !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }
}
</style>
