<template>
  <div>
    <Navbar />
    <Modal :isVisible="imported_plans?.length ? true : false" @close="closing">
      <div class="form-nini">
        <span class="title">Plans comptables importé</span>
        <div class="content">
          <table class="imported_plans">
            <tr>
              <th>Id</th>
              <th>Numero</th>
              <th>Nom</th>
            </tr>
            <tr v-for="item in imported_plans" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.numero }}</td>
              <td>{{ item.nom }}</td>
            </tr>
          </table>
        </div>
        <button class="btn save_btn" @click="saveImportedPlans">Sauvegarder</button>
      </div>
    </Modal>
    <Modal :isVisible="show_modal" @close="closing">
      <form @submit.prevent="newPlan" class="form">
        <span class="title">
          {{ isUpdating ? 'Modifier' : 'Ajouter' }} un plan comptable
        </span>
        <div class="content">
          <label for="numero">Numero</label>
          <input type="text" id="numero" v-model="numero" />
          <small v-for="err in data_error?.numero" :key="err.id">
            {{ err }}
          </small>
          <label for="nom">Nom</label>
          <input type="text" id="nom" v-model="nom" />
          <small v-for="err in data_error?.nom" :key="err.id">
            {{ err }}
          </small>
          <label for="category">Categorie</label>
          <!-- <input type="text" id="nom" v-model="category" /> -->
          <select name="" id="" v-model="category">
            <option value="">------</option>
            <option value="actif">Actif</option>
            <option value="passif">Passif</option>
            <option value="charge">Charge</option>
            <option value="produit">Produit</option>
            <option value="resultat">Resultat</option>
            <option value="hors_bilan">Hors bilan</option>
          </select>
          <small v-for="err in data_error?.category" :key="err.id">
            {{ err }}
          </small>
        </div>
        <button class="btn-modal" type="submit">Creer</button>
      </form>
    </Modal>

    <!-- <Modal :isVisible="show_edit" @close="closing">
      <div class="form">
        <span class="title">Modifier le plan comptable</span>
        <div class="content">
          <label>Numero 
            <input v-model="FormData.numero" type="text">
          </label>
          <label>Nom
            <input v-model="FormData.nom" type="text">
          </label>
          <label>Categorie
            <input v-model="FormData.category" type="text">
          </label>
        </div>
        <button class="btn-modal" @click="updatePlan">Modifier</button>
      </div>
    </Modal> -->

    <div class="page">
      <div class="subMenu-headers">
        <div class="row">
          <button class="btn retour" @click="goBack">&#10094;</button>
          <button class="btn" @click="show_modal = true"><i class="fa-solid fa-plus"></i> Ajouter</button>
        </div>
        <label class="btn" for="import"><i class="fa-solid fa-upload"></i> &nbsp;Importer</label>
        <input type="file" id="import" @change="prepareData" style="display: none" accept="text/csv" />
      </div>
      <div class="plans_container">
        <div v-for="plan in plans" class="plan" :class="'niveau_' + numWidth(plan.numero)">
          {{ plan.numero }} {{ plan.nom }} 
          <div class="btns">
            <button class="btn" @click="handlePlan(plan)">
              <i class="fa-solid fa-pen"></i> &ensp; Modifier
            </button>
            <!-- <button class="btn delete" @click="deleter(plan)">
              <i class="fa-solid fa-trash"></i>
            </button> -->
          </div>
        </div>
      </div>
      <br><br>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Modal from "@/Overlays/Modal.vue";
