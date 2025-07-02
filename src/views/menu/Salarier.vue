<template>
    <Navbar />
    <Modal :isVisible="show_modal" @close="closeModal">
        <div class="form">
            <span class="title">Nouveau Salarier</span>
            <div class="content">
                <div v-if="one">
                    <span>Compte</span>
                    <SearchCompte @compte="add_account" />
                    <small v-for="(err, index) in data_error?.compte" :key="index">
                        {{ err }}
                    </small><br>
                    <label>Montant:</label>
                    <input type="number" id="montant" placeholder="Montant" v-model="montant">
                    <small v-for="(err, index) in data_error?.montant" :key="index">
                        {{ err }}
                    </small>
                    <label for="motif">Motif:</label>
                    <input type="text" id="motif" placeholder="Motif" v-model="motif">
                    <small v-for="(err, index) in data_error?.motif" :key="index">
                        {{ err }}
                    </small>
                </div>
                <input v-show="two" type="file" accept=".csv" @change="e => prepareData(e)">
                <section class="table salarier_mul" v-if="to_accounts.length > 0">
                    <table>
                        <thead>
                            <tr>
                                <th>Motif</th>
                                <th>No. compte</th>
                                <th>Montant</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="acc in to_accounts">
                                <td>{{ acc.motif }}</td>
                                <td>{{ acc.compte }}</td>
                                <td>{{ money(acc.montant) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <div class="row" v-show="!showCreateButton">
                    <button class="btn-modal" @click="selectOne">Pour une seule</button>
                    <button class="btn-modal" @click="selectTwo">Pour plusieur </button>
                </div>
            </div>
            <button 
                v-show="showCreateButton" 
                class="btn-modal" 
                @click="one ? nouveauxSalarier() : multipleSalarier()"
                >Créer {{ money(montant) }}
            </button>
        </div>
    </Modal>
    <div class="container">
        <div class="btns">
            <button class="btn retour" @click="goBack">&#10094;</button>
            <button class="btn" @click="show_modal = true"><i class="fa-solid fa-plus"></i> Ajouter </button>
        </div>
        <section class="table">
            <table>
                <tr>
                    <th>Id</th>
                    <th>Compte</th>
                    <th>Montant</th>
                    <th>Motif</th>
                    <th>Date</th>
                    <th>Creé par</th>
                </tr>
                <tr v-for="item in list" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.compte }}</td>
                    <td>{{ money(item.montant) }}</td>
                    <td>{{ item.motif }}</td>
                    <td>{{ datetime(item.created_at) }}</td>
                    <td>{{ item.created_by }}</td>
                </tr>
            </table>
        </section>
    </div>
</template>

<script>
import Modal from '@/Overlays/Modal.vue';
import Navbar from '@/components/Navbar.vue';
import SearchCompte from '@/components/SearchCompte.vue';
import DateFilter from '@/components/dateFilter.vue';

export default {
    data() {
        return {
            show_modal: false,
            one: false,
            two: false,
            to_accounts: [],
            showCreateButton: false,
            montant: 0,
            motif: '',
            compte: '',
            comptes : [],
            list: [],
            data_error: {},
            accounts : []
        }
    },
    components: {
        Navbar, 
        Modal, 
        DateFilter,
        SearchCompte
    },
    methods: {
        selectOne() {
            this.one = true;
            this.two = false;
            this.showCreateButton = true;
        },
        selectTwo() {
            this.two = true;
            this.one = false;
            this.showCreateButton = true;
        },
        closeModal() {
            this.show_modal = false
            this.montant = 0
            this.motif = ''   
            this.compte = ''
            this.one = false
            this.two = false
            this.showCreateButton = false
            this.to_accounts = []
        },
        getSalarier() {
            axios.get("salarier/")
                .then((reponse) => {
                    this.list = reponse.data.results;
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getSalarier);
                })
        },
        prepareData(event) {
            this.isCsvfile = event.target.files.length > 0
            this.to_accounts = []
            this.accounts = []
            this.comptes = []
            this.montant = 0
            let file_path = event.target.files[0]; 
            if (file_path && file_path.type === 'text/csv') { 
                this.isCsvfile = true;
                var reader = new FileReader();
                reader.onload = (event) => {
                    const file = event.target.result;
                    const lines = file.split(/\r\n|\n/);
                    let i = 0;
                    for (i; i < lines.length - 1; i++) {
                        const array_line = lines[i].split(/,|;/);
                        if (array_line.length > 0) {
                            this.to_accounts.push({
                                "motif": array_line[0],
                                "montant": array_line[2],
                                "compte": array_line[1]
                            });
                            this.comptes.push(array_line[1])
                            this.montant += parseInt(array_line[2]);
                        }
                    }
                    this.getAcounts(this.comptes)
                };
                reader.onerror = (event) => {
                    alert(event.target.error.name);
                };
                reader.readAsText(file_path, 'ISO-8859-1');
            } else {
                this.isCsvfile = false;
                alert('Vous devez choisir un fichier CSV.');
            }
        },
        getAcounts(array) {
            this.accounts = new Array(array.length).fill(null);
            const requests = array.map((item, index) => {
                return axios.get(`comptes/?search=${item}`)
                    .then((response) => {
                        if (response.data.results.length > 0) {
                            let found = false;
                            for (let i = 0; i < response.data.results.length; i++) {
                                const result = response.data.results[i];
                                // if (!result){
                                //     console.log('result', result)
                                //     this.$store.commit('setError', `Le compte ${item} n'est pas trouvé, veuillez réessayer.`);
                                // }
                                if (result.numero === item.toUpperCase()) {
                                    this.accounts[index] = {
                                        "compte_arrivee": result.id,
                                    };
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                alert(`Le compte ${item} n'est pas trouvé, veuillez réessayer.`);
                            }
                        }
                    }).catch((error) => {
                        this.displayErrorOrRefreshToken(error, () => this.getAcounts(array));
                    });
            });

            Promise.all(requests)
                .then(() => {
                    this.accounts = this.accounts.filter(account => account !== null);
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, () => this.getAcounts(array));
                });
        },
        async multipleSalarier() {
            const data = this.to_accounts.map((to_account, index) => {
                return {
                    ...to_account,
                    "compte": this.accounts[index] ? this.accounts[index].compte_arrivee : to_account.compte_arrivee
                };
            });
            try {
                await axios.post('salarier/', data)
                this.$store.state.message.success = 'Multiple salarier   reussi avec success!';
                this.closeModal()
                this.getSalarier()    
            }
            catch (error) {
                this.displayErrorOrRefreshToken(error, this.multipleSalarier)
            };
        },
        nouveauxSalarier() {
            const formData = new FormData();
            formData.append('montant', this.montant);
            formData.append('motif', this.motif);
            formData.append('compte', this.compte);
            formData.append('microfinance', 1);
            axios.post('salarier/', formData)
                .then((reponse) => {
                    this.list.unshift(reponse.data);
                    this.closeModal();
                    this.$store.state.message.success = 'Salarier ajouté avec succès.'
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.nouveauxSalarier);
                    this.data_error = error.response?.data
                });
        }
    },
    mounted() {
        this.getSalarier();
    }
}
</script>
