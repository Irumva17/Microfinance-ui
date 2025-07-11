<template>
  <Navbar />
  <Modal :isVisible="showModal" @close="closeModal">
    <form class="form" @submit.prevent="">
      <span class="title">Nouveau Crédit</span>
      <div class="content">
        <label for="Document">Compte</label>
        <SearchCompte @compte="add_account" />
        <small v-for="err in data_error?.compte" :key="err.id">
          {{ err }}
        </small>
        <label>Montant : </label>
        <input type="number" v-model="montant" />
        <small v-for="err in data_error?.montant" :key="err.id">
          {{ err }}
        </small>
        <label for="interet">Interet</label>
        <input type="number" id="interet" v-model="interet" />
        <small v-for="err in data_error?.interet" :key="err.id">
          {{ err }}
        </small>
        <label for="motif">Motif</label>
        <input type="text" v-model="motif" />
        <label for="echeance">Echeance</label>
        <input type="number" id="echeance" v-model="echeance" />
        <small v-for="err in data_error?.echeance" :key="err.id">
          {{ err }}
        </small>
        <label for="avaliseur">Avaliseur</label>
        <input type="text" id="Avaliseur" v-model="avaliseur" />
        <label for="Document">Document</label>
        <input type="file" id="Document" @change="handleFileUpload($event, 'document')" accept="pdf, images*" />
        <small v-for="err in data_error?.document" :key="err.id">
          {{ err }}
        </small>
        <label for="type">Type de Credit</label>
        <select id="type" v-model="type">
          <option value="" disabled>-----------</option>
          <option value="CREDIT AGRO PASTORAL">Credit Agro Pastoral</option>
          <option value="CREDIT COMMERCIAL">Credit Commercial</option>
          <option value="CREDIT A L'INDUSTRIE">Credit à l'industrie</option>
          <option value="CREDIT AU SECTEUR DES SERVICES">
            Credit au secteur des services
          </option>
          <option value="LES DECOUVERTS">Les Decouverts</option>
          <option value="CREDITS AUX EMPLOYES">Credits aux employes</option>
          <option value="AUTRES">Autres</option>
        </select>
      </div>
      <button class="btn-modal" @click="functionCredit">Créditer {{ money(montant) }}</button>
    </form>
  </Modal>
  <Modal :isVisible="showconf" @close="closeModal">
    <div class="form">
      <span class="title">Configuration du crédit</span>
      <div class="content">
        <label for="">Court terme max</label>
        <input type="number" name="" id="" v-model="courtMax" placeholder="Mettez des chiffres en fonction des jours">
        <label for="">Moyen terme max</label>
        <input type="number" name="" id="" v-model="MoyenMax" placeholder="Mettez des chiffres en fonction des jours">
        <label for="">Jours souffrance</label>
        <input type="number" name="" id="" v-model="soufrance" placeholder="Mettez des chiffres en fonction des jours">
        <label for="">Priorisation d'interet</label>
        <input type="checkbox" name="" id="" v-model="choix_interet">
        
      </div>
      <button class="btn-modal" @click="functionConfiguration">Configurer</button>
    </div>
  </Modal>
  <Modal :isVisible="showVisual" @close="closeModal">
    <div class="form">
      <span class="title">Visualisation de la configuration du crédit</span>
      <div class="content">
        <span>court terme max : {{ this.config.results[0]?.court_terme_max }}</span>
        <span>Moyen terme max : {{ this.config.results[0]?.moyen_terme_max }}</span>
        <span>Jour de soufrance : {{ this.config.results[0]?.jours_souffrance }}</span>
      </div>
      <button class="btn-modal delete" @click="confDelete(this.config.results[0].id)"> <i class="fa-solid fa-trash"></i>
        Supprimer</button>
    </div>
  </Modal>
  <Modal :isVisible="show_decalage" @close="closeModal">
    <div class="form">
      <div class="content">
        <span class="title">Décalage sur la periode de {{ datetime(compte.payment_date) }}:</span>
        <input type="number" v-model="decalage">
      </div>
      <button class="btn-modal" @click="postDecalage(compte.id)">Envoyer</button>
    </div>
  </Modal>
  <Modal :isVisible="show_reecholer" @close="closeModal">
    <div class="form">
      <div class="content">
        <span class="title">Nouvelle mensualiter:</span>
        <input type="number" v-model="mensualiter">
      </div>
      <button class="btn-modal" @click="postReecholer(compte.id)">Envoyer</button>
    </div>
  </Modal>
  <Modal :isVisible="showSelect" @close="closeModal">
    <form @submit.prevent="validate_password = true" class="form">
      <div class="content">
        <span class="title">Validation du credit </span>
        <select v-model="amortissement">
          <option value="" disabled>Type d'amortissement</option>
          <option value="lineaire">Amortissement lineaire</option>
          <option value="degressif">Amortissement degressif</option>
        </select>
        <div class="row">
          <input id="chk_assurance" type="checkbox" class="btn" v-model="checkassurance">
          <label for="chk_assurance"> Assurance </label>
        </div>
        <div class="row">
          <input id="chk_nant" type="checkbox" class="btn" v-model="checknantissement">
          <label for="chk_nant"> Nantissemment </label>
        </div>
        <div class="row">
          <input id="chk_doss" type="checkbox" class="btn" v-model="checkdossier">
          <label for="chk_doss"> Frais du dossier </label>
        </div>
        <div class="row">
          <input id="chk_comm" type="checkbox" class="btn" v-model="commission">
          <label for="chk_comm"> commission crédit </label>
        </div>
      </div>
      <button class="btn-modal" type="submit">Continuer</button>
    </form>
  </Modal>
  <Modal :isVisible="show_modo" @close="closeModal">
    <form @submit.prevent="searchLasta('')" class="form">
      <span class="title">Filtrage</span>
      <div class="content">
        <div>
          <label>Est-il une Personne physique :</label>
          <select v-model="physique">
            <option value="">Rien</option>
            <option value="true">Oui</option>
            <option value="false">Non</option>
          </select>
        </div>
        <div>
          <label>Commune :</label>
          <input type="text" placeholder="numero de votre compte" v-model="compte" />
          <label>Montant maximal :</label>
          <input type="text" placeholder="montant maximal" v-model="montant_maximal" />
          <label>Montant minimal :</label>
          <input type="text" placeholder="montant minimal" v-model="montant_minimal" />
          <label> Date d'approbation :</label>
          <div class="inputRow">
            <input type="date" placeholder="numero de votre age" v-model="approved_superieur" />
            <input type="date" placeholder="numero de votre age" v-model="approved_inferieur" />
          </div>
          <label> Date de paiement :</label>
          <div class="inputRow">
            <input type="date" placeholder="numero de votre age" v-model="paiement_superieur" />
            <input type="date" placeholder="numero de votre age" v-model="paiement_inferieur" />
          </div>
          <div v-show="physique === 'true'">
            <label> Mettre l'age :</label>
            <div class="inputRow">
              <input type="date" placeholder="numero de votre age" v-model="age_superieur" />
              <input type="date" placeholder="numero de votre age" v-model="age_inferieur" />
            </div>
          </div>
          <div v-show="physique === 'true'">
            <label>Mettre le genre :</label>
            <select v-model="sexe">
              <option value="">------</option>
              <option value="F">Femme</option>
              <option value="H">Homme</option>
              <option value="NA">Non applicable</option>
              <option value="autres">Autres</option>
            </select>
          </div>
          <div>
            <label>Sorte de crédit :</label>
            <select v-model="credite">
              <option value="">------</option>
              <option value="CREDIT+AGRO+PASTORAL">Credit agro pastoral</option>
              <option value="CREDIT+COMMERCIAL">Credit commercial</option>
              <option value="CREDIT+A+L%27INDUSTRIE">Credit industriel</option>
              <option value="CREDIT+AU+SECTEUR+DES+SERVICES">Credit secteur service</option>
              <option value="LES+DECOUVERTS">Les decouverts</option>
              <option value="CREDITS+AUX+EMPLOYES">Credit aux employes</option>
              <option value="AUTRES">Autres</option>
            </select>
          </div>
        </div>
      </div>
      <button class="btn-modal">Filtrer</button>
    </form>
  </Modal>
  <Modal :isVisible="show_liquider" @close="closeModal">
    <div class="form">
      <span class="title">Liquidation</span>
      <div class="content">
        <span>capital : {{ money(liquidation?.capital) }}</span>
        <span>Interet : {{ money(liquidation?.interet) }}</span>
        <span>Retard : {{ money(liquidation?.retard) }}</span>
      </div>
      <button class="btn-modal" @click="getLiquider">Liquider</button>
    </div>
  </Modal>
  <Modal :isVisible="show_reecholer_impayer" @close="closeModal">
    <div class="form">
      <span>Details: {{ this.impayer.detail }}</span>
    </div>
  </Modal>
  <Modal :isVisible="show_reecholer_impayer" @close="closeModal">
    <div class="form">
      <span>Details: {{ this.dif.detail }}</span>
    </div>
  </Modal>

  <!-- <Modal :isVisible="show_reecholer_impayer" @close="closeModal">
    <div class="form">
      <span>Details: {{ this.anticiper?.status }}</span>
    </div>
  </Modal> -->

  <div class="container">
    <div class="subMenu-headers">
      <div class="row">
        <button class="btn retour" @click="goBack">&#10094;</button>
        <button class="btn" @click="showModal = true">
          <i class="fa-solid fa-plus"></i> Ajouter Crédit</button>
        <button class="btn" @click="showconf = true" v-if="this.config.count === 0">
          <i class="fa-solid fa-gear"></i> &nbsp; Configuration Crédit 
        </button>
        <!-- <button class="btn" @click="showVisual = true" v-else>
          <i class="fa-solid fa-eye"></i>&nbsp; Configuration Crédit 
        </button> -->
      </div>
      <div class="row">
        <button @click="show_modo = true" class="btn">
          Filtrer
        </button>
        <SearchComponent :searchFunction="searchLasta" />
        <PasswordValidator v-if="validate_password" @close="validate_password = false" @validate="valider" />
      </div>
    </div>

    <div class="accounts" v-if="totals">
      <div class="aCont">
        <span>COMPTE:</span>
        <span>{{ credits.count }}</span>
      </div>
      <Account :account_name="'Montant en circulation'" :account_money="totals.montant_en_circulation" />
      <Account :account_name="'Interet credit en cours'" :account_money="totals.interet_credit_en_cours" />
      <Account :account_name="' Total credit en cours'" :account_money="totals.mensualite_credit_en_cours" />
      <Account :account_name="'Capital en cours'" :account_money="totals.capital_credit_en_cours" />
    </div>
    <section class="table">
      <table>
        <tr>
          <th>Id</th>
          <th>Compte</th>
          <!-- <th>Nom</th> -->
          <th>Date</th>
          <th>Jours</th>
          <th>Taux </th>
          <th>Periode (Mois)</th>
          <th>Montant</th>
          <!-- <th>Mensualites</th> -->
          <th>Aprouver par</th>
          <th>Options</th>
        </tr>
        <tr v-for="credit in credits.results" :key="credit.id" @dblclick="navigateToCredit(credit)">
          <td>{{ credit.id }}</td>
          <td>{{ credit.compte?.numero }}</td>
          <!-- <td>{{ (credit.compte?.first_name || '') + " " + (credit.compte?.last_name || '') }}</td> -->
          <td>{{ datetime(credit?.created_at) }}</td>
          <td v-if="credit.done && credit.approved">-</td>
          <td v-else :class="{ 'text-red': daysRemaining(credit?.payment_date) < 0 }">
            <span v-if="credit?.payment_date">
              <template v-if="daysRemaining(credit.payment_date) < 0">
                {{ Math.abs(daysRemaining(credit.payment_date)) }} jours dépassés
              </template>
              <template v-else>
                {{ daysRemaining(credit.payment_date) }} jours restants
              </template>
            </span>
            <span v-else>
              Jours non définis
            </span>
          </td>

          <td>{{ money(credit.interet) }}</td>
          <td>{{ credit.echeance }}</td>
          <td>{{ money(credit.montant) }}</td>
          <!-- <td>{{ money(credit.reste) }}</td> -->
          <td>
            <span v-if="!credit.approved_by?.first_name && !credit.approved_by?.last_name">
              {{ credit.approved_by?.username }}
            </span>
            <span v-else>{{ credit.approved_by?.first_name }} {{ credit.approved_by?.last_name }}</span>
          </td>
          <td>
            <div class="btns">
              <button v-if="!credit.approved_by" @click="(showSelect = true), (amId = credit.id)" class="btn">
                Valider
              </button>
              <!-- <button v-if="!credit.approved" @click="handleDelete(credit.id)" class="btn delete">
                <i class="fa-solid fa-trash"></i>
              </button> -->
              <span v-else-if="credit.done && credit.approved_by" class="valid">Crédit déjà terminer</span>
            </div>
            <i class="btn fa fa-ellipsis-v" v-show="!credit.done && credit.approved_by" @click="toggleOptions(credit.id)">
              <div class="option-links" v-show="selectedItemId === credit.id">
                <span class="option-link" v-if="!credit.done && credit.approved_by" @click="getLiquidation(credit.id)">
                  <span>&#9656;</span> Liquidation</span>
                <!-- <span class="option-link" @click="Decalage(credit)"> <span>&#9656;</span> Décalage</span> -->
                <span class="option-link" @click="Reecholer(credit)"> <span>&#9656;</span> Réechelonnement</span>
                <!-- <span class="option-link" @click="getReecholer_impayer(credit.id)"> <span>&#9656;</span> Réechelonnement
                  en cas d'impayer
                </span> -->

                <!-- <span class="option-link" @click="getDifferer(credit.id)"> <span>&#9656;</span>Differer </span> -->
                <span class="option-link" @click="getPayerAnticipation(credit.id)"> <span>&#9656;</span>Payer anticiper</span>
                <span class="option-link" @click="navigateToCredit(credit)"> <span>&#9656;</span>Plus d'information</span>
              </div>
            </i>
          </td>
        </tr>
      </table>
    </section>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import SearchComponent from "@/components/SearchComponent.vue";
