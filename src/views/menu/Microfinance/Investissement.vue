<template>
    <Navbar />
    <Modal :isVisible="show_modal" @close="closing">
        <div class="form">
            <span class="title"> Depenser investie</span>
            <div class="content">
                <label>Numéro de référence:</label>
                <input type="number" placeholder="Numero" v-model="number">
                <small v-for="err in data_error?.ref_number" :key="err.id">
                    {{ err }}
                </small>
                <label>Nom:</label>
                <input type="text" placeholder="Nom" v-model="Nom">
                <small v-for="err in data_error?.nom" :key="err.id">
                    {{ err }}
                </small>
                <label>Montant:</label>
                <input type="number" placeholder="Montant" v-model="montant">
                <small v-for="err in data_error?.montant" :key="err.id">
                    {{ err }}
                </small>
                <label>Détails:</label>
                <input type="text" placeholder="Détails" v-model="detail">
            </div>
            <button class="btn-modal" @click="postInvesti">Creer {{ money(montant) }} </button>
        </div>
    </Modal>
    <div class="container">
        <div class="btns">
            <button class="btn retour" @click="goBack">&#10094;</button>
            <button class="btn" @click="show_modal = true"><i class="fa-solid fa-plus"></i> Ajouter</button>
        </div>
        <section class="table">
            <table>
                <tr>
                    <th>Nom</th>
                    <th>Montant</th>
                    <th>Motif</th>
                    <th>Date</th>
                    <th>Fait par</th>
                    <th>Microfinance</th>
                    <th>Option</th>
                </tr>
                <tr v-for="item in list" :key="item.id">
                    <td>{{ item.nom }}</td>
                    <td>{{ money(item.montant) }}</td>
                    <td>{{ item.details }}</td>
                    <td>{{ datetime(item.created_at) }}</td>
                    <td>{{ item.created_by }}</td>
                    <td>{{ item.microfinance }}</td>
                    <td>
                        <button @click="handleDelete(item.id)" class="btn delete">
                            <i class="fa-solid fa-trash"></i>
                        </button>
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
            montant: 0,
            Nom: '',
            number: '',
            detail: '',
            list: [],
            data_error: {}        
        }
    },
    components: {
        Navbar, Modal
    },
    methods: {
        async handleDelete(id) {
      const confirmation = confirm(`Vous voulez vraiment supprimer ce crédit?`)
      if (confirmation) {
        try {
          await axios.delete(`depenseinvestissement/${id}/`);
          this.list = this.list.filter(user => user.id != id);
          this.$store.state.message.success = 'Supprimés avec succès.'
        } catch (error) {
          this.displayErrorOrRefreshToken(error, this.handleDelete)
        }
      }
    },
        closing() {
            this.show_modal = false;
            this.montant = '';
            this.Nom = '',
                this.number = '',
                this.detail = ''
        },
        getInvesti() {
            axios.get('depenseinvestissement/')
                .then((reponse) => {
                    this.list = reponse.data.results
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getdepot)
                })
        },
        postInvesti() {
            const data = {
                ref_number: this.number,
                nom: this.Nom,
                montant: this.montant,
                details: this.detail,
            };
            axios.post('depenseinvestissement/', data)
                .then((reponse) => {
                    this.$store.state.message.success = "Succès d'investissement.";
                    this.list.unshift(reponse.data)
                    this.closing()
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.postRetrait);
                    this.data_error = error.response?.data
                });
        },
    },
    mounted() {
        this.getInvesti();
    }
}
</script>
