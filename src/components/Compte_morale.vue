<template>
    <form @submit.prevent="" class="form-nini">
        <span class="title">Créer un compte d'une organisation.</span>
        <div class="content" v-if="current_slide === 1">
            <label for="company_name">Nom:</label>
            <input type="text" v-model="nom" id="company_name">
            <small v-for="err in data_error?.nom" :key="err.id">
                {{ err }}
            </small>
            <label for="prenom"> Date de creation: </label>
            <input type="date" v-model="date_creation" id="prenom">
            <small v-for="err in data_error?.date_creation" :key="err.id">
                {{ err }}
            </small>
            <div class="inputColumn">
                <label for="societe_nif">NIF: </label>
                <input type="text" v-model="NIF" id="societe_nif">
                <small v-for="err in data_error?.NIF" :key="err.id">
                    {{ err }}
                </small>
            </div>
            <label>Organisation:</label>
            <select v-model="organisation">
                <option value="" disabled>-------</option>
                <option value="Association">Association</option>
                <option value="coopérative">Coopérative</option>
                <option value="societe">Societé</option>
            </select>
            <label for="genre">Institution:</label>
            <select name="genre" id="genre" v-model="institution">
                <option value="" disabled>------</option>
                <option value="1">Banque centrale</option>
                <option value="2">Banques commerciales</option>
                <option value="3">Institution de microfinance</option>
                <option value="4">Autres sociétés financières</option>
            </select>
            <label for="activite">Activite:</label>
            <select name="activite" id="activite" v-model="activite">
                <option value="AGRO-ELEVEUR">Agro Eleveur</option>
                <option value="COMMERCANT">Commerçant</option>
                <option value="INDUSTRIEL">Industriel</option>
                <option value="SANS">Sans</option>
                <option value="AUTRES">Autres</option>
            </select>
        </div>
        <div class="content" v-if="current_slide === 2">
            <!-- <div class="inputRow"> -->
                <div class="content" v-if="current_slide === 2">
                    <div class="inputRow">
                        <div class="inputColumn">
                            <label for="province">Province:</label>
                            <!-- <select v-model="province">
                                <option value="" disabled>-------</option>
                                <option value="Bujumbura">Bujumbura</option>
                                <option value="Buhumuza">Buhumuza</option>
                                <option value="Burunga">Burunga</option>
                                <option value="Butanyerera">Butanyerera</option>
                                <option value="Gitega">Gitega</option>
                            </select> -->
                            <input type="text" id="province" v-model="province">
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
                            <input type="text" id="commune" v-model="commune">
                        </div>
                    </div>
                    <div class="inputRow">
                        <div class="inputColumn">
                            <label for="colline"> Colline/Quartier:</label>
                            <input type="text" v-model="colline" id="colline">
                        </div>
                        <div class="inputColumn">
                            <label for="telephone">Téléphone:</label>
                            <input type="tel" v-model="telephone" id="Telephone">
                        </div>
                    </div>
                    <!-- <label for="colline"> Colline/Quartier:</label>
                    <input type="text" v-model="colline" id="colline"> -->
                    <!-- <div class="inputColumn">
                        <label for="telephone">Téléphone:</label>
                        <input type="tel" v-model="telephone" id="Telephone">
                    </div> -->
                    <div class="inputColumn">
                        <label for="payant">Payante</label>
                        <select id="payant" v-model="payante">
                            <option value="" disabled>-------</option>
                            <option :value="true">Payante</option>
                            <option :value="false">Non payante</option>
                        </select>
                    </div>
                    <div class="inputRow">
                        <div class="inputColumn">
                            <label>Document:</label>
                            <input type="file" @change="handleFileUpload($event, 'document')" accept="application/pdf"
                                required />
                        </div>
                        <a v-if="updating && specmen_file" class="btn" target="_blank" :href="specmen_file">
                            <i class="fa-solid fa-eye"></i>
                            Voir
                        </a>
                    </div>
                    <div class="inputRow">
                        <div class="inputColumn">
                            <label>Image:</label>
                            <input type="file" @change="handleFileUpload($event, 'photo')" accept="image/*" required />
                        </div>
                        <a v-if="updating && specmen_image" class="btn" target="_blank" :href="specmen_image">
                            <i class="fa-solid fa-eye"></i>
                            Voir
                        </a>
                    </div>
                    <div v-if="!updating" class="checkboxRow">
                        <div class="inputColumn">
                            <label for="création_compte">Frais de création compte:</label>
                            <input type="checkbox" v-model="frais_creation_compte" id="création_compte"  required />
                        </div>
                        <div class="inputColumn">
                            <label for="d'adhésion">Frais d'adhésion:</label>
                            <input type="checkbox" v-model="frais_adhesion" id="d'adhésion"  required />
                        </div>
                        <div class="inputColumn">
                            <label for="commande_chéquier">Frais commande chéquier:</label>
                            <input type="checkbox" v-model="frais_commande_chequier" id="commande_chéquier" required />
                        </div>
                    </div>
                </div>
            <!-- </div> -->
        </div>
        <div class="btns">
            <button type="button" v-if="current_slide == 2" class="btn-modal" @click="current_slide = 1">&#10094;
                &nbsp; Précédent </button>
            <button type="button" v-if="current_slide == 1" class="btn-modal" @click="current_slide = 2">Suivant
                &nbsp; &#10095;</button>
            <button type="button" v-if="current_slide == 2" class="btn-modal" @click="createNewAccount"
            >
            <!-- :disabled="!document"  -->
                Créer 
            </button>
        </div>
    </form>
</template>

<script>
export default {
    data() {
        return {
            institution: '',
            nom: '',
            NIF: '',
            date_creation: '',
            activite: '',
            telephone: '',
            colline: '',
            commune: '',
            province: '',
            organisation: '',
            payante: '',
            document: '',
            photo: '',
            current_slide: 1,

            frais_creation_compte: false,
            frais_adhesion: false,
            frais_commande_chequier: false,
            // prix_dun_compte : 0,
            data_error: {},

            specmen_file:'',
            specmen_image: '',

            updating : null
        };
    },
    props : {
        updatingAccount : {
            type: Object,
            required: false
        }
    },
    watch: {
        updatingAccount(newVal) {
            if(newVal) {
                const account = JSON.parse(JSON.stringify(newVal))
                
                this.nom = account.nom
                this.date_creation = account.date_creation
                this.NIF = account.NIF
                this.institution = account.institution
                this.activite = account.activite

                this.province = account.compte.province
                this.commune = account.compte.commune
                this.colline = account.compte.adresse
                this.telephone = account.compte.telephone
                this.payante = account.compte.payante

                this.updating = {
                    compte_id: account.compte.id,
                    type_id: account.id
                }

                this.specmen_file = account.compte.document
                this.specmen_image = account.compte.image
            }
        }
    },
    methods: {
        async createNewAccount() {
            if(!this.checkNum()) return
            const data = new FormData();
            data.append('nom', this.nom);
            data.append('date_creation', this.date_creation);
            data.append('NIF', this.NIF);
            data.append('institution', this.institution);
            data.append('organisation', this.organisation);
            data.append('activite', this.activite);

            this.handleAccountCreation(
                this.updating,
                'personne_morales/',
                'compte_personne_morale',
                data
            )            

        },
    },
    mounted() {
        this.getAccountCreationPrice()
    }
}
</script>

<style>
.checkboxRow {
    display: flex;
    margin-top: 15px;
    font-size: 15px;
    justify-content: space-between;

    .inputColumn {
        max-width: fit-content;
        display: flex;
        align-items: center;

        label {
            font-size: 14px;
        }
    }

}
</style>