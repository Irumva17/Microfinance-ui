<template>
    <Navbar />
    <Modal :isVisible="showCapital" @close="closeModal">
        <div class="form">
            <span class="title">Ajouter le capital souscrit</span>
            <div class="content">
                <label>Actionnaire </label>
                <select name="actionnaire" v-model="action">
                    <option value="">-----</option>
                    <option v-for="action in actionnaire" :key="action.id" :value="action.id">{{ action.nom }} {{
                        action.prenom }} - {{ action.microfinance }}
                    </option>
                </select>
                <small v-for="err in data_error?.actionnaire" :key="err.id">
                    {{ err }}
                </small>
                <label for="capital_souscrit">Capital souscrit</label>
                <input id="capital_souscrit" type="number" v-model="capital_souscrit">
                <small v-for="err in data_error?.capital_souscrit" :key="err.id">
                    {{ err }}
                </small>
            </div>
            <button class="btn-modal" @click="postCapitalSouscrit">Enregister {{ money(capital_souscrit) }}</button>
        </div>
    </Modal>
    <Modal :isVisible="show_liberer != ''" @close="closeModal">
        <div class="form">
            <span class="title">Verser le capital promis</span>
            <div class="content">
                <div v-if="show_liberer === 'tot' || show_liberer === 'part'">
                    <label>Compte bancaire</label>
                    <SearchCompte search_for='banque' @compte="add_account" />
                    <small v-for="err in data_error?.compte_bancaire" :key="err.id">
                        {{ err }}
                    </small>
                    <label for="full_name">Nom</label>
                    <input id="full_name" type="text" v-model="nom" placeholder="Nom figurant sur la preuve de paiement">

                    <label for="ref_number">Montant</label>
                    <input id="ref_number" type="text" v-model="montant" placeholder="Montant">
                    <small v-for="err in data_error?.montant" :key="err.id">
                        {{ err }}
                    </small>

                    <label for="ref_number">Ref number</label>
                    <input id="ref_number" type="text" v-model="ref_number" placeholder="Numero de référence">
                    <small v-for="err in data_error?.ref_number" :key="err.id">
                        {{ err }}
                    </small>
                    
                    <label for="motif">Details</label>
                    <input id="motif" type="text" v-model="motif" placeholder="Details">
                    <small v-for="err in data_error?.motif" :key="err.id">
                        {{ err }}
                    </small>
                    <!-- <div v-if="show_liberer === 'part'">
                        <label for="capital_souscrit_liberé_totalement">Capital souscrit liberé partielement</label>
                        <input id="capital_souscrit_liberé_totalement" type="number"
                            v-model="capital_souscrit_libere_part">
                        <small v-for="err in data_error?.capital_souscrit_libere_part" :key="err.id">
                            {{ err }}
                        </small>
                    </div> -->
                    <label for="document">Fichier justifiant le paiement</label>
                    <input id="document" type="file" @change="uploadDocument">
                </div>

                <!-- <div v-else>
                    <label for="capital_souscrit_non_liberé">Capital souscrit non liberé</label>
                    <input id="capital_souscrit_non_liberé" type="number" v-model="capital_souscrit_non_libere">
                </div> -->
            </div>
            <button class="btn-modal" @click="getExtraAction">
                <!-- {{ show_liberer !== 'non' ? 'Liberer' : 'Non liberer' }} -->
                  Verser  {{ money(montant || 0) }}
                <!-- {{ money(
                    (show_liberer === 'tot' ? 
                    capital_souscrit_libere_tot : 
                    show_liberer === 'part' ? 
                    capital_souscrit_libere_part : 
                    capital_souscrit_non_libere) || 0
                ) }} -->
            </button>
        </div>
    </Modal>
    <Modal :isVisible="capital_tranches.length > 0" @close="capital_tranches = []">
        <div class="capital-info">
            <!-- <span class="title">Plus d'information</span>
            <div class="content">
                <div class="flex">
                    <i class="fa-solid fa-user"></i>
                    <span>Actionnaire: {{ item_to_view?.actionnaire }}</span>
                    <span>Capital souscrit : {{ money(item_to_view?.capital_souscrit) }}</span>
                </div>
                <div class="flex" v-if="item_to_view?.capital_souscrit_libere_total">
                    <span>Capital libéré totalement  : {{ money(item_to_view?.capital_souscrit_libere_total) }}</span>
                    <span class="capitalize">Libérer par : {{ item_to_view?.souscrit_libere_total_by }}</span>
                    <span class="capitalize">Date de libération : {{ datetime(item_to_view?.souscrit_libere_total_at) }}</span>
                </div>
                <div class="flex" v-if="item_to_view?.capital_souscrit_non_libere">
                    <span>Capital libéré totalement  : {{ money(item_to_view?.capital_souscrit_non_libere) }}</span>
                    <span class="capitalize">Libérer par : {{ item_to_view?.souscrit_non_libere_by }}</span>
                    <span class="capitalize">Date de libération : {{ datetime(item_to_view?.souscrit_non_libere_at) }}</span>
                </div>
            </div> -->
            <section v-if="capital_tranches?.length">
                <span class="title">Tranches de libération</span>
                <table>
                    <tr>
                        <!-- <th>Id</th> -->
                        <!-- <th>Référence</th> -->
                        <th>Montant</th>
                        <th>Banque</th>
                        <th>Nom</th>
                        <th>Motif</th>
                        <th>Date de création</th>
                        <th>Créer par</th>
                        <th>Document</th>
                    </tr>
                    <tr v-for="item in capital_tranches" :key="item.id">
                        <!-- <td>{{ item.id }}</td> -->
                        <!-- <td>{{ item.ref_number }}</td> -->
                        <td>{{ money(item.montant) }}</td>
                        <td>{{ item.banque.nom }}</td>
                        <td>{{ item.nom }}</td>
                        <td>{{ item.motif }}</td>
                        <td>{{ datetime(item.created_at) }}</td>
                        <td>
                            <span v-if="!item.created_by.first_name && !item.created_by.last_name">
                                {{ item.created_by.username }}
                            </span>
                            <span>{{ item.created_by.last_name }} {{ item.created_by.first_name }}</span>
                        </td>
                        <td><a :href="item.document" target="_blank" class="btn">Voir l'ATS</a></td>
                    </tr>
                </table>
            </section>
            <a v-else :href="selected_capital?.document" target="_blank" class="btn" >ATS</a>
        </div>
    </Modal>
    <div class="container">
        <div class="subMenu-headers">
            <div class="btns">
                <button class="btn retour" @click="goBack">&#10094;</button>
                <button class="btn" @click="showCapital = true">
                    <i class="fa-solid fa-plus"></i> Ajouter un capital
                </button>
            </div>
        </div>
        <div class="accounts">
            <Account account_name="Montant total promis" :account_money="capital_promis" />
            <Account account_name="Montant total versé" :account_money="capital_verse" />
            <Account account_name="Total restant" :account_money="capital_restant" />
        </div>
        <section class="table">
            <table>
                <tr>
                    <th>Id</th>
                    <th>Actionnaire</th>
                    <th>Capital promis</th>
                    <th>Date de souscrition</th>
                    <th>Total versé</th>
                    <th>Reste</th>
                    <!-- <th>Non liberé</th> -->
                    <!-- <th>Liberé par</th> -->
                    <th>Options</th>
                </tr>
                <tr v-for="(capital, index) in capitals.results" :key="capital.id">
                    <td>{{ capital.id }}</td>
                    <td>{{ capital.actionnaire.nom }}</td>
                    <td>{{ money(capital.montant_promis) }}</td>
                    <td>{{ datetime(capital.created_at) }}</td>
                    <td>{{ money(capital.total_verse || 0) }}</td>
                    <td>{{ money(capital.reste_a_verser || 0 )}}</td>
                    <!-- <td>{{ money(capital.capital_souscrit_non_libere) || 0 }}</td> -->
                    <td >
                        <i class="btn fa fa-ellipsis-v" @click="toggleOptions(capital)"></i>
                        <div v-if="selected_capital.id === capital.id"
                            :class="`menu_options ${getPosition(index)}`" @mouseleave="toggleOptions(capital.id)">
                            <button class="btn" @click="capital_id = capital.id;show_liberer = 'tot'">
                                Verser
                            </button>
                            <div class="menu_arrow">‣</div>
                            <button class="btn" @click="show_information(capital)">Tranches de libération</button>
                        </div>
                    </td>
                </tr>
            </table>
        </section>
    </div>
