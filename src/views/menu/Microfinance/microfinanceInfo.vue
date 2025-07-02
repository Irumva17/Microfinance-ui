<template>
    <Navbar />
    <div class="container">
        <div class="accounts">
            <Account account_name="Capital" :account_money="microfinance[0]?.capital || 0" />
            <Account account_name="Balance Microfinance" :account_money="microfinance[0]?.balance || 0" />
            <Account account_name="Banque" :account_money="microfinance[0]?.banque || 0" />
            <Account account_name="Placements" :account_money="microfinance[0]?.placements || 0" />
            <Account account_name="Caisses des agences" :account_money="caisses" />
        </div>
        <section class="table">
            <table>
                <tr>
                    <th>Nom</th>
                    <th>NIF</th>
                    <th>RC</th>
                    <th>Adresse</th>
                    <th>Detail</th>
                    <th>Date de création</th>
                    <th>Options</th>
                </tr>
                <tr v-for="item in microfinance" :key="item.id" @dblclick="gotremise(item.nom)">
                    <td>{{ item.nom }}</td>
                    <td>{{ item.NIF }}</td>
                    <td>{{ item.RC }}</td>
                    <td>{{ item.adresse }}</td>
                    <td>{{ item.details }}</td>
                    <td>{{ datetime(item.created_at) }}</td>
                    <td>
                        <!-- <div class="btns">
                            <button class="depot btn" @click="$router.push({name: 'depotmicrofinance', params: {id: item.id}})">
                                <i class="fa-solid fa-arrow-down"></i> &nbsp; Depot
                            </button>
                            <button class="retrait btn" @click="$router.push({name: 'retraitmicrofinance', params: {id: item.id}})"> 
                                <i class="fa-solid fa-arrow-up"></i> &nbsp; Retrait
                            </button>
                        </div> -->
                        <i class="btn fa fa-ellipsis-v" @click="toggleOptions(item.id)"></i>
                        <div v-if="selected === item.id" class="menu_options" @mouseleave="toggleOptions(item.id)">
                            <button class="for_mic btn" @click="$router.push({name: 'depotmicrofinance', params: {id: item.id}})"> <i class="fa-solid fa-arrow-down"></i> &nbsp; Depot </button>
                            <button class="for_mic btn" @click="$router.push({name: 'retraitmicrofinance', params: {id: item.id}})"> <i class="fa-solid fa-arrow-up"></i> &nbsp; Retrait </button>
                            <button class="btn"  @click="$router.push({name: 'Investissement', params: {id: item.id}})"> <i class="fa-solid fa-sack-dollar"></i>&nbsp; Investissement </button>
                            <div class="menu_arrow">‣</div>
                        </div>
                    </td>
                </tr>
            </table>
        </section>
    </div>
</template>
<script>
import Account from '@/components/account.vue';
import Navbar from '@/components/Navbar.vue';

export default {
    data() {
        return {
            microfinance : {},
            selected: '',
            caisses : 0,
            depots : 0,
            retraits : 0,
        }
    },
    components : {Account, Navbar},
    computed: {
        situation_journaliere() {
            return this.depots - this.retraits
        }
    },
    methods: {
        toggleOptions(id) {
            this.selected = this.selected === id ? null : id;
        },
        getMicrofinanceInfo() {
            axios.get('microfinances/')
                .then((response) => {
                    this.$store.state.microfinance_info = this.microfinance = response.data.results
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getMicrofinanceInfo)
                })
        },
        caisses_des_agences() {
            axios.get('agences/')
                .then((response) => {
                    this.caisses = response.data.results.reduce((accumulator, item)=>{
                        return accumulator + item.balance
                    }, 0)
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.caisses_des_agences)
                })
        }
    },
    mounted() {
        this.caisses_des_agences()
        // this.$store.state.microfinance_info.length ? 
        // this.microfinance = this.$store.state.microfinance_info : 
        this.getMicrofinanceInfo()
    }
}
</script>