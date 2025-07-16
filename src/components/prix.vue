<template>
    <Navbar />
    <Modal :isVisible="show_modal" @close="closeModal">
        <div class="form">
            <span class="title">Choisir une <br> classe comptable</span>
            <div class="searchbox">
                <input class="input-search for_grps" type="text" v-model="keyword_attributed" id="key"
                    placeholder="Rechercher par nom ou numero">
                <span class="btn-search">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </span>
            </div>
            <div class="content">
                <div>
                    <label v-for="plan in filteredPlans" :key="plan.id">
                        <input type="radio" v-model="classe" :value="plan.id" name="table" style="width: fit-content;">
                        {{ plan.numero }} : {{ plan.nom }}
                        <br>
                    </label>
                    <small v-for="err in data_error?.table" :key="err.id">
                        {{ err }}
                    </small>
                </div>
            </div>
            <button class="btn-modal" @click="putClasse(prix_id, price)">Ajouter</button>
        </div>
    </Modal>
    
    <div class="container">
        <div class="btns">
            <div class="btn retour" @click="goBack">&#10094;</div>
        </div>
        <div class="prix_container">
            <form class="form" @submit.prevent="handleCreatePrix">
                <span class="title" v-if="!edit">Nouveau Prix</span>
                <span class="title" v-else>Modifier le Prix</span>
                <div class="prix_content" v-if="step == 1">
                    <!-- <label for="motif">Motif: *</label>
                    <input type="text" id="motif" v-model="motif" placeholder="Motif">
                    <small v-for="err in data_error?.motif" :key="err.id">
                        {{ err }}
                    </small> -->
                    <label for="table">Opération: *</label>
                    <select name="table" id="table" v-model="table">
                        <option value="" disabled>--------</option>
                        <option v-for="option in options" :key="option" :value="option.value">{{ option.display_name }}
                        </option>
                    </select>
                    <small v-for="err in data_error?.table" :key="err.id">
                        {{ err }}
                    </small>
                    <label for="selector"> Prix/Pourcentage *
                        <select id="selector" v-model="par">
                            <option value="">--------</option>
                            <option value="prix">Prix</option>
                            <option value="pourcentage">Pourcentage</option>
                        </select>
                    </label>
                    <label v-if="par === 'prix'" for="prix">Prix: *</label>
                    <label v-else for="pourcentage"> Pourcentage: *</label>
                    <input v-if="par === 'prix'" type="number" id="prix" v-model="prix" placeholder="Prix">
                    <input v-else type="text" id="pourcentage" v-model="pourcentage" placeholder="Pourcentage">
                    <small v-for="err in data_error?.prix" :key="err.id">
                        {{ err }}
                    </small>
                    <div class="" v-if="table === 'commande chequier'">
                        <label for="minimum">Minimum:</label>
                        <input type="text" id="minimum" v-model="minimum" placeholder="Minimum">
                        <small v-for="err in data_error?.minimum" :key="err.id">
                            {{ err }}
                        </small>
                        <label for="maximum">Maximum:</label>
                        <input type="text" id="maximum" v-model="maximum" placeholder="Maximum">
                        <small v-for="err in data_error?.maximum" :key="err.id">
                            {{ err }}
                        </small>
                    </div>
                </div>
                <div class="btns">
                    <button v-if="!edit" class="btn-modal">Ajouter</button>
                    <div v-else class="row">
                        <button class="btn btn-modal" @click="clearForm"><i class="fa-solid fa-plus"></i> Ajouter </button>
                        <button class="btn-modal">Modifier</button>
                    </div>
                </div>
            </form>

            <div v-if="show_arrow" class="left_arrow">&larr;</div>
            <section class="table">
                <table>
                    <tr>
                        <th>Options</th>
                        <!-- <th>Motif</th> -->
                        <th>Prix</th>
                        <th>Minimum</th>
                        <th>Maximum</th>
                        <th>Pourcentage</th>
                        <th>Opération</th>
                        <!-- <th>Microfinance</th> -->
                        <th>Classe Comptable</th>
                    </tr>
                    <tr v-for="price in prices" :key="price.id">
                        <td>{{ price.table }}</td>
                        <td>{{ money(price.prix) || '-' }}</td>
                        <td>{{ money(price.minimum) }}</td>
                        <td>{{ money(price.maximum) }}</td>
                        <td>{{ price.pourcentage ? price.pourcentage + '%' : '-' }}</td>
                        <!-- <td>{{ price.table }}</td> -->
                        <!-- <td>{{ price.microfinance }}</td> -->
                        <td>
                            <button 
                                v-if="!price.classe_comptable" class="btn "
                                @click="prepareData(price.id, price), show_modal = true"
                            >
                                <i class="fa-solid fa-plus"></i>
                                &nbsp;Classe 
                            </button>
                            <span v-else>{{ price.classe_comptable.numero }}</span>
                        </td>
                        <td>
                            <div class="btns">
                                <button class="btn" v-if="price.classe_comptable" @click="editPrix(price)"><i
                                        class="fa-solid fa-pencil"></i></button>
                                <!-- <button class="btn delete" @click="deletePrix(price)">
                                    <i class="fa-solid fa-trash"></i></button> -->
                            </div>
                        </td>
                    </tr>
                </table>
            </section>
        </div>
    </div>
