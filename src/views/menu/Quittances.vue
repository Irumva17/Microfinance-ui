<template>
    <div class="printable" v-if="quittances_nums">
        <Print_quittances :quittances_nums="quittances_nums" class="printable" />
    </div>
    <div class="not_printable">
        <Navbar />
        <Modal :isVisible="show_modal" @close="closeModal">
            <form class="form" @submit.prevent="nouveauPlacement">
                <span class="title">Nouveaux Quittances</span>
                <div class="content">
                    <label for="quantite">Quantite</label>
                    <input type="text" id="quantite" placeholder="Quantité" v-model="quantite">
                    <small v-for="err in data_error?.quantite" :key="err.id">
                        {{ err }}
                    </small>
                </div>
                <button class="btn-modal" @click="nouveauQuittance">Créer</button>
            </form>
        </Modal>
        <Modal :isVisible="show_select" @close="closeModal">
            <form @submit.prevent="" class="form">
                <div class="content">

                    <label>Code debut : </label>
                    <input type="text" v-model="code_debut" />
                    <label>Code fin :</label>
                    <input type="text" v-model="code_fin">
                    <label>Date de validation : </label>
                    <div class="inputRow">
                        <input type="date" v-model="valider_superieur" />
                        <input type="date" v-model="valider_inferieur" />
                    </div>
                </div>
                <button class="btn-modal" @click="searchGet">Filtrage</button>
            </form>
        </Modal>
        <div class="container">
            <div class="btn-headers">
                <div class="row">
                    <button class="btn retour" @click="goBack">&#10094;</button>
                    <button class="btn" @click="show_modal = true"><i class="fa-solid fa-plus"></i> Ajouter</button>
                </div>
                <button @click="show_select = true" class="btn">
                    Filtrer
                </button>
            </div>
            <section class="table">
                <table>
                    <tr>
                        <th>Id</th>
                        <th>Date</th>
                        <th>Demandé Par</th>
                        <th>Quantité</th>
                        <th>Numero </th>
                        <th>Status</th>
                    </tr>
                    <tr v-for="quittance in quittances" :key="quittance.date">
                        <td>{{ quittance.id }}</td>
                        <td>{{ datetime(quittance.created_at) }}</td>
                        <td>{{ quittance.created_by }}</td>
                        <td>{{ quittance.code_fin - quittance.code_debut + 1 }}</td>
                        <td>{{ quittance.code_debut }} - {{ quittance.code_fin }}</td>
                        <td>
                            <div class="btns">
                                <button v-if="quittance.validated_by == 'None'" @click="valider(quittance.id)"
                                    class="btn">Valider</button>
                                <button v-else class="btn" @click="getReady(quittance)">
                                    <i class="fa-solid fa-print"></i> Imprimer
                                </button>
                                <!-- <button v-if="quittance.validated_by == 'None'" class="btn delete"
                                    @click=" deletequittance(quittance.id)">
                                    <i class="fa-solid fa-trash"></i>
                                </button> -->
                            </div>
                        </td>
                    </tr>
                </table>
            </section>
        </div>
    </div>
</template>

<script>
import Modal from '@/Overlays/Modal.vue';
import Navbar from '@/components/Navbar.vue'
import SearchComponent from '@/components/SearchComponent.vue';
import Print_quittances from '@/services/print_quittances.vue';
export default {
    data() {
        return {
            quittances: [],
            allquittances: [],
            show_modal: false,
            quantite: '',
            quittances_nums: 0,
            show_select: false,
            valider_inferieur: '',
            valider_superieur: '',
            code_debut: '',
            code_fin: '',
            data_error: {}
        }
    },
    components: {
        Navbar, SearchComponent, Modal, Print_quittances
    },
    methods: {
        searchLasta(text) {
            axios.get(`quittances/?search=${text}`)
                .then((reponse) => {
                    this.quittances = reponse.data.results;
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.searchLasta(text));
                })
        },
        searchGet() {
            this.$store.state.message.error = "";
            axios
                .get(`/quittances/?code_debut=${this.code_debut}&code_fin=${this.code_fin}&validated_at__gte=${this.valider_superieur}&validated_at__lte=${this.valider_inferieur}`)
                .then((reponse) => {
                    this.quittances = reponse.data.results;
                    this.show_select = false;
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.searchGet)
                })
        },
        getReady(quittance) {
            this.quittances_nums = [];
            for (let i = quittance.code_debut; i <= quittance.code_fin; i++) {
                this.quittances_nums.push(i);
            }
            this.$nextTick(() => {
                print();
            });
        },
        closeModal() {
            this.quantite = ''
            this.show_modal = false
            this.show_print = false
            this.show_select = false
        },
        valider(quittance_id) {
            axios.get(`quittances/${quittance_id}/valider/`)
                .then((response) => {
                    this.$store.state.message.success = 'Validé avec succés.'
                    this.quittances = this.quittances.map(quittance => {
                        if (quittance.id === quittance_id) {
                            return { ...quittance, ...response.data }
                        }
                        return quittance
                    })
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, () => this.valider(quittance_id))
                })
        },
        getQuittances() {
            axios.get('quittances/')
                .then((response) => {
                    this.quittances = response.data.results
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getQuittances)
                })
        },
        nouveauQuittance() {
            axios.post('quittances/', { 'quantite': this.quantite })
                .then((response) => {
                    this.$store.state.message.success = `${this.quantite} quittances ont été créés avec succès.`
                    this.quittances.unshift(response.data)
                    this.closeModal()
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.nouveauQuittance)
                    this.data_error = error.response?.data
                })
        },
        // async deletequittance(id) {
        //     const confirmation = confirm(`Vous voulez vraiment supprimer le quittance ${id}`)
        //     if (confirmation) {
        //         try {
        //             await axios.delete(`quittances/${id}/`);
        //             this.quittances = this.quittances.filter(quitt => quitt.id != id)
        //         } catch (error) {
        //             this.displayErrorOrRefreshToken(error, () => this.deletequittance(id))
        //         }
        //     }
        // },
    },
    mounted() {
        this.getQuittances()
    }
}
</script>

<style></style>
