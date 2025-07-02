<template>
    <Navbar />
    <div class="container">
        <section class="table">
            <table>
                <tr>
                    <th>Id</th>
                    <th>Numero</th>
                    <th>Rubrique</th>
                    <th>Anneé</th>
                    <th>Montant (N)</th>
                    <th>Ancien montant (N-1)</th>
                </tr>
                <tr v-for="item in produits" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.numero }}</td>
                    <td>{{ item.rubrique }}</td>
                    <td>{{ datetime(item.annee) }}</td>
                    <td>{{ money(item.montant) }}</td>
                    <td>{{ money(item.ancien_montant) }}</td>
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
            item: [],
            produits:'',
        }
    },
    components: {
        Navbar,
    },
    methods: {
        gettresor() {
            axios
                .get('Flux-tresorerie/')
                .then((reponse) =>{
                    this.produits = reponse.data
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.gettresor)
                })
        }
    },
    mounted(){
        this.gettresor();
    }
}
</script>
<style></style>