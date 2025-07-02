<template>
    <Modal :isVisible="show_modal" @close="closeModal">
        <div class="form">
            <div class="title">Changer le mot de passe</div>
            <div class="content">
                <label for="current_password">Mot de passe actuel</label>
                <div class="input_box">
                    <input :type="mode1" v-model="current_password" id="current_password" placeholder="Nouveau mot de passe" />
                    <i class="fa-regular" @click="
                        mode1 == 'password' ? (mode1 = 'text') : (mode1 = 'password')
                        " :class="{
                            'fa-eye-slash': mode1 != 'password',
                            'fa-eye': mode1 != 'text',
                        }">
                    </i>
                </div>
                <label for="new">Nouveau mot de passe:</label>
                <input type="text" id="new"  v-model="new_password" >
                <label for="comfirm">Comfirmer ce mot de passe:</label>
                <div class="input_box">
                    <input type="text" v-model="comfirmer_password" id="comfirm" placeholder="Comfirmer ce mot de passe" autocomplete="''" />
                    <!-- <i class="fa-regular" @click="
                        mode == 'password' ? (mode = 'text') : (mode = 'password')
                        " :class="{
                        'fa-eye-slash': mode != 'password',
                        'fa-eye': mode != 'text',
                        }">
                    </i> -->
                </div>
            </div>
            <button class="btn-modal" @click="verify">Changer</button>
        </div>
    </Modal>
    <div class="connected" id="triger" @click="toggleDropdown">
        <div class="profile">
            <div class="user_container">
                <i class="fa-solid fa-user"></i>
            </div>
        </div>
        <div class="userData">
            <h2>
                {{ user?.fullname || user?.username }} <br>
                <span>{{ user.agence?.nom }}</span>
            </h2>
            <i class="fa-solid fa-angle-down" :class="{ rotated: isDropdownOpen }"></i>
        </div>
        <div id="userIdentifier" :class="{ opened : isDropdownOpen }  "  @mouseleave="closeDropdown">
            <div class="userProfile">
                <i class="fa-solid fa-user"></i>
            </div>
            <div>
                <h3>
                    {{ user.username }} <br>
                    <p>{{ user.agence?.nom }}</p>
                </h3>
                <div>
                    <router-link class="a" :to="{ name: 'Parametres' }">
                        <i class="fa-solid fa-gear"></i> Parametres
                    </router-link>
                    <div class="a" @click="show_modal = true">
                        <i class="fa-solid fa-key"></i> Mot de Passe
                    </div>
                    <div class="a" @click="logout">
                        <i class="fa-solid fa-right-from-bracket"></i> Deconnexion
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Modal from '@/Overlays/Modal.vue';

export default {
    data() {
        return {
            isDropdownOpen: false,
            show_modal : false,
            mode : 'password',
            mode1 : 'password',
            current_password : '',
            new_password : '',
            comfirmer_password  : '',
        };
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    components : {
        Modal
    },
    methods: {
        verify() {
            if(this.current_password == '' || this.new_password == '' || this.comfirmer_password == ''){
                this.$store.state.message.error = 'Tous les mots de passe sont obligatoire.'
                return
            }
            if(this.current_password === this.new_password){
                this.$store.state.message.error = 'Le nouveau mot de passe ne doit pas correspondre à l\'ancien.'
                return
            }
            if (this.new_password === this.comfirmer_password) {
                confirm('Vous voulez vraiment changer votre mot de passe?') ?
                this.changePassword() : this.closeModal()
            } else {
                this.$store.state.message.error = 'Le nouveau mot de passe et sa confirmation doivent correspondre.';
            }
        },
        changePassword() {
            const id = this.$store.state.user.personnel.id
            const data = new FormData()
            data.append('old_password', this.current_password)
            data.append('new_password', this.new_password)
            data.append('confirm_password', this.comfirmer_password)
            
            axios.post(`personnels/${id}/change-password/`, data)
            .then(() => {
                this.$store.state.message.success = 'Votre mot de passe a été changé avec succès.'
                this.logout()
            }).catch((error) => {
                this.displayErrorOrRefreshToken(error, this.changePassword)
            })
        },
        closeModal(){
            this.show_modal = false,
            this.current_password = ''
            this.new_password = ''
            this.comfirmer_password = ''
        },
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        closeDropdown() {
            this.isDropdownOpen = false;
        },
    }
}
</script>
<style scoped>
.connected{
    cursor: pointer;
    position: relative;
    display: flex;
    gap: 10px;
    align-items: center;
    width: 200px;
    padding: 2px;
    height: fit-content;
}
.profile{
    box-sizing: border-box;
    position: relative;
    border-radius: 50%;
    background: var(--second);
    width: 35px;
}
.profile::before{
    position: absolute;
    top: 0px;
    right: 0px;
    content: "";
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background: lime;
}
.user_container{
    box-sizing: border-box;
    margin: 2px;
    border-radius: 50%;
    overflow: hidden;
}
.user_container i.fa-solid.fa-user {
    box-sizing: border-box;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 0%);
    color: var(--primary);
    font-size: 30px;
}
.userProfile{
    display: grid;
    place-content: center;
}
.userProfile .fa-user{
    display: grid;
    place-content: center;
    border-radius: 50%;
    width: 90px;
    font-size: 90px;
    color: var(--second);
    border: 5px solid transparent;
    outline: 5px solid white;
    height: auto;
    overflow: hidden;   
}
.connected h2{
    margin: 0;
    font: 500 16px serif;
    line-height: 70%;
}
.connected span{
    font-weight: 300;
    text-align: right;
    font-size: 12px;
}
.userData{
    display: flex;
    gap: 5px;
    align-items: center;
    padding: 10px 0;
    color: var(--second);
    text-transform: capitalize;
}
.connected:hover i.fa-angle-down{
    top:0
}
.rotated{
    transform: rotate(180deg);
}
#userIdentifier{
    position: fixed;
    display: none;
    flex-direction: column;
    background: var(--primary);
    top: 0;
    right: 20px;
    padding: 10px;
    padding-top: 20px;
    border-radius:0 0 5px 5px;
    transform: rotateX(-83deg);
    transform-origin: top;
    z-index: 1;
    animation: blockShow .2s ease-in-out 1 forwards;
    h3{
        color: var(--second);
        text-align: center;
        font: 500 20px sans-serif;
        text-transform: capitalize;
        height: fit-content;
        margin: 10px 0 5px 0;
        p{
            margin: 0;
            font-size: 15px;
        }
    }

}

@keyframes blockShow {
    100%{
        transform: rotateX(0);
    }
}
#userIdentifier .a{
    display: flex;
    align-items: center;
    gap: 20px;
    max-width: 170px;
    padding: 7px 20px;
    text-decoration: none;
    color:var(--second);
    border-radius: 3px;
    text-align: center;
    border: 1px solid ;
    margin-bottom: 5px;
    i{
        box-sizing: border-box;
    }
}

#userIdentifier .a:hover{
    color: var(--primary);
    background: white;
    border-radius: 5px;
}
#userIdentifier .a:last-child, #userIdentifier .a:last-child:hover{
    color: white;
    border: none;
    background-color: var(--red);
    margin: 0;
}

.opened{
    display: flex!important;
}
.input_box{
    position: relative;
}
.input_box i{
    position: absolute;
    right: 8px;
    top: 8px
}
</style>