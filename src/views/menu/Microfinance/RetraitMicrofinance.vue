<template>
    <Navbar />
    <Modal :isVisible="show_modal" @close="closing">
        <form class="form" @submit.prevent="">
            <span class="title"> Retrait Microfinance</span>
            <div class="content">
                <label>Banque:</label>
                <SearchCompte search_for='banque' @compte="add_account" />
                <small v-for="err in data_error?.banque" :key="err.id">
                    {{ err }}
                </small>
                <label>Numero de reference:</label>
                <input type="text" placeholder="explication de l'action" v-model="ref_number">
                <small v-for="err in data_error?.ref_number" :key="err.id">
                    {{ err }}
                </small>
                <label>Montant:</label>
                <input type="number" placeholder="Montant" v-model="montant">
                <small v-for="err in data_error?.montant" :key="err.id">
                    {{ err }}
                </small>
                <small v-for="err in data_error?.details" :key="err.id">
                    {{ err }}
                </small>
                <label for="document">Motif:</label>
                <input type="file" id="document" @change="handleFileUpload($event, 'document')" required>
            </div>
            <button class="btn-modal" @click="postRetrait">Creer {{ money(montant) }} </button>
        </form>
    </Modal>
    <!-- <Modal :isVisible="show_debut" @close="closing">
        <div class="form">
            <span class="title">Ajouter un debuteur</span>
            <div class="content">
                <label for="nom_debuteur">Nom d'un debuteur:</label>
                <input type="text" placeholder="Nom du debuteur" v-model="nom_debiteur" name="nom_debuteur">
                <small v-for="err in data_error?.nom_debiteur" :key="err.id">
                    {{ err }}
                </small>
                <label for="dossier">Dossier:</label>
                <input type="file" placeholder="explication de l'action" @change="handleFileUpload($event, 'document')" name="dossier">
                <small v-for="err in data_error?.document" :key="err.id">
                    {{ err }}
                </small>
            </div>
            <button class="btn-modal" @click="addDebuteur">Creer {{ money(montant) }} </button>
        </div>
    </Modal> -->

    <div class="container">
        <div class="btns">
            <button class="btn retour" @click="goBack">&#10094;</button>
            <button class="btn"@click="show_modal = true"><i class="fa-solid fa-plus"></i> Ajouter</button>
        </div>
        <section class="table">
            <table>
                <tr>
                    <th>Id</th>
                    <th>Montant</th>
                    <th>Motif</th>
                    <th>Nom debuteur</th>
                    <th>Date</th>
                    <th>Fait par</th>
                    <th>Dossier</th>
                    <!-- <th>Options</th> -->
                </tr>
                <tr v-for="item in list" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ money(item.montant) }}</td>
                    <td>{{ item.details }}</td>
                    <td>{{ item.nom_debiteur || '-' }}</td>
                    <td>{{ datetime(item.created_at) }}</td>
                    <td>{{ item.created_by }}</td>
                    <td>
                        <a :href="item.document" target="_blank" v-if="item.document" class="btn"><i class="fa-solid fa-eye"></i> &nbsp; Voir</a>
                        <span v-else>-</span>
                    </td>
                    <!-- <td>
                        <button class="btn" @click="show_debut = true, retrait_id = item.id"><i class="fa-solid fa-plus"></i>&nbsp; Ajouter un debuteur</button>
                    </td> -->
                </tr>
            </table>
        </section>

    </div>
</template>

<script>
import Modal from '@/Overlays/Modal.vue';
import Navbar from '@/components/Navbar.vue';
import SearchCompte from '@/components/SearchCompte.vue';

export default {
    data() {
        return {
            show_modal: false,
            show_debut: false,
            montant: 0,
            nom_debiteur: '',
            motif: '',
            ref_number: '',
            got_bank_account: '',
            document: null,
            list: [],
            document : null,
            retrait_id : '',
            data_error: {}
        }
    },
    components: {
        Navbar, Modal, SearchCompte
    },
    methods: {
        closing() {
            this.show_modal = false;
            this.show_debut = false;
            this.montant = 0;
            this.motif = '';
            this.nom_debiteur = '';
            this.document = '';
            this.retrait_id = '';
            this.ref_number = ''
            this.got_bank_account = ''
            this.data_error = {}
        },
        getdepot() {
            axios.get('retraitmicrofinance/')
                .then((reponse) => {
                    this.list = reponse.data.results
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getdepot)
                })
        },
        // addDebuteur() {
        //     const data = new FormData();
        //     data.append("nom_debiteur", this.nom_debiteur)
        //     data.append("document", this.document)

        //     axios.post(`retraitmicrofinance/${this.retrait_id}/add-debiteur/`, data)
        //         .then((reponse) => {
        //             this.$store.state.message.success = "Ajouté avec succès.";
        //             this.list = this.list.map((item) => {
        //                 if (item.id === this.retrait_id) {
        //                     return { ...item, ...reponse.data }
        //                 }
        //                 return item
        //             })
        //             this.closing()
        //         }).catch((error) => {
        //             this.data_error = error?.response?.data
        //             this.displayErrorOrRefreshToken(error, this.addDebuteur);
        //         });
        // },
        postRetrait() {
            const data = new FormData();
            data.append("montant", this.montant);
            data.append("details", this.motif);
            data.append("ref_number", this.ref_number);
            data.append("banque", this.got_bank_account);
            data.append("document", this.document);

            axios.post('retraitmicrofinance/', data)
                .then((reponse) => {
                    this.$store.state.message.success = "Retiré avec succès.";
                    this.list.unshift(reponse.data)
                    this.closing()
                }).catch((error) => {
                    this.data_error = error?.response?.data
                    this.displayErrorOrRefreshToken(error, this.postRetrait);
                });
        },
    },
    mounted() {
        this.getdepot();
    }
}
</script>
<style scoped>
    a.btn{
        display: inline-block;
        text-decoration: none !important;
        min-width: max-content !important;
    }
</style>