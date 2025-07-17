<template>
    <Navbar />
    <Modal :isVisible="show_modal" @close="closeModal">
        <form class="form" @submit.prevent="">
            <span class="title">Nouveau placement</span>
            <div class="content">
                <SearchCompte @compte="add_account" />
                <small v-for="err in data_error?.compte" :key="err.id">
                    {{ err }}
                </small>
                <label>Montant : {{ montant }} Fbu</label>
                <input type="number" v-model="montant" class="trois">
                <small v-for="err in data_error?.montant" :key="err.id">
                    {{ err }}
                </small>
                <label>Taux d'interet :</label>
                <input v-model="taux" type="number" class="trois">
                <small v-for="err in data_error?.taux_interet" :key="err.id">
                    {{ err }}
                </small>
                <label for="period">Type d'interet:</label>
                <select v-model="type_interet">
                    <option value="" disabled>-------</option>
                    <option value="interet_par_mois">Interet Par Mois</option>
                    <option value="interet_a_la_fin">Interet A La Fin</option>
                </select>
                <small v-for="err in data_error?.type_interet" :key="err.id">
                    {{ err }}
                </small>
                <label for="period">Periode ({{ period }} Mois):</label>
                <input v-model="period" type="number" class="trois">
                <small v-for="err in data_error?.periode" :key="err.id">
                    {{ err }}
                </small>
                <label for="details">Details :</label>
                <textarea type="text" v-model="details" id="details" class="trois"></textarea>
                <small v-for="err in data_error?.details" :key="err.id">
                    {{ err }}
                </small>
            </div>
            <button class="btn-modal" type="submit" @click="nouveauPlacement">
                Placer {{ money(montant) }}
            </button>
        </form>
    </Modal>
    <Modal :isVisible="show_filtre" @close="closeModal">
        <div class="form">
            <span class="title">Filtrage</span>
            <div class="content">
                <label>Est-il une personne physique :</label>
                <select v-model="personne_physique">
                    <option value="">------</option>
                    <option value="true">Oui</option>
                    <option value="false">NOn</option>
                </select>
                <label for="">Numero</label>
                <input type="text" v-model="numero">
                <label for="">Commune</label>
                <input type="text" v-model="commune">
                <label for="">Province</label>
                <input type="text" v-model="province">
                <label>Date de creation :</label>
                <div class="inputRow">
                    <input type="date" v-model="creation_debut">
                    <input type="date" v-model="creation_fin">
                </div>
                <label>Date de naissance :</label>
                <div class="inputRow">
                    <input type="date" v-model="date_superieur">
                    <input type="date" v-model="date_inferieur">
                </div>
                <label>Placement active :</label>
                <select v-model="active">
                    <option value="">------</option>
                    <option value="true">Oui</option>
                    <option value="false">NOn</option>
                </select>
                <label>Sexe :</label>
                <select v-model="sexe">
                    <option value="">------</option>
                    <option value="F">Femme</option>
                    <option value="M">Homme</option>
                    <option value="NA">Homme</option>
                    <option value="AUTRES">Autres</option>
                </select>
            </div>
            <button class="btn-modal" @click="searchPlacement('')">Filtrer</button>
        </div>
    </Modal>
    <Modal :isVisible="showconf" @close="closeModal">
        <div class="form">
            <span class="title">Configuration du crédit</span>
            <div class="content">
                <label for="">Impots pourcentage</label>
                <input type="number" name="" id="" v-model="impot"
                    placeholder="Mettez des chiffres en fonction des jours">
                <label for="">Seuil interet par an</label>
                <input type="number" name="" id="" v-model="interet"
                    placeholder="Mettez des chiffres en fonction des jours">
            </div>
            <button class="btn-modal" @click="functionConfiguration">Configurer</button>
        </div>
    </Modal>
    <Modal :isVisible="showVisual" @close="closeModal">
        <div class="form">
            <span class="title">Configuration des placement</span>
            <div class="content">
                <span>Impots pourcentage : {{ this.config.results[0].impots_pourcentage }}</span>
                <span>Seuil interet par an : {{ this.config.results[0].seuil_interet_par_an }}</span>
                <!-- <span>Microfinance : {{ this.config.results[0].microfinance }}</span> -->
            </div>
            <button class="btn-modal delete" @click="confDelete(this.config.results[0].id)"> <i
                    class="fa-solid fa-trash"></i>
                Supprimer</button>
        </div>
    </Modal>
    <div class="container">
        <div class="subMenu-headers">
            <div class="row">
                <button class="btn retour" @click="goBack">&#10094;</button>
                <span class="btn" @click="show_modal = true"> <i class="fa-solid fa-plus"></i> Ajouter</span>
                <!-- <button class="btn" @click="showconf = true" v-if="this.config.count === 0">
                    <i class="fa-solid fa-gear"></i> Configuration placement </button>

                <button class="btn" @click="showVisual = true" v-else>
                    <i class="fa-solid fa-eye"></i>Configuration placement </button> -->
            </div>
            <div class="row">
                <button class="btn" @click="show_filtre = true">Filtre</button>
                <SearchComponent :searchFunction="searchPlacement" />
                <PasswordValidator v-if="validate_password" @close="validate_password = false" @validate="valider" />
            </div>
        </div>
        <div class="accounts" v-if="totals">
            <Account :account_name="'Total interets deja versés:'" :account_money="totals.total_interets_deja_verses" />
            <Account :account_name="'Total placement encours:'" :account_money="totals.total_placements_en_cours" />
            <Account :account_name="'Total interets restants à verser:'"
                :account_money="totals.total_interets_restants_a_verser" />
        </div>
        <section class="table">
            <table>
                <tr>
                    <th>Id</th>
                    <th>Numero de compte</th>
                    <th>Date</th>
                    <th>Montant</th>
                    <th>Taux d'interet</th>
                    <th>Periode</th>
                    <th>Intérêt versé</th>
                    <th>Intérêt restant</th>
                    <th>Etat</th>
                    <th>Validation</th>
                    <th>Options</th>
                </tr>
                <tr v-for="item in placements" :key="item?.id" @dblclick="goToAmmortissement(item)" class="clickable-row">
                    <td>{{ item?.id }}</td>
                    <td>{{ item?.compte?.numero }}</td>
                    <td>{{ datetime(item?.created_at) }}</td>
                    <td>{{ money(item?.montant) }}</td>
                    <td>{{ item?.taux_interet }}</td>
                    <td>{{ item?.periode }} Mois</td>
                    <td>{{ item?.interets_deja_verses }}</td>
                    <td>{{ item?.interets_restants_a_verser }}</td>
                    <td>
                        <span v-if="item?.is_active">En cours</span>
                        <span v-if="!item?.is_active  && !item?.done_at">Non valider</span>
                        <span v-if="item?.done_at" class="valid">Terminé</span>
                    </td>
                    <td>
                        <span v-if="item?.validated_by != null" class="valid">Validé</span>
                        <button v-else class="btn" @click="validate_password = true, placement_a_valider = item">
                            Valider
                        </button>
                    </td>
                    <td>
                        <i v-if="item.validated_by != null" class="btn fa fa-ellipsis-v"
                            @click="toggleOptions(item.id)">
                            <div class="option-links" v-show="selectedItemId === item.id">
                                <span @click="goToAmmortissement(item)" class="option-link">
                                    <span>&#9656;</span>
                                    Ammortissement
                                </span>
                                <span @click="goToInteret(item.compte.numero)" :to="{ name: 'Interet' }"
                                    class="option-link">
                                    <span>&#9656;</span>
                                    Intérêt
                                </span>
                                <span @click="goToImpots(item?.compte?.numero)" class="option-link">
                                    <span>&#9656;</span>
                                    Impots
                                </span>
                            </div>
                        </i>
                        <span v-else>-</span>
                    </td>
                </tr>
            </table>
        </section>
    </div>
