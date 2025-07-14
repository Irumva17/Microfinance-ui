<template>
    <Navbar />
    <Modal :isVisible="show_modal" @close="closeModal">
        <form class="form" @submit.prevent="AjouterCompteBancaire">
            <span class="title">Ajouter compte bancaire</span>
            <div class="content">
                <label>Banque</label>
                <input type="text" v-model="banque">
                <small v-for="err in data_error?.banque" :key="err.id">
                    {{ err }}
                </small>
                <label for="type_d_institution">Type d'institution</label>
                <select name="type_d_institution" v-model="type_d_institution">
                    <option value="">--------</option>
                    <option value="1">Banque centrale</option>
                    <option value="2">Banques commerciales</option>
                    <option value="3">Institutions de microfinance</option>
                    <option value="4">Autres sociétés financières</option>
                </select>
                <small v-for="err in data_error?.type_institution" :key="err.id">
                    {{ err }}
                </small>
                <label>Compte</label>
                <input type="text" v-model="compte">
                <small v-for="err in data_error?.compte" :key="err.id">
                    {{ err }}
                </small>
                <label>Details</label>
                <input type="text" v-model="details">
            </div>
            <button class="btn-modal" type="submit">Ajouter</button>
        </form>
    </Modal>
    <Modal :isVisible="show_filtre" @close="closeModal">
        <form @submit.prevent="searchLasta('')" class="form">
            <span class="title">Filtrage</span>
            <div class="content">
                <label>Banque :</label>
                <input type="text" placeholder="Taper le nom du Banque" v-model="banques">
                <label>Compte :</label>
                <input type="text" placeholder="Taper le nom du compte" v-model="comptes">
                <div>
                    <label>Type institution :</label>
                    <select v-model="institus">
                        <option value="Banque central">Banque central</option>
                        <option value="Banques commerciales">Banques commerciales</option>
                        <option value="institutions de microfinance">institutions de microfinance</option>
                        <option value="Autres sociétés financières">Autres sociétés financières</option>
                    </select>
                </div>
            </div>
      <button class="btn-modal">Filtrer</button>
        </form>
    </Modal>
    <div class="container">
        <div class="subMenu-headers">
            <div class="row">
                <button class="btn retour" @click="goBack">&#10094;</button>
                <button class="depot btn" @click="show_modal = true"><i class="fa-solid fa-plus"></i> Ajouter </button>
            </div>
            <div class="row">
                <button @click="show_filtre = true" class="btn">
                    Filtrer
                </button>
            </div>
        </div>
        <section class="table">
            <table>
                <tr>
                    <th>Banque</th>
                    <th>Compte</th>
                    <th>Solde</th>
                    <th>Details</th>
                    <th>Options</th>
                </tr>
                <tr v-for="item in comptebancaires" :key="item.id">
                    <td>{{ item.banque }}</td>
                    <td>{{ item.compte }}</td>
                    <td>{{ money(item.balance) }}</td>
                    <td>{{ item.details }}</td>
                    <td>
                        <i class="btn fa fa-ellipsis-v" @click="toggleOptions(item.id)"></i>
                        <div v-if="selected === item.id" class="menu_options" @mouseleave="toggleOptions(item.id)">
                            <button class=" btn" @click="goToDepot(item)"> <i class="fa-solid fa-arrow-down"></i> &nbsp;
                                Depot </button>
                            <button class=" btn" @click="goToRetrait(item)"> <i class="fa-solid fa-arrow-up"></i> &nbsp;
                                Retrait </button>
                            <!-- <button class="credit btn" @click="goToCredit(item)"> 
                                <i class="fa-solid fa-sack-dollar"></i>&nbsp; Crédit 
                            </button> -->
                            <div class="menu_arrow">‣</div>
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

export default {
    data() {
        return {
            show_modal: false,
            show_filtre: false,
            comptebancaires: [],
            banque: '',
            compte: '',
            banques: '',
            comptes: '',
            institus: '',
            details: '',
            type_d_institution: '',
            selected: '',
            data_error: {}
        }
    },
    components: {
        Navbar, Modal
    },
    methods: {
        toggleOptions(id) {
            this.selected = this.selected === id ? null : id;
        },
        goToDepot(banque) {
            this.$store.state.compte_active = banque
            this.$router.push({ name: 'depotbanques', query: { 'id': banque.id } })
        },
        goToRetrait(banque) {
            this.$store.state.compte_active = banque
            this.$router.push({ name: 'retraitbanques', query: { 'id': banque.id } })
        },
        goToCredit(banque) {
            this.$store.state.compte_active = banque
            this.$router.push({ name: 'creditbanques', query: { id: banque.id } })
        },
        searchLasta(text) {
            axios.get(
                text ? `comptebancaire/?search=${text}` :
                    `/comptebancaire/?banque=${this.banques}&compte=${this.comptes}&type_institution=${this.institus}`
            ).then((reponse) => {
                this.comptebancaires = reponse.data;
                this.closeModal()
            }).catch((error) => {
                this.displayErrorOrRefreshToken(error, () => searchLasta(text));
            })
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
        closeModal() {
            this.show_modal = false;
            this.show_filtre = false;
            this.banque = '';
            this.compte = '';
            this.details = '';
        },
        async AjouterCompteBancaire() {

            const form = new FormData();
            form.append('banque', this.banque)
            form.append('compte', this.compte)
            form.append('details', this.details)
            form.append('type_institution', this.type_d_institution)

            await axios.post('comptebancaire/', form)
                .then((response) => {
                    this.$store.state.message.success = 'Vous avez crée une banque avec succèss.'
                    this.comptebancaires.push(response.data)
                    this.closeModal()
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.AjouterCompteBancaire)
                    this.data_error = error.response?.data
                })
        },
    },
    mounted() {
        // this.$store.state.comptebancaires?.length
        //     ? this.comptebancaires = this.$store.state.comptebancaires: 
        this.getCompteBancaires();
    }
}
</script>

<style scoped>
input {
    width: 100%;
}

/* .credit.btn{
    background-color: #2a1d9b; 
} */
.menu_options {
    min-width: fit-content;
}

.menu_options button {
    padding: 5px 8px;
    border: 1px solid transparent;
    text-align: left;
    display: flex;
    align-items: center;
    width: 100%;
    gap: 8px;
    background: transparent !important;

    &:hover {
        border-bottom: 1px solid;
    }
}
</style>