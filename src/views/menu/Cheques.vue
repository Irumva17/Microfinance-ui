<template>
    <div class="cheque_container" v-if="cheque_nums.length">
        <Print_cheques :account="account" :cheque_nums="cheque_nums" :full_name="full_name" class="printable" />
    </div>
    <div class="not_printable">
        <Navbar />
        <Modal :isVisible="show_modal" @close="closeModal">
            <form class="form" @submit.prevent="">
                <span class="title">Retirer les Cheques</span>
                <div class="content">
                    <label for="card_number">CNI: </label>
                    <input type="text" v-model="cni" id="card_number">
                    <small v-for="err in data_error?.CNI" :key="err.id">
                        {{ err }}
                    </small>
                    <label for="full_name">Nom: </label>
                    <input type="text" v-model="nom" id="full_name">
                    <small v-for="err in data_error?.nom" :key="err.id">
                        {{ err }}
                    </small>

                    <label for="telephone">Telephone: </label>
                    <input type="tel" v-model="telephone" id="telephone">
                    <small v-for="err in data_error?.telephone" :key="err.id">
                        {{ err }}
                    </small>

                    <label for="detail">Detail: </label>
                    <input type="text" v-model="detail" id="detail">
                    <small v-for="err in data_error?.details" :key="err.id">
                        {{ err }}
                    </small>
                </div>
                <button class="btn-modal" @click="retraitCheques">Envoyer </button>
            </form>
        </Modal>
        <Modal :isVisible="show_flitre" @close="closeModal">
            <div class="form">
                <div class="content">
                    <label for="detail">Date de naissance : </label>
                    <div class="inputRow">
                        <input type="date" v-model="age_superieur" id="detail">
                        <input type="date" v-model="age_inferieur" id="detail">
                    </div>
                    <label for="detail">Date de creation: </label>
                    <div class="inputRow">
                        <input type="date" v-model="create_superieur" id="detail">
                        <input type="date" v-model="create_inferieur" id="detail">
                    </div>
                    <div class="inputColumn">
                        <label>Province:</label>
                        <!-- <select v-model="province">
                            <option value="" disabled>-------</option>
                            <option value="Bujumbura">Bujumbura</option>
                            <option value="Buhumuza">Buhumuza</option>
                            <option value="Burunga">Burunga</option>
                            <option value="Butanyerera">Butanyerera</option>
                            <option value="Gitega">Gitega</option>
                        </select> -->
                        <input type="text" v-model="province">
                    </div>
                    <div class="inputColumn">
                        <label for="commune">Commune:</label>
                        <!-- <select v-model="commune">
                            <option value="" disabled>-------</option>
                            <option v-if="province === ''" value="" disabled>Province d'abord</option>
                            <option v-if="province === 'Buhumuza'" value="Butaganzwa">Butaganzwa</option>
                            <option v-if="province === 'Buhumuza'" value="Butihinda">Butihinda</option>
                            <option v-if="province === 'Buhumuza'" value="Cankuzo">Cankuzo</option>
                            <option v-if="province === 'Buhumuza'" value="Gisagara">Gisagara</option>
                            <option v-if="province === 'Buhumuza'" value="Gisuru">Gisuru</option>
                            <option v-if="province === 'Buhumuza'" value="Muyinga">Muyinga</option>
                            <option v-if="province === 'Buhumuza'" value="Ruyigi">Ruyigi</option>

                            <option v-if="province === 'Bujumbura'" value="Bubanza">Bubanza</option>
                            <option v-if="province === 'Bujumbura'" value="Bukinanyana">Bukinanyana</option>
                            <option v-if="province === 'Bujumbura'" value="Cibitoke">Cibitoke</option>
                            <option v-if="province === 'Bujumbura'" value="Isare">Isare</option>
                            <option v-if="province === 'Bujumbura'" value="Mpanda">Mpanda</option>
                            <option v-if="province === 'Bujumbura'" value="Mugere">Mugere</option>
                            <option v-if="province === 'Bujumbura'" value="Mugina">Mugina</option>
                            <option v-if="province === 'Bujumbura'" value="Muhuta">Muhuta</option>
                            <option v-if="province === 'Bujumbura'" value="Mukaza">Mukaza</option>
                            <option v-if="province === 'Bujumbura'" value="Ntahangwa">Ntahangwa</option>
                            <option v-if="province === 'Bujumbura'" value="Rwibaga">Rwibaga</option>

                            <option v-if="province === 'Burunga'" value="Bururi">Bururi</option>
                            <option v-if="province === 'Burunga'" value="Makamba">Makamba</option>
                            <option v-if="province === 'Burunga'" value="Matana">Matana</option>
                            <option v-if="province === 'Burunga'" value="Musongati">Musongati</option>
                            <option v-if="province === 'Burunga'" value="Nyanza">Nyanza</option>
                            <option v-if="province === 'Burunga'" value="Rumonge">Rumonge</option>
                            <option v-if="province === 'Burunga'" value="Rutana">Rutana</option>

                            <option v-if="province === 'Butanyerera'" value="Busoni">Busoni</option>
                            <option v-if="province === 'Butanyerera'" value="Kayanza">Kayanza</option>
                            <option v-if="province === 'Butanyerera'" value="Kiremba">Kiremba</option>
                            <option v-if="province === 'Butanyerera'" value="Kirundo">Kirundo</option>
                            <option v-if="province === 'Butanyerera'" value="Matongo">Matongo</option>
                            <option v-if="province === 'Butanyerera'" value="Muhanga">Muhanga</option>
                            <option v-if="province === 'Butanyerera'" value="Ngozi">Ngozi</option>
                            <option v-if="province === 'Butanyerera'" value="Tangara">Tangara</option>

                            <option v-if="province === 'Gitega'" value="Bugendana">Bugendana</option>
                            <option v-if="province === 'Gitega'" value="Gishubi">Gishubi</option>
                            <option v-if="province === 'Gitega'" value="Gitega">Gitega</option>
                            <option v-if="province === 'Gitega'" value="Karusi">Karusi</option>
                            <option v-if="province === 'Gitega'" value="Kiganda">Kiganda</option>
                            <option v-if="province === 'Gitega'" value="Muramvya">Muramvya</option>
                            <option v-if="province === 'Gitega'" value="Mwaro">Mwaro</option>
                            <option v-if="province === 'Gitega'" value="Nyabihanga">Nyabihanga</option>
                            <option v-if="province === 'Gitega'" value="Shombo">Shombo</option>
                        </select> -->
                        <input type="text" v-model="commune">
                    </div>
                    <label for="detail">Est-il disponible: </label>
                    <select v-model="disponible">
                        <option value="">-----</option>
                        <option value="true">Oui</option>
                        <option value="false">Non</option>
                    </select>
                    <label for="detail">Deja retirer: </label>
                    <select v-model="retirer">
                        <option value="">-----</option>
                        <option value="true">Oui</option>
                        <option value="false">Non</option>
                    </select>
                    <label for="detail">Deja delivrer: </label>
                    <select v-model="delivrer">
                        <option value="">-----</option>
                        <option value="true">Oui</option>
                        <option value="false">Non</option>
                    </select>
                    <label for="detail">Deja imprimer: </label>
                    <select v-model="imprimer">
                        <option value="">-----</option>
                        <option value="true">Oui</option>
                        <option value="false">Non</option>
                    </select>
                    <label for="detail">sexe: </label>
                    <select v-model="sexe">
                        <option value="">-----</option>
                        <option value="F">Feminin</option>
                        <option value="M">Masculin</option>
                        <option value="NA">Non applicable</option>
                        <option value="autres">Autres</option>
                    </select>
                </div>
                <button class="btn-modal" @click="searchLasta('')">Filtrer</button>
            </div>
        </Modal>
        <Modal :isVisible="show_black" @close="closeModal">
            <div class="form">
                <span class="title">Bloquer les Chèques du compte {{ printable[index]?.compte.numero }}</span>
                <div class="content">
                    <span class="un">Les cheques disponible sont {{ printable[index]?.cheque_restant }}</span>
                    <label for="cheques"> Numero des chèques à bloquer:</label>
                    <input type="text" id="cheques" v-model="black_nums" placeholder="1,2,3">
                </div>
                <button class="btn-modal" @click="blackLister(printable[index]?.compte.numero)"
                    style="margin-top: 20px;">Bloquer</button>
            </div>
        </Modal>
        <Modal :isVisible="show_cheques" @close="closeModal">
            <div class="chk_viewer">
                <div v-if="!client_cheques.length">
                    <div class="form">
                        <span class="title">Voir les chèques</span>
                        <div class="content">
                            <label for="cheque_num"> Numero du compte:</label>
                            <input type="text" id="cheque_num" v-model="cheques_account" placeholder="AA0000">
                        </div>
                        <button class="btn-modal" @click="voirlesCheques(cheques_account)">Envoyer</button>
                    </div>
                </div>
                <div v-else class="got_check_container">
                    <h3 class="title">
                        Voici les chèques du compte <br>
                        {{ cheques_account.toUpperCase() }}
                    </h3>
                    <p v-if="client_cheques[0].blacklisted != ''" class="blacklisted_check red">
                        Chèques bloqués: {{ client_cheques[0].blacklisted }}
                    </p>
                    <div v-else class="blacklisted_check red">Pas de chèque bloqué.</div>
                    <p v-if="client_cheques[0].cheque_restant != ''" class="blacklisted_check">
                        Chèques restants: {{ client_cheques[0].cheque_restant }}</p>
                    <div v-else class="blacklisted_check">Pas de chèque restant.</div>
                </div>
            </div>
        </Modal>
        <Modal :isVisible="show_modale" @close="closeModal">
            <form class="form" @submit.prevent="">
                <span class="title">Commande Chèques</span>
                <div class="content">
                    <SearchCompte @compte="add_account" />
                    <small v-for="err in data_error?.compte" :key="err.id">
                        {{ err }}
                    </small>
                    <label for="Quantite">Quantite:</label>
                    <input type="number" v-model="quantite" id="Quantite" />
                    <small v-for="err in data_error?.quantite" :key="err.id">
                        {{ err }}
                    </small>
                    <label for="Detail">Details:</label>
                    <input type="text" v-model="detail" id="detail" />
                    <label for="agence">Agence</label>
                    <select name="agence" v-model="agence">
                        <option value="" disabled>-----</option>
                        <option v-for="agence in $store.state.agences" :key="agence.id" :value="agence.id">{{ agence.nom
                            }}
                        </option>
                    </select>
                    <small v-for="err in data_error?.compte" :key="err.id">
                        {{ err }}
                    </small>
                </div>
                <button class="btn-modal" @click="Envoyer">Envoyer</button>
            </form>
        </Modal>
        <div class="container">
            <div class="btn-headers">
                <div class="btns">
                    <button class="btn retour" @click="goBack">&#10094;</button>
                    <button class="btn" @click="show_modale = true"> <i class="fa-solid fa-plus"></i> Commander</button>
                </div>
                <div class="row">
                    <span :class="['btn-switch', { btn_active: is_active === 'pas_encore' }]"
                        @click="is_active = 'pas_encore'">Pas encore retiré</span>
                    <span :class="['btn-switch', { btn_active: is_active === 'deja' }]" @click="is_active = 'deja'">Déjà
                        retiré</span>
                </div>
                <div class="row">
                    <button class="btn" @click="show_flitre = true">Filtrer</button>
                    <SearchComponent :searchFunction="searchLasta" />
                </div>
            </div>

            <section class="table">
                <table>
                    <tr>
                        <th>Id</th>
                        <th>Compte</th>
                        <th>Agence </th>
                        <th>Quantite</th>
                        <th>Numero </th>
                        <th>Action</th>
                        <th></th>
                    </tr>
                    <tr v-for="(cheque, index) in printable" :key="index">
                        <td>{{ cheque.id }}</td>
                        <td>{{ cheque.compte.numero }}</td>
                        <td>{{ cheque.agence }}</td>
                        <td>{{ cheque.quantite }}</td>
                        <td>{{ cheque.code_debut }} - {{ cheque.code_fin }}</td>
                        <td>
                            <div class="btns">
                                <button class="btn" v-if="cheque.is_available == true && cheque.is_delivered == false"
                                    @click="getExtraAction('delivered', cheque)">
                                    Recevoir
                                </button>
                                <button v-if="cheque.is_done == false && cheque.is_delivered == true" class="btn"
                                    @click="show_modal = true, compte = cheque.compte.id">
                                    Retirer
                                </button>
                                <button v-if="cheque.is_available == false && cheque.is_printed == true" class="btn"
                                    @click="getExtraAction('available', cheque)">Disponibiliser
                                </button>
                                <button class="btn" @click="getExtraAction('printed', cheque)">
                                    <i class="fa-solid fa-print"></i>
                                    {{ `${cheque.is_printed ? 'Réimprimer' : 'Imprimer'}` }}
                                    <!-- Imprimer -->
                                </button>
                            </div>
                        </td>
                        <td>
                            <button class="btn delete" v-if="cheque.is_done === false" @click="deleteCheque(cheque.id)">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                            <!-- <button class="btn delete" @click="chequeAjour(cheque.id)"
                                v-if="cheque.is_done == true">Bloquer
                            </button> -->
                        </td>
                    </tr>
                </table>
            </section>
        </div>
    </div>
