<template>
    <Navbar />
    <div class="container">
        <div class="btn-headers">
            <button class="btn retour" @click="goBack">&#10094;</button>
            <div class="row">
                <button :class="['btn-switch', { btn_active: selected === 'actifs' }]"
                    @click="setSelected('actifs')">Actifs
                </button>
                <button :class="['btn-switch', { btn_active: selected === 'passifs' }]"
                    @click="setSelected('passifs')">Passifs
                </button>
            </div>
            <div class="row">
                <DateFilter ref="dates" />
                <div class="btn" @click="getBilan">Filtrer</div>
            </div>
        </div>
        <div class="accounts">
            <Account :account_name="'Total Actifs'" :account_money="tot_actifs" />
            <Account :account_name="'Total Passifs'" :account_money="tot_passifs" />
        </div>
        <section class="table">
            <table>
                <tr>
                    <th>Compte</th>
                    <th>Libellé</th>
                    <th>Solde</th>
                    <th>Année Precedente</th>
                    <th>Année</th>
                </tr>
                <tr v-for="item in selected === 'actifs' ? actifs : passifs " :key="item.id">
                    <td>{{ item.code }}</td>
                    <td>{{ item.nom }}</td>
                    <td>{{ money(item.solde) }}</td>
                    <td>{{ item.solde_annee_precedente }}</td>
                    <td>{{ item.annee }}</td>
                </tr>
            </table>
        </section>
    </div>
</template>


<script>
import Account from '@/components/account.vue';
import DateFilter from '@/components/dateFilter.vue';
import Navbar from '@/components/Navbar.vue';

export default {
    data() {
        return {
            actifs: [],
            passifs: [],
            selected: 'actifs',
            totals : [],
            tot_actifs : 0,
            tot_passifs : 0,
        }
    },
    components: {
        Navbar,
        Account,
        DateFilter,
    },
    methods: {
        setSelected(element) {
            this.selected = element;
        },
        getBilan() {
            let from = this.$refs.dates.from
            let to = this.$refs.dates.to
            axios.get(`bilan/?created_at_gte=${from}&created_at_lte=${to}`)
                .then((response) => {
                    this.tot_passifs = response.data.total_passifs
                    this.tot_actifs = response.data.total_actifs
                    this.actifs = response.data.actifs
                    this.passifs = response.data.passifs
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getBilan)
                })
        },
    },
    mounted() {
        this.getBilan()
    }
}
</script>

<style></style>