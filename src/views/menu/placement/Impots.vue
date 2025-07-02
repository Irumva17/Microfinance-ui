<template>
    <Navbar />
    <div class="container">
        <div class="row">
            <div class="btn retour" @click="goBack">&#10094;</div>
            {{ $route.params.compte }}
        </div>
        <section class="table">
            <table>
                <tr>
                    <th>Date</th>
                    <th>Montant</th>
                    <th>Details</th>
                </tr>
                <tr v-for="client in impots_placements" :key="client.id">
                    <td>{{ datetime(client.date) }}</td>
                    <td>{{ money(client.montant) }}</td>
                    <td>{{ client.details }}</td>
                </tr>
                <tr v-if="!impots_placements">Pas de resultat</tr>
            </table>
        </section>
    </div>
</template>

<script>

import Navbar from '@/components/Navbar.vue'

export default {
    data() {
        return {
            impots_placements: [],
        }
    },
    components: {
        Navbar
    },
    methods: {
        async getImpots() {
            await axios.get(`impotsPlacement/?compte__numero=${this.$route.params.compte}`)
                .then((response) => {
                    this.impots_placements = response.data.results
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getImpots)
                })
        }
    },
    mounted() {
        this.getImpots();
    }
}
</script>
<style></style>