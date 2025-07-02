<template>
    <Navbar />
    <Modal :isVisible="show_rembourssement" @close="closing">
        <div class="form">
            <span class="title">Rembourssement <br> du crédit {{ id }}</span>
            <div class="content">
                <label for="num">Numero de référence:</label>
                <input type="text" id="num" placeholder="Numero de référence" v-model="credit.ref_number">
                <small v-for="err in data_error?.ref_number" :key="err.id">
                    {{ err }}
                </small>
                <label for="montant">Montant payée:</label>
                <input type="number" id="montant" placeholder="Montant" v-model="credit.montant">
                <small v-for="err in data_error?.montant" :key="err.id">
                    {{ err }}
                </small>
                <label for="date">Date:</label>
                <input type="date" id="date" v-model="date">
                <small v-for="err in data_error?.date" :key="err.id">
                    {{ err }}
                </small>
            </div>
            <button class="btn-modal" @click="nouveauxRembourssements">Remboursser {{ money(credit.montant) }} </button>
        </div>
    </Modal>
    <Modal :isVisible="show_flitre" @close="closing">
        <div class="form">
            <span class="title">Filtrage</span>
            <div class="content">
                <label for="">Banque</label>
                <select v-model="Banq">
                    <option value="">---------</option>
                <option v-for="baq in banque" :key="baq.id" :value="baq.id"> {{ baq.banque }} avec compte {{ baq.compte }}</option>
                </select>
                <label for="">Date de création :</label>
                <div class="inputRow">
                    <input type="date" v-model="date_fin" />
                    <input type="date" v-model="date_debut" />
                </div>
            </div>
            <button class="btn-modal" @click="searchGet">Filtrer</button>
        </div>
    </Modal>
    <Modal :isVisible="show_modal" @close="closing">
        <div class="form">
            <span class="title">Nouveau Crédit</span>
            <div class="content">
                <label for="num">Numero de référence:</label>
                <input type="text" id="num" placeholder="Numero de référence" v-model="credit.ref_number">
                <small v-for="err in data_error?.ref_number" :key="err.id">
                    {{ err }}
                </small>
                <label for="montant">Montant:</label>
                <input type="number" id="montant" placeholder="Montant" v-model="credit.montant">
                <small v-for="err in data_error?.montant" :key="err.id">
                    {{ err }}
                </small>
                <label for="interet">Interet:</label>
                <input type="number" id="interet" placeholder="Interet" v-model="credit.interet">
                <small v-for="err in data_error?.interet" :key="err.id">
                    {{ err }}
                </small>
                <label for="motif">Motif:</label>
                <input type="text" id="motif" placeholder="Motif" v-model="credit.motif">
                <small v-for="err in data_error?.motif" :key="err.id">
                    {{ err }}
                </small>
                <label for="periode">Période:</label>
                <input type="number" id="periode" placeholder="Période (Mois)" v-model="credit.periode">
                <small v-for="err in data_error?.periode" :key="err.id">
                    {{ err }}
                </small>
                <label for="banque">Type de credit:</label>
                <select name="banque" v-model="duree_dredit">
                    <option value="">--------</option>
                    <option value="court terme">Credit à court terme</option>
                    <option value="moyen terme">Credit à moyen terme</option>
                    <option value="long terme">Credit à long terme</option>
                </select>
                <small v-for="err in data_error?.duree_credit" :key="err.id">
                    {{ err }}
                </small>
                <label for="document">Document:</label>
                <input type="file" id="document" @change="handleFileUpload($event, 'document')"
                    accept="application/pdf">
                <small v-for="err in data_error?.document" :key="err.id">
                    {{ err }}
                </small>
            </div>
            <button class="btn-modal" @click="nouveaxCredit">Créer {{ money(credit.montant) }} </button>
        </div>
    </Modal>
    <div class="container">
        <div class="subMenu-headers">
            <div class="row">
                <button class="btn retour" @click="goBack">&#10094;</button>
                <button class="btn" v-if="choosed_account" @click="show_modal = true">
                    <i class="fa-solid fa-plus"></i>
                    Ajouter
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
                    <th>Id</th>
                    <th>Numer   o</th>
                    <th>Montant</th>
                    <th>Motif</th>
                    <th>Date</th>
                    <th>Periode</th>
                    <th>Payer</th>
                    <th>Restant</th>
                    <th>Banque</th>
                    <th>Options</th>
                </tr>
                <tr v-for="credit in list" :key="credit.id">
                    <td>{{ credit.id }}</td>
                    <td>{{ credit.ref_number }}</td>
                    <td>{{ money(credit.montant) }}</td>
                    <td>{{ credit.motif }}</td>
                    <td>{{ datetime(credit.date_creation) }}</td>
                    <td>{{ credit.periode }}</td>
                    <td>{{ money(credit.montant_deja_payer) }}</td>
                    <td>{{ money(credit.montant_a_payer) }}</td>
                    <td>{{ credit.banque.banque }}</td>
                    <td>
                        <div class="menu-container">
                            <i class="btn fa fa-ellipsis-v" @click="toggleOptions(credit.id)">
                                <div v-if="selected_credit === credit.id" class="option-links"
                                    @mouseleave="toggleOptions(credit.id)">
                                    <a :href="credit.document" target="_blank">‣&nbsp;Voir le document</a>
                                    <span @click="goToRembourssement(credit)">‣&nbsp;Rembourssement</span>
                                </div>
                            </i>
                        </div>
                    </td>
                </tr>
            </table>
        </section>
    </div>
