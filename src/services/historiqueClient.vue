<template>
    <PrintableHistory v-if="triger === 'client'" :account_name="full_name" :account_number="this.$route.query.numero" :histories="histories" :from="from" :to="to" class="printable" />
    <div class="not_printable">
        <Navbar />
        <div class="container">
            <div class="subMenu-headers">
                <div class="row">
                    <div class="btn retour" @click="goBack">&#10094;</div>
                    <DateFilter ref="filterDates" :flexDirection="'row'"/>
                    <button v-if="triger == 'client'" class="btn" @click="getHistory(numero)">
                        <i class="fa-solid fa-filter"></i> Filtrer
                    </button>
                    <button v-else class="btn" @click="getUserHistory(numero)">
                        <i class="fa-solid fa-filter"></i> Filtrer
                    </button>
                </div>
                <div v-if="triger === 'client'" class="rechercher">
                    <button class="btn" @click="goToPrinter()">
                        <i class="fa-solid fa-print"></i> Imprimer
                    </button>
                </div>
            </div>
            <section v-if="triger === 'client'" class="table">
                <table>
                    <tr>
                        <th>Date et Heure</th>
                        <th>Action</th>
                        <th>Débit</th>
                        <th>Crédit</th>
                        <!-- <th>Montant</th> -->
                        <th>Balance</th>
                        <th>Details</th>
                        <th>Acteur</th>
                    </tr>
                    <tr v-for="(history, index) in histories" :key="history.id">
                        <td>{{ datetime(history.created_at) }}</td>
                        <td>{{ history.action }}</td>
                        <!-- <td>{{ history.montant }}</td> -->
                        <td>{{ history.montant < 0 ? money(history.montant) : '-' }}</td>
                        <td>{{ history.montant > 0 ? money(history.montant) : '-' }}</td>
                        <!-- <td :class="getMontantClass(index, history.balance)">{{ money(history.montant)}}</td> -->
                        <td>{{ money(history.balance) }}</td>
                        <td>{{ history.details }}</td>
                        <td>{{ history.created_by }}</td>
                    </tr>
                </table>
                <div v-if="empty" class="empty-message">
                    Aucun historique disponible.
                </div>
            </section>
            <section v-else class="table">
                <table>
                    <tr>
                        <th>Date</th>
                        <th>Action</th>
                        <th>Débit</th>
                        <th>Crédit</th>
                        <!-- <th>Montant</th> -->
                        <th>Balance</th>
                    </tr>
                    <tr v-for="(history , index) in histories" :key="history.id">
                        <td>{{ datetime(history.date) }}</td>
                        <td>{{ history.action }}</td>
                        <td>{{ history.montant < 0 ? money(history.montant * -1) : '-' }}</td>
                        <td>{{ history.montant > 0 ? money(history.montant) : '-' }}</td>
                        <!-- <td>{{ money(history.montant)}}</td> -->
                        <td>{{ money(history.balance) }}</td>
                    </tr>
                </table>
                <div v-if="empty" class="empty-message">
                    Aucun historique disponible.
                </div>
            </section>
            <Printed_by />
        </div>
    </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import PrintableHistory from './print_history.vue';
import DateFilter from '@/components/dateFilter.vue';
import Printed_by from './Printed_by.vue';
export default {
    data() {
        return {
            histories: [],
            from: '',
            to: '',
            numero: '',
            search_key: '',
            print: false,
            account_name: '',
            triger : '',
            empty : false,
            full_name : ''
        }
    },
    watch : {
        "$store.state.compte_active" : {
            deep : true,
            handler(){
                const compte = this.$store.state.compte_active;
                if (compte.personne_physique) {
                    this.full_name = `${compte.personne_physique.Last_name} ${compte.personne_physique.First_name}`;
                } else if (compte.personne_morale) {
                    this.full_name = compte.personne_morale.nom
                }
                this.triger = this.$store.state.compte_active?.user ? 'user' : 'client'
            }
        }
    },
    components: {
        Navbar,
        // Loader, 
        PrintableHistory,DateFilter,
        Printed_by
    },
    methods: {
        async getHistory(compte) {
            this.from = this.$refs.filterDates.from;
            this.to = this.$refs.filterDates.to;
            this.numero = compte;
            let allHistories = [];
            try {
                // let allHistories = [];
                let nextPage = `historiqueclients/?compte__numero=${compte}&created_at__gte=${this.from}&created_at__lte=${this.to}`;
                while (nextPage) {
                    const url = nextPage.startsWith('http') ? nextPage : nextPage;
                    const response = await axios.get(url);
                    allHistories.push(...response.data.results);
                    nextPage = response.data.next;
                }
                this.histories = allHistories;
            } catch (error) {
                this.displayErrorOrRefreshToken(error,()=> this.getHistory(compte));
            }
        },
        getUserHistory(compte, page = 1, userHistory = []) {
            this.numero = compte;
            this.from = this.$refs.filterDates.from
            this.to = this.$refs.filterDates.to
            axios.get(`historiquepersonnels/?created_by=${compte}&date__gte=${this.to}&date__lte=${this.from}&page=${page}`)
            .then((response)=>{
                if(!response.data?.results.length){
                    this.$store.state.message.error = "Aucun historique trouvé"
                    this.empty = true
                } else {
                    this.histories = response.data.results
                }
            }).catch ((error)=>{
                this.displayErrorOrRefreshToken(error, () => this.getUserHistory(compte));
            })
        },
        goToPrinter() {
            this.from = this.$refs.filterDates.from;
            this.to = this.$refs.filterDates.to;
            if(!this.from && !this.to){
                this.$store.state.message.error = 'Vous devez preciser l\'intervalle des dates à imprimer.'
                return
            } 
            let data = {
                date_debut: this.from,
                date_fin: this.to,
                compte_numero: this.numero
            };
            axios.post('historiqueclients/impression_historique/', data)
                .then((response) => {
                    this.histories = response.data.historique
                    this.$nextTick(()=> print())
                }).catch(error => {
                    this.displayErrorOrRefreshToken(error, this.goToPrinter)
                })
        },
        // getMontantClass(index, balance) {

        //     console.log(index);
            

        //     const PreviousBalance = this.histories[index + 1]?.balance;
        //     const ecart =  balance - PreviousBalance
        //     if (ecart > 0) {
        //         this.histories[index].debit = ecart

        //     } else if (ecart < 0) {
        //         this.histories[index].credit = ecart
        //     }
        // },
    },
    mounted() {
        localStorage?.getItem('compte_active') ? 
        this.$store.state.compte_active = JSON.parse(localStorage?.getItem('compte_active')) : ''
        this.$nextTick(()=>{ 
            this.$store.state.compte_active?.user ?
            this.getUserHistory(this.$store.state.compte_active.id) : this.getHistory(this.$route.query.numero) 
        })
    }
}
</script>

<style>
</style>