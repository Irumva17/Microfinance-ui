<template >
	<div class="not_printable">
		<div v-if="error" class="error">{{ error }} 
			<!-- <div v-html="eEmojis[Math.floor(Math.random() * eEmojis.length)]"></div> -->
		</div>
		<div v-if="success" class="error success">{{ success }} 
			<audio v-if="enable_success" src="/success.mp3" autoplay></audio>
			<!-- <div v-html="sEmojis[Math.floor(Math.random() * sEmojis.length)]"></div> -->
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			enable_success: true,
			error: '',
			success: '',
			sEmojis : ['&#x1F929;', '&#x1F917;', '&#x1F604;', '&#x1F970;'],
			eEmojis : ['&#x1F614;', '&#x1F494;', '&#x1F97A;', '&#x1F622;']
		}
	},
	watch: {
		"$store.state.message.success"(new_val) {
			this.enable_success = true
			const enable_success = window.localStorage?.getItem('success_audio')
			if(enable_success){
				if(enable_success != 'true'){
					this.enable_success = false
				}
			}
			this.success = new_val
    	},
		"$store.state.message.error"(new_val) {
			this.error = new_val
    	}
  	},
}
</script>
<style scoped>
.error div{
	font-size: 33px;
}
</style>