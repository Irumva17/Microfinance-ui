<template>
    <Navbar />
    <div class="container">
        <div class="btns">
            <div class="btn retour" @click="goBack">&#10094;</div>
        </div>
        <section class="table">
            <table>
                    <tr>
                        <th>Date</th>
                        <th>Montant</th>
                        <th>Details</th>
                    </tr>
                    <tr v-for="client in interetclients" :key="client.id">
                        <td>{{ datetime(client.date) }}</td>
                        <td>{{ money(client.montant) }}</td>
                        <td>{{ client.details }}</td>
                    </tr>
                    <tr v-if="!interetclients">Pas de resultat</tr>
            </table>
        </section>
    </div>
</template>

<script>

import Navbar from '@/components/Navbar.vue'

export default {
    data() {
        return {
            interetclients: [],
        }
    },
    components: {
        Navbar
    },
    methods: {
        async getInteret() {
            
            await axios.get(`interetclientplacements/?compte__numero=${this.$route.query.placement_numero}`)
                .then((response) => {
                    this.interetclients = response.data.results
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getInteret)
                })
        }
    },
    mounted() {
        this.getInteret();
    }
}
</script>
<style></style>