</template>

<script>

import Account from '@/components/account.vue';
import Navbar from '@/components/Navbar.vue'
import Modal from '@/Overlays/Modal.vue';
import SearchComponent from "@/components/SearchComponent.vue";
import SearchCompte from '@/components/SearchCompte.vue';
import PasswordValidator from '@/Overlays/PasswordValidator.vue';


export default {
    data() {
        return {
            placements: [],
            compte_owner: [],
            users: [],
            idcompte: null,
            show_modal: false,
            selectedItemId: null,
            timeoutId: null,
            compte: '',
            montant: 0,
            taux: '',
            period: '',
            intervalle: '',
            type_interet: '',
            details: '',
            total_encours: 0,
            totals: [],
            result: '',
            got_accounts: [],
            account: [],
            creation_debut: '',
            creation_fin: '',
            active: '',
            date_valider: '',
            date_inferieur: '',
            date_superieur: '',
            numero: '',
            province: '',
            commune: '',
            sexe: '',
            personne_physique: '',
            show_filtre: false,
            data_error: {},
            validate_password: false,
            placement_a_valider: null,
            showVisual: false,
            showconf: false,
            config: []
        }
    },
    components: {
        Navbar, Modal, Account,
        SearchComponent,
        SearchCompte, PasswordValidator
    },
    watch: {
        compte(new_val) {
            this.got_accounts = this.got_accounts.filter(acc => acc.id == new_val)
        }
    },
    methods: {
        searchPlacement(text) {
            axios.get(
                text ? `placements/?search=${text}` :
                    `placements/?created_at__gte=${this.creation_debut}&created_at__lte=${this.creation_fin}&is_active=${this.active}&validated_at=${this.date_valider}&compte__numero=${this.numero}&compte__commune=${this.commune}&compte__province=${this.province}&compte__personne_physique__date_naissance__gte=${this.date_superieur}&compte__personne_physique__date_naissance__lte=${this.date_inferieur}&compte__personne_physique__sexe=${this.sexe}&compte__personne_physique__isnull=${this.personne_physique}`
            ).then((reponse) => {
                this.placements = reponse.data.results.results
                this.closeModal()
            }).catch((error) => this.displayErrorOrRefreshToken(error, this.searchPlacement(text)));
        },
        async getConf() {
            await axios.get("placementconfiguration/")
                .then((response) => {
                    this.config = response.data;
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getConf);
                })
        },
        async confDelete(id) {
            const confirmation = confirm(`Vous voulez vraiment supprimer ce configuration?`)
            if (confirmation) {
                try {
                    await axios.delete(`placementconfiguration/${id}/`);
                    this.$store.state.message.success = 'Supprimés avec succès.'
                    this.closeModal()
                    this.getConf()
                } catch (error) {
                    this.displayErrorOrRefreshToken(error, this.handleDelete)
                }
            }
        },
        async functionConfiguration() {
            const formData = new FormData();
            formData.append("impots_pourcentage", this.impot);
            formData.append("seuil_interet_par_an", this.interet);
            try {
                const response = await axios.post("placementconfiguration/", formData);
                this.$store.state.message.success = "Placement configurer.";
                this.closeModal();
                this.getConf()
            } catch (error) {
                this.data_error = error.response?.data
                this.displayErrorOrRefreshToken(error, this.functionConfiguration)
            }
        },
        nouveauPlacement() {
            if (this.sum < 1000000) {
                this.$store.state.message.error = 'Le montant à placer doit être supérieur à 1 000 000.'
                return
            }
            const formData = new FormData();
            formData.append('taux_interet', this.taux);
            formData.append('montant', this.montant);
            formData.append('periode', this.period);
            formData.append('details', this.details);
            formData.append('compte', this.compte);
            formData.append('type_interet', this.type_interet);

            axios.post('placements/', formData)
                .then(response => {
                    this.getPlacement(response.data)
                    this.show_modal = false;
                    this.$store.state.message.success = 'Placement Réusi.'
                }).catch(error => {
                    this.displayErrorOrRefreshToken(error, this.nouveauPlacement)
                    this.data_error = error.response?.data
                });
        },
        toggleOptions(itemId) {
            if (this.selectedItemId !== itemId) {
                this.selectedItemId = itemId;

                clearTimeout(this.timeoutId);
                this.timeoutId = setTimeout(() => {
                    this.selectedItemId = null;
                }, 10000);
            } else {
                this.selectedItemId = null;
                clearTimeout(this.timeoutId);
            }
        },
        goToAmmortissement(placement) {
            this.$store.state.compte_active = placement
            this.$router.push({ name: 'Ammortissement', query: { 'placement_id': placement.id } });
        },
        goToInteret(placement_numero) {
            this.$router.push({ name: 'Interet', query: { 'placement_numero': placement_numero } });
        },
        goToImpots(compte) {
            this.$router.push({ name: 'Impots', params: { 'compte': compte } });
        },
        async valider() {
            await axios.get(`placements/${this.placement_a_valider.id}/valider/`)
                .then((response) => {
                    this.placements = this.placements.map(placement => {
                        if (placement.id == this.placement_a_valider.id) return { ...placement, ...response.data }
                        return placement
                    })
                    this.$store.state.message.success = 'Valider succèssivement.'
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.valider)
                })
        },
        async getPlacement() {
            await axios.get('placements/')
                .then((response) => {
                    this.placements = response.data.results.results
                    this.totals = response.data.totals
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getPlacement)
                })
        },
        closeModal() {
            this.show_modal = false,
                this.compte = '',
                this.montant = 0,
                this.taux = '',
                this.period = '',
                this.intervalle = '',
                this.details = '',
                this.data_error = {},
                this.show_filtre = false,
                this.showVisual = false,
                this.showconf = false,
                this.personne_physique = ''
            this.numero = ''
            this.commune = ''
            this.province = ''
            this.creation_debut = ''
            this.creation_fin = ''
            this.date_superieur = ''
            this.date_inferieur = ''
            this.active = ''
            this.sexe = ''
        }
    },
    mounted() {
        this.getPlacement();
        // this.getConf();
    }
}
</script>
