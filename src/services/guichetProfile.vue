<template>
    <Navbar />
    <Modal :isVisible="showModal" @close="closeModal">
        <div class="form-nini" v-if="action === 'Depot'">
            <div class="bills">
                <div class="billets">
                    <div class="inputRow">
                        <label class="bill-label">10 000 &times;</label>
                        <input class="bill-input" type="number" v-model="tenthousand">
                        <span>= {{ tenthousand * 10000 }}</span>
                    </div>
                    <div class="inputRow">
                        <label class="bill-label">5 000 &times; </label>
                        <input class="bill-input" type="number" v-model="fivethousand">
                        <span>= {{ fivethousand * 5000 }}</span>
                    </div>
                    <div class="inputRow">
                        <label class="bill-label">2 000 &times; </label>
                        <input class="bill-input" type="number" v-model="twothousand">
                        <span>= {{ twothousand * 2000 }}</span>
                    </div>
                    <div class="inputRow">
                        <label class="bill-label">1 000 &times; </label>
                        <input class="bill-input" type="number" v-model="thousand">
                        <span>= {{ thousand * 1000 }}</span>
                    </div>
                    <div class="inputRow">
                        <label class="bill-label">500 &times; </label>
                        <input class="bill-input" type="number" v-model="fivehundred">
                        <span>= {{ fivehundred * 500 }}</span>
                    </div>
                    <div class="inputRow">
                        <label class="bill-label">100 &times; </label>
                        <input class="bill-input" type="number" v-model="hundred">
                        <span>= {{ hundred * 100 }}</span>
                    </div>
                    <div class="inputRow">
                        <label class="bill-label">50 &times; </label>
                        <input class="bill-input" type="number" v-model="fifty">
                        <span>= {{ fifty * 50 }}</span>
                    </div>
                    <div class="inputRow">
                        <label class="bill-label">20 &times; </label>
                        <input class="bill-input" type="number" v-model="twenty">
                        <span>= {{ twenty * 20 }}</span>
                    </div>
                    <div class="inputRow">
                        <label class="bill-label">10 &times; </label>
                        <input class="bill-input" type="number" v-model="ten">
                        <span>= {{ ten * 10 }}</span>
                    </div>
                    <div class="inputRow">
                        <label class="bill-label">5 &times; </label>
                        <input class="bill-input" type="number" v-model="five">
                        <span>= {{ five * 5 }}</span>
                    </div>
                    <div class="inputRow">
                        <label class="bill-label">1 &times; </label>
                        <input class="bill-input" type="number" v-model="one">
                        <span>= {{ one * 1 }}</span>
                    </div>
                    <div class="total">Total: <span>{{ money(sum) }}</span></div>
                </div>
                <div class="bordereau-details">
                    <label>Details</label>
                    <input type="text" v-model="details" placeholder="Details">
                    <small v-for="err in data_error?.details" :key="err.id">
                        {{ err }}
                    </small>
                    <button class="btn-modal" @click="depot">Depot {{ money(sum) }}</button>
                </div>
            </div>
        </div>
        <div class="form" v-if="action === 'Retrait'">
            <span class="title">Retrait</span>
            <div class="content">
                <label for="amount">Montant</label>
                <input type="number" id="amount" v-model="montant" placeholder="Montant">
                <small v-for="err in data_error?.montant" :key="err.id">
                    {{ err }}
                </small>
                <label for="id_card_number">CNI</label>
                <input type="text" id="id_card_number" v-model="cni" placeholder="CNI">
                <small v-for="err in data_error?.cni" :key="err.id">
                    {{ err }}
                </small>
                <label class="full_name">Nom</label>
                <input id="full_name" type="text" v-model="nom" placeholder="Nom">
                <small v-for="err in data_error?.nom" :key="err.id">
                    {{ err }}
                </small>
                <label for="telephone">Téléphone</label>
                <input type="tel" id="telephone" v-model="telephone" placeholder="Téléphone">
                <small v-for="err in data_error?.telephone" :key="err.id">
                    {{ err }}
                </small>
                <label for="details">Details</label>
                <input type="text" id="details" v-model="details" placeholder="Details">
                <small v-for="err in data_error?.cni" :key="err.id">
                    {{ err }}
                </small>
            </div>
            <button class="btn-modal" @click="retrait">Retrait {{ money(montant) }}</button>
        </div>
        <div class="form" v-if="action === 'Virement' || action === 'Virement Externe'">
            <div class="content">
                <span class="title">{{ action === 'Virement' ? 'Virement interne' : 'Virement Externe' }}</span>
                <span>Compte arrivée(Bénéficiaire)</span>
                <SearchCompte @compte="add_account" />
                <!-- <input type="text" v-model="compte" placeholder="Compte arrivée"> -->
                <small v-for="err in data_error?.compte_arrivee" :key="err.id">
                    {{ err }}
                </small>
                <span v-if="action === 'Virement Externe'">Compte du donneur d'ordre(Banque)</span>
                <SearchCompte  v-if="action === 'Virement Externe'" search_for='banque' @compte="add_account" />
                <small v-for="err in data_error?.banque" :key="err.id">
                    {{ err }}
                </small>
                <label>Montant</label>
                <input type="number" v-model="montant" placeholder="Montant">
                <small v-for="err in data_error?.montant" :key="err.id">
                    {{ err }}
                </small>
                <label>Motif</label>
                <input type="text" v-model="details" placeholder="Motif">
                <small v-for="err in data_error?.motif" :key="err.id">
                    {{ err }}
                </small>
            </div>
            <button class="btn-modal" @click="handleVirement(action)">Virement {{ money(montant) }}</button>
        </div>
        <div class="form" v-if="action === 'Virement Multiple'">
            <span class="title">Virement Multiple</span>
            <div class="content">
                <input type="file" accept="csv" @change="e => prepareData(e)"> <br> <br>
                <section class="table" v-if="to_accounts.length > 0">
                    <table>
                        <thead>
                            <tr>
                                <th>Motif</th>
                                <th>No. compte</th>
                                <th>Montant</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="acc in to_accounts">
                                <td>{{ acc.motif }}</td>
                                <td>{{ acc.compte_arrivee }}</td>
                                <td>{{ money(acc.montant) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <small v-for="err in data_error?.montant" :key="err.id">
                    {{ err }}
                </small>
                <small v-for="err in data_error?.motif" :key="err.id">
                    {{ err }}
                </small>
                <small v-for="err in data_error?.compte_arrivee" :key="err.id">
                    {{ err }}
                </small>
            </div>
            <button class="btn-modal" @click="handleVirementMultiple" :disabled="!isCsvfile">
                Virement Multiple {{ mymontant }}
            </button>
        </div>
    </Modal>
    <Modal :isVisible="profile" @close="closeModal">
        <div class="form">
            <span class="title">Client</span>
            <div class="content">
                <div class="affichage-profile"><strong>Nom et Prenom :</strong>
                    <div v-if="compte_active.personne_physique">
                        {{ compte_active.personne_physique.last_name + ' ' +
                            compte_active.personne_physique.first_name
                        }}
                    </div>
                    <div v-else-if="compte_active.personne_morale">
                        {{ compte_active.personne_morale.nom }}
                    </div>
                    <div v-else>
                        -
                    </div>
                </div>
                <div class="affichage-profile"><strong>Compte :</strong> {{ compte_active.numero }}</div>
                <div class="affichage-profile"><strong>Solde :</strong> {{ money(compte_active.solde) }}</div>
                <div class="affichage-profile"><strong>CNI/NIF :</strong>
                    <span v-if="compte_active.personne_physique">
                        {{ compte_active.personne_physique.CNI }}
                    </span>
                    <span v-else-if="compte_active.personne_morale">
                        {{ compte_active.personne_morale.NIF }}
                    </span>
                    <span v-else>
                        -
                    </span>
                </div>
                <div class="affichage-profile">
                    <strong>Province :</strong> {{ compte_active.province }}
                </div>
                <div class="affichage-profile"><strong>Commune : </strong>{{ compte_active.commune }}</div>
                <div class="affichage-profile"><strong>Adresse :</strong> {{ compte_active.adresse }}</div>
                <div class="affichage-profile"><strong>Telephone : </strong>{{ compte_active.telephone }}</div>
                <div class="affichage-profile"><strong>Organisation :</strong> {{ compte_active.organisation }}</div>
                <div v-if="nom_compte" style="color: var(--second);margin: auto;">
                    <h1 style="text-align: center;">{{ nom_compte }}</h1>
                </div>
            </div>
        </div>
    </Modal>
    <div class="container">
        <div class="bottom">
            <div class="btn retour" @click="goBack">&#10094;</div>
            <div class="left">
                <div class="names">
                    <i class="fa-solid fa-user"></i>
                    <div class="client_name" v-if="compte_active">
                        <div v-if="compte_active.personne_physique">
                            {{ 
                                compte_active.personne_physique.last_name + ' ' +
                                compte_active.personne_physique.first_name
                            }}
                        </div>
                        <div v-else-if="compte_active.personne_morale">
                            {{ compte_active.personne_morale.nom }}
                        </div>
                        <div v-else>
                            -
                        </div>
                    </div>
                    <button class="btn" @click="profile = true">Details du client</button>
                </div>
                <div class="actions">
                    <div class="action" :class="{ active: action === 'Depot' }" @click="setAction('Depot')">
                        Depot
                    </div>
                    <div class="action" :class="{ active: action === 'Retrait' }"
                        @click="setAction(checkId('Retrait'))">
                        Retrait
                    </div>
                    <div class="action" :class="{ active: action === 'Virement' }"
                        @click="setAction(checkId('Virement'))">
                        Virement interne
                    </div>
                    <div class="action" :class="{ active: action === 'Virement Multiple' }"
                        @click="setAction(checkId('Virement Multiple'))">
                        Virement interne Multiple
                    </div>
                    <div class="action" :class="{ active: action === 'Virement Externe' }"
                        @click="setAction(checkId('Virement Externe'))">
                        Virement Externe
                    </div>
                    <div class="action" :class="{ active: action === 'Virement Permanent' }"
                        @click="$router.push(`/virementpermanent/${compte_active.id}`)">
                        Virement Permanent
                    </div>
                </div>
            </div>
            <div class="right">
                <!-- <div v-if="compte_active.photo" class="showFull">
                    <button class="button" @click="toggleFullImage">Agrandir&nbsp; <i class="fa-solid fa-expand"></i></button>
                    <a class="button" :href="compte_active.document" target="_blank">
                        Voir le document &nbsp;
                        <i class="fa-solid fa-file-pdf"></i>
                    </a>
                </div> -->
                <iframe :src="compte_active.document" width="100%" height="600px"></iframe>
            </div>
            <div v-if="showFullImage" class="full-image-container" @click="toggleFullImage">
                <img :src="compte_active.photo" alt="" class="full-image">
            </div>
        </div>
    </div>
</template>
<script>
import Navbar from '@/components/Navbar.vue';
import Modal from '@/Overlays/Modal.vue';
import SearchComponent from '@/components/SearchComponent.vue';
import SearchCompte from '@/components/SearchCompte.vue';
export default {
    data() {
        return {
            client: null,
            action: '',
            nom: '',
            montant: null,
            bordereau: '',
            details: '',
            telephone: '',
            cni: '',
            motif: '',
            showModal: false,
            to_accounts: [],
            tenthousand: 0,
            fivethousand: 0,
            twothousand: 0,
            thousand: 0,
            fivehundred: 0,
            hundred: 0,
            fifty: 0,
            twenty: 0,
            ten: 0,
            five: 0,
            one: 0,
            compte: '',
            profile: false,
            mymontant: null,
            motif: '',
            debId: '',
            id: '',
            numero: null,
            adresse: '',
            commune: '',
            province: '',
            CNI_NIF: '',
            telephone: '',
            solde: null,
            organisation: '',
            showFullImage: false,
            compte_active: '',

            guichet: false,
            livre: false,

            compte_comptable: [],
            nom_compte: '',
            show_operations: false,
            compte_operations: [],

            result: '',
            got_accounts: [],
            account: [],
            keyword: '',
            data_error: {},

            comptes: [],
            accounts: [],

            deblocage_id: null,
            isCsvfile: false,
            got_bank_account : '',

            type_de_compte : '',
            date_virement : ''
        }
    },
    components: {
        Navbar,
        Modal,
        SearchComponent,
        SearchCompte
    },
    watch: {
        '$store.state.compte_active': {
            deep: true,
            handler(new_val) {
                this.setCompte(new_val);
            }
        },
        type_de_compte(){
            this.compte = ''
        }
    },
    computed: {
        sum() {
            return (
                this.tenthousand * 10000 + this.fivethousand * 5000 + this.twothousand * 2000 + this.thousand * 1000 + this.fivehundred * 500 + this.hundred * 100 + this.fifty * 50 + this.twenty * 20 + this.ten * 10 + this.five * 5 + this.one * 1
            );
        },
    },
    methods: {
        showOperations(operations) {
            this.compte_operations = operations
            this.show_operations = true
        },
        toggleFullImage() {
            this.showFullImage = !this.showFullImage;
        },
        setAction(action) {
            if (action) {
                this.action = action;
                this.showModal = true;
            } else return
        },
        checkId(action) {
            if (action === 'Virement' || action === 'Virement Multiple') {
                let for_virement_id = this.$store.state.compte_active.deblocages
                    .filter(deblocage => deblocage.unblock_for === "ordre de virement interne")
                    .pop();

                if (!for_virement_id) {
                    for_virement_id = this.$store.state.compte_active.deblocages
                        .filter(deblocage => deblocage.unblock_for === "cheque")
                        .pop();
                }

                if (!for_virement_id) {
                    this.displayError('Le compte doit d\'abord être débloqué pour un virement.')
                    return null;
                } else {
                    this.deblocage_id = for_virement_id.id;
                    return action;
                }
            } else if (action === 'Retrait') {
                let deb = this.$store.state.compte_active.deblocages
                    .filter(deblocage =>
                        deblocage.unblock_for === "cheque" ||
                        deblocage.unblock_for === 'quittance' ||
                        deblocage.unblock_for === 'cahier'
                    ).pop();

                if (!deb) {
                    this.displayError(`Le compte doit d'abord être débloqué.`)
                    return null;
                } else {
                    this.deblocage_id = deb.id
                    return action;
                }
            } else if(action === 'Virement Externe') {
                let deb = this.$store.state.compte_active.deblocages
                    .filter(deblocage =>
                        deblocage.unblock_for === 'ordre de virement externe'
                    ).pop();

                if (!deb) {
                    this.displayError(`Le compte doit d'abord être débloqué pour cette opération.`)
                    return null;
                } else {
                    this.deblocage_id = deb.id
                    return action;
                }
            }
        },
        displayError(error){
            this.$store.state.message.error = error
            this.alertError()
        },
        setCompte(compte) {
            this.compte_active = compte
        },
        closeModal() {
            this.montant = null,
            this.bordereau = '',
            this.details = '',
            this.nom = '',
            this.cni = '',
            this.telephone = '',
            this.compte = '',
            this.showModal = false,
            this.profile = false,
            this.to_accounts = [],
            this.mymontant = null,
            this.show_operations = false,
            this.compte_operations = [],
            this.show_depot = false,

            this.tenthousand = 0,
            this.fivethousand = 0,
            this.twothousand = 0,
            this.thousand = 0,
            this.fivehundred = 0,
            this.hundred = 0,
            this.fifty = 0,
            this.twenty = 0,
            this.ten = 0,
            this.five = 0,
            this.one = 0,

            this.result = '',
            this.got_accounts = [],
            this.account = [],
            this.keyword = '',
            this.compte = '',
            this.got_bank_account = '',
            this.date_virement = '',
            this.type_de_compte = ''
        },
        async depot() {
            if(this.sum < 500){
                this.displayError('Le montant à deposer doit être supérieur à 500.')
                return
            }
            const data = {
                montant: Number(this.sum),
                bordereau: String(this.bordereau),
                details: String(this.details),
                compte: this.$store.state.compte_active.id
            };
            try {
                const response = await axios.post('depots/', data);
                this.$store.state.message.success = `Vous avez deposé ${data.montant}Fbu avec success`;
                this.$store.state.compte_active.solde += response.data.montant
                // this.$store.state.user.personnel.balance += response.data.montant
                this.closeModal();
            } catch (error) {
                this.data_error = error?.response?.data
                this.displayErrorOrRefreshToken(error, this.depot)
            }
        },
        async retrait() {
            const data = {
                nom: this.nom,
                cni: this.cni,
                telephone: this.telephone,
                details: this.details,
                montant: this.montant,
                compte: this.$store.state.compte_active.id
            };
            try {
                const response = await axios.post('retraits/', data);
                this.$store.state.compte_active.solde -= response.data.montant
                // this.$store.state.user.personnel.balance -= response.data.montant
                this.$store.state.message.success = `Retrait de ${response.data.montant}Fbu avec success.`
                this.closeModal()
                const updated_deblocages = this.$store.state.compte_active.deblocages.filter(deblocage => deblocage.id !== this.deblocage_id);
                this.$store.commit('UPDATE_DEBLOCAGES', updated_deblocages);
            } catch (error) {
                this.data_error = error?.response?.data
                this.displayErrorOrRefreshToken(error, this.retrait)
            }
        },
        async handleVirement(action) {
            const form = {
                montant: this.montant,
                motif: this.details,
                compte_arrivee: this.compte,
                ...(action === 'Virement Externe' && {banque : this.got_bank_account})
            }
            try {
                const response = await axios.post(`deblocages/${this.deblocage_id}/${action === 'Virement' ? 'virement_interne_details' : 'virement_externe'}/`, form);
                this.$store.state.message.success = `Virement de ${response.data.montant} effectué avec success!`
                this.$store.state.compte_active.solde -= response.data.montant
                this.closeModal()
                const updated_deblocages = this.$store.state.compte_active.deblocages.filter(deblocage => deblocage.id !== this.deblocage_id);
                this.$store.commit('UPDATE_DEBLOCAGES', updated_deblocages);
            } catch (error) {
                this.data_error = error?.response?.data
                this.displayErrorOrRefreshToken(error,() => this.handleVirement(action))
            }
        },
        async handleVirementMultiple() {
            const data = this.to_accounts.map((to_account, index) => {
                return {
                    ...to_account,
                    "compte_arrivee": this.accounts[index] ? this.accounts[index].compte_arrivee : to_account.compte_arrivee
                };
            });
            try {
                await axios.post(`deblocages/${this.deblocage_id}/virement_interne_details/`, data)
                this.$store.state.message.success = 'Virement multiple  reussi avec success!';
                this.closeModal()
                const updated_deblocages = this.$store.state.compte_active.deblocages.filter(deblocage => deblocage.id !== this.deblocage_id);
                this.$store.commit('UPDATE_DEBLOCAGES', updated_deblocages);
            }
            catch (error) {
                this.data_error = error?.response?.data
                this.displayErrorOrRefreshToken(error, this.handleVirementMultiple)
            };
        },
        prepareData(event) {
            this.isCsvfile = event.target.files.length > 0
            this.to_accounts = []
            this.mymontant = 0;

            let file_path = event.target.files[0]; 
            if (file_path && file_path.type === 'text/csv') { 
                this.isCsvfile = true;
                var reader = new FileReader();
                reader.onload = (event) => {
                    const file = event.target.result;
                    const lines = file.split(/\r\n|\n/);
                    let i = 0;
                    for (i; i < lines.length - 1; i++) {
                        const array_line = lines[i].split(/,|;/);
                        if (array_line.length > 0) {
                            this.to_accounts.push({
                                "motif": array_line[0],
                                "compte_arrivee": array_line[1],
                                "montant": array_line[2]
                            });
                            this.comptes.push(array_line[1])
                            this.mymontant += parseInt(array_line[2]);
                        }
                    }
                    this.getAcounts(this.comptes)
                };
                reader.onerror = (event) => {
                    alert(event.target.error.name);
                };
                reader.readAsText(file_path, 'ISO-8859-1');
            } else {
                this.isCsvfile = false;
                alert('Vous devez choisir un fichier CSV.');
            }
        },
        getAcounts(array) {
            this.accounts = new Array(array.length).fill(null);
            const requests = array.map((item, index) => {
                return axios.get(`comptes/?search=${item}`)
                    .then((response) => {
                        if (response.data.results.length > 0) {
                            let found = false;
                            for (let i = 0; i < response.data.results.length; i++) {
                                const result = response.data.results[i];
                                if (result.numero === item.toUpperCase()) {
                                    this.accounts[index] = {
                                        "compte_arrivee": result.id,
                                    };
                                    found = true;
                                    break;
                                }
                            } 
                            !found && alert(`Le compte ${item} n'est pas trouvé, veuillez réessayer.`)
                        }
                    }).catch((error) => {
                        this.displayErrorOrRefreshToken(error, () => this.getAcounts(array));
                    });
            });
            Promise.all(requests)
                .then(() => {
                    this.accounts = this.accounts.filter(account => account !== null);
                }).catch(() => {
                    this.displayErrorOrRefreshToken(error, () => this.getAcounts(array));
                });
        },
    },
    mounted() {
        localStorage?.getItem('compte_active') ? this.$store.state.compte_active = JSON.parse(localStorage?.getItem('compte_active')) : ''
        this.$nextTick(()=>{
            this.setCompte(this.$store.state.compte_active);
        })
    }
}
</script>
<style src="./profile.css" scoped></style>