</template>
<script>
import Account from '@/components/account.vue';
import Navbar from '@/components/Navbar.vue';
import SearchCompte from '@/components/SearchCompte.vue';
import Modal from '@/Overlays/Modal.vue';

export default {
    data() {
        return {
            capital: [],
            capitals: [],
            selected_capital: {},
            actionnaire: [],
            action: [],
            banque: [],
            capital_id: '',
            got_bank_account: '',
            capital_type: '',
            nom: '',
            ref_number: '',
            motif: '',
            document: '',
            capital_souscrit: 0,
            capital_souscrit_libere_tot: 0,
            capital_souscrit_libere_part: 0,
            capital_souscrit_non_libere: 0,
            montant: 0,
            action: '',
            showCapital: false,
            show_liberer: false,
            show_infos: false,

            capital_tranches: [],
            item_to_view: null,

            data_error: {}
        }
    },
    components: {
        Navbar, Modal, SearchCompte, Account
    },
    computed: {
        capital_promis() {
            if(!this.capitals.results?.length) return 0
            return this.capitals?.results.reduce((amount, item) => amount + (item.montant_promis), 0);
        },
        capital_verse() {
            if(!this.capitals.results?.length) return 0
            return this.capitals?.results.reduce((amount, item) => amount + (item.total_verse), 0);
        },
        capital_restant() {
            if(!this.capitals.results?.length) return 0
            return this.capitals?.results.reduce((amount, item) => amount + (item.reste_a_verser), 0);
        },
    },
    methods: {
        remainingCapital(capital) {
            const total = capital.capital_souscrit || 0;
            const totLib = capital.capital_souscrit_libere_total || 0;
            const partLib = capital.capital_souscrit_libere_partiel || 0;
            const nonLib = capital.capital_souscrit_non_libere || 0;
            return total - totLib - partLib - nonLib;
        },
        hasRemainingCapital(capital) {
            return this.remainingCapital(capital) > 0;
        },
        show_information(item) {
            this.$store.commit('clearMessage')
            axios.get(`tranchesouscription/?capital_id=${item.id}`)
                .then((reponse) => {
                    // this.item_to_view = item
                    if(!reponse.data.results.length) {
                        this.$store.commit('setError', 'Pas des tranches trouvées.')
                    }
                    this.capital_tranches = reponse.data.results;
                    // this.show_infos = true;
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, () => this.show_information(item));
                });
            // this.selected_capital = this.capitals.find(capital => capital.id === id);
        },
        isFullyNonLiberated(capital) {
            return (
                (capital.capital_souscrit_libere_total || 0) === 0 &&
                (capital.capital_souscrit_libere_partiel || 0) === 0 &&
                (capital.capital_souscrit_non_libere || 0) === 0
            );
        },
        canBeMarkedAsNonLiberated(capital) {
            return this.hasRemainingCapital(capital) && (capital.capital_souscrit_non_libere || 0) === 0;
        },
        uploadDocument(event) {
            this.document = event.target.files[0];
        },
        toggleOptions(id) {
            this.selected_capital = this.selected_capital === id ? null : id;
        },
        getPosition(index) {
            if (this.capitals.length > 10) {
                return index >= this.capitals.length - 4 ? 'above' : ''
            } else {
                return ''
            }
        },

        getExtraAction() {
            const data = new FormData();

            data.append('nom', this.nom)
            data.append('motif', this.motif)
            data.append('ref_number', this.ref_number)
            data.append('banque', this.got_bank_account)
            data.append('document', this.document)
            data.append('montant', this.montant)
            data.append('capital', this.capital_id)

            // this.show_liberer === 'tot' ? (
            //     data.append('capital_souscrit_libere_total', this.capital_souscrit_libere_tot)
            // ) : this.show_liberer === 'part' ? (
            //     data.append('capital_souscrit_libere_partiel', this.capital_souscrit_libere_part)
            // ) : (
            //     data.append('capital_souscrit_non_libere', this.capital_souscrit_non_libere)
            // )
            // let url = this.show_liberer === 'tot' ? (
            //     '/liberer_souscription_totale/'
            // ) : this.show_liberer === 'part' ? (
            //     '/liberer_souscription_partielle/'
            // ) : (
            //     '/Souscription_non_liberer/'
            // )

            axios.post(`tranchesouscription/`, data)
                .then((reponse) => {
                    this.$store.state.message.success = 'Reussis.'
                    // this.capitals = this.capitals.map(capital => {
                    //     if(capital.id === this.capital_id) {
                    //         Object.assign(capital, reponse.data)
                    //         if(this.show_liberer === 'part') {
                    //             capital?.tranches.push(reponse.data)
                    //         }
                    //     }
                    //     return capital
                    // })
                    let capitalIndex = this.capitals.findIndex(capital => capital.id === this.capital_id)
                    if (capitalIndex !== -1) {
                        this.capitals[capitalIndex].total_verse += reponse.data.montant
                        this.capitals[capitalIndex].reste_a_verser -= reponse.data.montant
                    }
                    this.closeModal()
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getExtraAction)
                })
        },

        // deleteCapital(id){
        //     const confirmation = confirm(`Vous voulez vraiment supprimer ce capital?`)
        //     if (confirmation) {
        //         axios.delete(`capitals/${id}/`)
        //         .then(()=>{this.capitals = this.capitals.filter(cap => cap.id != id)
        //             this.$store.state.message.success = 'Supprimés avec succès.'
        //         })
        //         .catch((error)=> this.displayErrorOrRefreshToken(error, this.deleteCheque))
        //     }
        // },
        // validation(id){
        //     axios.get(`capitals/${id}/valider_injection/`)
        //     .then((reponse)=>{
        //         this.$store.state.message.success = 'Le capital a étè validé avec succès.'
        //         this.capitals = this.capitals.map(capital => {
        //             capital.id === id && Object.assign(capital, reponse.data)
        //             return capital
        //         })
        //     }).catch((error) =>{
        //         this.displayErrorOrRefreshToken(error, this.validation)
        //     })
        // },
        closeModal() {
            this.showCapital = false
            this.show_liberer = ''
            this.show_infos = false
            this.compte = ''
            this.montant = ''
            this.motif = ''

            this.action = ''
            this.got_bank_account = '',
                this.capital_type = '',
                this.nom = '',
                this.ref_number = '',
                this.capital_souscrit = 0,
                this.capital_souscrit_libere_tot = 0,
                this.capital_souscrit_non_libere = 0,
                this.montant = 0
            this.show_liberer = ''
            this.data_error = {}
        },
        getCapital() {
            axios.get('capitals/')
                .then((reponse) => {
                    this.capitals = reponse.data
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getCapital);
                })
        },
        getActionnaire() {
            axios.get('actionnaires/')
                .then((reponse) => {
                    this.actionnaire = reponse.data.results
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getActionnaire);
                })
        },
        postCapitalSouscrit() {
            const formData = new FormData();
            formData.append("montant_promis", this.capital_souscrit);
            formData.append("actionnaire", this.action);
            axios.post('capitals/', formData)
                .then((reponse) => {
                    this.$store.state.message.success = 'Reussis.'
                    this.capitals.unshift(reponse.data)
                    this.closeModal()
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.postCapitalSouscrit)
                    this.data_error = error.response?.data
                })
        },
        // postCapital() {
        //     const formData = new FormData();
        //     formData.append("montant_injecter", this.montant);
        //     formData.append("actionnaire", this.action);
        //     formData.append("banque", this.got_bank_account);
        //     formData.append("capital_type", this.capital_type);
        //     axios.post('capitals/', formData)
        //         .then((reponse) => {
        //             this.$store.state.message.success = 'Le capital a étè injecté avec succès.'
        //             this.getCapital(reponse.data.results)
        //             this.closeModal()
        //         }).catch((error) => {
        //             this.displayErrorOrRefreshToken(error, this.postCapital)
        //             this.data_error = error.response?.data
        //         })
        // }
    },
    mounted() {
        this.getCapital()
        this.getActionnaire()
    }
}
</script>
<style scoped>
.capitalize{
    text-transform: capitalize;
}
input {
    margin: 3px 0 5px 0;
}
.capital-info{
    max-width: 80vw;
    height: fit-content;
    padding: 25px;
    border-radius: 2px;
    background: var(--second);
    .title{
        display: inline-block;
        margin-bottom: 10px;
    }
    .content div{
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
}
a[target="_blank"]{
    display: block;
    text-decoration: none;
    width: unset;
    text-align: center;
}
</style>
