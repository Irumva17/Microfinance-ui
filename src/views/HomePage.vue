<template>
    <Navbar />
    <!-- <Modal :isVisible="show_modal" @close="show_modal = false">
        <div class="form">
            <span class="titre">Filtre</span>
            <DateFilter flex-direction="column"/>
        </div>
    </Modal> -->
    <div class="container">
        <!-- <div class="subMenu-headers"> -->
            <div class="subMenu-headers">
                <span class="title" v-if="user.agence">AGENCE : {{ user.agence.nom }}</span>
            <span class="title" v-if="user.agence">Balance : {{ money(balances?.balance) }} Fbu</span>
            </div>
            
            <!-- <button class="btn" @click="show_modal = true">
                <i class="fa-solid fa-filter"></i> &nbsp;
                Filtrer
            </button>
        </div> -->
        <!-- <div class="accounts">
            <Account account_name="Balance Agence" :account_money="balances?.balance" />
            <Account account_name="Retraits Journalières" :account_money="retraits_journalier" />
            <Account account_name="Depots Journalières" :account_money="depots_journalier" />
            <Account account_name="Situations Journalière" :account_money="situation_journaliere" />
        </div> -->
        <Agences />
    </div>
</template>

<script>
// import Modal from '@/Overlays/Modal.vue';
// import DateFilter from '@/components/dateFilter.vue';
import Navbar from '@/components/Navbar.vue';
import Account from '@/components/account.vue';
import Agences from '@/components/permissions/agences.vue';
export default {
    data() {
        return {
            // show_modal: false,
            balances: 0,
            balance_personnel: 0,
            depots_journalier: 0,
            retraits_journalier: 0,
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
        situation_journaliere() {
            return this.balances?.balance + this.depots_journalier - this.retraits_journalier
        }
    },
    components: {
        Navbar,
        Account,
        Agences,
        // DateFilter,
        // Modal
    },
    methods: {
        getStates() {
            axios.get(`agences/${this.user.agence.id}/`)
                .then(response => {
                    this.balances = response.data;
                }).catch(error => this.displayErrorOrRefreshToken(error, this.getStates));
        },
        getDepots() {
            axios.get('depots/')
                .then((response) => {
                    this.depots_journalier = response.data?.totals?.montant_deposer_par_jour
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getDepots)
                })
        },
        getRetraits() {
            axios.get('retraits/')
                .then((response) => {
                    this.retraits_journalier = response.data?.totals?.montant_retirer_par_jour || 0
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getRetraits)
                })
        }
    },
    created() {
        this.getStates()
        this.getDepots()
        this.getRetraits()
    }
}
</script>