export default {
  data() {
    return {
      plans: [],
      show_modal: false,
      microfinance: "",
      microfinances: [],
      nom: "",
      category: "",
      numero: "",
      microfinance: "",
      show_edit : false,
      // FormData : {},
      isUpdating: false,
      document: null,
      imported_plans : null,
      data_error : {},
      itemId: ''
    };
  },
  components: {
    Navbar,
    Modal,
  },
  methods: {
    handlePlan(item){
      this.show_modal = true
      // this.FormData = { ...item }
      this.nom = item.nom
      this.numero = item.numero
      this.category = item.category
      this.itemId = item.id
      this.isUpdating = true
    },
    // updatePlan(){
    //   if (!this.FormData.nom) {
    //     this.$store.commit('setError', 'Le nom ne peut être vide.')
    //     return
    //   }
    //   axios.put(`plancomptable/${this.FormData.id}/`, this.FormData)
    //   .then((response)=>{
    //     this.plans = this.plans.map( plan => plan.id === this.FormData.id ? {  ...plan, ...response.data} :  plan )
    //     this.$store.commit('setSuccess', 'Modifié avec succès.')
    //     this.closing()
    //   }).catch((error)=>{
    //     this.data_error = error?.reponse?.data
    //     this.displayErrorOrRefreshToken(error, this.updatePlan)
    //   })
    // },
    // deleter(item) {
    //   let confirmDelete = confirm(`Vous voulez vraiment supprimer le plan pour ${item.nom.toUpperCase()}?`)
    //   if (confirmDelete) {
    //     axios.delete(`plancomptable/${item.id}/`)
    //       .then(() => {
    //         this.$store.commit('setSuccess', 'Supprimé avec succès.')
    //         this.plans = this.plans.filter(plan => plan.id != item.id)
    //       }).catch((error) => {
    //         this.displayErrorOrRefreshToken(error, () => this.deleter(item))
    //       })
    //   }
    // },
    numWidth(numero) {
      return numero.length < 5 ? numero.length : 5;
    },
    getPlans(page = 1, allPlans = []) {
      axios.get(`plancomptable/?page=${page}`)
      .then((response) => {
        const data = response.data;
        allPlans = allPlans.concat(data.results);
        data.next ? this.getPlans(page + 1, allPlans) : this.plans = allPlans;
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.getPlans);
      });
    },
    newPlan() {
      const form = new FormData();
      form.append("numero", this.numero);
      form.append("nom", this.nom);
      form.append("category", this.category);

      let url = this.isUpdating ? `plancomptable/${this.itemId}/` : `plancomptable/`

      axios[this.isUpdating ? 'put': 'post'](url, form)
        .then((reponse) => {
          // this.$store.state.plan_comptables.push(reponse.data)
          this.$store.state.message.success = `Vous avez ${this.isUpdating ? 'crée' : 'modifié'} un plan comptable avec succèss.`
          this.show_modal = false;
          this.numero = this.nom = ''
          this.getPlans()
        }).catch((error)=>{
          this.data_error = error.response?.data
          console.log(this.data_error)
          this.displayErrorOrRefreshToken(error, this.newPlan)
        })
    },
    closing() {
      this.show_modal = false;
      this.show_edit = false
      this.numero = this.nom = this.category = ''
      // this.FormData = {}
      this.data_error = {}
      this.imported_plans = []
    },
    prepareData(event) {
      let file = event.target.files[0];
      event.target.value = null;
      if (file && file.type === "text/csv") {
        this.imported_plans = [];
        var reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result; 
          const lines = content.split(/\r\n|\n/);
          for (let i = 0; i < lines.length; i++) {
            const array_line = lines[i].split(/,|;/);
            if (array_line.length > 1) {
              this.imported_plans.push({
                id: array_line[0],
                numero: array_line[1],
                nom: array_line[2],
              });
            }
          }
        };
        reader.onerror = (e) => {
          alert(e.target.error.name);
        };
        reader.readAsText(file, "ISO-8859-1");
      } else {
        alert("Vous devez choisir un fichier CSV.");
      }
    },
    saveImportedPlans() {
      axios.post("plancomptable/importer/", this.imported_plans)
        .then(() => {
          this.$store.commit('setSuccess', 'Plans importés avec succès.')
          this.imported_plans = []
          this.getPlans()
        }).catch((error) => {
          this.displayErrorOrRefreshToken(error, this.saveImportedPlans)
        });
    },
  },
  mounted() {
    this.getPlans();
  },
};
</script>
<style>
.imported_plans ~ button {
  padding: 12px 15px;
  cursor: pointer;
  margin: 20px 0 0 auto;
}
.imported_plans {
  width: 100%;
  margin-top: 10px;
}
.page {
  padding: 60px 60px 0 60px;
  min-height: calc(100vh - 60px);
}
.plan {
  padding: 5px 6px;
  /* height: 44px; */
  box-sizing: border-box;
  border-radius: 8px;
  /*border: 1px solid;
  /* border-left: 2px solid; */
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.plan .btns{
  display: none;
}
.plan .btns button{
  height: 30px;
  padding: 5px 10px;
}
.plan:hover {
  background-color:rgba(0, 0, 0, 0.1);
}
.plan:hover .btns{
  display: flex;
}
.niveau_1, .niveau_2{
  text-transform: uppercase;
  font-weight : bold
}
.niveau_1 {
  font-weight: 700;
  /* margin: 10px 0; */
}
.niveau_2 {
  margin: 0;
}

.niveau_3 {
  margin: 0 0 0 30px;
  text-transform: uppercase;
}

.niveau_4 {
  margin-left: 60px;
}

.niveau_5 {
  margin-left: 90px;
}
.plans_container{
  margin: 20px 0;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 23px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(5px);
}
</style>
