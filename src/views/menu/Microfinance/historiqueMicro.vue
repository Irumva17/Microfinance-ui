<template>
    <Navbar />
    <div class="container">
        <section class="table">
            <table>
                <tr>
                    <th>Id</th>
                    <th>Action</th>
                    <th>Montant</th>
                    <th>Balance</th>
                    <th>Date de création</th>
                    <th>Débiter</th>
                    <th>Créditer</th>
                    <th>créer par</th>
                    <!-- <th>Microfinance</th> -->
                </tr>
                <tr v-for="(histo , index) in historique" :key="histo.id">
                    <td>{{ histo.id }}</td>
                    <td>{{ histo.action }}</td>
                    <td :class="getMontantClass(index , histo.balance)">{{ money(histo.montant)}}</td>
                    <td>{{ money(histo.balance) }}</td>
                    <td>{{ datetime(histo.date) }}</td>
                    <td>{{ money(histo?.debit) || '-' }}</td>
                    <td>{{ money(histo?.credit) || '-'}}</td>
                    <td>{{ histo.created_by }}</td>
                    <!-- <td>{{ histo.microfinance }}</td> -->
                </tr>
            </table>
        </section>
    </div>
</template>
<script>
import Navbar from '@/components/Navbar.vue';
export default {
    data() {
        return {
            historique:[],
            histo:[]
        }
    },
    components: {
        Navbar
    },
    methods: {
        getHistorique() {
            axios.get('historiqueMicrofinances/')
                .then((reponse) => {
                    this.historique = reponse.data.results
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getHistorique);
                })
        },
        getMontantClass(index, balance) {
            const PreviousBalance = this.historique[index + 1]?.balance;
            const ecart =  balance - PreviousBalance

            if (ecart < 0) {
                this.historique[index].debit = ecart
            } else if (ecart > 0) {
                this.historique[index].credit = ecart
            }
        },
    },
    mounted() {
        this.getHistorique()
    }
}
</script>