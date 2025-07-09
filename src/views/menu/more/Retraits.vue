<template>
    <Navbar class="not_printable" />
    <div class="container not_printable" >
        <div class="btns">
            <button class="btn retour" @click="goBack">&#10094;</button>
        </div>
        <section class="table">
            <table>
                <tr>
                    <th>Id</th>
                    <th>Nom</th>
                    <th>Telephone</th>
                    <th>Montant</th>
                    <th>Motif</th>
                    <th>Date</th>
                    <th>Fait par</th>
                </tr>
                <tr v-for="(item, index) in list" :key="index">
                    <td>{{ item.id }}</td>
                    <td>{{ item.nom }}</td>
                    <td>{{ item.telephone }}</td>
                    <td>{{ money(item.montant) }}</td>
                    <td>{{ item.details }}</td>
                    <td>{{ datetime(item.created_at) }}</td>
                    <td>{{ item.created_by }}</td>
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
            list: [],
            itemToPrint: null,
        }
    },
    components: {
        Navbar
    },
    methods: {
        printDepot(depot){
            this.itemToPrint = depot;
            this.$nextTick(() => {
                window.print();
                this.itemToPrint = null;
            });
        },
        getItems() {
            const account = parseInt(this.$route.params.compte)
            axios.get(`retraits/?compte=${account}`)
                .then((reponse) => {
                    this.list = reponse.data.results
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getItems)
                })
        },
    },
    mounted() {
        this.getItems();
    }
}
</script>