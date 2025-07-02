<template>
    <div>
        <Modal :isVisible="true" @close="closeModal">
            <form action="" @submit.prevent="verifyPasswordBeforeValidation" class="form">
                <span class="title">Tapez votre mot de passe.</span>
                <input type="password" v-model="password">
                <button class="btn-modal" type="submit">Valider</button>
            </form>
        </Modal>
    </div>
</template>
<script>
import Modal from './Modal.vue';

export default {
    data() {
        return {
            password: ''
        }
    },
    components: {
        Modal
    },
    methods: {
        closeModal() {
            this.password = ''
            this.$emit('close')
        },
        verifyPasswordBeforeValidation() {
            const credentials = {
                username: this.$store.state.user.username,
                password: this.password
            };
            axios.post('login/', credentials)
                .then(() => {
                    this.$emit('close')
                    this.$emit('validate')
                }).catch(error => {
                    error.response && error.response.status === 401 ?
                        (this.$store.state.message.error = "Mot de passe incorrect.")
                        : this.displayErrorOrRefreshToken(error, () => this.verifyPasswordBeforeValidation(password, validator))
                })
        }
    }
}
</script>
<style></style>