<template>
    <div>
        <div v-for="num in cheque_nums" class="cheque_paper">
            <img src="/static/cheque.jpg" alt="" class="background">
            <div class="left_cont">
                <img src="/static/logo.png" alt="">
                <p>Date: ........./........./.......... &nbsp;&nbsp;&nbsp;    N°: {{ num }}</p>
                <span>Montant:
                    <p class="montant"> <span>FBU</span></p>
                </span>
                <p>
                    Solde de compte: <br>
                    FBU: ...............................................
                </p>
                <p>
                    A l'ordre de: .................................. <br>
                    ......................................................... <br>
                    ......................................................... <br>
                </p>
                <p>
                    Motif : ............................................ <br>
                    ......................................................... <br>
                </p>
                <p>
                    Nouveau solde : ........................... <br>
                </p>
            </div>
            <div style="position: relative;">
                <div class="backgrounds">
                    <img src="/static/logo.png" alt="">
                    <img src="/static/logo.png" alt="">
                </div>
                <div class="header">
                    <p>Payez contre ce cheque la somme de/Pay against this check</p>
                    <p class="montant"> <span>FBU</span></p>
                </div>
                <p>
                    Montant en lettre/the Sum of: ................................................................................................................ <br>
                    .......................................................................................................................................................................
                </p>
                <p>
                    A l'ordre de/to: ....................................................................................................................................................... <br>
                </p>
                <div class="payer">
                    <div>
                        <p>PAYABLE A /DRAWN ON</p>
                        <p>Compte No {{ account }} de {{ full_name }}</p>
                        <p>Cheque Numero {{ num }}</p>
                    </div>
                    <div>
                        <p>Fait à/issued at:........................................</p>
                        <p>Date ........./........./...........</p>
                        <p>Signatures: </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props : {
        cheque_nums : {
            type :Array,
            required : true
        },
        account : {
            type : String,
            required : true
        }, 
        full_name : {
            type : String,
            required : true
        }  
    }
}
</script>
<style scoped>
    .cheque_paper{
        position: relative;
        display: flex;
        background: white;
        width: fit-content;
        padding: 10px 30px 10px 0!important;
        gap: 25px;
        border-bottom: 1px solid;
    }
    .payer{
        display: flex;
        width: 100%;
        justify-content: space-between;
    }
    .montant{
        margin-top: 0;
        width: 90%;
        border: 1px solid;
    }
    .montant span{
        padding: 0 5px!important;
        border-right:1px solid ;
    }
    .left_cont{
        position: relative;
        width: 250px;
        border-right: 3px dotted;
        padding-left: 70px!important;
    }
    
    .header{
        display: flex;
        gap: 30px;
    }
    .header .montant{
        margin: 16px 0;
        width: 200px;
    }  
    .left_cont img, .backgrounds{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: .15;
    } 
    .backgrounds{
        display: flex;
        gap: 100px;
    }
    .background{
        position: absolute;
        min-width: 100%;
        max-height: 100%;
        opacity: 1;
    }
    @media print{
        .cheque_paper{
            page-break-inside: avoid;
        }
    }     
</style>