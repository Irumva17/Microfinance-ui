<template>
    <Navbar />
    <Modal :isVisible="show_mandataire" @close="closeModal">
        <div class="form">
            <span class="title">Créer un mandataire du compte</span>
            <div class="content">
                <label for="firstName">Nom:</label>
                <input type="text" id="firstName" v-model="nom" placeholder="Mettez votre nom" />
                <small v-for="err in data_error?.nom" :key="err.id">
                    {{ err }}
                </small>
                <label for="lastName">Prenom:</label>
                <input type="text" id="lastName" v-model="prenom" placeholder="Mettez votre prenom" />
                <small v-for="err in data_error?.prenom" :key="err.id">
                    {{ err }}
                </small>
                <label for="adresse">Adresse:</label>
                <input type="text" id="adresse" v-model="adresse" placeholder="Mettez votre adresse" />

                <label for="card_number">CNI:</label>
                <input type="number" id="card_number" v-model="CNI" placeholder="Mettez votre CNI" />
                <small v-for="err in data_error?.CNI" :key="err.id">
                    {{ err }}
                </small>
                <label for="telphone">Telephone:</label>
                <input type="tel" id="telphone" v-model="telephone" placeholder="Numero de telephone" />
                <small v-for="err in data_error?.telephone" :key="err.id">
                    {{ err }}
                </small>
                <label for="details">Details:</label>
                <input type="text" id="details" v-model="details" placeholder="Mettez les details" />
                <small v-for="err in data_error?.details" :key="err.id">
                    {{ err }}
                </small>
                <label for="document">Photos:</label>
                <input type="file" id="document" @change="handleImageUpload" accept="image/*" required />
                <small v-for="err in data_error?.photo" :key="err.id">
                    {{ err }}
                </small>
            </div>
            <button @click="postMandataire" class="btn-modal">Créer</button>
        </div>
    </Modal>
    <div class="container">
        <div class="row">
            <button class="btn retour" @click="goBack">&#10094;</button>
            <button class="depot btn" @click="show_mandataire = true"> <i class="fa-solid fa-plus"></i> Ajouter</button>
        </div>
        <section class="table">
            <table>
                <tr>
                    <th>Id</th>
                    <th>Nom et Prenom</th>
                    <th>Adresse</th>
                    <th>Details</th>
                    <th>Telephone</th>
                </tr>
                <tr v-for="item in manda" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.nom }} {{ item.prenom }}</td>
                    <td>{{ item.adresse }}</td>
                    <td>{{ item.details }}</td>
                    <td>{{ item.telephone }}</td>
                </tr>
            </table>
            <p class="mandataireMessage" v-if="!manda.length">Aucun mandataire trouvée</p>
        </section>
    </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Modal from "@/Overlays/Modal.vue";

export default {
    data() {
        return {
            item: [],
            show_mandataire: false,
            manda: [],
            is_loading: false,
            nom: '',
            prenom: '',
            adresse: '',
            CNI: '',
            telephone: '',
            details: '',
            microfinance: '',
            microfinances: [],
            photo: null,
            data_error: {}
        };
    },
    components: {
        Navbar,
        Modal,
    },
    methods: {
        closeModal() {
            this.show_mandataire = false;
            this.nom = ''
            this.prenom = ''
            this.adresse = ''
            this.CNI = ''
            this.telephone = ''
            this.details = ''
            this.photo = null
        },
        getMandataire() {
            axios.get(`mandataires/?compte__id=${parseInt(this.$route.query.id)}`)
                .then((reponse) => {
                    this.manda = reponse.data.results;
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getMandataire);
                })
        },
        async getMicrofinance(of = 1, microfinances = []) {
            try {
                const response = await axios.get(`microfinances/?page=${of}`);
                const data = response.data;
                data.next 
                    ? this.getMicrofinance(of + 1, microfinances.concat(data.results))
                    : this.microfinances = microfinances.concat(data.results);
            } catch (error) {
                this.displayErrorOrRefreshToken(error, this.getMicrofinance);
            }
        },
        handleImageUpload(event) {
            const file = event.target.files[0];
            this.photo = file;
        },
        async postMandataire() {
            const formData = new FormData();
            formData.append('nom', this.nom);
            formData.append('prenom', this.prenom);
            formData.append('adresse', this.adresse);
            formData.append('CNI', this.CNI);
            formData.append('telephone', this.telephone);
            formData.append('compte', parseInt(this.$route.query.id));
            formData.append('details', this.details);
            formData.append('photo', this.photo);

            try {
                const response = await axios.post(`comptes/${parseInt(this.$route.query.id)}/creer_mandataire/`, formData);
                this.$store.state.message.success = `Le mandataire du compte ${this.$route.query.numero} a été créé avec succès.`;
                this.manda.unshift(response.data)
                this.closeModal();
            } catch (error) {
                this.displayErrorOrRefreshToken(error, this.postMandataire);
                this.data_error = error.response?.data
            }
        },
    },
    mounted() {
        this.getMandataire();
        this.getMicrofinance();
    }
};
</script>

<style>
.mandataireMessage {
    text-align: center;
    margin: 0;
}
</style>
