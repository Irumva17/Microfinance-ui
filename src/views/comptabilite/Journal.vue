<template>
  <Navbar />
  <Modal :isVisible="show_modal" @close="closing">
    <form class="form" @submit.prevent="searchGet">
      <span class="title">Filtrage</span>
      <div class="content">
        <label for="echeance">Numero de compte</label>
        <input type="text" id="echeance" placeholder="Metter votre numero" v-model="numero" />
        <label for="echeance">Numero créditer</label>
        <input type="text" id="echeance" placeholder="Metter votre numero créditer" v-model="crediteur" />
        <label for="echeance">Numero débiter</label>
        <input type="text" id="echeance" placeholder="Metter votre numero débiter" v-model="debiteur" />
        <label for="text">Date de création</label>
        <div class="inputRow">
            <input type="date"  v-model="date_inferieur" />
            <input type="date"  v-model="date_superieur" />
          </div>
      </div>
      <button class="btn-modal" @click="searchGet">Rechercher </button>
    </form>
  </Modal>
  <Modal :isVisible="show_modal_new" @close="closing">
    <form class="form" @submit.prevent="">
      <span class="title">Ajouter</span>
      <div class="content">
        <label for="montant">Montant</label>
        <input type="number" id="montant" placeholder="Montant" v-model="montant" />
        <label for="ref_number">Numero de référence</label>
        <input type="text" id="ref_number" placeholder="Numero de référence" v-model="ref_number" />
        <small v-for="err in data_error?.ref_number" :key="err.id">
          {{ err }}
        </small>
        <label for="motif">Motif</label>
        <input type="text" id="motif" placeholder="Motif" v-model="motif" />
        <small v-for="err in data_error?.motif" :key="err.id">
          {{ err }}
        </small>
        <label for="debiteur">Debiteur</label>
        <select id="debiteur" v-model="debiteur">
          <option value="" disabled>--------</option>
          <option v-for="plan in plan_comptables" :key="plan.id" :value="plan.id">{{ plan.numero + '-' + plan.nom }}
          </option>
        </select>
        <label for="Crediteur">Crediteur</label>
        <select id="crediteur" v-model="crediteur">
          <option value="" disabled>--------</option>
          <option v-for="plan in plan_comptables" :key="plan.id" :value="plan.id">{{ plan.numero + '-' + plan.nom }}
          </option>
        </select>
        <small v-for="err in data_error?.crediteur" :key="err.id">
          {{ err }}
        </small>
      </div>
      <button class="btn-modal" @click="nouveauxJournal">Créer &nbsp; {{money(montant)}}</button>
    </form>
  </Modal>

  <div class="container">
    <div class="subMenu-headers">
      <div class="row">
        <button class="btn retour" @click="goBack">&#10094;</button>
        <button class="depot btn" @click="show_modal_new = true"><i class="fa-solid fa-plus"></i>Ajouter</button>
      </div>
      <div class="row">
        <span class="btn" @click="show_modal = true">Filtrer</span>
        <SearchComponent :searchFunction="rechercher" />
      </div>
    </div>
    <section class="table" ref="dataContainer">
      <table>
        <tr>
          <th rowspan="2">Id</th>
          <th rowspan="2">Date</th>
          <th rowspan="2">Référence</th>
          <th colspan="2">Comptes</th>
          <th rowspan="2">Libellé</th>
          <th rowspan="2">Montant</th>
          <th rowspan="2">Options</th>
        </tr>
        <tr>
          <th>Débiteur</th>
          <th>Créditeur</th>
        </tr>
        <tr v-for="journal in journals.results" :key="journal.id">
          <td>{{ journal.id }}</td>
          <td>{{ datetime(journal.created_at) }}</td>
          <td>{{ journal.ref_number }}</td>
          <td>{{ journal.debiteur.nom }}</td>
          <td>{{ journal.crediteur.nom }}</td>
          <td>{{ journal.motif }}</td>
          <td>{{ money(journal.montant) }}</td>
          <td>
            <button v-if="journal.created_by" class="btn delete" @click="deleteItem(journal.id)">
              <i class="fa-solid fa-trash"></i>
            </button>
            <span v-else>N/A</span>
          </td>
        </tr>
      </table>
      <div v-if="journals.next" class="nextPaginator">
        <button class="btn" @click="getJournals(journals.next)">
          Page suivante &nbsp; &#10095;
        </button>
      </div>
    </section>
  </div>
