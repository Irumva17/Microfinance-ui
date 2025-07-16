<template>
    <form @submit.prevent="" class="form-nini">
        <span class="title">Creer un compte d'une personne.</span>
        <div class="content" v-if="current_slide == 1">
            <div class="inputRow">
                <div class="inputColumn">
                    <label for="last_name">Nom :</label>
                    <input type="text" id="last_name" v-model="nom" placeholder="Nom d'utilisateur">
                    <small v-for="err in data_error?.first_name" :key="err.id">
                        {{ err }}
                    </small>
                </div>
                <div class="inputColumn">
                    <label for="first_name">Prenom:</label>
                    <input type="text" id="first_name" v-model="prenom" placeholder="Prenom d'utilisateur">
                    <small v-for="err in data_error?.last_name" :key="err.id">
                        {{ err }}
                    </small>
                </div>
            </div>
            <div class="inputRow">
                <div class="inputColumn">
                    <label for="id_number">CNI: </label>
                    <input type="text" id="id_number" v-model="cni" placeholder="Numero du CNI">
                    <small v-for="err in data_error?.CNI" :key="err.id">
                        {{ err }}
                    </small>
                </div>

                <div class="inputColumn">
                    <label for="genre">Genre:</label>
                    <select name="genre" v-model="genre">
                        <option value="M">Masculin</option>
                        <option value="F">Feminin</option>
                    </select>
                    <small v-for="err in data_error?.sexe" :key="err.id">
                        {{ err }}
                    </small>
                </div>
            </div>
            <div class="inputRow">
                <div class="inputColumn">
                    <label for="anneedenaissance"> Anneé de naissance:</label>
                    <input type="date" v-model="naissance">
                    <small v-for="err in data_error?.date_naissance" :key="err.id">
                        {{ err }}
                    </small>
                </div>
                <div class="inputColumn">
                    <label for="birth_place">Lieu de Naissance:</label>
                    <input type="text" id="birth_place" v-model="lieu_naissance">
                </div>
                <small v-for="err in data_error?.lieu_naissance" :key="err.id">
                    {{ err }}
                </small>
            </div>
            <div class="inputRow">
                <div class="inputColumn">
                    <label for="activite">Activite:</label>
                    <select name="activite" v-model="activite">
                        <option value="AGRO-ELEVEUR">Agro Eleveur</option>
                        <option value="COMMERCANT">Commercant</option>
                        <option value="SALARIE">Salarie</option>
                        <option value="INDUSTRIEL">Industriel</option>
                        <option value="SANS">Sans</option>
                        <option value="AUTRES">Autres</option>
                    </select>
                    <small v-for="err in data_error?.activite" :key="err.id">
                        {{ err }}
                    </small>
                </div>
                <div class="inputColumn">
                    <label for="Residence">Residence:</label>
                    <select name="Residence" v-model="residence">
                        <option value="" disabled selected>-------</option>
                        <option value="RESIDENT">Resident</option>
                        <option value="NON RESIDENT">Non Resident</option>
                    </select>
                    <small v-for="err in data_error?.residence" :key="err.id">
                        {{ err }}
                    </small>
                </div>
            </div>
            <div class="inputRow">
                <!-- <div class="inputColumn">
                    <label> Organisation:</label>
                    <select v-model="organisation">
                        <option value="" disabled>-------</option>
                        <option value="individu">Individu</option>
                        <option value="groupe">Groupe</option>
                        <option value="societe">Societé</option>
                    </select>
                </div> -->
                <div class="inputColumn">
                    <label for="proffession">Profession:</label>
                    <input type="text" id="proffession" v-model="profession" placeholder="Mettez la proffession">
                    <small v-for="err in data_error?.profession" :key="err.id">
                        {{ err }}
                    </small>
                </div>
            </div>
        </div>
        <div class="content" v-if="current_slide === 2">
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
                <input type="text" id="province" placeholder="Province" v-model="province">
                <small v-for="err in data_error?.province" :key="err.id">
                    {{ err }}
                </small>
            </div>
            <div class="inputColumn">
                <label for="commune">Commune:</label>
                <!-- <select id="commune" v-model="commune">
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
                <input type="text" id="commune" placeholder="Commune" v-model="commune">
                <small v-for="err in data_error?.commune" :key="err.id">
                    {{ err }}
                </small>
            </div>
            <div class="inputColumn">
                <label for="colline">Colline/Quartier:</label>
                <input type="text" id="colline" v-model="colline" placeholder="Colline" required>
                <small v-for="err in data_error?.adresse" :key="err.id">
                    {{ err }}
                </small>    
            </div>
            <div class="inputRow">
                <div class="inputColumn">
                    <label for="telephone">Téléphone:</label>
                    <input type="tel" id="telephone" v-model="telephone" placeholder="Numero de telephone">
                    <small v-for="err in data_error?.telephone" :key="err.id">
                        {{ err }}
                    </small>
                </div>
                <div class="inputColumn">
                    <label for="payant">Payante</label>
                    <select v-model="payante">
                        <option value="" disabled>-------</option>
                        <option :value="true">Payante</option>
                        <option :value="false">Non payante</option>
                    </select>
                </div>
            </div>
            <div class="inputRow">
                <div class="inputColumn">
                    <label>Document(Spcmen de signature):</label>
                    <input type="file" @change="handleFileUpload($event, 'document')" accept="application/pdf" required />
                </div>
                <a v-if="updating && specmen_file" class="btn" target="_blank" :href="specmen_file">
                    <i class="fa-solid fa-eye"></i>
                    Voir
                </a>
                <!-- <div class="inputColumn">
                    <label>Carte d'identite:</label>
                    <input type="file" @change="handleFileUpload($event, 'photo')" accept="image/*" required />
                </div> -->
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
        <div class="btns">
            <button type="button" v-if="current_slide == 2" class="btn-modal"
                @click="current_slide = 1">&#10094;
                &nbsp; Précédent </button>
            <button type="button" v-if="current_slide == 1" class="btn-modal" @click="current_slide = 2">Suivant
                &nbsp; &#10095;</button>
            <button type="button" v-if="current_slide == 2" class="btn-modal" @click="createNewAccount"
            >
            <!-- :disabled="updating && !document" -->
                {{ updating ? 'Modifier' : 'Créer' }}
            </button>
        </div>
    </form>
