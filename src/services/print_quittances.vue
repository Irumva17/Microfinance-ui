<template>
    <div class="quittances_container">
        <div v-for="num in quittances_nums" class="quittances">
            <div class="top">
                <div style="display: flex;gap: 20px;align-items: center;">
                    <img src="/static/logo.png" alt="">
                    <h1>MICROFINANCE</h1>
                </div>
                <div class="actions" style="display: flex;gap: 15px;">
                    <p>Depot <span></span></p>
                    <p>Retrait <span></span></p>
                </div>
                <!-- <h2 style="margin: 5px;">N°:{{ $store.state.user.agence.microfinance.nom }}/{{ num }}</h2> -->
            </div>
            <div class="bottom">
                Effectué par: ............................................................ <br>
                Titulaire du Compte : .............................................. <br>
                Numéro du Compte : .............................................. <br>
                Montant : .................................................................. <br>
                ..................................................................................... <br>
                <p>Date : ......./......../........ &emsp;Signature</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props : {
        quittances_nums : {
            type :Array,
            required : true
        }
    }
}
</script>
<style scoped>
    *{
        color: black
    }
    .quittances_container{
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-wrap: wrap;
        min-width: 100vw;
        height: fit-content;
        background: white;
    }
    .quittances{
        box-sizing: border-box;
        border: 1px solid ;
        max-height: 360px;
        max-width:340px;
        margin: 0 10px 10px 0;
    } 
    img{
        width: 60px;
    } 
    .actions p{
        display: flex;
        align-items: center;
        gap: 15px;
        margin: 5px;
    }  
    span{
        display: inline-block;
        height: 20px;
        width: 20px;
        border: 1px solid;
    }
    .top{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    h1{
        font-size: 22px;
    } 
    h2{
        font-size: 18px;
    }  
    
    .bottom{
        font-size: 14px
    }
    @media print{
        body{
            width: fit-content;
        }
        .quittances{
            page-break-inside: avoid;
            padding: 20px!important;
        }
    }
</style>