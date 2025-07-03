<template>
    <Navbar />
    <div class="container">
        <div class="subMenu-headers">
            <div class="row">
                <button class="btn retour" @click="goBack">&#10094;</button>
                <button class="btn" @click="show_action = true">
                    <i class="fa-solid fa-plus"></i> Ajouter actionnaire</button>
            </div>
            <div class="row">
                <SearchComponent :searchFunction="searchLasta" />
            </div>
        </div>
        <Modal :isVisible="show_action" @close="closeModal">
            <div class="form">
                <div class="content">
                    <span class="title">Ajout de l'actionnaire</span>
                    <label for="lastname">Nom</label>
                    <input type="text" v-model="nom" id="lastname" placeholder="Veuillez mettre votre nom">
                    <small v-for="err in data_error?.nom" :key="err.id">
                        {{ err }}
                    </small>
                    <label for="firstname">Prenom</label>
                    <input type="text" v-model="prenom" id="firstname" placeholder="Veuillez mettre votre prenom">
                    <small v-for="err in data_error?.prenom" :key="err.id">
                        {{ err }}
                    </small>
                    <label>Adresse</label>
                    <input type="text" v-model="adresse" placeholder="Veuillez mettre votre adresse">
                    <small v-for="err in data_error?.adresse" :key="err.id">
                        {{ err }}
                    </small>
                    <label for="CNI">CNI</label>
                    <input type="text" id="CNI" v-model="CNI" placeholder="tapez votre CNI">
                    <small v-for="err in data_error?.CNI" :key="err.id">
                        {{ err }}
                    </small>
                    <label for="telephone">Telephone</label>
                    <input type="number" id="telephone" v-model="telephone"
                        placeholder="Tapez votre numero de telephone">
                    <small v-for="err in data_error?.telephone" :key="err.id">
                        {{ err }}
                    </small>
                    <label for="detail">Detail</label>
                    <input type="text" id="detail" v-model="details" placeholder="Veuillez dire votre motif">
                    <small v-for="err in data_error?.details" :key="err.id">
                        {{ err }}
                    </small>
                </div>
                <button class="btn-modal" @click="postAction">Créer</button>
            </div>
        </Modal>
        <section class="table">
            <table>
                <tr>
                    <th>Id</th>
                    <th>Nom et Prenom</th>
                    <th>Adresse</th>
                    <th>CNI</th>
                    <th>Telephone</th>
                    <th>Details</th>
                    <!-- <th>Montant</th> -->
                </tr>
                <tr v-for="action in actionnaire" :key="action.id">
                    <td>{{ action.id }}</td>
                    <td>{{ action.fullname }}</td>
                    <td>{{ action.adresse }}</td>
                    <td>{{ action.CNI }}</td>
                    <td>{{ action.telephone }}</td>
                    <td>{{ action.details }}</td>
                    <!-- <td>{{ money(action.montant) }}</td> -->
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
            action: [],
            actionnaire: [],

            show_action: false,
            data_error: {},
            nom: '',
            prenom: '',
            details: '',
            adresse: '',
            CNI: '',
            telephone: '',
            microfinance: ''
        }
    },
    components: { Navbar, Modal, SearchComponent },
    methods: {
        closeModal() {
            this.show_action = false
            this.nom = ''
            this.prenom = ''
            this.details = ''
            this.adresse = ''
            this.CNI = ''
            this.telephone = ''
        },
        searchLasta(text) {
            axios.get(`actionnaires/?search=${text}`)
                .then((reponse) => {
                    this.actionnaire = reponse.data.results
                    this.closeModal()
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, () => searchLasta(text));
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
        postAction() {
            const formData = new FormData();
            formData.append("nom", this.nom);
            formData.append("prenom", this.prenom);
            formData.append("adresse", this.adresse);
            formData.append("CNI", this.CNI);
            formData.append("telephone", this.telephone);
            formData.append("details", this.details);
            axios.post(`actionnaires/`, formData)
                .then((reponse) => {
                    this.$store.state.message.success = 'Actionnaire a été crée avec succès.'
                    this.actionnaire.unshift(reponse.data)
                    this.closeModal()
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.postAction)
                    this.data_error = error.response?.data
                })
        }
    },
    mounted() {
        this.getActionnaire();
    }
}
</script>