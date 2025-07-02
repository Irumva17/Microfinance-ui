<template>
    <Navbar />
    <Modal :isVisible="show_modal" @close="closeModal">
        <form class="form" @submit.prevent="getBalances">
            <span class="title" >Entreer les dates:</span>
            <div class="content">
                <label for="start">Date de depart:</label>
                <input type="date" id="start" v-model="start">
                <label for="end">Date fin:</label>
                <input type="date" id="end" v-model="end">
                <small v-for="err in data_error?.error" :key="err.id">
                    {{ err }}
                </small>
            </div>
            <button class="btn-modal" type="submit">
                Envoyer
            </button>
        </form>
    </Modal>
    <div class="container">
        <div class="btn-headers">
            <div class="btn retour" @click="goBack">&#10094;</div>
            <button class="btn" @click="show_modal = true">{{ balances?.balance?.length ? 'Filtre' : 'Entreer les dates' }}</button>
        </div>
        <div v-if="answer" class="accounts">
            <Account account_name='Total solde initial :' :account_money="balances.total_solde_initial"/>
            <Account account_name='Total debits au début de la periode :' :account_money="balances.total_debits_before"/>
            <Account account_name='Total credits au début de la periode :' :account_money="balances.total_credits_before"/>
            <Account account_name='Total debits au cour de la période :' :account_money="balances.total_debits_during"/>
            <Account account_name='Total credits au cour de la période :' :account_money="balances.total_credits_during"/>
            <Account account_name='Total debits à la fin de la période :' :account_money="balances.total_debits_after"/>
            <Account account_name='Total credits à la fin de la période :' :account_money="balances.total_credits_after"/>
            <Account account_name='Total solde final :' :account_money="balances.total_solde_final"/>
        </div>
        <section v-if="answer" class="table">
            <table>
                <thead>
                    <tr>
                        <th rowspan="2">Compte</th>
                        <th colspan="2"> Solde au début de la période</th>
                        <th colspan="2"> Mouvements en cours de la période </th>
                        <th colspan="2">Solde à la fin de la période</th>
                    </tr>
                    <tr>
                        <th>Débit</th>
                        <th>Crédit</th>
                        <th>Débit</th>
                        <th>Crédit</th>
                        <th>Débit</th>
                        <th>Crédit</th>
                    </tr>
                </thead>
                <tr v-for="(balance, index) in balances.balance" :key="index">
                    <td>{{ balance.classe_principale }}</td>
                    <td>{{ money(balance.tot_debit_before) }}</td>
                    <td>{{ money(balance.tot_credit_before) }}</td>
                    <td>{{ money(balance.tot_debit_during) }}</td>
                    <td>{{ money(balance.tot_credit_during) }}</td>
                    <td>{{ money(balance.tot_debit_after) }}</td>
                    <td>{{ money(balance.tot_credit_after) }}</td>
                </tr>
                <tr class="title">
                    <td  >Totaux</td> 
                    <td> {{ money(balances.total_debits_before) }}</td>
                    <td> {{ money(balances.total_credits_before) }}</td>
                    <td> {{ money(balances.total_debits_during) }}</td>
                    <td> {{ money(balances.total_credits_during) }}</td>
                    <td> {{ money(balances.total_debits_after) }}</td>
                    <td> {{ money(balances.total_credits_after) }}</td>
                </tr>
            </table>
        </section>
        <br>
    </div>
</template>

<script>
import Account from '@/components/account.vue';
import Navbar from '@/components/Navbar.vue';
import Modal from '@/Overlays/Modal.vue';

export default {
    data() {
        return {
            balances: [],
            start: '',
            end: '',
            answer: false,
            show_modal: true,
            is_loading: false,
            data_error: {}
        }
    },
    components: {
        Navbar,
        Modal,
        Account
    },
    methods: {
        closeModal() {
            this.show_modal = false
            this.start = ''
            this.end = ''
        },
        getBalances() {
            axios.get(`balance-general/?start_date=${this.start}&end_date=${this.end}`)
                .then((response) => {
                    this.balances = response.data
                    this.answer = true
                    this.closeModal()
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error,()=> this.getBalances(start, end))
                    this.data_error = error.response?.data
                })
        }
    }
}
</script>


<style scoped>
th{
    text-align: center;
    border-left: 1px solid;
    padding: 5px;
}
td{
    text-align: right;
    border-right: 1px solid;
}
tr:nth-child(1){
    position:relative
}
</style>