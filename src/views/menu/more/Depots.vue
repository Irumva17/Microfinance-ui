<template>
    <Navbar class="not_printable" />
    <div class="printable" v-if="itemToPrint">
        <PrintDepot :item="itemToPrint" class="printable" />
    </div>
    <div class="container not_printable" >
        <div class="btns">
            <button class="btn retour" @click="goBack">&#10094;</button>
        </div>
        <section class="table">
            <table>
                <tr>
                    <th>Id</th>
                    <th>Montant</th>
                    <th>Details</th>
                    <th>Motif(Source)</th>
                    <th>Date</th>
                    <th>Fait par</th>
                    <th>Options</th>
                </tr>
                <tr v-for="(item, index) in list" :key="index">
                    <td>{{ item.id }}</td>
                    <td>{{ money(item.montant) }}</td>
                    <td>{{ item.details }}</td>
                    <td>{{ item.motif }}</td>
                    <td>{{ datetime(item.created_at) }}</td>
                    <td>{{ item.created_by }}</td>
                    <td>
                        <button class="btn" @click="printDepot(item)">
                            <i class="fa-solid fa-print"></i>
                            Imprimer
                        </button>
                        <button 
                            @click="handleDelete(credit.id)" 
                            class="btn delete"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            </table>
        </section>

    </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import PrintDepot from '@/services/PrintDepot.vue';
export default {
    data() {
        return {
            list: [],
            itemToPrint: null,
        }
    },
    components: {
        Navbar, PrintDepot
    },
    methods: {
        printDepot(depot){
            this.itemToPrint = depot;
            this.$nextTick(() => {
                window.print();
                this.itemToPrint = null;
            });
        },
        async handleDelete(id) {
            const confirmation = confirm(`Vous voulez vraiment supprimer ce depot?`)
            if (confirmation) {
                try {
                    await axios.delete(`depots/${id}/`);
                    this.list = this.list.filter((item) => item.id != id);
                    this.$store.state.message.success = 'Supprimés avec succès.'
                } catch (error) {
                    this.displayErrorOrRefreshToken(error,() => this.handleDelete(id))
                }
            }
        },
        getItems() {
            const account = parseInt(this.$route.params.compte)
            axios.get(`depots/?compte=${account}`)
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