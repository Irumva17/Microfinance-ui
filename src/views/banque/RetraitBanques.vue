<template>
    <Navbar />
    <Modal :isVisible="show_modal" @close="closeModal">
        <form class="form" @submit.prevent="AjouterRetraitBanque">
            <span class="title">Retrait</span>
            <div class="content">
                <label>Référence</label>
                <input type="text" v-model="bordereau">
                <small v-for="err in data_error?.bordereau" :key="err.id">
                    {{ err }}
                </small>
                <label>Montant</label>
                <input type="number" v-model="montant">
                <small v-for="err in data_error?.montant" :key="err.id">
                    {{ err }}
                </small>
                <label>Motif</label>
                <input type="text" v-model="motif">
                <small v-for="err in data_error?.motif" :key="err.id">
                    {{ err }}
                </small>
                <!-- <label>Banque</label>
                {{this.comptes}}
                <select v-model="banque">
                    <option v-for="compte in comptes" :key="compte.id" :value="compte.id">{{ compte.banque }}</option>
                </select>
                <small v-for="err in data_error?.banque" :key="err.id">
                    {{ err }}
                </small> -->
            </div>
            <button class="btn-modal" type="submit">Retrait {{ money(montant) }}</button>
        </form>
    </Modal>
    <Modal :isVisible="show_flitre" @close="closeModal">
        <div class="form">
            <span class="title">Filtrage</span>
            <div class="content">
                <label for="">Banque</label>
                <select v-model="Banq">
                    <option value="">---------</option>
                    <option v-for="baq in banque" :key="baq.id" :value="baq.id"> {{ baq.banque }} avec compte {{
                        baq.compte }}</option>
                </select>
                <div class="inputRow">
                    <input type="date" v-model="date_fin" />
                    <input type="date" v-model="date_debut" />
                </div>
            </div>
            <button class="btn-modal" @click="searchGet">Filtrer</button>
        </div>
    </Modal>
    <div class="container">
        <div class="subMenu-headers">
            <div class="row">
                <button class="btn retour" @click="goBack">&#10094;</button>
                <button class="btn" v-if="choosed_account" @click="show_modal = true">
                    <i class="fa-solid fa-plus"></i> Ajouter
                </button>
            </div>
            <div class="row">
                <button class="btn" @click="show_flitre = true">Filtrer</button>
                <SearchComponent :search-function="searchLasta" />
            </div>
        </div>
        <section class="table">
            <table>
                <tr>
                    <th>Bordereau</th>
                    <th>Montant</th>
                    <th>Motif</th>
                    <th>Banque</th>
                </tr>
                <tr v-for="item in retraitbanques" :key="item.id">
                    <td>{{ item.bordereau }}</td>
                    <td>{{ money(item.montant) }}</td>
                    <td>{{ item.motif }}</td>
                    <td>{{ item.banque.banque }}</td>
                </tr>
            </table>
        </section>
    </div>
</template>
<script>
import Modal from '@/Overlays/Modal.vue';
import Navbar from '@/components/Navbar.vue';
import SearchComponent from '@/components/SearchComponent.vue';

export default {
    data() {
        return {
            show_modal: false,
            show_flitre: false,
            retraitbanques: [],
            bordereau: '',
            montant: null,
            motif: '',
            date_fin: '',
            date_debut: '',
            Banq: '',
            banque: '',
            choosed_account: parseInt(this.$route.query.id) || '',
            data_error: {},
            comptes: []
        }
    },
    components: {
        Navbar, Modal, SearchComponent
    },
    methods: {
        async getRetraitBanques(of = 1, retraitbanques = []) {
            await axios.get(`retraitbanques/${this.$route.query.id ? '?banque=' + parseInt(this.$route.query.id) : `?page=${of}`}`)
                .then((response) => {
                    const data = response.data
                    data.next ? (
                        retraitbanques = retraitbanques.concat(data.results),
                        this.getRetraitBanques(of + 1, retraitbanques)
                    ) : this.retraitbanques = retraitbanques.concat(data.results)
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getRetraitBanques)
                })
        },
        closeModal() {
            this.show_modal = false;
            this.show_flitre = false;
            this.bordereau = '';
            this.montant = '';
            this.motif = '';
            this.banque = ''
        },
        // getChoices() {
        //     axios.options('retraitbanques/')
        //         .then((reponse) => this.comptes = reponse.data.actions.POST.Banque.choices, this. getRetraitBanques())
        //         .catch((error) => this.displayErrorOrRefreshToken(error, this.getRetraitBanques()))
        // },
        getChoices() {
            axios.options('retraitbanques/')
                .then((response) => {
                    console.log("Réponse complète :", response.data);

                    if (response.data?.actions?.POST?.Banque?.choices) {
                        this.comptes = response.data.actions.POST.Banque.choices;
                        this.getRetraitBanques();
                    } else {
                        console.warn("Les choix des banques ne sont pas disponibles.");
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des choix :", error);
                    this.displayErrorOrRefreshToken(error, this.getChoices);
                });
        },

        async AjouterRetraitBanque() {
            const form = new FormData();

            form.append('bordereau', this.bordereau)
            form.append('montant', this.montant)
            form.append('motif', this.motif)
            form.append('banque', this.choosed_account)

            await axios.post('retraitbanques/', form)
                .then((response) => {
                    this.retraitbanques.unshift(response.data)
                    this.$store.state.message.success = 'Vous avez retiré avec succès.'
                    this.closeModal()
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.AjouterRetraitBanque)
                    this.data_error = error.response?.data
                })
        },
    },
    mounted() {
        this.getRetraitBanques();
        this.getChoices()
        // this.getBanque()
    }
}
</script>

<style></style>