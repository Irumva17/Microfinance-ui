<template>
    <div class="searchbox">
        <input 
            class="input-search for_grps" type="text" 
            v-model="keyword"
            placeholder="Rechercher par nom ou numero"
        >
        <span class="btn-search">
            <i class="fa-solid fa-magnifying-glass"></i>
        </span>
    </div>
    <div class="compte_result">
        <label v-for="plan in filteredPlans" :key="plan.id">
            <input type="radio" 
                v-model="selectedItem" 
                :value="plan.id" :name="name ? namec : table" 
                style="width: fit-content;"
            >
                {{ plan.numero }} : {{ plan.nom }}
            <br>
        </label>
    </div>
</template>

<script>
export default {
    data() {
        return {
            keyword: '',
            selectedItem: ''
        }
    },
    watch: {
        selectedItem(newVal){
            if(newVal) {
                this.$emit('select', newVal)
            }
        }
    },
    props: {
        name: {
            type: String,
            required:false
        }
    },
    computed: {
        filteredPlans() {
            const keyword = this.keyword.toLowerCase();
            if (keyword === '') {
                return [];
            }
            return this.plan_comptables.filter(plan => {
                return plan.numero.toLowerCase().includes(keyword) || plan.nom.toLowerCase().includes(keyword);
            });
        },
    },
    emits : ['select'],
    mounted() {
        if (this.$store.state.plan_comptables.length) {
            this.plan_comptables = this.$store.state.plan_comptables
        } else {
            this.getPlans();
        }
    },
}
</script>

<style scoped>
.searchbox {
    width: 100%;
    input {
        flex: 1;
    }
}
.compte_result {
    height: fit-content !important;
    height: 50px;
}
</style>