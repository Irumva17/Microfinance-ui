<template>
    <Navbar />
    <div class="container">
        <div class="subMenu-headers">
            <div class="row">
                <button class="btn retour" @click="goBack">&#10094;</button>
                <button class="btn" @click="show_modale = true"> <i class="fa-solid fa-plus"></i> Epargne</button>
            </div>
            <div class="row">
                <button class="btn" @click="show_flitre = true">Filtrer</button>
                <SearchComponent :search-function="searchLasta" />
            </div>
        </div>
        <!-- <Modal :isVisible="show_black" @close="closeModal">
            <div class="form">
                <span class="title">Depot sur l'epargne de {{ printable[0]?.compte }}</span>
                <div class="content">
                    <label> Montant:</label>
                    <input type="number" placeholder="Montant" v-model="montant">
                    <label> Details:</label>
                    <input type="text" placeholder="Details" v-model="detail">
                </div>
                <button class="btn-modal" @click="blackLister(printable[0]?.id)">Deposer {{ money(montant || 0) }}</button>
            </div>
        </Modal> -->
        <!-- <Modal  :isVisible="show_etat" @close="closeModal">
            <div class="form">
                <span class="title">Etat de l'epargne {{ printable[0]?.compte }}</span>
                <div class="content">
                    <label>Montant : {{ money(Etat.montant_epargne) }}</label>
                    <label>Interet : {{ money(Etat.interets) }}</label>
                    <label>Durée en jours : {{ Etat.duree_jours }}</label>
                    <label>Montant toatl : {{ money(Etat.montant_total) }}</label>
                </div>
            </div>
        </Modal> -->

        <Modal :isVisible="show_flitre" @close="closeModal">
            <div class="form">
                <span class="title">Filtrage</span>
                <div class="content">
                    <label> Details:</label>
                    <input type="text" placeholder="Mettez le detail" v-model="detail">
                    <label> Numero:</label>
                    <input type="number" placeholder="Mettez le numero" v-model="numero">
                    <label> Nom:</label>
                    <input type="text" placeholder="Mettez le nom" v-model="first_name">
                    <label> Prenom:</label>
                    <input type="text" placeholder="Mettez le prenom" v-model="last_name">
                    <label> Nom du personne moral:</label>
                    <input type="text" placeholder="Mettez le nom morale" v-model="last_name_morale">
                    <label for="detail">Les épargnes active: </label>
                    <select v-model="date_fin">
                        <option value="">-----</option>
                        <option value="true">Oui</option>
                        <option value="false">Non</option>
                    </select>
                    <label for="detail">L'interet est-il null: </label>
                    <input type="number" v-model="interet_null">
                </div>
                <button class="btn-modal" @click="searchGet">Filtrer</button>
            </div>
        </Modal>
        <Modal :isVisible="show_modale" @close="closeModal">
            <form class="form" @submit.prevent="">
                <span class="title">Nouveau épargne</span>
                <div class="content">
                    <SearchCompte @compte="add_account" />
                    <label for="Detail">Details:</label>
                    <input type="text" placeholder="les details sur l'épargne" v-model="detail" id="detail" />
                    <label for="interet">Interet</label>
                    <input type="number" placeholder="Frais d'interet" v-model="interet" id="detail">
                </div>
                <button class="btn-modal" @click="postEpargne">Créer</button>
            </form>
        </Modal>
        <section class="table">
            <table>
                <tr>
                    <th>Id</th>
                    <th>Compte</th>
                    <th>Details</th>
                    <th>Montant </th>
                    <th>interet </th>
                    <th>Debut d'épargne </th>
                    <th>Fin d'épargne </th>
                    <th>Etat</th>
                </tr>
                <tr v-for="(item, index) in printable" :key="index" @dblclick="$router.push(`/depot_epargne/${item.id}?active=${!item.date_fin}`)" class="clickable_row">
                    <td>{{ item.id }}</td>
                    <td>{{ item.compte }}</td>
                    <td>{{ item.details }}</td>
                    <td>{{ money(item.montant) }}</td>
                    <td>{{ money(item.interet) }}</td>
                    <td>{{ datetime(item.date_debut) }}</td>
                    <td>{{ datetime(item.date_fin) }}</td>
                    <!-- <td>
                        <div class="btns">
                            <button class="depot btn" @click="depotAjour(item)" v-if="item.date_fin == null">
                                <i class="fa-solid fa-arrow-down"></i> &nbsp; Depot
                            </button>

                            <button class="btn delete" v-if="item.date_fin == null"
                                @click="blockEpargne(item.id)">Cloturer l'épargne</button>
                            <span v-else>L'épargne est déjà cloturer</span>
                        </div>
                    </td> -->
                    <td>
                        <span v-if ="item.date_fin == null">En cours</span>
                        <!-- <i class="btn fa fa-ellipsis-v" v-if ="item.date_fin == null" @click="toggleOptions(item.id)" >
                            <div class="option-links" v-show ="selectedItemId === item.id">
                                <span  class="option-link"  @click="depotAjour(item)">Depot</span>
                                <span  class="option-link"  @click="blockEpargne(item.id)">Cloturer</span>
                                <span class="option-link" @click="getEpargneEtat(item.id)">Etat</span>
                            </div>
                        </i> -->
                        <span v-else class="valid">L'épargne est déjà cloturer</span>
                    </td>
                </tr>
            </table>
        </section>
    </div>
