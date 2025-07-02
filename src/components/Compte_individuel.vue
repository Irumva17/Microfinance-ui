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
                    </select>
                </div>
                <div class="inputColumn">
                    <label for="Residence">Residence:</label>
                    <select name="Residence" v-model="residence">
                        <option value="" disabled selected>-------</option>
                        <option value="RESIDENT">Resident</option>
                        <option value="NON RESIDENT">Non Resident</option>
                    </select>
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
                </div>
            </div>
        </div>
        <div class="content" v-if="isSucces">
            <div class="inputRow">
                <div class="inputColumn">
                    <label for="nom">Nom :</label>
                    <input type="text" v-model="nom" placeholder="Nom d'utilisateur">
                    <small v-for="err in data_error?.first_name" :key="err.id">
                        {{ err }}
                    </small>
                </div>
                <div class="inputColumn">
                    <label for="prenom">Prenom:</label>
                    <input type="text" v-model="prenom" placeholder="Prenom d'utilisateur">
                    <small v-for="err in data_error?.last_name" :key="err.id">
                        {{ err }}
                    </small>
                </div>
            </div>
            <div class="inputRow">
                <div class="inputColumn">
                    <label for="cni">CNI: </label>
                    <input type="text" v-model="cni" placeholder="Numero du CNI">
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
                </div>
            </div>
            <div class="inputRow">
                <div class="inputColumn">
                    <label for="anneedenaissance"> Date de naissance:</label>
                    <input type="date" v-model="naissance" placeholder="Date de naissance">
                    <small v-for="err in data_error?.date_naissance" :key="err.id">
                        {{ err }}
                    </small>
                </div>
                <div class="inputColumn">
                    <label for="adresse">Lieu de Naissance:</label>
                    <input type="text" v-model="lieu_naissance" placeholder="Lieu de Naissance">
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
                </div>
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
                    </select>
                </div>
                <div class="inputColumn">
                    <label for="Residence">Residence:</label>
                    <select name="Residence" v-model="residence">
                        <option value="" disabled selected>-------</option>
                        <option value="RESIDENT">Resident</option>
                        <option value="NON RESIDENT">Non Resident</option>
                    </select>
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
                <input type="text" id="province" placeholder="Mettez le nom du province" v-model="province">
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
                <input type="text" id="commune" placeholder="Mettez le nom du commune" v-model="commune">
            </div>
            <div class="inputColumn">
                <label for="colline">Colline/Quartier:</label>
                <input type="text" id="colline" v-model="colline" placeholder="Mettez le nom de la colline" required>
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
                    <label>Document(Spcen de signature):</label>
                    <input type="file" @change="handleFileUpload($event, 'document')" accept="application/pdf" required />
                </div>
                <!-- <div class="inputColumn">
                    <label>Carte d'identite:</label>
                    <input type="file" @change="handleFileUpload($event, 'photo')" accept="image/*" required />
                </div> -->
            </div>
        </div>
        <div class="btns">
            <button type="button" v-if="current_slide == 2" class="btn-modal"
                @click="current_slide = 1">&#10094;
                &nbsp; Précédent </button>
            <button type="button" v-if="current_slide == 1" class="btn-modal" @click="current_slide = 2">Suivant
                &nbsp; &#10095;</button>
            <button type="button" v-if="current_slide == 2" class="btn-modal" @click="createNewAccount"
                :disabled="!document">
                Créer 
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
            document: null,
            photo: '',
            isSucces: false,
            current_slide: 1,
            // prix_dun_compte : 0,
            data_error: []
        };
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
                'personne_physiques/',
                'compte_personne_physique',
                data
            )
            // Personal data
            // data.append('compte_personne_physique.telephone', this.telephone);
            // data.append('compte_personne_physique.adresse', this.colline);
            // data.append('compte_personne_physique.commune', this.commune);
            // data.append('compte_personne_physique.province', this.province);
            // data.append('compte_personne_physique.organisation', this.organisation);
            // // data.append('compte_personne_physique.payante', this.payante);
            // data.append('compte_personne_physique.document', this.document);
            // data.append('compte_personne_physique.photo', this.photo);

            // await axios.post('personne_physiques/', data)
            // .then((response) => {
            //         this.compte = response.data.numero
            //         this.current_slide = 1
            //         // this.putDatas(response.data.compte_id)
            //         // this.$store.state.user.personnel.balance += this.prix_dun_compte
            //         this.$store.commit(
            //             'setSuccess', 
            //             `Le compte de ${this.nom} a été créée avec succès.`
            //         );
            //         this.$emit('done')
            //     }).catch((error) => {
            //         this.data_error = error.response?.data
            //         this.displayErrorOrRefreshToken(error, this.createNewAccount)
            //     })
        }
    },
    mounted(){
        this.getAccountCreationPrice()
    }
}
</script>