</template>

<script>
import Navbar from './Navbar.vue';
import Modal from '@/Overlays/Modal.vue';

export default {
    data() {
        return {
            prix: '',
            maximum: 0,
            minimum: 0,
            pourcentage: '',
            motif: '',
            microfinance: '',
            table: '',
            classe: '',
            microfinances: [],
            prices: [],
            step: 1,
            stepEdit: 1,
            plan_comptables: [],
            edit: false,
            prix_id: '',
            show_arrow: false,
            keyword_attributed: '',
            par: '',
            show_modal: false,
            price: '',
            classe_comptable: '',
            options: [],
            data_error: [],
            got_prices: []
        }
    },
    components: {
        Navbar, Modal
    },
    computed: {
        filteredPlans() {
            const keyword = this.keyword_attributed.toLowerCase();
            if (keyword === '') {
                return [];
            }
            return this.plan_comptables.filter(plan => {
                return plan.numero.toLowerCase().includes(keyword) || plan.nom.toLowerCase().includes(keyword);
            });
        },
    },
    watch: {
        "prices": {
            deep: true,
            handler(new_val) {
                new_val.forEach(element => {
                    this.options = this.options.filter(option => option.display_name != element.table)
                });
            }
        }
    },
    methods: {
        get_table_value(value) {
            switch (value) {
                case 'Retrait Par Quittance':
                    return 'quittance'
                case 'Retrait Par Cheque':
                    return 'cheque'
                case 'Retrait Par Cahier':
                    return 'cahier'
                case 'Commande Chequiers':
                    return 'commande chequier'
                case 'Ordre Virement Interne':
                    return 'ordre de virement interne'
                case 'Ordre Virement Externe':
                    return 'ordre de virement externe'
                case 'Commission Credit':
                    return 'commission sur credit'
                case 'Interets Sur Credit':
                    return 'interets_sur_credit'
                default:
                    return value
            }
        },
        prepareData(id, price) {
            this.prix_id = id
            this.price = price
        },
        closeModal() {
            this.show_modal = false
            this.classe = ''
            this.prix_id = ''
            this.keyword_attributed = ''
        },
        clearForm() {
            this.motif = '';
            this.prix = '';
            this.pourcentage = '';
            this.table = '';
            this.classe = '';
            this.edit = false,
            this.par = ''
        },
        selectStepEdit(num) {
            this.stepEdit = num;
        },
        selectStep(num) {
            this.step = num;
        },
        editPrix(price) {
            this.prix_id = price.id;
            this.edit = true;
            this.motif = price.motif;
            this.prix = price.prix || '';
            this.minimum = price.minimum;
            this.maximum = price.maximum;
            this.pourcentage = price.pourcentage || '';
            this.table = this.get_table_value(price.table).toLowerCase();
            this.classe = price?.classe_comptable?.id || '';
            this.step = 1
            this.par = price.prix ? 'prix' : 'pourcentage'
            this.show_arrow = true;
            setTimeout(() => {
                this.show_arrow = false;
            }, 300);
        },
        // deletePrix(price) {
        //     const comfirmation = confirm(`Vous voulez vraiment supprimer le prix pour ${price.table}?`)
        //     if (comfirmation) {
        //         axios.delete(`prix/${price.id}/`)
        //             .then(() => {
        //                 this.$store.state.message.success = `Le prix pour ${price.table} a été suprimmé avec succès.`
        //                 this.prices = this.prices.filter(prix => prix.id !== price.id)
        //             }).catch((error) => {
        //                 this.displayErrorOrRefreshToken(error, () => this.deletePrix(price))
        //             })
        //     }
        // },
        handleCreatePrix() {
            const formData = new FormData();

            this.edit && (formData.append('id', this.prix_id))
            formData.append('motif', this.motif);
            formData.append('prix', this.prix);
            formData.append('minimum', this.minimum);
            formData.append('maximum', this.maximum);
            formData.append('pourcentage', this.pourcentage);
            formData.append('table', (this.table).toLowerCase());
            formData.append('classe_comptable', this.classe);

            const method = this.edit ? axios.put : axios.post;
            const url = this.edit ? `prix/${this.prix_id}/` : `prix/`

            method(url, formData).then((response) => {
                if (this.edit) {
                    this.$store.state.message.success = `Le prix pour ${this.table} a été mis à jour avec succès`;
                    this.prices = this.prices.map(price => {
                        if (price.id == this.prix_id) {
                            return { ...price, ...response.data }
                        }
                        return price
                    })
                } else {
                    this.$store.state.message.success = `Le prix pour ${this.table} a été ajouté avec succès`;
                    this.prices.unshift(response.data);
                    this.plansGetter()
                }
                this.clearForm()
                this.edit = false
            }).catch((error) => {
                this.displayErrorOrRefreshToken(error, this.handleCreatePrix);
                this.data_error = error.response?.data
            });
        },
        putClasse(id, price) {
            const formData = {
                'motif': price.motif,
                'prix': price.prix,
                'minimum': price.minimum,
                'maximum': price.maximum,
                'pourcentage': price.pourcentage,
                'table': this.get_table_value(price.table).toLowerCase(),
                'classe_comptable': this.classe
            }
            axios.put(`prix/${id}/`, formData)
                .then((response) => {
                    this.$store.state.message.success = `La classe comptable pour ${this.table} a été ajouté avec succès`;
                    this.prices = this.prices.map(price => {
                        if (price.id === id) {
                            return { ...price, ...response.data };
                        }
                        return price;
                    });
                    this.closeModal()
                }).catch((error) => {
                    this.data_error = error.response?.data
                    this.displayErrorOrRefreshToken(error, () => this.putClasse(id, data))
                })
        },
        async getPrix() {
            await axios.get('prix/')
                .then((rep) => {
                    this.prices = rep.data.results
                    const allDontHaveClasses = rep.data.results.some(
                        element => element.classe_comptable === null
                    )
                    allDontHaveClasses && this.plansGetter()
                }).catch((error) => this.displayErrorOrRefreshToken(error, this.getPrix))
        },
        getChoices() {
            axios.options('prix/')
                .then((rep) => this.options = rep.data.actions.POST.table.choices, this.getPrix())
                .catch((error) => this.displayErrorOrRefreshToken(error, this.getChoices))
        },
        plansGetter() {
            if (this.$store.state.plan_comptables.length) {
                this.plan_comptables = this.$store.state.plan_comptables
            } else {
                this.getPlans();
            }
        }
    },
    mounted() {
        this.getChoices()
    }
};
</script>

<style scoped>
.prix_container {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 20px;
    /* padding: 70px 30px 0 30px; */
}

.prix_container .form {
    box-shadow: 0 1px 2px;
    width: 290px;
}

section.table {
    flex: 1;
}

.prix_content {
    display: flex;
    flex-direction: column;
    width: 250px;
    padding: 0 0 10px 0;
}

.left_arrow {
    position: absolute;
    top: 50%;
    left: 75%;
    font-size: 200px;
    z-index: 1000;
    transform: translateY(-60%);
    transition: .3s ease-in-out;
    animation: go_right .3s ease-in-out 1 forwards;
}

@keyframes go_right {
    100% {
        left: 350px;
    }
}

input#key {
    width: 100%;
}

button.btn.add_classe {
    min-width: 80px !important
}

select[name="table"]#table option {
    text-transform: capitalize;
}
.searchbox{
    width: 100%;
}
</style>