<template>
    <Navbar />
    <Modal :isVisible="show_depotBanque" @close="closing">
        <form class="form" @submit.prevent="postdepot">
            <span class="title"> Depot Bancaire</span>
            <div class="content">
                <label>Nom du client:</label>
                <input type="text" placeholder="Nom du client" v-model="nom_du_client">
                <label>Compte du client:</label>
                <input type="text" placeholder="Compte du client" v-model="compte_du_client">
                <label>Numero de référence:</label>
                <input type="text" placeholder="Numero de référence" v-model="ref_number">
                <label>Montant:</label>
                <input type="number" placeholder="Montant" v-model="montant">
                <label>Motif:</label>
                <input type="text" placeholder="explication de l'action" v-model="motif">
                <label for="source_type">Type de source</label>
                <!-- <input type="text" placeholder="Type de source" v-model="source_type"> -->
                <select name="source_type" v-model="source_type">
                    <option value="">------</option>
                    <option v-for="source in options.actions.POST.source_type.choices" :value="source.value">
                        {{ source.display_name }}
                    </option>
                </select>
                <label>Débiteur</label>
                <select v-model="debit">
                    <option value="">-------</option>
                    <option v-for="debit in prices" :key="debit.id" :value="debit.id">
                        {{ debit.numero }} {{ debit.nom }}
                    </option>
                </select>
                <label>Créditeur</label>
                <select v-model="credit">
                    <option value="">-------</option>
                    <option v-for="debit in prices" :key="debit.id" :value="debit.id">
                        {{ debit.numero }} {{ debit.nom }}
                    </option>
                </select>
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
                <label for="">Banque</label>
                <select v-model="Banq">
                    <option value="">---------</option>
                    <option v-for="baq in banque" :key="baq.id" :value="baq.id"> {{ baq.banque }} avec compte {{
                        baq.compte }}</option>
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
    <div class="container">
        <div class="subMenu-headers">
            <div class="row">
                <button class="btn retour" @click="goBack">&#10094;</button>
                <button class="btn" v-if="choosed_account" @click="show_depotBanque = true"><i
                        class="fa-solid fa-plus"></i>
                    Ajouter</button>
            </div>
            <div class="row">
                <button class="btn" @click="show_flitre = true">Filtrer</button>
                <SearchComponent :searchFunction="searchLasta" />
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
                    <!-- <th>Action</th> -->
                </tr>

                <tr v-for="item in list" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.ref_number }}</td>
                    <td>{{ money(item.montant) }}</td>
                    <td>{{ datetime(item.created_at) }}</td>
                    <td>{{ item.motif }}</td>
                    <td>{{ item.compte.banque }}</td>

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
            montant: 0,
            motif: '',
            compte: '',
            document: null,
            list: [],
            subvention_type: '',
            source_type: '',
            ref_number: '',
            choosed_account: parseInt(this.$route.query.id) || '',
            comptes: [],
            comptebancaires: [],
            options: [],
            prices: [],
            debit: '',
            credit: '',
            date_fin: '',
            date_debut: '',
            Banq: '',
            show_flitre: false,
            banque: [],
        }
    },
    components: {
        Navbar, Modal, SearchComponent
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
        getOptions() {
            axios
                .options(`depotbanques/`)
                .then((reponse) => {
                    this.options = reponse.data
                    console.log('OPTIONS', this.options.actions.POST.source_type.choices)
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getdepot)
                })
        },
        async getPrix() {
            await axios.get('plancomptable/')
                .then((rep) => {
                    this.prices = rep.data.results
                    console.log(this.prices)
                }).catch((error) => this.displayErrorOrRefreshToken(error, this.getPrix))
        },
        searchLasta(text) {
            axios.get(
                text ? `depotbanques/?search=${text}` :
                `/credits/?compte__commune__icontains=${this.compte}&compte__numero=&compte__personne_physique__date_naissance__gte=${this.age_superieur}&compte__personne_physique__date_naissance__lte=${this.age_inferieur}&compte__personne_physique__sexe=${this.sexe}&type_credit=${this.credite}&approved_at__gte=${this.approved_superieur}&approved_at__lte=${this.approved_inferieur}&payment_date__gte=${this.paiement_superieur}&payment_date__lte=${this.paiement_inferieur}&montant__gte=${this.montant_maximal}&montant__lte=${this.montant_minimal}&compte__personne_physique__isnull=${this.physique}`
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
            data.append("compte_source", this.compte_du_client);
            data.append("source_type", this.source_type);
            data.append("ref_number", this.ref_number);
            data.append("montant", this.montant);
            data.append("motif", this.motif);
            data.append("document", this.document);
            data.append("compte", this.choosed_account);
            data.append("subvention_type", this.subvention_type);
            data.append("debiteur", this.debit);
            data.append("crediteur", this.credit);
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
                        this.$store.state.comptebancaires = this.comptebancaires
                    }
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getCompteBancaires)
                })
        },
    },
    mounted() {
        this.getdepot();
        this.getCompteBancaires();
        this.getOptions()
        this.getPrix()
        // this.getBanque()
        // this.getcompte();
    }
}
</script>