</template>

<script>
export default {
    data() {
        return {
            naissance: '', nom: '', prenom: '', genre: '', cni: '',
            residence: null, lieu_naissance: '', profession: '', activite: '',

            telephone: '',
            colline: '',
            commune: '',
            province: '',
            organisation: 'individu',
            payante: '',
            document: '',
            photo: '',
            isSucces: false,
            current_slide: 1,
            // prix_dun_compte : 0,
            data_error: [],

            frais_creation_compte: false,
            frais_adhesion: false,
            frais_commande_chequier: false,

            specmen_file:'',

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
                
                this.nom = account.first_name
                this.prenom = account.last_name
                this.cni = account.CNI
                this.genre = account.sexe
                this.naissance = account.date_naissance
                this.lieu_naissance = account.lieu_naissance
                this.activite = account.activite
                this.profession = account.profession
                this.residence = account.residence

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
            }
        }
    },
    methods: {
        
        async createNewAccount() {
            if(!this.checkNum()) return
            const data = new FormData();
            data.append("first_name", this.nom)
            data.append("last_name", this.prenom)
            data.append("date_naissance", this.naissance)
            data.append("lieu_naissance", this.lieu_naissance)
            data.append("profession", this.profession)
            data.append("sexe", this.genre)
            data.append("CNI", this.cni)
            data.append("activite", this.activite)
            data.append("residence", this.residence)

            this.handleAccountCreation(
                this.updating,
                'personne_physiques/',
                'compte_personne_physique',
                data
            )

        }
    },
    mounted(){
        this.getAccountCreationPrice()
    }
}
</script>

<style>

.inputRow:has(.fa-eye) {
    align-items: end;

    a {
        text-decoration: none;
    }
}
</style>