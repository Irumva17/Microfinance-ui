<template>
    <Navbar />
    <Modal :isVisible="show_modal" @close="closeModal">
        <form class="form" @submit.prevent="getGrandLivre">
            <span class="title" >Entreer les dates:</span>
            <div class="content">
                <label for="start">Date de depart:</label>
                <input type="date" id="start" v-model="start">
                <label for="end">Date fin:</label>
                <input type="date" id="end" v-model="end">
                <small v-for="err in data_error?.error" :key="err.id">
                    {{ err }}
                </small>
            </div>
            <button class="btn-modal" type="submit">
                Envoyer
            </button>
        </form>
    </Modal>
    <div class="container">
        <div class="btn-headers">
            <div class="btn retour" @click="goBack">&#10094;</div>
            <button class="btn" @click="show_modal = true">{{ grand_livre?.length ? 'Filtre' : 'Entreer les dates' }}</button>
        </div>
        <section class="table" v-for="(compte,index) in grand_livre" :key="index">
            <table>
                <caption>
                    <div>
                        <span class="table-title">COMPTE {{ compte.classe }}</span>
                        <div>
                            <span class="initial">
                                <span class="indicator start"></span> &nbsp;
                                SOLDE INITIAL : {{ money(compte.solde_initial) }}
                            </span>
                            <span class="final">
                                <span class="indicator end"></span> &nbsp;
                                SOLDE FINAL : {{ money(compte.solde_final) }}
                            </span>
                        </div>
                    </div>
                </caption>
                <tr>
                    <th>Id</th>
                    <th>Montant</th>
                    <th>Reference</th>
                    <th>Motif</th>
                    <th>Date de creation</th>
                    <th>Debit</th>
                    <th>Crédit</th>
                    <th>Cumil</th>
                </tr>
                <tr v-for="operation in compte.details" :key="index">
                    <td>{{ operation.id }}</td>
                    <td>{{ money(operation.montant) }}</td>
                    <td>{{ operation.ref_number }}</td>
                    <td>{{ operation.motif }}</td>
                    <td>{{ datetime(operation.created_at) }}</td>
                    <td>
                        {{
                            operation.debiteur?.nom.slice(
                                0, compte.classe.length
                            ) === compte.classe ? money(operation.montant) : 0
                        }}
                    </td>
                    <td>
                        {{ 
                            operation.crediteur?.nom.slice(
                                0, compte.classe.length
                            ) === compte.classe ? money(operation.montant) : 0
                        }}
                        
                    </td>
                    <td>{{ money(operation.cumil) }}</td>
                </tr>
            </table>
        </section>
        <span class="empty" v-if="!grand_livre.length">Vide</span>
        <br><br>
    </div>
</template>
<script>
import Account from '@/components/account.vue';
import Navbar from '@/components/Navbar.vue';
import Modal from '@/Overlays/Modal.vue';

export default {
    data() {
        return {
            grand_livre: [],
            start: '',
            end: '',
            show_modal: false,
            data_error : {}
        }
    },
    components: {
        Navbar,
        Account,
        Modal
    },
    methods: {
        closeModal() {
            this.show_modal = false
            this.start = ''
            this.end = ''
        },
        getGrandLivre() {
            axios.get(`grand-livre/?created_at__gte=${this.start}&created_at__lt=${this.end}`)
                .then((response) => {

                    response.data.forEach(compte => {
                        let cumil = compte.solde_initial; 

                        compte.details = compte.details.map(operation => {
                            const isDebit = operation.debiteur?.nom.slice(0, compte.classe.length) === compte.classe;
                            const isCredit = operation.crediteur?.nom.slice(0, compte.classe.length) === compte.classe;

                            if (isDebit) {
                                cumil -= operation.montant;
                            }

                            if (isCredit) {
                                cumil += operation.montant;
                            }

                            return {
                                ...operation,
                                cumil
                            };
                        });
                    });

                    this.grand_livre = response.data

                    
                    this.$store.state.grand_livre = this.grand_livre
                    this.show_modal = false
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getGrandLivre)
                })
        }
    },
    mounted() {
        this.getGrandLivre()
    }
}
</script>
<style scoped>
    section.table{
        min-height: fit-content;
        box-shadow: 0 0 5px rgba(0,0,0,0.1);
        padding: 10px;
        background-color: white;
        table{
            min-height: fit-content;
        }
    }
    span.table-title{
        font-weight: bolder;
        font-size: 1.1rem;
    }
    caption:has(div){
        padding: 8px;
        margin:0 0 10px 0;
        border:1px solid rgba(0,0,0,0.2);
    }
    caption div{
        display: flex;
        justify-content : space-between;
        gap : 5vw;
        align-items: center;
    }
    caption div div{
        gap: 10px;
    }
    .initial, .final{
        padding:7px;
        border-radius: 2px;
        font-size: 14px;
        font-weight: bold;
    }
    .final{
        background-color: rgb(229, 250, 229);
        border: 2px solid rgb(220, 248, 231);
    }
    .initial{
        background-color: rgb(235, 233, 255);
        border: 2px solid rgb(223, 221, 255);
    }
    .empty{
        padding:20px 40px;
        display: block;
        margin: auto;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 20px;
    }
</style>