import Modal from "@/Overlays/Modal.vue";
import dayjs from "dayjs";
import Account from "@/components/account.vue";
import SearchCompte from "@/components/SearchCompte.vue";
import PasswordValidator from "@/Overlays/PasswordValidator.vue";

export default {
  data() {
    return {
      credits: [],
      config: [],
      show_liquider: false,
      showModal: false,
      showconf: false,
      showVisual: false,
      showSelect: false,
      show_modo: false,
      amortissement: "",
      amId: null,
      document: null,
      montant: null,
      echeance: null,
      interet: null,
      motif: "",
      avaliseur: "",
      type: "",
      close: false,
      compte: "",
      searchQuery: "",
      search: "",
      id: "",
      choix_interet: false,
      compte: "",
      age_inferieur: "",
      age_superieur: "",
      sexe: "",
      physique: "",
      credite: "",
      got_accounts: [],
      result: '',
      keyword: '',
      courtMax: '',
      MoyenMax: '',
      soufrance: '',
      approved_superieur: '',
      approved_inferieur: '',
      paiement_inferieur: '',
      paiement_superieur: '',
      montant_minimal: '',
      montant_maximal: '',
      totals: [],
      liquide: [],
      liquideur: [],
      impayer: [],
      dif: [],
      anticiper: [],
      credit_id: '',
      data_error: {},
      liquidation: {
        capital: null,
        interet: null,
        retard: null
      },
      selectedItemId: '',
      timeoutId: '',
      decalage: '',
      mensualiter: '',
      show_decalage: false,
      show_reecholer: false,
      show_reecholer_impayer: false,
      checknantissement: false,
      checkdossier: false,
      checkassurance: false,
      commission: false,
      validate_password: false
    };
  },
  components: {
    Navbar,
    SearchComponent,
    Modal,
    Account,
    SearchCompte,
    PasswordValidator
  },
  watch: {
    liquidation(newVal) {
      if (newVal) {
        if (newVal.capital) this.liquidation.capital = newVal.capital;
        if (newVal.interet) this.liquidation.interet = newVal.interet;
        if (newVal.retard) this.liquidation.retard = newVal.retard;
      }
    },
    'choix_interet'(value) {
      console.log(value)
    }
  },
  methods: {
    // async handleDelete(id) {
    //   const confirmation = confirm(`Vous voulez vraiment supprimer ce crédit?`)
    //   if (confirmation) {
    //     try {
    //       await axios.delete(`credits/${id}/`);
    //       this.credits.results = this.credits.results.filter(user => user.id != id);
    //       this.$store.state.message.success = 'Supprimés avec succès.'
    //     } catch (error) {
    //       this.displayErrorOrRefreshToken(error, this.handleDelete)
    //     }
    //   }
    // },
    async confDelete(id) {
      const confirmation = confirm(`Vous voulez vraiment supprimer ce configuration?`)
      if (confirmation) {
        try {
          await axios.delete(`creditconfiguration/${id}/`);
          this.$store.state.message.success = 'Supprimés avec succès.'
          this.closeModal()
          this.getConf()
        } catch (error) {
          this.displayErrorOrRefreshToken(error, this.handleDelete)
        }
      }
    },
    Decalage(credit) {
      this.show_decalage = true;
      this.compte = credit
    },
    Reecholer(credit) {
      this.show_reecholer = true;
      this.compte = credit
    },
    getReecholer_impayer(id) {
      this.show_reecholer_impayer = true;
      axios.get(`credits/${id}/reechelonner/`)
        .then((reponse) => {
          this.impayer = reponse.data.results
        }).catch((error) => {
          this.displayErrorOrRefreshToken(error, () => this.getReecholer_impayer(id));
        })
    },
    getDifferer(id) {
      this.show_reecholer_impayer = true;
      axios.get(`credits/${id}/differer/`)
        .then((reponse) => {
          this.dif = reponse.data.results
          console.log(this.dif)
        }).catch((error) => {
          this.data_error = error.response?.data
          this.displayErrorOrRefreshToken(error, () => this.getDifferer(id));
        })
    },
    getPayerAnticipation(id) {
      axios.get(`credits/${id}/payer-anticipation/`)
        .then((reponse) => {
          this.anticiper = reponse.data
          this.$store.state.message.success = this.anticiper?.status;
          console.log(this.dif)
        }).catch((error) => {
          this.data_error = error.response?.data
          this.displayErrorOrRefreshToken(error, () => this.getPayerAnticipation(id));
        })
    },
    update(data) {
      this.credits.results = this.credits.results.map((credit) => {
        if (credit.id === data.id) return { ...credit, ...data }
        return credit
      })
    },
    postDecalage(id) {
      const formData = new FormData();
      formData.append("periode", this.decalage);
      axios.post(`credits/${id}/reechelonner/`, formData)
        .then((response) => {
          this.$store.state.message.success = "Décalage enregistrer avec succées.";
          this.update(response.data)
          this.closeModal()
        }).catch((error) => {
          this.data_error = error.response?.data
          this.displayErrorOrRefreshToken(error, () => this.postDecalage(id))
        })
    },
    postReecholer(id) {
      const formData = new FormData();
      formData.append("echeance", this.mensualiter);
      axios.post(`credits/${id}/reechelonner/`, formData)
        .then((response) => {
          this.$store.state.message.success = "Décalage enregistrer avec succées.";
          this.update(response.data)
        }).catch((error) => {
          this.data_error = error.response?.data
          this.displayErrorOrRefreshToken(error, () => this.postReecholer(id))
        })
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
    getLiquidation(id) {
      this.show_liquider = true;
      this.credit_id = id;
      axios.get(`credits/${id}/liquidation/`)
        .then((reponse) => {
          this.liquidation = reponse.data
        }).catch((error) => {
          this.displayErrorOrRefreshToken(error, this.getLiquidation);
        })
    },
    getLiquider() {
      axios.get(`credits/${this.credit_id}/liquider/`)
        .then((reponse) => {
          this.update(reponse.data)
          this.closeModal()
        }).catch((error) => {
          this.displayErrorOrRefreshToken(error, this.getLiquider);
        })
    },
    searchLasta(text) {
      axios.get(
        text ? `credits/?search=${text}` :
          `/credits/?compte__commune__icontains=${this.compte}&compte__numero=&compte__personne_physique__date_naissance__gte=${this.age_superieur}&compte__personne_physique__date_naissance__lte=${this.age_inferieur}&compte__personne_physique__sexe=${this.sexe}&type_credit=${this.credite}&approved_at__gte=${this.approved_superieur}&approved_at__lte=${this.approved_inferieur}&payment_date__gte=${this.paiement_superieur}&payment_date__lte=${this.paiement_inferieur}&montant__gte=${this.montant_maximal}&montant__lte=${this.montant_minimal}&compte__personne_physique__isnull=${this.physique}`
      ).then((reponse) => {
        this.credits = reponse.data;
        this.closeModal()
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, () => searchLasta(text));
      })
    },
    async getCredits() {
      // await axios.get('credits/?is_active=true')
      await axios.get('credits/')
        .then((response) => {
          this.credits = response.data;
          this.totals = response.data.totals
        }).catch((error) => {
          this.displayErrorOrRefreshToken(error, this.getCredits);
        })
    },
    // async getConf() {
    //   await axios.get("creditconfiguration/")
    //     .then((response) => {
    //       this.config = response.data;
    //     }).catch((error) => {
    //       this.displayErrorOrRefreshToken(error, this.getCredits);
    //     })
    // },
    navigateToCredit(credit) {
      this.$store.state.compte_active = credit
      this.$router.push({
        name: "credit/:id",
        params: credit,
        query: { approved: credit.approved },
      });
    },
    closeModal() {
      this.showSelect = false;
      this.show_modo = false;
      this.showModal = false;
      this.showconf = false;
      this.showVisual = false;
      this.show_liquider = false;
      this.show_decalage = false;
      this.show_reecholer = false;
      this.show_reecholer_impayer = false;
      this.liquidation = {
        capital: null,
        interet: null,
        retard: null
      }
      this.compte = "",
        this.searchQuery = "",
        this.search = "",
        this.compte = "",
        this.age_inferieur = "",
        this.age_superieur = "",
        this.sexe = "",
        this.physique = "",
        this.credite = "",
        this.result = '',
        this.courtMax = '',
        this.MoyenMax = '',
        this.soufrance = '',
        this.keyword = '',
        this.approved_superieur = '',
        this.approved_inferieur = '',
        this.paiement_inferieur = '',
        this.paiement_superieur = '',
        this.montant_minimal = '',
        this.montant_maximal = '';
    },
    valider() {
      if (this.amortissement === "") {
        this.$store.state.message.error = "veuiller choisir une amortissement";
        return;
      }
      const data = {
        amortissement: this.amortissement,
        frais_dossier: this.checkdossier,
        frais_nantissement: this.checknantissement,
        frais_assurance: this.checkassurance,
        commission_credit: this.commission
      };
      axios
        .post(`credits/${this.amId}/valider_credit/`, data)
        .then((response) => {
          // const index = this.credits.results.findIndex((credit) => credit.id === this.amId);
          // if (index !== -1) {
          //   this.credits.results[index] = response.data
          // }
          this.getCredits()
          this.amortissement = this.checkdossier = this.checknantissement = this.checkassurance = ''
          this.$store.state.message.success = 'Valider avec succès.'
          this.showSelect = false
          this.closeModal();
        }).catch((error) => {
          this.displayErrorOrRefreshToken(error, this.valider)
        })
    },
    async functionCredit() {
      const formData = new FormData();
      formData.append("document", this.document);
      formData.append("montant", this.montant);
      formData.append("interet", this.interet);
      formData.append("motif", this.motif);
      formData.append("echeance", this.echeance);
      formData.append("avaliseur", this.avaliseur);
      formData.append("type_credit", this.type);
      formData.append("compte", this.compte);
      try {
        const response = await axios.post("credits/", formData);
        this.closeModal();
        this.$store.state.message.success = "Credit enregistré.";
        //console.log(response)
        //this.credits.results.unshift(response)
        this.getCredits()
      } catch (error) {
        this.data_error = error.response?.data
        this.displayErrorOrRefreshToken(error, this.functionCredit)
      }
    },
    async functionConfiguration() {
      const formData = new FormData();
      formData.append("court_terme_max", this.courtMax);
      formData.append("moyen_terme_max", this.MoyenMax);
      formData.append("jours_souffrance", this.soufrance);
      formData.append("is_interest_prior", this.choix_interet);

      const data = {
        "court_terme_max":this.courtMax,
        "moyen_terme_max":this.MoyenMax,
        "jours_souffrance":this.soufrance,
        "is_interest_prior":this.choix_interet,
      }
      try {
        const response = await axios.post("creditconfiguration/", data);
        this.$store.state.message.success = "Credit configurer.";
        this.closeModal();
        this.getConf()
      } catch (error) {
        this.data_error = error.response?.data
        this.displayErrorOrRefreshToken(error, this.functionCredit)
      }
    },
    onUpdated(credit, status) {
      credit.status = status;
    },
    daysRemaining(paymentDate) {
      const today = dayjs();
      const payment = dayjs(paymentDate);
      const daysDiff = payment.diff(today, 'day');

      return daysDiff;
    }
  },
  mounted() {
    this.$store.state.credits?.length
      ? this.credits = this.$store.state.credits
      : this.getCredits();
    // this.getConf()
  },

};
</script>
