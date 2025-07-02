<template>
  <main>
    <div class="formContainer">
      <div class="logo">
        <img src="/static/logo.png" alt="" />
      </div>
      <form class="form" @submit.prevent="login">
        <div class="content">
          <label for="username">Nom d'utilisateur:</label>
          <div class="input password">
            <i class="fa fa-user"></i>
            <input type="text" v-model="username" placeholder="Taper votre d'utilisateur ici" autocomplete="false" />
          </div>
          <label for="password">Mot de passe:</label>
          <div class="input password">
            <i class="fa fa-lock"></i>
            <input :type="mode" v-model="password" placeholder="Taper votre mot de passe ici" />

            <i class="fa-regular" @click="
              mode == 'password' ? (mode = 'text') : (mode = 'password')
              " :class="{
              'fa-eye-slash': mode != 'password',
              'fa-eye': mode != 'text',
            }"></i>
          </div>
        </div>
        <button type="submit" class="btn-modal">Connexion</button>
      </form>
    </div>
  </main>
</template>
<script>
import Loader from "@/components/loader.vue";
export default {
  data() {
    return {
      username: "",
      password: "",
      mode: "password",
    };
  },
  components: {
    Loader,
  },
  methods: {
    login() {
      let credentials = { username: this.username, password: this.password};
      axios.post('login/', credentials)
        .then((response) => {
          this.$store.state.user = response.data;
          window.localStorage.setItem('_mic_user', JSON.stringify(response.data))
        }).catch(error => {
          error.response && error.response.status === 401 ? (
            this.$store.state.message.error = "Nom d'utilsateur ou mot de passe incorrect.", 
            this.$store.state.is_loading = false,
            this.alertError()
          ) : this.displayErrorOrRefreshToken(error, this.login)
        })
    },
  },
};
</script>
<style scoped>
main {
  width: 100%;
  height: 100vh;
  display: grid;
  place-content: center;
}

.formContainer {
  padding: 20px 0 0 0;
  background: var(--second);
  box-shadow: 4px 8px 24px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.disabled {
  background: var(--third);
  cursor: progress;
}

.logo img {
  width: 116px;
}

label {
  font: 600 16px sans-serif;
  color: var(--primary);
}

.input {
  box-sizing: border-box;
  padding: 0 8px;
  border: 2px solid var(--primary);
  border-radius: 5px;
  margin-bottom: 10px;
}

.password {
  content: '';
  display: flex;
  align-items: center;
  justify-content: space-between;
}

input {
  min-width: 190px;
  padding: 8px;
  border: none;
  outline: none;
  background: transparent;
}
</style>