<template>
    <Navbar />
    <Modal :isVisible="show_modal" @close="closeModal">
        <form @submit.prevent="calculateImpot" class="form">
            <span class="title">Calculer l'impot</span>
            <div v-if="!response" class="content">
                <label for="impot_type">Type d'impot</label>
                <select id="impot_type" v-model="impot_type">
                    <option value="" disabled>--------</option>
                    <option value="1">1%</option>
                    <option value="30">30%</option>
                </select>
                <label for="calculer_sur">Calculer sur</label>
                <select id="calculer_sur" v-model="calculer_sur">
                    <option value="" disabled>--------</option>
                    <option value="produits">Produits</option>
                    <option value="resultat_net">Resultat net</option>
                </select>
            </div>
            <div v-else class="content">
                <label>Montant calculé </label>
                <span>{{ money(response.montant_calculé) }}</span>
                <label >Impot</label>
                <span>{{ money(response?.impot_sur_resultats) }}</span>
            </div>
            <button v-if="!response"  type="submit" class="btn-modal">Calculer</button>
            <div v-else class="row">
                <button type="submit" class="btn-modal" @click="response = null">
                    <i class="fa-solid fa-undo"></i>
                    Recalculer
                </button>
                <button type="submit" class="btn-modal" @click="navigateToJournal">
                    Continuer
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </form>
    </Modal>

    <div class="container">
        <div class="btn-headers">
            <button class="btn retour" @click="goBack">&#10094;</button>
            <div class="row">
                <button :class="['btn-switch', { btn_active: selected === 'produits' }]"
                    @click="setSelected('produits')">Produits
                </button>
                <button :class="['btn-switch', { btn_active: selected === 'charges' }]"
                    @click="setSelected('charges')">Charges
                </button>
            </div>
            <div class="row">
                <DateFilter ref="dates" />
                <div class="btn" @click="getPlans">Filtrer</div>
                <button class="btn" @click="show_modal = true">Calculer l'impot</button>    
            </div>
        </div>
        <div class="accounts">
            <Account account_name='Total produits ' :account_money="totals_produits" />
            <Account account_name='Total charge' :account_money="totals_charges" />
            <Account account_name='Resultat net' :account_money="resultats_net" />
        </div>
        <section class="table" v-if="selected == 'produits'">
            <table>
                <tr>
                    <th>Compte</th>
                    <th>Libellé</th>
                    <th>Solde Precedente</th>
                    <th>Solde</th>
                    <th>Anneé</th>
                </tr>
                <tr v-for="(item, index) in produits" :key="index">
                    <td>{{ item.compte }}</td>
                    <td>{{ item.nom }}</td>
                    <td>{{ money(item.old_solde) }}</td>
                    <td>{{ money(item.solde) }}</td>
                    <td>{{ item.year }}</td>
                </tr>
            </table>
        </section>
        <section class="table" v-if="selected == 'charges'">
            <table>
                <tr>
                    <th>Compte</th>
                    <th>Libellé</th>
                    <th>Solde Precedente</th>
                    <th>Solde</th>
                    <th>Anneé</th>
                </tr>
                <tr v-for="(item, index) in charges" :key="index">
                    <td>{{ item.compte }}</td>
                    <td>{{ item.nom }}</td>
                    <td>{{ money(item.old_solde) }}</td>
                    <td>{{ money(item.solde) }}</td>
                    <td>{{ item.year }}</td>
                </tr>
            </table>
        </section>
    </div>
</template>

<script>
import Modal from '@/Overlays/Modal.vue';
import Navbar from '@/components/Navbar.vue';
import Account from '@/components/account.vue';
import DateFilter from '@/components/dateFilter.vue';
export default {
    data() {
        return {
            show_modal: false,
            produits: [],
            charges: [],
            selected: 'produits',
            totals_charges : 0,
            totals_produits : 0,
            resultats_net: 0,
            response : null,
            impot_type : '',
            calculer_sur : ''
        }
    },
    components: {
        Navbar,
        Account,
        DateFilter,
        Modal
    },
    methods: {
        closeModal() {
            this.show_modal = false
            this.impot_type = ''
            this.calculer_sur = ''
        },
        setSelected(element) {
            this.selected = element;
        },
        getPlans() {
            let from = this.$refs.dates.from
            let to = this.$refs.dates.to
            axios.get(`compteresultat/?created_at_gte=${from}&created_at_lte=${to}`)
                .then((response) => {
                    this.produits = response.data.produits
                    this.charges = response.data.charges
                    this.totals_charges = response.data.totals_charges
                    this.totals_produits = response.data.totals_produits
                    this.resultats_net = response.data.resultat_net
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getPlans)
                })
        },
        calculateImpot(){
            axios.get(
                `compteresultat/calculate_impot/?impot_type=${this.impot_type}&calcul_sur=${this.calculer_sur}`
            ).then((response) => {
                this.response = response.data
            }).catch((error) => {
                this.displayErrorOrRefreshToken(error, this.calculateImpot)
            })
        },
        navigateToJournal(){
            this.$router.push({name : 'Journal' , query : {impot : this.response.impot_sur_resultats}})
        }
    },
    mounted() {
        this.getPlans()
    }
}
</script>

<style></style>