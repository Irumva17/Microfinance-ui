<template>
    <Modal :isVisible="show_modal" @close="closeModal">
        <form class="form" @submit.prevent="handleAction">
            <span class="title">{{ selected_agency ? `Modifier l'agence`: 'Créer un agence' }}</span>
            <div class="content">
                <label>Nom</label>
                <input type="text" v-model="nom">
                <small v-for="(err, index) in data_error?.nom" :key="index">
                    {{ err }}
                </small>
                <label>Adresse</label>
                <input type="text" v-model="adresse">
                <label>Details</label>
                <textarea type="text" v-model="details"></textarea>
                <!-- <label>Microfinance</label>
                <input type="text" v-model="get_microfinance" disabled> -->
            </div>
            <button class="btn-modal" type="submit">{{ selected_agency ? 'Modifier' : 'Créer'}}</button>
        </form>
    </Modal>
    <div class="subMenu-headers">
        <button class="btn" @click="show_modal = true">
            <i class="fa-solid fa-plus"></i> Agence 
        </button>
        <!-- <SearchComponent :search-function="chercherUneAgence" placeholder="Nom de l'agence"/> -->
    </div>
    <section class="table">
        <table>
            <tr>
                <th>Nom</th>
                <th>Date</th>
                <th>Adresse</th>
                <th>Balance</th>
                <!-- <th>Depots</th>
                <th>Retraits</th> -->
                <!-- <th>Microfinance</th> -->
                <th>Options</th>
            </tr>
            <tr v-for="agence in agences" :key="agence.id" @dblclick="gotremise(agence.nom, agence.id)" class="clickable-row">
                <td>{{ agence.nom }}</td>
                <td>{{ datetime(agence.created_at) }}</td>
                <td>{{ agence.adresse }}</td>
                <td>{{ money(agence.balance) }}</td>
                <!-- <td>{{ money(agence.depots) }}</td>
                <td>{{ money(agence.retraits) }}</td> -->

                <!-- <td>{{ agence.microfinance }}</td> -->
                <td>
                    <i class="btn fa fa-ellipsis-v" @click="toggleOptions(agence.id)"></i>
                    <div v-if="selected_agency === agence.id" :class="`menu_options`">
                        <!-- <button class="btn" @click="handelAgence(agence.id, agence)"> <i class="fa-solid fa-pencil"></i> Modifier</button> -->
                        <button class="btn" @click="gotToHistory(agence.id)"> <i class="fa-solid fa-clock-rotate-left"></i> Historique</button>
                        <button class="btn" @click="gotremise(agence.nom, agence.id)"><i class="fa-solid fa-hand-holding-dollar"></i> Remettre/Reprendre </button>
                        <div class="menu_arrow">‣</div>
                    </div>
                </td>
            </tr>
        </table>
    </section>
</template>
<script>
import Modal from '@/Overlays/Modal.vue';
import SearchComponent from '../SearchComponent.vue';
export default {
    data() {
        return {
            agences: [],
            selected_agency: null,
            nom: '',
            details: '',
            nom: '',
            adresse: '',
            microfinance:'',
            details: '',
            show_modal: false,
            selected: '',
            selectedGroupId: null,

            data_error: {}
        }
    },
    components: { Modal, SearchComponent },
    methods: {
        toggleOptions(id) {
            this.selected_agency = this.selected_agency === id ? null : id;
        },
        gotremise(nom, id){
            this.$router.push({name : 'Remise agences', params: {agenceNom: nom,}, query : { id : id}})
        },
        gotToHistory(id){
            this.$router.push({name : 'historiques/:id', params: {id : id}})
        },
        handleAction() {
            if (this.selected_agency) {
                this.changeAgency()
            } else {
                this.createAgency()
            }
        },
        async getAgences(of = 1, agences = []) {
            await axios.get(`agences/?page=${of}`)
                .then((response) => {
                    const data = response.data
                    data.nex ? (
                        agences = agences.concat(data.results),
                        this.getAgences(of + 1, agences)
                    ) : (
                        this.agences = agences.concat(data.results),
                        this.$store.state.agences = this.agences
                    )
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getAgences)
                })
        },
        handelAgence(id, agence) {
            this.selected_agency = id
            this.nom = agence.nom,
            this.adresse = agence.adresse
            this.details = agence.details,
            this.microfinance = agence.microfinance,
            this.show_modal = true
        },
        closeModal() {
            this.show_modal = false,
            this.nom = '';
            this.adresse = '';
            this.details = '';
            this.microfinance = '',
            this.selected_agency = ''
            this.data_error = []
        },
        async changeAgency() {
            const data = new FormData();

            data.append('nom', this.nom)
            data.append('adresse', this.adresse)
            data.append('details', this.details)
            // data.append('microfinance', this.$store.state.user.agence.microfinance.id)
            try {
                const response = await axios.put(`agences/${this.selected_agency}/`, data)
                this.agences = this.agences.map((agence) => {
                    if (agence.id === this.selected_agency) return { ...agence, ...response.data }
                    return agence
                })
                this.$store.state.message.success = `Modification de l'agence ${this.nom} avec succès.`
                this.closeModal()
            } catch (error) {
                this.displayErrorOrRefreshToken(error, this.changeAgency)
            }
        },

        async createAgency() {
            const form = new FormData();

            form.append('nom', this.nom)
            form.append('adresse', this.adresse)
            form.append('details', this.details)
            // form.append('microfinance', this.$store.state.user.agence.microfinance.id)

            await axios.post('agences/', form)
                .then((response) => {
                    this.$store.state.message.success = 'Vous avez crée une agence avec succèss.'
                    this.agences.unshift(response.data)
                    this.closeModal()
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.createAgency)
                    this.data_error = error.response?.data
                })
        },
        // chercherUneAgence(keyword){
        //     axios.get(`agences/?search=${keyword}/`)
        //     .then((response)=>{
        //         //
        //     }).catch((error)=>{
        //         this.displayErrorOrRefreshToken(error, ()=> this.chercherUneAgence(keyword))
        //     })
        // }
    },
    mounted() {
        // if (this.$store.state.agences.length) {
        //     this.agences = this.$store.state.agences
        // } else {
            this.getAgences();
        // }
    }
}
</script>

<style scoped>
.menu_options{
    min-width: fit-content;
}
.menu_options button{
    padding:5px 8px;
    border: 1px solid transparent;
    text-align: left;
    display: flex;
    align-items: center;
    width: 100%;
    gap: 8px;
    &:hover{
        border-bottom: 1px solid;
        /* filter: saturate(1.7); */
    }
}
</style>