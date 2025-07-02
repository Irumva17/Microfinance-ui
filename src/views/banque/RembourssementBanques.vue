<template>
    <Navbar />
    <Modal :isVisible="show_filter" @close="closing">
        <div class="form">
            <div class="title">Filtrer</div>
            <div class="content">
                <label for="credit">Crédit banque</label>
                <input type="text" name="credit" v-model="credit">
                <small v-for="err in data_error?.credit__banque" :key="err.id">
                    {{ err }}
                </small>
                <label for="from">Date inférieur ou egale à:</label>
                <input type="date" name="from" v-model="from">
                <label for="to">Date supérieur ou egale à:</label>
                <input type="date" name="to" v-model="to">
            </div>
            <button class="btn-modal" @click="getRembourssements('', true)">Filtrer</button>
        </div>
    </Modal>
    <Modal :isVisible="show_modal" @close="closing">
        <div class="form">
            <span class="title">Nouveau Rembourssement</span>
            <div class="content">
                <label for="num">Numero de référence:</label>
                <input type="text" id="num" placeholder="Numero de référence" v-model="ref_number">
                <small v-for="err in data_error?.ref_number" :key="err.id">
                    {{ err }}
                </small>
                <label for="montant">Montant payée:</label>
                <input type="number" id="montant" placeholder="Montant" v-model="montant">
                <small v-for="err in data_error?.montant" :key="err.id">
                    {{ err }}
                </small>
                <label for="motif">Date:</label>
                <input type="date" id="date" v-model="date">
                <small v-for="err in data_error?.date" :key="err.id">
                    {{ err }}
                </small>
            </div>
            <button class="btn-modal" @click="nouveauxRembourssements">Créer {{ money(montant) }} </button>
        </div>
    </Modal>
    <div class="container">
        <div class="subMenu-headers">
            <div class="btns">
                <button class="btn retour" @click="goBack">&#10094;</button>
                <button class="btn"  
                    v-if="this.$route.query.credit"
                    @click="show_modal = true">
                    <i class="fa-solid fa-plus"></i> Ajouter 
                </button>
            </div>
            <div class="row">
                <div class="btn" @click="show_filter = true">Filtre</div>
                <SearchComponent :search-function="getRembourssements"/>
            </div>
        </div>
        <section class="table">
            <table>
                <tr>
                    <th>Id</th>
                    <th>Numero de référence</th>
                    <th>Montant payée</th>
                    <th>Date de création</th>
                    <th>Date</th>
                    <th>Credit</th>
                    <th>Créer par</th>
                </tr>
                <tr v-for="item in list" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.ref_number }}</td>
                    <td>{{ money(item.montant_payee) }}</td>
                    <td>{{ datetime(item.created_at) }}</td>
                    <td>{{ item.date }}</td>
                    <td>{{ item.credit.banque.banque }}</td>
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
            ref_number: '',
            montant: null,
            date: null,
            credit: null,
            list: [],
            data_error: {},
            from : '',
            to : '',
            show_filter : false
        }
    },
    components: {
        Navbar, Modal,
        SearchComponent,
    },
    methods: {
        closing() {
            this.show_modal = false;
            this.ref_number = '',
            this.montant = null,
            this.date = null,
            this.credit = '',
            this.show_filter = null
        },
        getRembourssements(keyword = '', filtre = parseInt(this.$route.query.credit) || false ) {
            axios.get(
                `/remboursementbanques/${keyword ? `?search=${keyword}` : filtre ? 
                `?credit__banque=${parseInt(this.$route.query.credit) || this.credit}&created_at__gte=${this.from}&created_at__lte=${this.to}` :''}`
            ).then((reponse) => {
                this.list = reponse.data.results;
                this.closing()
            }).catch((error) => {
                this.data_error = error?.response?.data
                this.displayErrorOrRefreshToken(error, this.getRembourssements(keyword = '', filtre = parseInt(this.$route.query.credit) || false ));
            })
        },
        nouveauxRembourssements() {

            const formData = new FormData();

            formData.append('ref_number', this.ref_number);
            formData.append('montant_payee', this.montant);
            formData.append('date', this.date);
            formData.append('credit', parseInt(this.$route.query.credit));

            axios
                .post('remboursementbanques/', formData)
                .then((reponse) => {
                    this.list.unshift(reponse.data);
                    this.closing();
                    this.$store.state.message.success = 'Rembourssement ajouté avec succès.'
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.nouveauxRembourssements);
                    this.data_error = error.response?.data
                });
        }
    },
    mounted() {
        this.getRembourssements();
    }
}
</script>