</template>
<script>
import Modal from '@/Overlays/Modal.vue';
import Navbar from '@/components/Navbar.vue'
import Print_cheques from '../../services/print_cheques.vue';
import SearchCompte from '@/components/SearchCompte.vue';
import SearchComponent from '@/components/SearchComponent.vue';
export default {
    data() {
        return {
            printable: [],
            Etat: [],
            is_loading: false,
            allcheques: [],
            pdfSrc: null,
            show_modal: false,
            idchaque: null,
            cni: '',
            nom: '',
            telephone: '',
            detail: '',
            cheque_nums: [],
            account: '',
            compte: '',
            black_nums: '',
            black_compte: '',
            show_flitre: false,
            show_black: false,
            show_cheques: false,
            show_modale: false,
            show_etat: false,
            client_cheques: '',
            cheques_account: '',
            search: '',
            users: [],
            result: '',
            got_accounts: [],
            account: [],
            keyword: '',
            clients: '',
            quantite: '',
            agence: '',
            agences: [],
            age_superieur: '',
            age_inferieur: '',
            commune: '',
            province: '',
            sexe: '',
            retirer: '',
            disponible: '',
            montant: '',
            bordereau: '',
            numero: '',
            last_name: '',
            first_name: '',
            last_name_morale: '',
            date_fin: '',
            interet_null: '',
            interet: '',
            selectedItemId:'',
            data_error: {}
        }
    },
    components: {
        Navbar, Modal, Print_cheques, SearchCompte, SearchComponent
    },
    methods: {
        depotAjour(cheque) {
            this.printable = [cheque]
            this.show_black = true
        },
        
        searchGet() {
            axios
                .get(
                    `/epargnes/?details=${this.detail}&compte__numero=${this.numero}&compte__personne_physique__first_name=${this.first_name}&compte__personne_physique__last_name=${this.last_name}&compte__personne_morale__nom=${this.last_name_morale}&date_fin__isnull=${this.date_fin}&interet=${this.interet_null}`
                ).then((reponse) => {
                    this.printable = reponse.data.results;
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.searchGet);
                }).finally(() => {
                    this.show_flitre = false;
                });
        },
        async getEpargne() {
            await axios.get('epargnes/')
                .then((response) => {
                    this.allcheques = response.data.results
                    this.printable = [...this.allcheques]
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getEpargne)
                })
        },
         getEpargneEtat(id) {
            this.show_etat = true
            axios.get(`epargnes/${id}/etats_epargne/`)
                .then((response) => {
                    this.Etat = response.data
                    console.log(this.Etat)
                    // this.printable = [...this.allcheques]
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getEpargneEtat)
                })
        },
        closeModal() {
            this.fina_sum = this.sum;
            this.show_modal = false;
            this.cni = '';
            this.nom = '';
            this.telephone = '';
            this.detail = '';
            this.compte = '';
            this.show_black = false
            this.black_nums = ''
            this.black_compte = '',
                this.show_cheques = false,
                this.show_etat = false,
                this.cheques_account = ''
            this.client_cheques = '',
                this.show_modale = false,
                this.result = '',
                this.got_accounts = [],
                this.account = [],
                this.keyword = '',
                this.clients = '',
                this.quantite = '',
                this.agence = '',
                this.agences = [],
                this.montant = '',
                this.bordereau = '',
                this.detail = '',
                this.interet = '',
                this.show_flitre = false
        },
        searchLasta(text) {
            axios.get(`epargnes/?search=${text}`)
                .then((reponse) => {
                    this.printable = reponse.data.results;
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.searchLasta(text));
                })
        },
        postEpargne() {
            const form = {
                details: this.detail,
                compte: this.compte,
                interet: this.interet,
            };
            axios.post('epargnes/', form)
                .then(() => {
                    this.closeModal();
                    this.$store.state.message.success = "Epargne Réussi.";
                    this.getEpargne();
                }).catch((error) => {
                    this.data_error = error.response?.data
                    this.displayErrorOrRefreshToken(error, this.postEpargne);
                });
        }
    },
    mounted() {
        this.getEpargne()
        this.agences = this.$store.state.agences
    }
}
</script>

<style></style>