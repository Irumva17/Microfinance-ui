<template>
    <Navbar class="not_printable"/>
    <PrintHeader title="Bilan" :showInfo="false" />
    <div class="container">
        <div class="btn-headers not_printable">
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
                <button class="btn" @click="printer()">
                    <i class="fa-solid fa-print"></i>
                    &nbsp;
                    Imprimer
                </button>
            </div>
        </div>
        <div class="accounts not_printable">
            <Account account_name="Total Actifs" :account_money="tot_actifs" />
            <Account account_name="Total Passifs" :account_money="tot_passifs" />
            <Account account_name="Equilibre" :account_money="equilibre" />
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
                <tr v-for="item in selected === 'actifs' ? actifs : passifs" :key="item.id">
                    <td>{{ item.code }}</td>
                    <td>{{ item.nom }}</td>
                    <td>
                        {{ money(
                            item.solde * (selected === 'actifs' ? 1 : -1)
                        )}}
                    </td>
                    <td>{{ item.solde_annee_precedente }}</td>
                    <td>{{ item.annee }}</td>
                </tr>
            </table>
        </section>
        <PrintedBy />
    </div>
</template>


<script>
import Account from '@/components/account.vue';
import DateFilter from '@/components/dateFilter.vue';
import Navbar from '@/components/Navbar.vue';
import PrintHeader from '@/services/print_header.vue';
import PrintedBy from '@/services/Printed_by.vue';

export default {
    data() {
        return {
            actifs: [],
            passifs: [],
            selected: 'actifs',
            totals : [],
            tot_actifs : 0,
            tot_passifs : 0,
            equilibre: 0,
        }
    },
    components: {
        Navbar,
        Account,
        DateFilter,
        PrintHeader,
        PrintedBy
    },
    methods: {
        printer(){
            // if(!this.credite.length){
            //     alert("Aucun ammortissement à  imprimer")
            //     return
            // }
            print()
        },
        setSelected(element) {
            this.selected = element;
        },
        getBilan() {
            let from = this.$refs.dates.from
            let to = this.$refs.dates.to
            axios.get(`bilans/?created_at_gte=${from}&created_at_lte=${to}`)
                .then((response) => {
                    console.log(response.data);
                    
                    this.tot_passifs = response.data.totaux.total_passifs
                    this.tot_actifs = response.data.totaux.total_actifs
                    this.equilibre = response.data.totaux.equilibre
                    this.actifs = response.data.bilan.actifs
                    this.passifs = response.data.bilan.passifs
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