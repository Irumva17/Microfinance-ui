<template>
    <Navbar class="not_printable" />

    <Modal :isVisible="show_add_depot" @close="closeModal">
        <form class="form" @submit.prevent="addDepot">
            <span class="title">Depot epargne</span>
            <div class="content">
                <label> Montant:</label>
                <input type="number" placeholder="Montant" v-model="depot.montant" required>
                <label> Details:</label>
                <input type="text" placeholder="Details" v-model="depot.details" required>
            </div>
            <button class="btn-modal">Deposer {{ money(depot.montant || 0) }}</button>
        </form>
    </Modal>
    
    <!-- <Modal :isVisible="show_etat" @close="closeModal">
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
    
    <div class="container not_printable">
        <div class="details_disp not_printable">
            <div class="btns">
                <div class="btn retour" @click="goBack">&#10094;</div>
                <button class="btn"
                    v-if="$route.query.active !== 'false'"
                    @click="show_add_depot = true"
                > 
                    <i class="fa-solid fa-plus"></i> 
                    Ajouter
                </button>
                <button class="btn delete" @click="closeEpargne"><i class="fa-solid fa-ban"></i> Cloturer</button>
            </div>
            <div v-if="$route.query.active !== 'false'" class="row">
                <p class="detail">
                    <strong>Duree(jours):</strong>
                    {{ money(state.duree_jours) }}
                </p>
                <p class="detail">
                    <strong>Interet:</strong>
                    {{ money(state.interets) }}
                </p>
                <p class="detail">
                    <strong>Montant epargné:</strong>
                    {{ money(state.montant_epargne) }} Fbu
                </p>
                <p class="detail">
                    <strong>Montant total:</strong>
                    {{ money(state.montant_epargne) }} Fbu
                </p>
            </div>
        </div>
        <section class="table">
            <table>
                <tr>
                    <th>Id</th>
                    <th>Montant</th>
                    <th>Motif</th>
                    <th>Date</th>
                    <th>Fait par</th>
                    <!-- <th>Options</th> -->
                </tr>
                <tr v-for="(item, index) in list" :key="index">
                    <td>{{ item.id }}</td>
                    <td>{{ money(item.montant) }}</td>
                    <td>{{ item.details }}</td>
                    <td>{{ datetime(item.created_at) }}</td>
                    <td>{{ item.created_by }}</td>
                    <!-- <td>
                        <button class="btn" @click="printDepot(item)">
                            <i class="fa-solid fa-print"></i>
                            Imprimer
                        </button>
                    </td> -->
                </tr>
            </table>
        </section>
    </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Modal from '@/Overlays/Modal.vue';
export default {
    data() {
        return {
            list: [],
            state: {},
            show_add_depot : false,
            depot: {
                epargne: this.$route.params.compte
            }
        }
    },
    components: {
        Navbar, Modal
    },
    computed: {
        epargneId(){
            return parseInt(this.$route.params.compte)
        }
    },
    methods: {
        getEpargneEtat() {
            this.show_etat = true
            axios.get(`epargnes/${this.epargneId}/etats_epargne/`)
                .then((response) => {
                    this.state = response.data
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getEpargneEtat)
                })
        },
        closeModal(){
            this.show_add_depot = false
            this.depot = {
                epargne: this.$route.params.compte
            }
        },
        getItems() {
            axios.get(`depotepargnes/?epargne__id=${this.epargneId}`)
                .then((reponse) => {
                    this.list = reponse.data.results
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getItems)
                })
        },
        addDepot() {
            axios.post('depotepargnes/', this.depot)
                .then((response) => {
                    this.$store.state.message.success = 'Depot reçue.'
                    this.closeModal()
                    this.list.push(response.data)
                    this.getEpargneEtat()
                }).catch(error => {
                    this.displayErrorOrRefreshToken(error, () => this.addDepot(compte))
                })
        },
        closeEpargne() {
            axios.get(`epargnes/${this.epargneId}/close_epargne/`)
                .then(() => {
                    this.$store.state.message.success = 'Epargne cloturer.'
                    this.$router.replace(`/depot_epargne/${this.epargneId}?active=false`)
                }).catch(error => {
                    this.displayErrorOrRefreshToken(error, this.closeEpargne)
                })
        },
    },
    mounted() {
        if(this.$route.query.active !== 'false') {
            this.getEpargneEtat();
        }
        this.getItems();
    }
}
</script>

<style scoped>
.details_disp {
    display: flex;
    justify-content: space-between;
    background-color: var(--primary);
    color: var(--second);
    padding: 10px;
    border-radius: 5px;

    .retour {
        background-color: var(--second);
        color: var(--primary);
    }

    p {
        padding: 6px;
        border-radius: 3px;
        border: 1px solid var(--second);
        margin: 0;
    }
}

</style>