</template>

<script>
import Modal from '@/Overlays/Modal.vue';
import Navbar from '@/components/Navbar.vue';
import DateFilter from '@/components/dateFilter.vue';
import SearchComponent from '@/components/SearchComponent.vue';

export default {
    data() {
        return {
            show_modal: false,
            show_flitre: false,
            document: null,
            date_fin: '',
            date_debut: '',
            Banq: '',
            credit: {
                ref_number: '',
                montant: null,
                interet: null,
                motif: '',
                periode: null,
                banque: null,
            },
            list: [],
            banque: [],
            data_error: {},
            show_rembourssement: false,
            id: null,
            date: null,
            duree_dredit: '',
            selected_credit: null,
            choosed_account: parseInt(this.$route.query.id) || ''
        }
    },
    components: {
        Navbar, Modal, DateFilter, SearchComponent
    },
    methods: {
        toggleOptions(credit_id) {
            if (this.selected_credit === credit_id) {
                this.selected_credit = null;
            } else {
                this.selected_credit = credit_id;
            }
        },
        goToRembourssement(credit) {
            this.$router.push({ name: 'rembourssementbanques', query: { credit: credit.id } })
        },
        searchLasta(text) {
            axios.get(`creditbanques/?search=${text}`)
                .then((reponse) => {
                    this.list = reponse.data.results;
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.searchLasta(text));
                })
        },
        searchGet() {
            axios
                .get(
                    `creditbanques/?banque=${this.Banq}&date_creation__gte=${this.date_debut}&date_creation__lte=${this.date_fin} `
                ).then((reponse) => {
                    this.list = reponse.data.results;
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.searchGet);
                }).finally(() => {
                    this.show_flitre = false;
                });
        },
        closing() {
            this.show_modal = false;
            this.show_flitre = false;
            this.document = null, 
                this.credit = {
                    ref_number: '',
                    montant: null,
                    interet: null,
                    motif: '',
                    periode: null,
                    banque: null,
                };
            this.date = ''
            this.show_rembourssement = false,
                this.data_error = [],
                this.duree_dredit = ''
        },
        getCredits() {
            axios
                .get(`creditbanques/${this.$route.query.id ? '?banque=' + parseInt(this.$route.query.id) : ''}`)
                .then((reponse) => {
                    this.list = reponse.data.results;
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getCredits);
                })
        },
        getBanque() {
            axios
                .get(`comptebancaire/`)
                .then((reponse) => {
                    this.banque = reponse.data.results;
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getBanque);
                })
        },
        nouveaxCredit() {
            const formData = new FormData();
            formData.append('ref_number', this.credit.ref_number);
            formData.append('document', this.document);
            formData.append('montant', this.credit.montant);
            formData.append('interet', this.credit.interet);
            formData.append('motif', this.credit.motif);
            formData.append('periode', this.credit.periode);
            formData.append('duree_credit', this.duree_dredit);
            formData.append('banque', this.choosed_account);
            
            axios.post('creditbanques/', formData)
                .then((reponse) => {
                    this.list.unshift(reponse.data);
                    this.closing();
                    this.$store.state.message.success = 'Credit ajouté avec succès.'
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.nouveaxCredit);
                    this.data_error = error.response?.data
                });
        },
        nouveauxRembourssements() {

            const formData = new FormData();
            formData.append('ref_number', this.credit.ref_number);
            formData.append('montant_payee', this.credit.montant);
            formData.append('date', this.date);
            formData.append('credit', this.id);

            axios.post('remboursementbanques/', formData)
                .then(() => {
                    this.closing();
                    this.$store.state.message.success = 'Rembourssement ajouté avec succès.'
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.nouveauxRembourssements);
                });
        }
    },
    mounted() {
        this.getCredits();
        // this.getBanque();
    }
}
</script>
<style scoped>
a {
    text-decoration: none;
    color: var(--second);
    padding: 7px 0;
}

.option-links span {
    padding: 7px 0;
}
</style>