</template>
<script>
import Modal from '@/Overlays/Modal.vue';
import Navbar from '@/components/Navbar.vue'
import SearchComponent from '@/components/SearchComponent.vue';
import Print_cheques from '../../services/print_cheques.vue';
import SearchCompte from '@/components/SearchCompte.vue';
export default {
    data() {
        return {
            printable: [],
            show_modal: false,
            cni: '',
            nom: '',
            telephone: '',
            detail: '',
            cheque_nums: [],
            account: '',
            compte: '',
            black_nums: '',
            show_flitre: false,
            show_black: false,
            show_cheques: false,
            show_modale: false,
            client_cheques: '',
            cheques_account: '',
            quantite: '',
            agence: '',
            age_superieur: '',
            age_inferieur: '',
            create_inferieur: '',
            create_superieur: '',
            commune: '',
            province: '',
            sexe: '',
            retirer: '',
            disponible: '',
            is_active: 'pas_encore',
            delivrer: '',
            imprimer: '',
            data_error: {},
            index : null,
            full_name : ''
        }
    },
    watch: {
        is_active() {
            this.getCheques()
        }
    },
    components: {
        Navbar, SearchComponent, Modal, Print_cheques,
        SearchCompte
    },
    methods: {
        async deleteCheque(id) {
            const confirmation = confirm(`Vous voulez vraiment supprimer ces chèques?`)
            if (confirmation) {
                try {
                    await axios.delete(`cheques/${id}/`);
                    this.printable = this.printable.filter(user => user.id != id);
                    this.$store.state.message.success = 'Supprimés avec succès.'
                } catch (error) {
                    this.displayErrorOrRefreshToken(error,()=> this.deleteCheque(id))
                }
            }
        },
        chequeAjour(id) {
            this.index = this.printable.findIndex((cheq_) => cheq_.id === id)
            this.show_black = true
        },
        searchLasta(text) {
            axios.get(
                text ? `cheques/?search=${text}` :
                `/cheques/?compte__numero=${this.compte}&compte__personne_physique__date_naissance__gte=${this.age_superieur}&compte__personne_physique__date_naissance__lte=${this.age_inferieur}&compte__personne_physique__sexe=${this.sexe}&compte__commune=${this.commune}&compte__province=${this.province}&is_available=${this.retirer}&is_done=${this.disponible}&is_printed=${this.imprimer}&is_delivered=${this.delivrer}&created_at__gte=${this.create_superieur}&created_at__lte=${this.create_inferieur}`
            ).then((reponse) => {
                this.printable = reponse.data.results;
                this.closeModal()
            }).catch((error) => {
                this.displayErrorOrRefreshToken(error,()=> this.searchLasta(text));
            })
        },
        blackLister(numero) {
            this.show_black = true
            const data = new FormData()
            data.append('compte_numero', numero)
            data.append('blacklist_numbers', this.black_nums)
            axios.post(`cheques/blacklist-cheques/`, data)
                .then((response) => {
                    this.$store.state.message.success = 'Cheques bloqués avec succée.'
                    this.closeModal()
                    this.update(response.data)
                }).catch(error => {
                    this.displayErrorOrRefreshToken(error, this.blackLister)
                })
        },
        async retraitCheques() {
            const form = {
                CNI: this.cni,
                nom: this.nom,
                telephone: this.telephone,
                details: this.detail,
                compte: this.compte,
            }

            axios.post(`retraitcheques/`, form)
                .then(() => {
                    this.$store.state.message.success = 'Chèques retirés avec succès.'
                    this.printable = this.printable.filter((cheque) => cheque.compte.id !== this.compte);
                    this.closeModal()
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.retraitCheques)
                    this.data_error = error.response?.data
                })
            },

        update(data) {
            this.printable = this.printable.map((cheque) => {
                if(cheque.id === data.id) return { ...cheque, ...data }
                return cheque
            });
        },
        getExtraAction(action, cheque) {
            axios.get(`cheques/${cheque.id}/cheque-${action}/`)
            .then((response)=>{
                if(action === 'printed'){
                    this.account = cheque.compte?.numero
                    this.full_name =  cheque.compte?.fullname
                    this.cheque_nums = cheque?.cheque_restant.split(",").map(Number)
                    this.$nextTick(() => print())
                }
                else this.$store.commit('setSuccess', `Cheques ${action === 'delivered' ? 'reçue' : action === 'available' ? 'disponilisés' : ''}  avec succès.` )
                this.update(response.data)
            }).catch((error)=>{
                this.displayErrorOrRefreshToken(error, ()=> this.getExtraAction(cheque))
            })
        },
        async getCheques() {
            await axios.get(`cheques/?${this.is_active === 'pas_encore' ? 'is_done=false' : 'is_done=true'}`)
                .then((response) => {
                    this.printable = response.data.results.filter((item)=> item.is_deleted !== true);
                })
                .catch((error) => this.displayErrorOrRefreshToken(error, this.getCheques))
        },
        closeModal() {
            this.show_flitre = false;
            this.fina_sum = this.sum;
            this.show_modal = false;
            this.cni = '';
            this.nom = '';
            this.telephone = '';
            this.detail = '';
            this.compte = '';
            this.show_black = false
            this.black_nums = ''
            this.show_cheques = false
            this.cheques_account = ''
            this.client_cheques = ''
            this.show_modale = false,
            this.account = '',
            this.quantite = '',
            this.agence = '',
            this.show_flitre = false
            this.age_superieur = ''
            this.age_inferieur = ''
            this.create_inferieur = ''
            this.province = ''
            this.commune = ''
            this.disponible = ''
            this.retirer = ''
            this.delivrer = ''
            this.imprimer = ''
            this.sexe = ''
        },
        voirlesCheques(numero) {
            axios.get(`cheques/?compte__numero=${numero.toUpperCase()}`)
                .then((response) => {
                    response.data.results.length ? this.client_cheques = response.data.results : (
                        this.$store.state.message.error = `Le compte ${numero.toUpperCase()} n'a pas des chèques valide.`,
                        this.closeModal()
                    )
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, () => this.voirlesCheques(numero))
                })
        },
        Envoyer() {
            const form = {
                quantite: this.quantite,
                details: this.detail,
                compte: this.compte,
                agence: this.agence,
            };
            axios.post('cheques/', form)
                .then((rep) => {
                    this.closeModal();
                    this.$store.state.message.success = "Commande Réussi.";
                    this.printable.unshift(rep.data)
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.Envoyer);
                    this.data_error = error?.response.data
                });
        },
    },
    mounted() {
        this.getCheques()
        this.getAgences()
    }
}
</script>

<style scoped>
.cheques_nums_list {
    word-break: break-word;
}
.blacklisted_check {
    width: 100%;
    box-sizing: border-box;
    margin: 0 0 8px 0;
    word-break: break-all;
    padding: 10px;
    border-radius: 3px;
    background-color: var(--primary);
}
.red {
    background-color: var(--red);
}

.got_check_container * {
    word-break: break-all;
    color: var(--second);
    max-width: 300px;
}
.got_check_container .title {
    margin-bottom: 20px;
    color: var(--primary);
}
.chk_viewer input {
    width: 100%;
}
.un {
    max-width: 100%;
    word-break: break-all
}
</style>