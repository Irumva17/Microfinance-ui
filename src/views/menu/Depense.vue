<template>
    <Navbar />
    <Modal :isVisible="show_depense" @close="closeModal">
        <div class="form">
            <span class="title">Ajouter une depense</span>
            <div class="content">
                <label for="ref_number">Numero de référence :</label>
                <input type="text" id="ref_number" v-model="ref_compte" placeholder="Mettez le numero de reférence">
                <small v-for="err in data_error?.ref_number" :key="err.id">
                    {{ err }}
                </small>
                <label for="full_name">Intitulé :</label>
                <input type="text" id="full_name" v-model="nom" placeholder="Mettez votre nom">
                <small v-for="err in data_error?.nom" :key="err.id">
                    {{ err }}
                </small>
                <label>Montant :</label>
                <input type="number" v-model="montant" placeholder="Mettez votre montant">
                <small v-for="err in data_error?.montant" :key="err.id">
                    {{ err }}
                </small>
                <label>Détails :</label>
                <input type="text" v-model="details" placeholder="Mettez votre details">
                <small v-for="err in data_error?.details" :key="err.id">
                    {{ err }}
                </small>
                <label for="agence">Agence</label>
                <select name="agence" v-model="agence">
                    <option value="" disabled>-----</option>
                    <option v-for="agence in $store.state.agences" :key="agence.id" :value="agence.id">{{ agence.nom
                        }}
                    </option>
                </select>
                <small v-for="err in data_error?.agence" :key="err.id">
                    {{ err }}
                </small>
            </div>
            <button class="btn-modal" @click="functionDepense">Créer {{ money(montant || 0) }}</button>
        </div>
    </Modal>
    <Modal :isVisible="show_valider" @close="closeModal">
        <div class="form">
            <span class="title">Validation du depense</span>
            <div class="content">
                <div v-if="is_loading">
                    <span>chargement du plan comptable en court...</span>
                    </div>
                    <div v-else>
                    <label for="debiteur">Debiteur</label>
                    <select id="debiteur" v-model="debiteur">
                        <option value="" disabled>--------</option>
                        <option v-for="plan in plan_comptables" :key="plan.id" :value="plan.id">{{ plan.numero + '-' +
                            plan.nom }}</option>
                    </select>
                    <label for="Crediteur">Crediteur</label>
                    <select id="crediteur" v-model="crediteur">
                        <option value="" disabled>--------</option>
                        <option v-for="plan in plan_comptables" :key="plan.id" :value="plan.id">{{ plan.numero + '-' +
                            plan.nom
                            }}</option>
                    </select>
                </div>
            </div>
            <button class="btn-modal" @click="functionValiderDepense(valider)">Valider</button>
        </div>
    </Modal>
    <div class="container">
        <div class="row">
            <button class="btn retour" @click="goBack">&#10094;</button>
            <button class="btn" @click="show_depense = true">
                <i class="fa-solid fa-plus"></i> Ajouter</button>
        </div>
        <section class="table">
            <table>
                <tr>
                    <th>Id</th>
                    <th>Nom</th>
                    <th>Numero de compte</th>
                    <th>Details</th>
                    <th>Date de création</th>
                    <th>Creer par</th>
                    <th>Montant</th>
                    <th>Agence</th>
                    <th>Option</th>
                </tr>
                <tr v-for="item in depenses" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.nom }}</td>
                    <td>{{ item.ref_number }}</td>
                    <td>{{ item.details }}</td>
                    <td>{{ datetime(item.created_at) }}</td>
                    <td>{{ item.created_by }}</td>
                    <td>{{ money(item.montant) }}</td>
                    <td>{{ item.agence }}</td>
                    <td>
                        <button 
                            class="btn" 
                            v-if="item.approved_at === null" 
                            @click="modalvalider(item)">
                            Valider
                        </button>
                        <span v-else class="valid">Validé</span>
                    </td>
                </tr>

            </table>
        </section>
    </div>
</template>
<script>
import Navbar from "@/components/Navbar.vue";
import Modal from "@/Overlays/Modal.vue";
export default {
    data() {
        return {
            depenses: [],
            show_depense: false,
            show_valider: false,
            is_loading: false,
            got_accounts: [],
            result: '',
            keyword: '',
            ref_compte: '',
            nom: '',
            details: '',
            montant: '',
            agence: '',
            crediteur: null,
            debiteur: null,
            data_error: false,
            plan_comptables: [],
            agences: [],
            data_error : {}
        }
    },
    components: {
        Navbar,
        Modal
    },
    methods: {
        modalvalider(item) {
            this.show_valider = true
            this.valider = item.id
        },
        closeModal() {
            this.show_depense = false;
            this.show_valider = false;
            this.ref_compte = '';
            this.nom = '';
            this.details = '';
            this.montant = '';
            this.agence = '';
        },
        getDepense() {
            axios.get('depenses/')
                .then((reponse) => {
                    this.depenses = reponse.data.results
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getDepense)
                })
        },
        async functionDepense() {
            const formData = new FormData();
            formData.append("ref_number", this.ref_compte);
            formData.append("nom", this.nom);
            formData.append("montant", this.montant);
            formData.append("details", this.details);
            formData.append("agence", this.agence);
            try {
                const response = await axios.post("depenses/", formData)
                this.closeModal();
                this.$store.state.message.success = "Depense enregistré avec succès.";
                this.depenses.unshift(response.data)
            } catch (error) {
                this.displayErrorOrRefreshToken(error, this.functionDepense)
                this.data_error = error.response?.data
            }
        },
        async functionValiderDepense(id) {
            const formData = new FormData();
            formData.append("crediteur", this.crediteur);
            formData.append("debiteur", this.debiteur);
            try {
                const response = await axios.post(`depenses/${id}/valider/`, formData)
                this.closeModal();
                let itemIndex = this.depenses.findIndex((item) => item.id === id)
                this.depenses[itemIndex] = response
                this.$store.commit('setSuccess', 'Validé avec succès.')
            } catch (error) {
                this.displayErrorOrRefreshToken(error,()=> this.functionValiderDepense(id))
                this.data_error = error.response.data?.error
            }
        }
    },
    mounted() {
        this.getDepense();
        this.getAgences()
        this.getPlans()
    }
}
</script>
