<template>
    <Navbar />
    <div class="container">
        <div class="parametre">
            <div class="side">
                <div class="profile">
                    <i class="fa-solid fa-user"></i>
                    <div class="identifiers">
                        <h1>{{ this.$store.state.user.username }}</h1>
                        <span>Agence : {{ this.$store.state.user.agence.nom }}</span>
                    </div>
                </div>
                <div class="themeChanger">
                    <span class="lubrik_title">Couleurs</span>
                    <!-- <p>Changer les couleurs de l'application</p> -->
                    <div class="colors">
                        <div v-for="variable in variables" :key="variable.name" class="color">
                            <input type="color" :id="variable.name" :value="variable.color"
                                @input="changeColor($event, variable.name)" /> <br>
                            <label :for="variable.name">{{ variable.label }}</label>
                        </div>
                    </div>
                    <span class="lubrik_title">Arrière plan</span>
                    <div class="backgroundChanger">
                        <label for="image" class="button changer">
                            <i class="fa-solid fa-image"></i>
                            Changer l'arrière plan.
                        </label>
                        <input id="image" type="file" @change="handleFileUpload" />
                    </div>
                    <span class="lubrik_title">Sons</span>
                    <div class="audio_wrapper">
                        <div class="audio_">Son de reussite <input type="checkbox" v-model="success" :checked="success"></div>
                        <div class="audio_">Son d'erreur <input type="checkbox" v-model="error" :checked="error"></div>
                    </div>
                    <button @click="reset" class="reset">Reinitialiser</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import Navbar from '@/components/Navbar.vue'
import store from '@/store';
export default {
    data() {
        return {
            success : this.enable_success,
            error : this.enable_error,
            username: '',
            curentpassword: '',
            newPassword: '',
            confirmPassword: '',
            passwordError: '',
            backgroundImage: this.getSavedBackgroundImage(),
            variables: [
                { name: '--primary', label: 'Principal', color: this.getSavedColor('--primary', '#202c5c') },
                { name: '--second', label: 'Second', color: this.getSavedColor('--second', '#ffffff') },
                { name: '--third', label: 'Troisieme', color: this.getSavedColor('--third', 'rgb(173, 173, 173)') }
            ],
        };
    },
    watch : {
        success(new_val){
            store.state.success_audio = new_val
            localStorage.setItem('success_audio', new_val)
        },
        error(new_val){
            store.state.error_audio = new_val
            localStorage.setItem('error_audio', new_val)
        },
    },
    components: {
        Navbar,
    },
    created(){
        this.success = true
        const enable_success = localStorage?.getItem('success_audio')
        if(enable_success){
            if(enable_success != 'true'){
                this.success = false
            }
        }
        this.error = true
        const enable_error = localStorage?.getItem('error_audio')
        if(enable_error){
            if(enable_error != 'true'){
                this.error = false
            }
        }
    },
    methods: {
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageStore = e.target.result;
                    this.backgroundImage = imageStore;
                    document.body.style.backgroundImage = `url(${imageStore})`;
                    localStorage.setItem('backgroundImage', imageStore);
                };
                reader.readAsDataURL(file);
            }
        },
        getSavedBackgroundImage() {
            return localStorage.getItem('backgroundImage') || null;
        },
        changeColor(event, variableName) {
            const color = event.target.value;
            document.documentElement.style.setProperty(variableName, color);
            localStorage.setItem(variableName, color);
        },
        getSavedColor(variableName, defaultColor) {
            return localStorage.getItem(variableName) || defaultColor;
        },
        reset() {
            localStorage.removeItem('backgroundImage');
            localStorage.removeItem('--primary')
            localStorage.removeItem('--second')
            localStorage.removeItem('--third')
            this.$router.go(0)
        }
    },
    mounted() {
        this.backgroundImage &&  (document.body.style.backgroundImage = `url(${this.backgroundImage})`)
        this.variables.forEach(variable => {
            document.documentElement.style.setProperty(variable.name, variable.color);
        });
    },
}

</script>

<style scoped>
* {
    box-sizing: border-box;
}

.parametre {
    display: flex;
    justify-content: center;
}

.side {
    position: relative;
    width: fit-content;
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    background: var(--submenu);
    border-radius: 5px;
}

.changer {
    border-radius: 3px;
    color: var(--primary)
}

.profile {
    display: flex;
    gap: 20px;
    padding: 20px;
    background-color: var(--second);
    border-radius: 5px;

    .fa-user {
        font-size: 70px;
    }

}
.identifiers{
    display: flex;
    flex-direction: column;
    text-transform: capitalize;
}
.identifiers h1{
    margin: 0;
}
.themeChanger {
    background-color: var(--primary);
    color: var(--second);
    padding: 30px;
    border-radius: 5px;

    p {
        margin-top: 0;
        margin-bottom: 8px;
        text-align: center;
    }

    .colors {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        padding: 5px 0;
        .color {
            width: 90px;

            input {
                padding: 0;
                border: none;
                min-width: 90px;
                height: 40px;
            }

            ;

            label {
                display: block;
                margin: 5px;
                text-align: center;
            }
        }
    }

    .backgroundChanger {
        position: relative;
        margin: 10px 0 20px;

        .button {
            cursor: pointer;
            position: absolute;
            background-color: var(--second);
            width: 100%;
            padding: 10px;
            text-align: center;
        }
    }

    .reset {
        cursor: pointer;
        background-color: var(--red);
        width: 100%;
        padding: 10px;
        text-align: center;
        border: none;
        outline: none;
        color: var(--second);
        border-radius: 3px;
    }
}
.lubrik_title{
    display: block;
    padding: 0 0 2px;
    margin-bottom: 15px;
    width: 100%;
    border-bottom: 1px solid;
    filter: brightness(0.8);
}
.audio_wrapper{
    display: flex;
    flex-direction: column;
    /* margin: 30px 0; */
    margin-bottom: 20px;
    border-radius: 5px;
    .audio_{
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
    }
}
</style>