<template>
    <Navbar />
    <Modal :isVisible="show_modal" @close="closeModal">
        <form class="form" @submit.prevent="nouveauxRemiseOuReprise">
            <span class="title">Nouveaux {{ action }}.</span>
            <div class="content">
                <small v-if="action === 'remise'" v-for="err in data_error?.agence" :key="err.id">
                    {{ err }}
                </small>
                <label>Montant :</label>
                <input type="text" v-model="montant">
                <small v-for="err in data_error?.montant" :key="err.id">
                    {{ err }}
                </small>
                
                <label>Details :</label>
                <textarea rows="3" type="text" v-model="details"></textarea>
                <small v-for="err in data_error?.details" :key="err.id">
                    {{ err }}
                </small>
            </div>
            <button class="btn-modal">
                {{ action }} {{ money(montant || 0) }}
            </button>
        </form>
    </Modal>
    <Modal :isVisible="show_flitre" @close="closeModal">
        <div class="form">
            <span class="title">Filtrage</span>
            <div class="content">
                <label for="">Nom de l'agence :</label>
                <input type="text" placeholder="Metter le nom de l'agence" v-model="name_agence">
                <label for="">Créer par :</label>
                <input type="text" placeholder="Metter le nom de l'agence" v-model="created_par">
                <label for="">Reçue par :</label>
                <input type="text" placeholder="Metter le nom de l'agence" v-model="recu_par">
                <label for="">Date de creation :</label>
                <div class="inputRow">
                    <input type="date" v-model="date_fin" />
                    <input type="date" v-model="date_debut" />
                </div>
                <label for="">Date de recéption :</label>
                <div class="inputRow">
                    <input type="date" v-model="date_reception_fin" />
                    <input type="date" v-model="date_reception_debut" />
                </div>
            </div>
            <button class="btn-modal" @click="searchGet">Filtrer</button>
        </div>
    </Modal>
    <div class="container">
        <div class="subMenu-headers">
            <div class="row">
                <span class="btn retour" @click="$router.back()">&#10094;</span>
                <!-- <span class="btn" @click="show_modal = true"><i class="fa-solid fa-plus"></i> &nbsp;Ajouter</span> -->
                <span class="btn" @click="show_modal = true, action = 'remise'">
                    <i class="fa-solid fa-arrow-down"></i> &nbsp; Remettre (+)
                </span>
                <span class="btn" @click="show_modal = true, action = 'reprise'">
                    <i class="fa-solid fa-arrow-up"></i> &nbsp; Reprendre (-)
                </span>
            </div>
            <!-- <div class="row">
                <span :class="['btn-switch', { btn_active: is_active === 'cree' }]"
                    @click="is_active = 'cree'">Remise/reprise creé</span>
                <span :class="['btn-switch', { btn_active: is_active === 'recue' }]"
                    @click="is_active = 'recue'">Remise/reprise Reçue
                </span>
            </div>
            <span>{{ user_fullname }}</span>
            <span class="money">Balance :{{ money(user_balance) }}</span> -->
            <PasswordValidator v-if="validate_password" @close="validate_password = false" @validate="valider" />
            <div class="row">
                <button class="btn" @click="show_flitre = true">Filtrer</button>
                <SearchComponent :search-function="searchLasta" />
            </div>
        </div>
        <section class="table">
            <table>
                <tr>
                    <th>Montant</th>
                    <th>Date de création</th>
                    <th>Date de réception</th>
                    <th>Créé par</th>
                    <th>Reçu par</th>
                    <th>Agence</th>
                    <th>Status</th>
                </tr>
                <tr v-for="remise in remises_reprises" :key="remise.id">
                    <td>{{ money(remise.montant) }}</td>
                    <td>{{ datetime(remise.created_at) }}</td>
                    <td>{{ datetime(remise.received_at) }}</td>
                    <td>{{ getItemName(remise.created_by) }}</td>
                    <td>{{ getItemName(remise.received_by) }}</td>
                    <td>{{ remise.agence.nom }}</td>
                    <!-- <td v-if="remise.created_by === user_fullname || remise.received_by === user_fullname"> -->
                    <td>
                        <span v-if="remise.received_at" class="valid">Validé</span>
                        <button v-else class="btn" @click="
                            validation_id = remise.id,
                            validation_action = remise.action,
                            validate_password = true">
                            Valider
                        </button>
                    </td>
                    <!-- <td v-else><i class="fa-solid fa-ban"></i></td> -->
                </tr>
            </table>
        </section>
    </div>
