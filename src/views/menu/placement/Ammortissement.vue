<template>
    <Navbar class="not_printable" />
    <Print_header title='Ammortissement Placements' />
    <div class="container">
        <div class="btn-headers not_printable">
            <div class="btn retour" @click="goBack">&#10094;</div>
            <div class="row">
                <DateFilter ref="dates" :flex-direction="'row'" />
                <div class="btn" @click="getAmortissemts">Filter</div>
                <div class="btn"  @click="printer()">
                    <i class="fa-solid fa-print"></i> &nbsp;
                    Imprimer
                </div>
            </div>
        </div>
        <section class="table">
            <table>
                <tr>
                    <th>Date et Heure</th>
                    <th>Echeance</th>
                    <th>Montant</th>
                    <th>Interet</th>
                    <th>Impots</th>
                </tr>
                <tr v-for="client in ammortissements" :key="client.id">
                    <td>{{ datetime(client.date) }}</td>
                    <td>{{ client.echeance }}</td>
                    <td>{{ money(client.montant) }}</td>
                    <td>{{ money(client.interet) }}</td>
                    <td>{{ money(client.impots) }}</td>
                </tr>
            </table>
        </section>
        <Printed_by />
    </div>
</template>

<script>

import DateFilter from '@/components/dateFilter.vue';
import Navbar from '@/components/Navbar.vue'
import Print_header from '@/services/print_header.vue';
import Printed_by from '@/services/Printed_by.vue';

export default {
    data() {
        return {
            ammortissements: [],
        }
    },
    components: {
        Navbar, DateFilter, Print_header,Printed_by
    },
    methods: {
        printer(){
            if(!this.ammortissements.length){
                alert("Aucun ammortissement à  imprimer")
                return
            } 
            print()
        },
        async getAmortissemts() {
            const placementID = parseInt(this.$route.query.placement_id);
            await axios.get(`ammortissementplacements/?placement__id=${placementID}&date__gte=${this.$refs.dates.to}&date__lte=${this.$refs.dates.from}&done=&placement__compte__numero=`)
                .then((response) => {
                    this.ammortissements = response.data.results
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getAmortissemts)
                })
        }
    },
    mounted() {
        this.getAmortissemts();
    }
}
</script>