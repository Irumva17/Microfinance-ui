<template>
    <Navbar />
    <Modal :isVisible="show_depotBanque" @close="closing">
        <form class="form" @submit.prevent="postdepot">
            <span class="title"> Depot Bancaire</span>
            <div class="content">
                <label for="">Debiteur</label>
                <div class="searchbox">
                    <input 
                        class="input-search for_grps" type="text" 
                        v-model="keyword_attributed" id="key"
                        placeholder="Rechercher par nom ou numero"
                    >
                    <span class="btn-search">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </span>
                </div>
                <div class="content">
                    <label v-for="plan in filteredPlans" :key="plan.id">
                        <input type="radio" v-model="debiteur" :value="plan.id" name="table" style="width: fit-content;">
                        {{ plan.numero }} : {{ plan.nom }}
                        <br>
                    </label>
                    <!-- <small v-for="err in data_error?.table" :key="err.id">
                        {{ err }}
                    </small> -->
                </div>

                <label>Nom du client:</label>
                <input type="text" placeholder="Nom du client" v-model="nom_du_client">
                <label>Numero de référence:</label>
                <input type="text" placeholder="Numero de référence" v-model="ref_number">
                <label>Montant:</label>
                <input type="number" placeholder="Montant" v-model="montant">
                <label>Motif:</label>
                <input type="text" placeholder="explication de l'action" v-model="motif">
                <label for="document">Document</label>
                <input type="file" id="document" @change="handleFileUpload($event, 'document')" required>
            </div>
            <button type="submit" class="btn-modal">creer {{ money(montant) }} </button>
        </form>
    </Modal>
    <Modal :isVisible="show_flitre" @close="closing">
        <div class="form">
            <span class="title">Filtrage</span>
            <div class="content">
                <label v-if="!$route.query.id" for="">Banque</label>
                <select v-if="!$route.query.id" v-model="choosed_account">
                    <option value="">---------</option>
                    <option v-for="baq in comptebancaires" :key="baq.id" :value="baq.id">
                        {{ baq.banque }} compte {{ baq.compte }}
                    </option>
                </select>
                <label for="">Date de création :</label>
                <div class="inputRow">
                    <input type="date" v-model="date_fin" />
                    <input type="date" v-model="date_debut" />
                </div>
            </div>
            <button class="btn-modal" @click="searchLasta('')">Filtrer</button>
        </div>
    </Modal>

    <div class="container">
        <div class="subMenu-headers">
            <div class="row">
                <button class="btn retour" @click="goBack">&#10094;</button>
                <button class="btn"
                    v-if="$route.query.id" @click="show_depotBanque = true">
                    <i class="fa-solid fa-plus"></i>
                    Ajouter
                </button>
            </div>
            <div class="row">
                <button class="btn" @click="show_flitre = true">Filtrer</button>
                <SearchComponent v-if="!$route.query.id" :searchFunction="searchLasta" />
            </div>
        </div>
        <section class="table">
            <table>
                <tr>
                    <th>Id</th>
                    <th>Référence</th>
                    <th>Montant</th>
                    <th>Date</th>
                    <th>Motif</th>
                    <th>Compte</th>
                </tr>

                <tr v-for="item in list" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.ref_number }}</td>
                    <td>{{ money(item.montant) }}</td>
                    <td>{{ datetime(item.created_at) }}</td>
                    <td>{{ item.motif }}</td>
                    <td>{{ item.compte.nom }}</td>
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
            show_depotBanque: false,
            nom_du_client: '',
            compte_du_client: '',
            keyword_attributed: '',
            montant: 0,
            motif: '',
            compte: '',
            document: null,
            list: [],
            subvention_type: '',
            // source_type: '',
            ref_number: '',
            choosed_account: parseInt(this.$route.query.id) || '',
            comptes: [],
            comptebancaires: [],
            options: [],
            plans: [],
            plan_comptables: [],
            debiteur: '',
            // crediteur: '',
            date_fin: '',
            date_debut: '',
            Banq: '',
            show_flitre: false,
            banque: [],
            show_modal: false
        }
    },
    components: {
        Navbar, Modal, SearchComponent
    },
    computed: {
        filteredPlans() {
            const keyword = this.keyword_attributed.toLowerCase();
            if (keyword === '') {
                return [];
            }
            return this.plan_comptables.filter(plan => {
                return plan.numero.toLowerCase().includes(keyword) || plan.nom.toLowerCase().includes(keyword);
            });
        },
    },
    methods: {
        closing() {
            this.show_depotBanque = false;
            this.nom_du_client = '';
            this.compte_du_client = '';
            this.montant = '';
            this.motif = '';
            this.compte = '';
            this.subvention_type = '';
            this.source_type = '';
            this.ref_number = '';
            this.show_flitre = false;
        },
        getdepot() {
            axios
                .get(`depotbanques/${this.$route.query.id ? '?compte=' + parseInt(this.$route.query.id) : ''}`)
                .then((reponse) => {
                    this.list = reponse.data.results
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getdepot)
                })
        },
        async getPrix() {
            await axios.get('plancomptable/')
                .then((rep) => {
                    this.plans = rep.data.results
                }).catch((error) => this.displayErrorOrRefreshToken(error, this.getPrix))
        },
        closeModal(){
            this.date_debut = ''
            this.date_fin = ''
            this.show_flitre = false
        },
        searchLasta(text) {
            axios.get(
                text ?  `depotbanques/?search=${text}` :
                `depotbanques/?compte=${this.choosed_account}&created_at__lte=${this.date_debut}&created_at__gte=${this.date_fin}`
            ).then((reponse) => {
                this.list = reponse.data.results;
                this.closeModal()
            }).catch((error) => {
                this.displayErrorOrRefreshToken(error, () => searchLasta(text));
            })
        },
        postdepot() {
            const data = new FormData();
            data.append("nom_client", this.nom_du_client);
            // data.append("compte_source", this.compte_du_client);
            // data.append("compte_source", this.source_type);
            data.append("ref_number", this.ref_number);
            data.append("montant", this.montant);
            data.append("motif", this.motif);
            data.append("document", this.document);
            data.append("compte", this.choosed_account);
            data.append("subvention_type", this.subvention_type);
            data.append("debiteur", this.debiteur);
            // data.append("crediteur", this.crediteur);
            axios
                .post('depotbanques/', data)
                .then((reponse) => {
                    this.$store.state.message.success = "Création du depot Réussi.";
                    this.list.unshift(reponse.data)
                    this.closing()
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.postdepot);
                });
        },
        async getCompteBancaires(of = 1, comptebancaires = []) {
            await axios.get(`comptebancaire/?page=${of}`)
                .then((response) => {
                    const data = response.data
                    if (data.next) {
                        comptebancaires = comptebancaires.concat(data.results)
                        this.getCompteBancaires(of + 1, comptebancaires)
                    } else {
                        this.comptebancaires = comptebancaires.concat(data.results)
                        // this.$store.state.comptebancaires = this.comptebancaires
                    }
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getCompteBancaires)
                })
        },
    },
    mounted() {
        this.getdepot();
        this.getCompteBancaires();
        // this.getOptions()
        this.getPrix()
        // this.getBanque()
        // this.getcompte();
        if (this.$store.state.plan_comptables.length) {
            this.plan_comptables = this.$store.state.plan_comptables
        } else {
            this.getPlans();
        }
    }
}
</script>

<style scoped>
.searchbox {
    width: 100%;

    input {
        flex: 1;
    }
}
</style>