</template>
<script>
import store from '@/store';
import Navbar from '@/components/Navbar.vue';
import Modal from '@/Overlays/Modal.vue';
import PasswordValidator from '@/Overlays/PasswordValidator.vue';
import SearchComponent from '@/components/SearchComponent.vue';
export default {
    data() {
        return {
            remises_reprises: [],
            montant: 0,
            details: '',
            action: 'remise',
            compte_arrive: '',
            agence: '',
            show_modal: false,
            show_flitre: false,
            agences: [],
            banques: [],
            data_error: {},
            is_active: 'cree',
            user_fullname: '',
            user_balance: '',
            validate_password: '',
            validation_id: '',
            validation_action: '',
            date_reception_debut: '',
            date_reception_fin:'',
            date_debut:'',
            date_fin: '',
            created_par: '',
            name_agence:'',
            recu_par: '',
        }
    },
    components: {
        Navbar,
        Modal,
        PasswordValidator,
        SearchComponent
    },
    watch: {
        is_active() {
            this.getRemises();
        },
        "$store.state.compte_active": {
            deep: true,
            handler() {
                this.user_fullname = store.state.compte_active.user.first_name + ' ' + store.state.compte_active.user.last_name
                this.user_balance = store.state.compte_active.balance
            }
        }
    },
    methods: {
        valider() {
            axios.get(`remisereprisepersonnels/${this.validation_id}/valider_remise_reprise/`)
                .then((response) => {
                    this.remises_reprises = this.remises_reprises.map(remises_reprise => {
                        if (remises_reprise.id === this.validation_id) {
                            return { ...remises_reprise, ...response.data }
                        }
                        return remises_reprise
                    })
                    this.validation_action === 'remise'
                        ? store.state.user.personnel.balance += response.data.montant
                        : store.state.user.personnel.balance -= response.data.montant

                    store.state.message.success = 'Validé avec succés.'
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.valider)
                })
        },
        closeModal() {
            this.montant = '',
            this.details = '',
            this.action = 'remise',
            this.compte_arrive = '',
            this.agence = '',
            this.banque = '',
            this.show_modal = false
            this.show_flitre = false
        },
        searchLasta(text) {
            axios.get(`remisereprisepersonnels/?search=${text}`)
                .then((reponse) => {
                    this.remises_reprises = reponse.data.results;
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.searchLasta(text));
                })
        },
        searchGet() {
                axios.get(
                    `remisereprisepersonnels/?agence__nom=${this.name_agence}&created_by__username=${this.created_par}&received_by__username=${this.recu_par}&created_at__gte=${this.date_debut}&created_at__lte=${this.date_fin}&received_at__gte=${this.date_reception_debut}&received_at__lte=${this.date_reception_fin}} `
                ).then((reponse) => {
                    this.remises_reprises = reponse.data.results;
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.searchGet);
                }).finally(() => {
                    this.show_flitre = false;
                });
        },
        getRemises() {
            this.remises_reprises = []
            axios.get(
                `remisereprisepersonnels/?${this.is_active === 'cree' ? 'created_by__username=' : 'received_by__username='}${this.$route.query.username}`
            ).then((response) => {
                response.data.results.length ? this.remises_reprises = response.data.results
                    : store.state.message.error = 'Aucun remise ou reprise trouvé'
            }).catch((error) => {
                this.displayErrorOrRefreshToken(error, this.getRemises)
            })
        },
        nouveauxRemiseOuReprise() {
            const formData = new FormData();
            formData.append('montant', this.action === 'remise' ? this.montant : -1 * this.montant);
            formData.append('details', this.details);
            // formData.append('action', this.action);
            formData.append('received_by', parseInt(this.$route.query.compte));

            axios.post('remisereprisepersonnels/', formData)
                .then((response) => {
                    this.remises_reprises.unshift(response.data)
                    store.state.message.success = `${this.action} effectué avec succès.`
                    this.closeModal()
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getRemises)
                    this.data_error = error.response?.data
                })
        },
    },
    mounted() {
        localStorage?.getItem('compte_active') ?
            store.state.compte_active = JSON.parse(localStorage?.getItem('compte_active')) : ''
        this.$nextTick(() => {
            this.getRemises()
            // store.state.agences.length ? this.agences = store.state.agences : this.getAgences()
        })
    }
}
</script>
<style scoped>
.fa-ban {
    color: var(--red);
    font-size: 22px;
}
</style>