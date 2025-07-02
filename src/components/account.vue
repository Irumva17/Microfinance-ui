<template>
    <div class="aCont">
        <span class="accname"> {{ account_name }} </span>
        <p class="acMoney">{{ money(account_money) }} <span>Fbu</span></p>
    </div>
</template>
<script>
export default {
    props : {
        account_name : {
            type : String,
            required : true
        },
        account_money : {
            type : Number,
            required : true,
            default : 0
        }
  },
}
</script>