<template>
    <Navbar />
    <Modal :isVisible="show_modal" @close="closeModal">
        <form class="form" @submit.prevent="nouveauxRemiseOuReprise">
            <span class="title">Nouveau {{ action }}</span>
            <div class="content">
                <label>Montant :</label>
                <input type="number" v-model="montant">
                <small v-for="err in data_error?.montant" :key="err.id">
                    {{ err }}
                </small>
                <label>Details :</label>
                <input type="text" v-model="details">
                <small v-for="err in data_error?.details" :key="err.id">
                    {{ err }}
                </small>
                <label v-if="action === 'reprise'"> Banque :</label>
                <select v-if="action === 'reprise'"  v-model="banque">
                    <option value="">--------</option>
                    <option v-for="banque in banques" :key="banque.id" :value="banque.id">
                        {{ banque.banque }}
                    </option>
                </select>
                <small v-for="err in data_error?.banque" :key="err.id">
                    {{ err }}
                </small>
            </div>
            <button class="btn-modal"> 
                {{ action }} {{ money(montant) }}
            </button>
        </form>
    </Modal>
    <div class="container">
        <div class="btns">
            <span class="btn" @click="goBack">&#10094;</span>
            <span class="btn" @click="show_modal = true, action = 'remise'">
                <i class="fa-solid fa-arrow-down"></i> &nbsp; Remettre
            </span>
            <span class="btn" @click="show_modal = true, action = 'reprise'">
                <i class="fa-solid fa-arrow-up"></i> &nbsp; Reprendre
            </span>
            <PasswordValidator 
              v-if="validate_password" 
              @close="validate_password = false"
              @validate="valider"
            />
        </div>
        <section class="table">
            <table>
                <tr>
                    <th>ID</th>
                    <th>Montant</th>
                    <th>Date de création</th>
                    <th>Détails</th>
                    <!-- <th>Action</th> -->
                    <th>Date de réception</th>
                    <th>Créé par</th>
                    <th>Reçu par</th>
                    <th>Agence</th>
                    <th>Banque</th>
                    <th>Status</th>
                </tr>
                <tr v-for="remise in remises_reprises" :key="remise.id">
                    <td>{{ remise.id }}</td>
                    <td>{{ money(remise.montant) }}</td>
                    <td>{{ datetime(remise.created_at) }}</td>
                    <td>{{ remise.details }}</td>
                    <!-- <td>{{ remise.action }}</td> -->
                    <td>{{ datetime(remise.received_at) }}</td>
                    <td>
                        <span v-if="!remise.created_by?.last_name && !remise.created_by?.first_name">
                            {{ remise.created_by?.username }}
                        </span>
                        <span v-else>{{ remise.created_by?.last_name }} {{ remise.created_by?.first_name }}</span>
                    </td>
                    <td>
                        <span v-if="!remise.received_by?.last_name && !remise.received_by?.first_name">
                            {{ remise.received_by?.username }}
                        </span>
                        <span v-else>{{ remise.received_by?.last_name }} {{ remise.received_by?.first_name }}</span>
                    </td>
                    <td>{{ remise.agence?.nom }}</td>
                    <td>{{ remise.banque ? remise.banque?.nom : '-' }}</td>
                    <td>
                        <span v-if="remise.received_at" class="valid">Validé</span>
                        <button v-else class="btn" 
                            @click=" validation_id = remise.id, 
                                validation_action = remise.action,
                                validate_password = true "
                        >
                            Valider
                        </button>
                    </td>
                </tr>
            </table>
        </section>
    </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Modal from '@/Overlays/Modal.vue';
import PasswordValidator from '@/Overlays/PasswordValidator.vue';
export default {
    data() {
        return {
            remises_reprises: [],
            montant: 0,
            details: '',
            action: '',
            banques: '',
            banque : '',
            compte_arrive: '',
            show_modal: false,
            users: [],
            data_error: {},
            validate_password : '',
            validation_id : '',
            validation_action : ''
        }
    },
    components: {
        Navbar,
        Modal,
        PasswordValidator
    },
    methods: {
        valider() {
            axios.get(`remiserepriseagences/${this.validation_id}/valider_remise_reprise/`)
                .then((response) => {
                    this.remises_reprises = this.remises_reprises.map(remises_reprise => {
                        if (remises_reprise.id === this.validation_id)  return { ...remises_reprise, ...response.data }
                        return remises_reprise
                    })
                    this.validation_action === 'remise'
                        ? this.$store.state.user.agence.balance += response.data.montant
                        : this.$store.state.user.agence.balance -= response.data.montant
                    this.$store.state.message.success = 'Validé avec succès.'
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.valider)
                })
        },
        closeModal() {
            this.montant = 0,
            this.details = '',
            this.action = '',
            this.compte_arrive = '',
            this.show_modal = false
        },
        getRemises() {
            axios.get(`remiserepriseagences/?agence__nom=${this.$route.params.agenceNom}`)
                .then((response) => {
                    this.remises_reprises = response.data.results
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getRemises)
                })
        },
        nouveauxRemiseOuReprise() {
            const formData = new FormData();
            formData.append(
                'montant', 
                this.action === 'remise' ? this.montant : -1 * this.montant
            );
            formData.append('details', this.details);
            // formData.append('action', this.action);
            formData.append('received_by', this.compte_arrive);
            formData.append('agence', parseInt(this.$route.query.id));
            formData.append('banque', this.action === 'reprise' ? this.banque : '')

            axios.post('remiserepriseagences/', formData)
                .then((response) => {
                    this.remises_reprises.unshift(response.data)
                    this.$store.state.message.success = `${this.action} effectué avec succès.`
                    this.closeModal()
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.nouveauxRemiseOuReprise)
                    this.data_error = error.response?.data
                })
        },
        async getBanques(of = 1, banques = []) {
            await axios.get(`comptebancaire/?page=${of}`)
                .then((response) => {
                    const data = response.data
                    if (data.next) {
                        banques = banques.concat(data.results)
                        this.getBanques(of + 1, banques)
                    } else {
                        this.banques = banques.concat(data.results)
                    }
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getBanques)
                })
        },

    },
    mounted() {
        this.getRemises()
        this.getBanques()
    }
}
</script>