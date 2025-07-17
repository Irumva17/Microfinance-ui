<template>
    <div class="search_account_container" >
        <SearchComponent :search-function="rechercher" width="100%" container_width="100%"/>
        <span v-if="!compte">{{ result }}</span>
        <div class="compte_result">
            <label v-for="acc in got_accounts">
                <input type="radio" v-model="compte" :value="acc.id" :name="acc.id" style="width: fit-content;"> 
                {{ search_for === 'compte' ? acc.numero : acc.compte }}
                {{
                    search_for === 'compte' ? (
                        acc.personne_physique ? acc.personne_physique.First_name + ' ' +  acc.personne_physique.Last_name :
                        acc.personne_morale ? acc.personne_morale.nom : '--'
                    ) : (
                        acc.banque
                    )
                }}
                <br>
            </label>
        </div>
    </div>
</template>
<script>
import SearchComponent from './SearchComponent.vue';

export default {
    data(){
        return {
            result : null,
            results : [],
            got_accounts : [],
            compte: null
        }
    },
    props : {
        search_for : {
            type : String,
            required : false,
            default : 'compte'
        }
    },
    watch : {
        compte(new_val){
            this.got_accounts = this.got_accounts.filter(acc => acc.id == new_val)
            this.$emit('compte' , new_val, this.search_for)
        }
    },
    components : {
        SearchComponent
    },
    methods : {
        rechercher(keyword) {
            this.compte = null
            this.result = "En cours de echerche..."
            this.got_accounts = []
            axios.get(`${this.search_for === 'compte' ? 'comptes' : 'comptebancaire'}/?search=${keyword}`)
                .then((response) => {
                    let s = response.data.results.length > 1 ? 's' : ''
                    this.result = `${response.data.results.length} resultat${s} trouvé${s}`;
                    this.got_accounts = response.data.results
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error,()=> this.rechercher(keyword))
                    this.result = `0 resultat trouvé.`;
                })
        },
    }
}
</script>
<style >
    .search_account_container{
        width: 100%;
    }
    .compte_result{
        max-height: 120px!important;
        overflow: auto;
        padding: 5px 0;
        flex: 1;
    }
</style>