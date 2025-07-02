<template>
  <div class="searchbox" :style="container">
    <input 
      class="input-search" 
      type="text" 
      :placeholder="placeholder" 
      v-model="keyword" 
      @keyup.enter="searchFunction(keyword)" 
      :style="style"
    />
    <button class="btn-search" @click="searchFunction(keyword)">
      <i class="fa-solid fa-magnifying-glass"></i>
    </button>
  </div>
</template>
<script>
export default {
  data(){
    return {
      keyword : ''
    }
  },
  props: {
    searchFunction: {
      type: Function,
      required: true
    },
    width : {
      type : String,
      default : '227px'
    },
    container_width : {
      type : String,
      default : 'fit-content'
    },
    placeholder : {
      type : String,
      default : 'Nom ou numero de compte'
    }
  },
  computed : {
    style(){
      return{
        width : this.width
      }
    },
    container(){
      return {
        width : this.container_width
      }
    }
  }
}
</script>

<style>
.searchbox{
  position: relative;
  display: flex;
  align-items: center;
  width: fit-content;
  height: 33px;
}
.input-search{
  border: 1px solid var(--primary);
  padding: 6px;
  border-radius: 5px 0 0 5px;
  outline: none;
  background: var(--second);
  /* width: 227px; */
  box-sizing: border-box;
  height: 100%;
}
.btn-search {
  padding: 6px 10px;
  background-color: var(--primary);
  color: var(--second);
  border-radius: 0 5px 5px 0;
  border: 0;
  cursor: pointer;
  width: fit-content;
  height: 100%;
  box-sizing: border-box;
}
</style>