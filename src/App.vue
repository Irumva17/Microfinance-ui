<template>
  <Notifier />
  <Loader v-if="this.$store.state.is_loading" />
  <NetworkStatus v-if="!this.$store.state.online" />
  <!-- <Developper /> -->
   <!-- <Navbar /> -->
  <router-view v-if="this.$store.state.user"></router-view>
  <Login v-else />
</template>
<script>

import Developper from './components/Developper.vue';
import Loader from './components/loader.vue';
import Login from './components/login.vue';
import Navbar from './components/Navbar.vue';
import NetworkStatus from './services/NetworkStatus.vue';
import Notifier from './services/notifier.vue';
export default {
  data(){
    return {
      backgroundImage: this.getSavedBackgroundImage(),
      variables: [
        { name: '--primary', label: 'Primary Color', color: this.getSavedColor('--primary', '#202c5c') },
        { name: '--second', label: 'Second Color', color: this.getSavedColor('--second', '#ffffff') },
        { name: '--third', label: 'Third Color', color: this.getSavedColor('--third', 'rgb(173, 173, 173)') }
      ],
    }
  },
  components: {
    Login, Notifier, Developper, Loader, NetworkStatus, Navbar
  },
  methods: {
    getSavedBackgroundImage() {
      return localStorage.getItem('backgroundImage') || null;
    },
    getSavedColor(variableName, defaultColor) {
      return localStorage.getItem(variableName) || defaultColor;
    }
  },
  mounted() {
    // this.$store.state.online = navigator.onLine
    let user = JSON.parse(window.localStorage.getItem('_mic_user'))
    if (!!user) {
      this.$store.state.user = user
    }

    if (this.backgroundImage) {
      document.body.style.backgroundImage = `url(${this.backgroundImage})`;
    }
    this.variables.forEach(variable => {
      document.documentElement.style.setProperty(variable.name, variable.color);
    });
  }
}
</script>

<style></style>
