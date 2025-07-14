<template>
    <Navbar />
    <div class="container">
        <div class="btn-headers">
            <button class="btn retour" @click="goBack">&#10094;</button>
            <div class="row">
                <DateFilter ref="dates" />
                <button class="btn" @click="getHistoriques">Filtrer</button>
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
                    <th>Balance</th>
                </tr>
                <tr v-for="(history, index) in historiques" :key="history.id">
                    <td>{{ history.id }}</td>
                    <td>{{ datetime(history.date) }}</td>
                    <td>{{ history.action }}</td>
                    <td>{{ history.montant < 0 ? money(history.montant * -1) : '-' }}</td>
                    <td>{{ history.montant > 0 ? money(history.montant) : '-' }}</td>
                    <td>{{ money(history.balance) }}</td>
                </tr>
            </table>
        </section>
    </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import SearchComponent from '@/components/SearchComponent.vue';
import DateFilter from '@/components/dateFilter.vue';

export default {
    data() {
        return {
            historiques: [],
        };
    },
    components: {
        Navbar, SearchComponent, DateFilter
    },
    methods: {
        getHistoriques() {
            let from = this.$refs.dates.from
            let to = this.$refs.dates.to
            axios.get(
                `historiqueAgence/?created_by=${this.$route.params.id}&date__gte=${from}&date__lte=${to}`
            ).then((reponse) => {
                this.historiques = reponse.data.results
            }).catch((error) => {
                this.displayErrorOrRefreshToken(error, this.getHistoriques);
            })
        },
    },
    mounted() {
        this.getHistoriques();
    }
}
</script>

<style></style>
