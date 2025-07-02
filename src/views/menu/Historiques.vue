<template>
    <Navbar />
    <div class="container">
        <div class="btn-headers">
            <button class="btn retour" @click="goBack">&#10094;</button>
            <div class="row">
                <div class="row">
                    <label>Du: </label>
                    <input type="date" class="input-historique" v-model="age_superieur">
                </div>
                <div class="row">
                    <label>Au: </label>
                    <input type="date" class="input-historique" v-model="age_inferieur">
                </div>
                <button class="btn" @click="getfiltre">Filtrer</button>
            </div>
        </div>
        <section class="table">
            <table>
                <tr>
                    <th>Id</th>
                    <th>Heure</th>
                    <th>Action</th>
                    <th>Débiter</th>
                    <th>Créditer</th>
                    <th>Montant</th>
                    <th>Balance</th>
                </tr>
                <tr v-for="(history,index) in historiques" :key="history.id">
                    <td>{{ history.id }}</td>
                    <td>{{ datetime(history.date) }}</td>
                    <td>{{ history.action }}</td>
                    <td>{{ money(history?.debit) || '-' }}</td>
                    <td>{{ money(history?.credit) || '-'}}</td>
                    <td :class="getMontantClass(index , history.balance)">{{ money(history.montant) }}</td>
                    <td>{{ money(history.balance) }}</td>
                </tr>
            </table>
        </section>
    </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import SearchComponent from '@/components/SearchComponent.vue';

export default {
    data() {
        return {
            historiques: [],
            users: [],
            age_inferieur: '',
            age_superieur: ''
        };
    },
    components: {
        Navbar, SearchComponent
    },
    methods: {

        getHistoriques(id) {
            axios.get(`historiqueAgence/?agence=${id}`)
                .then((response) => {
                    this.historiques = response.data.results;
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getHistoriques);
                })
        },
        getUsers() {
            axios.get('users/')
                .then((response) => {
                    this.users = response.data.results;
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getUsers);
                });
        },
        getfiltre() {
            if(!this.age_superieur || !this.age_inferieur) {
                this.$store.commit('setError', 'Veuillez remplir les deux dates');
                return;
            }
            axios.get(`historiqueAgence/?created_by=${this.$route.params.id}&date__gte=${this.age_superieur}&date__lte=${this.age_inferieur}`)
                .then((reponse) => {
                    this.historiques = reponse.data.results
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getfiltre);
                })
        },
        getMontantClass(index, balance) {
            const PreviousBalance = this.historiques[index + 1]?.balance;
            const ecart =  balance - PreviousBalance

            if (ecart < 0) {
                this.historiques[index].debit = ecart
                return 'decrease';
            } else if (ecart > 0) {
                this.historiques[index].credit = ecart
                return 'increase'; 
            }
        },
},
mounted() {
    this.getHistoriques(this.$route.params.id);
    this.getUsers();
}
}
</script>

<style >

</style>
