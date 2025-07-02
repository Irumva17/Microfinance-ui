<template>
    <Navbar />
    <Modal :isVisible="show_modal" @close="closing">
        <div class="form">
            <div class="content">
                <span class="title">Virement Permanent</span>
                <label for="type_compte">Type de compte arrivée</label>
                <select name="type_compte" v-model="type_de_compte">
                    <option value="" disabled>Veuillez choisir</option>
                    <option value="compte_interne">Compte interne</option>
                    <option value="compte_externe">Compte externe</option>
                </select>
                <span v-if="type_de_compte != ''">Compte arrivée</span>
                <SearchCompte v-if="type_de_compte === 'compte_interne'" @compte="add_account" />
                <input v-else-if="type_de_compte === 'compte_externe'" type="text" v-model="compte"
                    placeholder="Compte arrivée externe">
                <small v-for="err in data_error?.compte_arrivee" :key="err.id">
                    {{ err }}
                </small>
                <span v-if="type_de_compte === 'compte_externe'">Compte bancaire</span>
                <SearchCompte v-if="type_de_compte === 'compte_externe'" search_for='banque' @compte="add_account" />
                <small v-for="err in data_error?.banque" :key="err.id">
                    {{ err }}
                </small>
                <label>Date</label>
                <input type="date" v-model="date_virement">
                <small v-for="err in data_error?.date_virement" :key="err.id">
                    {{ err }}
                </small>
                <label>Montant</label>
                <input type="number" v-model="montant" placeholder="Montant">
                <small v-for="err in data_error?.montant" :key="err.id">
                    {{ err }}
                </small>
                <label>Motif</label>
                <input type="text" v-model="details" placeholder="Motif">
                <small v-for="err in data_error?.motif" :key="err.id">
                    {{ err }}
                </small>
            </div>
            <button class="btn-modal" @click="handleVirementPermanent(type_de_compte)">Virement {{ money(montant) }}</button>
        </div>
    </Modal>
    <div class="container">
        <div class="btns">
            <button class="btn retour" @click="goBack">&#10094;</button>
            <button class="btn" @click="show_modal = true"><i class="fa-solid fa-plus"></i> Ajouter</button>
        </div>
        <section class="table">
            <table>
                <tr>
                    <th>Id</th>
                    <th>Type</th>
                    <th>Compte Depart</th>
                    <th>Compte Arrivée</th>
                    <th>Banque</th>
                    <th>Montant</th>
                    <th>Motif</th>
                    <th>Date virement</th>
                    <th>Date</th>
                    <th>Fait par</th>
                    <th>Options</th>
                </tr>
                <tr v-for="(item, index) in list" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.type_compte_arrivee === "compte_interne" ? 'Interne' : 'Externe' }}</td>
                    <td>{{ item.compte_depart }}</td>
                    <td>{{ item.compte_arrivee_interne || item.compte_arrivee_externe }}</td>
                    <td>{{ item.banque ? item.banque : '-' }}</td>
                    <td>{{ money(item.montant) }}</td>
                    <td>{{ item.motif }}</td>
                    <td>{{ item.date_virement }}</td>
                    <td>{{ datetime(item.created_at) }}</td>
                    <td>{{ item.created_by }}</td>
                    <td>
                        <button v-if="item.is_active" class="btn delete" @click="getDesactive(item.id, index)"><i class="fa-solid fa-power-off"></i></button>
                        <span v-else class="desactiveted">&times;</span>
                    </td>
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
            montant: 0,
            motif: '',
            list: [],
            type_de_compte: "",
            compte: "",
            date_virement: "",
            montant: null,
            details: "",
            data_error: "",
            compte_arrivee: '',
            banque: '',
            date_virement: '',
            motif: '',
            got_bank_account: '',
            got_internal_account: '',
            banque: '',
        }
    },
    components: {
        Navbar, Modal, SearchCompte
    },
    methods: {
        closing() {
            this.montant = '';
            this.motif = '';
            this.show_modal = false;
            this.type_de_compte = "",
            this.compte = "",
            this.date_virement = "",
            this.montant = null,
            this.details = "",
            this.data_error = "",
            this.compte_arrivee = '',
            this.banque = '',
            this.date_virement = '',
            this.motif = '',
            this.got_bank_account = '',
            this.got_internal_account = '',
            this.banque = ''
        },
        getDesactive(id, index){
            axios.get(`virementpermanents/${id}/desactiver_virement/`)
                .then(() => {
                    this.list[index].is_active = false
                    this.$store.state.message.success = `Virement désactivé avec success!`
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getDesactive)
                })
        },
        getVirements() {
            axios.get(`virementpermanents/`)
                .then((reponse) => {
                    this.list = reponse.data.results
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getVirements)
                })
        },

        async handleVirementPermanent(type_de_compte) {
            const data = new FormData();
            data.append('type_compte_arrivee', type_de_compte)
            data.append('compte_depart', this.$route.params.id)
            data.append('montant', this.montant)
            data.append('motif', this.details)
            data.append('date_virement', this.date_virement)
            type_de_compte === 'compte_externe' && (
                data.append('banque', this.got_bank_account),
                data.append('compte_arrivee_externe', this.compte),
                data.append('compte_arrivee_interne', '')
            )
            type_de_compte === 'compte_interne' && (
                data.append('banque', ''),
                data.append('compte_arrivee_externe', ''),
                data.append('compte_arrivee_interne', this.compte)
            )

            try {
                const response = await axios.post('virementpermanents/', data);
                this.$store.state.message.success = `Virement de ${response.data.montant} effectué avec success!`
                this.list.unshift(response.data)
                this.closing()
            } catch (error) {
                this.data_error = error?.response?.data
                this.displayErrorOrRefreshToken(error, () => this.handleVirementPermanent(type_de_compte))
            }
        },
    },
    mounted() {
        this.getVirements();
    }
}
</script>

<style scoped>
    .desactiveted {
        padding:0 10px;
        color: red;
        font-size: 20px;
    }
    tr:not(:has(button.delete)) {
        background-color: #f8d7da;
    }
</style>
