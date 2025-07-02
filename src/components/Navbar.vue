<template>
  <nav>
    <ul class="nav">
      <li v-for="(nav_item, index) in navbar" :key="index" :class="{ 'active-page': isActive(nav_item) }">
        <router-link v-if="nav_item.link" :to="nav_item.link" class="nav_item" :class="{ 'active-page': nav_item.link === $route.path }">
          {{ nav_item.name }}
        </router-link>
        <span v-else :class="{ 'active-page': isActive(nav_item) }">{{ nav_item.name }}</span>
        <ul class="navLinks" v-if="nav_item.subLinks && nav_item.subLinks.length">
          <li class="nav_link_sub_links" v-for="(sub_item, sub_index) in nav_item.subLinks" :key="sub_index" :class="{ 'active-page': isActive(sub_item) }">
            <router-link v-if="sub_item.link" :to="sub_item.link">{{ sub_item.name }}</router-link>
            <span class="nav-menu-item" v-else>{{ sub_item.name }}</span>
            <ul class="navLinks" v-if="sub_item.subLinks && sub_item.subLinks.length">
              <li v-for="(sub_sub_item, sub_sub_index) in sub_item.subLinks" :key="sub_sub_index" :class="{ 'active-page': isActive(sub_sub_item) }">
                <router-link v-if="sub_sub_item.link" :to="sub_sub_item.link">{{ sub_sub_item.name }}</router-link>
                <span v-else>{{ sub_sub_item.name }}</span>
              </li>
            </ul>
          </li>
        </ul>
        <div class="indicator"></div>
      </li>
    </ul>
    <div class="menu"><i class="fa-solid fa-bars"></i></div>
    <ConnectedUser />
  </nav>
</template>

<script>
import navbarMenu from '@/navbarmenu.json';
import ConnectedUser from '@/components/ConnectedUser.vue';

export default {
  components: {
    ConnectedUser,
  },  
  data() {
    return {
      navbar: navbarMenu,
    };
  },
  methods: {
    isActive(nav_item) {
      if (nav_item.subLinks) {
        return nav_item.subLinks.some(sub_menu_item => sub_menu_item.link === this.$route.path);
      }
      return false;
    }
  }
};
</script>

<style scoped>
nav{
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--primary);
  width: 100%;
  height: 48px;
  padding: 0 0 0 35px;
  box-shadow: 0 0 5px;
  height: fit-content;
  z-index: 100;
}

.fa-bars{
  cursor: pointer;
  display: none;
  margin: 14px 0;
  background-color: var(--dark);
  font-size: 22px;
  color: white
}
nav ul{
  position: relative;
  list-style: none;
  display: flex;
  gap: 10px;
  font: 400 16px sans-serif;
  margin: 0;
  padding: 0;
}
ul.nav li{
  cursor: pointer;
  position: relative;
  padding: 0;
  width: fit-content;
  color: var(--second);
}
ul.nav li .indicator{
  position: relative;
  top: 7px;
  height: 3px;
  width: 0%;
  margin: auto;
  background-color: var(--second);
  border-radius: 4px;
  align-self: center;
  transition: .2s ease-in-out;
}
ul.nav .active-page .indicator, ul.nav .active-page  + .indicator{
  width: 100%!important;
}
ul.nav li:hover{
  box-sizing: border-box; 
}
ul.nav li:hover .indicator{
  width: 100%;
}
a.nav_item{
  text-decoration: none;
  color: var(--second);
  padding: 15px 0;
}
.navLinks{
  display: none;
  position: absolute;
  top:100%;
  left: 0;
  padding: 5px;
  background-color: var(--primary);
  border-radius: 5px;
  border: 1px solid var(--second);
  box-shadow: 0 0 5px var(--primary);
  z-index: 1;
}
.navLinks a, .nav-menu-item{
  position: relative;
  display: inline-block;
  width: 150px;
  padding: 10px;
  color: var(--second);;
  text-decoration: none;
  background-color: var(--primary);
  border-radius: 3px;
  margin-bottom: 2px;
}
.navLinks a.router-link-active{
  background-color: var(--second);
  color: var(--primary);
}
.navLinks a.router-link-active:hover{
  color: var(--primary);
}
.navLinks a:hover{
  color: var(--primary);
  background: var(--third);
}
li:hover .navLinks{
  display: block;
}

.nav_link_sub_links .navLinks{
  display: none!important;
  top:10px;
  left: 90%;
}
.nav_link_sub_links:hover .navLinks{
  display: block!important
}
@media screen and ( max-width: 680px ) {
  nav{
    padding: 0 15px;
  }
  nav ul.nav{
    display: none;
  }
  .fa-bars{
    display: block;
  }
}
</style>
