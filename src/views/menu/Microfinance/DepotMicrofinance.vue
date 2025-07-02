<template>
    <Navbar />
    <Modal :isVisible="show_modal" @close="closing">
        <div class="form">
            <span class="title"> Depot Microfinance</span>
            <div class="content">
                <label>Montant:</label>
                <input type="number" placeholder="Montant" v-model="montant">
                <label>Motif:</label>
                <input type="text" placeholder="Motif" v-model="motif">
            </div>
            <button class="btn-modal" @click="postdepot">Creer {{ money(montant) }} </button>
        </div>
    </Modal>
    <div class="container">
        <div class="subMenu-headers">
            <div class="row">
                <button class="btn retour" @click="goBack">&#10094;</button>
                <!-- <button class="btn" @click="show_modal = true"><i class="fa-solid fa-plus"></i> Ajouter</button> -->
            </div>
            <div class="row">
                <SearchComponent :searchFunction="searchLasta" />
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
                </tr>
                <tr v-for="item in list" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ money(item.montant) }}</td>
                    <td>{{ item.details }}</td>
                    <td>{{ datetime(item.created_at) }}</td>
                    <td>{{ item.created_by }}</td>
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
            show_modal: false,
            montant: 0,
            motif: '',
            list: [],
        }
    },
    components: {
        Navbar, Modal, SearchComponent
    },
    methods: {
        closing() {
            this.montant = '';
            this.motif = '';
            this.show_modal = false;
        },
        searchLasta(text) {
            axios.get(`credits/?search=${text}`)
                .then((reponse) => {
                this.credits = reponse.data;
                this.closeModal()
            }).catch((error) => {
                this.displayErrorOrRefreshToken(error, () => searchLasta(text));
            })
        },
        getdepot() {
            axios.get(`depotmicrofinance/`)
                .then((reponse) => {
                    this.list = reponse.data.results
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getdepot)
                })
        },
        postdepot() {
            const data = {
                montant: this.montant,
                details: this.motif,
            };
            axios.post('depotmicrofinance/', data)
                .then((reponse) => {
                    this.$store.state.message.success = "Deposé avec succès.";
                    this.list.unshift(reponse.data)
                    this.closing()
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.postdepot);
                });
        },
    },
    mounted() {
        this.getdepot();
    }
}
</script>