</template>
<script>
import Navbar from "@/components/Navbar.vue";
import SearchComponent from "@/components/SearchComponent.vue";
import Modal from "@/Overlays/Modal.vue";
export default {
  data() {
    return {
      journals: [],
      search: "",
      show_modal: false,
      numero: "",
      crediter: "",
      debiter: "",
      show_modal_new: false,

      montant: 0,
      motif: '',
      crediteur: '',
      debiteur: '',
      ref_number: '',
      data_error:{},
      plan_comptables: [],
      date_superieur:'',
      date_inferieur: ''
    };
  },
  components: {
    Navbar,
    Modal,
    SearchComponent
  },
  methods: {
    // getJournalNumber(nom){
    //   const match = nom.match(/^\d+(?:-\d+)?/);
    //   return match ? match[0] : '';
    // },''
    async deleteItem(id) {
      const confirmation = confirm(`Vous voulez vraiment supprimer ce journal?`)
      if (confirmation) {
        try {
          await axios.delete(`journalcaisse/${id}/`);
          this.journals.results = this.journals.results.filter(item => item.id != id);
          this.$store.state.message.success = 'Supprimés avec succès.'
        } catch (error) {
          this.displayErrorOrRefreshToken(error,()=> this.deleteItem(id))
        }
      }
    },
    rechercher(keyword) {
      axios.get(`journalcaisse/?search=${keyword}`)
        .then((reponse) => {
          // this.journals = reponse.data;
          if (reponse.data.results.length) {
            this.journals = reponse.data;
          } else {
            this.$store.state.message.error = "Resultats introuvable.";
          }
        }).catch((error) => {
          this.displayErrorOrRefreshToken(error,()=> this.rechercher(keyword))
        })
    },
    searchGet() {
      axios.get(`journalcaisse/?ref_number=${this.numero}&crediteur__numero__startswith=${this.crediteur}&debiteur__numero__startswith=${this.debiteur}&created_at__gte=${this.date_superieur}&created_at__lte=${this.date_inferieur}`)
        .then((reponse) => {
          this.journals = reponse.data;
          this.show_modal = false;
        }).catch((error) => {
          this.displayErrorOrRefreshToken(error, this.searchGet);
        }).finally(() => {
          this.show_modo = false;
        });
    },
    getJournals(url) {
      axios
      .get(url ? url : "journalcaisse/")
      .then((response) => {
          this.journals = response.data;
          this.$nextTick(() => {
            this.$refs.dataContainer.scrollTop = 0
          });
        }).catch((error) => {
          this.displayErrorOrRefreshToken(error, this.getJournals);
        });
    },
    nouveauxJournal() {
      const form = new FormData();
      form.append("montant", this.montant);
      form.append("ref_number", this.ref_number);
      form.append("motif", this.motif);
      form.append("debiteur", this.debiteur);
      form.append("crediteur", this.crediteur);

      axios.post(`journalcaisse/`, form)
        .then((response) => {
          this.journals.results.push(response.data)
          // this.journals = [...response.data]
          
          this.$store.state.message.success = 'Nouveaux journal a été crée avec succèss.'
          this.closing()
        }).catch((error) => {
          this.displayErrorOrRefreshToken(error, this.nouveauxJournal)
          this.data_error = error.response?.data
        })
    },
    closing() {
      this.show_modal = false;
      this.show_modal_new = false,
      this.search = "",
      this.numero = "",

      this.montant = 0,
      this.motif = '',
      this.crediteur = '',
      this.debiteur = '',
      this.ref_number = ''
    },
  },
  mounted() {
    this.getJournals();
    this.$route.query.impot && (
      this.montant = this.$route.query.impot,
      this.show_modal_new = true
    )
    if (this.$store.state.plan_comptables.length) {
      this.plan_comptables = this.$store.state.plan_comptables
    } else {
      this.getPlans();
    }
  },
};
</script>

<style scoped>
th {
  text-align: center;
  border-left: 1px solid;
  padding: 5px 10px;
}

td {
  border-right: 1px solid;
}

tr:nth-child(1) {
  position: relative;
}

th:nth-child(3) {
  text-align: center;
}

span.btn {
  font-size: 12px;
}
</style>