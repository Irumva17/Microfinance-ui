<template>
  <Navbar class="not_printable" />
  <Print_header :title="`Ammortissement Crédits (${credit.type_credit})`" />
  <div class="container">
    <div class="one not_printable" v-if="!!credit">
      <div class="btn retour" @click="goBack">&#10094;</div>
      <p class="detail">
        <strong>Type de Crédit:</strong>
        {{ credit.type_credit || 'N/A' }}
      </p>
      <p class="detail">
        <strong>Montant:</strong>
        {{ money(credit.montant) }}
      </p>
      <!-- <p class="detail">
        <strong>Amortissement:</strong>
        {{ credit.amortissement || 'N/A' }}
      </p> -->
      <select v-show="!this.credit.approved_by" v-model="choose" @change="getCredit" class="select-amortissement">
        <option value="" disabled>Type d'amortissement</option>
        <option value="lineaire">Amortissement lineaire</option>
        <option value="degressif">Amortissement degressif</option>
      </select>
      <button class="btn credit_detail"  @click="printer()">
        <i class="fa-solid fa-print"></i> &nbsp;
        Imprimer
      </button>
    </div>

    <div class="accounts" v-if="extratotals">
      <Account account_name="Capital" :account_money="extratotals?.capital" />
      <Account account_name="Interet" :account_money="extratotals?.interet" />
      <Account account_name="Penalités" :account_money="extratotals.penalite" />
      <!-- <Account account_name="Capital a payer" :account_money="extratotals.capital_a_payer" />
      <Account account_name="Interet a payer" :account_money="extratotals.interet_a_payer" />
      <Account account_name="Mensualite a payer" :account_money="extratotals.mensualite_a_payer" /> -->
    </div>

    <section class="table">
      <table>
        <tr>
          <!-- <th>Crédit restant</th> -->
          <th>Interet</th>
          <th>Capital</th>
          <th>Mensualite</th>
          <th>Mensualite à payer</th>
          <th>Retard</th>
          <th>Date</th>
          <th>Date de fin</th>
          <th>Echeance</th>
          <th v-if="this.credit.approved_by">Action</th>
        </tr>
        <tr v-for="item in credite" :key="item.id">
          <!-- <td>{{ money(item.reste) }}</td> -->
          <td>{{ money(item.interet) }}</td>
          <td>{{ money(item.capital) }}</td>
          <td>{{ money(item.mensualite) }}</td>
          <td>{{ money(item?.mensualite_a_payer) }}</td>
          <td>{{ datetime(item.retard) }}</td>
          <td>{{ datetime(item.date) }}</td>
          <td>{{ datetime(item.date_fin) }}</td>
          <td>{{ money(item.echeance) }}</td>
          <td v-if="this.credit.approved_by">
            <span v-if="item.done" class="valid">Mensualite terminé</span>
            <span v-if="!item.done">Mensualiter non terminé</span>
          </td>
        
        </tr>
      </table>
    </section>
    <Printed_by />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import SearchComponent from "@/components/SearchComponent.vue";
import Print_header from "@/services/print_header.vue";
import Printed_by from "@/services/Printed_by.vue";
import Account from "@/components/account.vue";
export default {
  components: {
    Navbar,
    SearchComponent,
    Print_header, Printed_by,
    Account
  },

  data() {
    return {
      amortissementlineaire: [],
      credite: [],
      credit: {},
      choose: "",
      extratotals:null
    };
  },

  methods: {
    printer(){
      if(!this.credite.length){
        alert("Aucun ammortissement à  imprimer")
        return
      }
      print()
    },
    getCreditData(url){
      axios.get(`${url}/?credit=${this.$route.params.id}`)
        .then((reponse) => {
          this.credite = reponse.data.results;
          this.extratotals = reponse.data.totals
        }).catch((error) => {
          this.displayErrorOrRefreshToken(error, this.getCreditData)
        });
    },
    
    async getCredit() {
      await axios
        .get(`credits/${this.$route.params.id}/`)
        .then((response) => {
          this.credit = response.data;
          if (this.credit.approved_by) {
            this.getCreditData('amortissementcredits')
          } else if (!this.credit.approved_by) {
            if (this.choose === "degressif") {
              this.getCreditData('amortissementdegressive')
            } else if (this.choose === "lineaire") {
              this.getCreditData('amortissementlineaire')
            } else {
              this.getCreditData('amortissementcredits')
            }
          }
          this.$store.state.print_credit = response.data
        }).catch((error) => {
          this.displayErrorOrRefreshToken(error, this.getCredit)
        });
    },
  },
  mounted() {
    this.getCredit();
    // this.getExtraTotals();
  },
};
</script>

<style scoped>
.one {
  display: flex;
  width: 100%;
  color: var(--second);
  background-color: var(--primary);
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  border-radius: 3px;
  padding: 10px;
}

.detail {
  flex-grow :1;
  border: 2px solid var(--second);
  border-radius: 3px;
  padding: 4px;
  margin: 0;
}
.btn.retour{
  background-color: var(--second);
  color: var(--primary);
}
.credit_detail:has(.fa-print){
  background: var(--second);
  color: var(--primary);
}
</style>
