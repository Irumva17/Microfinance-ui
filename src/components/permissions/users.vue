<template>
    <Modal :isVisible="show_modal_user" @close="closeModal">
        <form class="form-nini" @submit.prevent="handleSubmit">
            <span class="title">Créer Un Utilisateur</span>
            <div class="content" v-if="step == 1">
                <div class="inputRow">
                    <div class="inputColumn">
                        <label for="last_name">Nom</label>
                        <input type="text" v-model="user.last_name" id="last_name" placeholder="Nom">
                    </div>
                    <div class="inputColumn">
                        <label for="first_name">Prénom</label>
                        <input type="text" v-model="user.first_name" id="first_name" placeholder="Prénom">
                    </div>
                </div>
                
                <div class="inputRow">
                    <div class="inputColumn">
                        <label for="sexe">Sexe</label>
                        <select class="select" name="sexe" id="sexe" v-model="sex">
                            <option value="" disabled>-----</option>
                            <option value="M">Homme</option>
                            <option value="F">Femme</option>
                            <option value="NA">Non Applicable</option>
                            <option value="AUTRES">AUTRES</option>
                        </select>
                        <small v-for="err in data_error?.sex" :key="err.id">
                            {{ err }}
                        </small>
                    </div>
                    <div class="inputColumn">
                        <label for="residence">Residence</label>
                        <select class="select" name="residence" v-model="residence">
                            <option value="" disabled>-----</option>
                            <option value="RESIDENT">Resident</option>
                            <option value="NON RESIDENT">Non Residant</option>
                        </select>
                        <small v-for="err in data_error?.residence" :key="err.id">
                            {{ err }}
                        </small>
                    </div>
                </div>

                <div class="inputRow">
                    <div class="inputColumn">
                        <label for="birthDate">Date de naissance</label>
                        <input type="date" v-model="date_naissance" id="birthDate" placeholder="Date de naissance">
                        <small v-for="err in data_error?.date_naissance" :key="err.id">
                            {{ err }}
                        </small>
                    </div>
                    <div class="inputColumn">
                        <label for="birthPlaece">Lieu de naissance</label>
                        <input type="text" v-model="lieu_naissance" id="birthPlaece" placeholder="Lieu de naissance">
                        <small v-for="err in data_error?.lieu_naissance" :key="err.id">
                            {{ err }}
                        </small>
                    </div>
                </div>

                <div class="inputRow">
                    <div class="inputColumn">
                        <label for="cni">Proffession</label>
                        <input type="text" v-model="proffession" id="cni" placeholder="Proffession">
                        <small v-for="err in data_error?.proffession" :key="err.id">
                            {{ err }}
                        </small>
                    </div>
                    <div class="inputColumn">
                        <label for="activite">Activite:</label>
                        <select name="activite" v-model="activite">
                            <option value="">-------</option>
                            <option value="AGRO-ELEVEUR">Agro Eleveur</option>
                            <option value="COMMERCANT">Commercant</option>
                            <option value="SALARIE">Salarie</option>
                            <option value="INDUSTRIEL">Industriel</option>
                            <option value="SANS">Sans</option>
                            <option value="AUTRES">Autres</option>
                        </select>
                        <small v-for="err in data_error?.activite" :key="err.id">
                            {{ err }}
                        </small>
                    </div>
                </div>

                <div class="inputRow">
                    <div class="inputColumn">
                        <label for="cni">CNI</label>
                        <input type="text" v-model="CNI" id="cni" placeholder="CNI">
                        <small v-for="err in data_error?.CNI" :key="err.id">
                            {{ err }}
                        </small>
                    </div>
                    <div class="inputColumn">
                        <label for="telephone">Téléphone</label>
                        <input type="text" v-model="telephone" id="telephone" placeholder="Téléphone">
                        <small v-for="err in data_error?.telephone" :key="err.id">
                            {{ err }}
                        </small>
                    </div>
                </div>

            </div>
            <div class="content" v-if="step == 2">
                <!-- <label for="username">Nom d'utilisateur </label>
                <input type="text" v-model="user.username" id="username" placeholder="Nom d'utilisateur">
                <small v-for="err in data_error?.user?.username" :key="err.id">
                    {{ err }}
                </small> -->
                <!-- <span class="username_message">Le nom d'utilisateur sera le numero de téléphone.</span> -->

                <div class="inputRow">
                    <div class="inputColumn">
                        <label for="province">Province</label>
                        <input type="text" v-model="province" id="province" placeholder="Province">
                        <small v-for="err in data_error?.province" :key="err.id">
                            {{ err }}
                        </small>
                    </div>
                    <div class="inputColumn">
                        <label for="commune">Commune</label>
                        <input type="text" v-model="commune" id="commune" placeholder="Commune">
                        <small v-for="err in data_error?.commune" :key="err.id">
                            {{ err }}
                        </small>
                    </div>
                </div>
                <div class="inputRow">
                    <div class="inputColumn">
                        <label for="adress">Adresse</label>
                        <input type="text" v-model="adresse" id="adress" placeholder="Adresse">
                        <small v-for="err in data_error?.adresse" :key="err.id">
                            {{ err }}
                        </small>
                    </div>
                    <div class="inputColumn">
                        <label for="email">Email</label>
                        <input type="email" v-model="user.email" id="email" placeholder="Email">
                        <small v-for="err in data_error?.email" :key="err.id">
                            {{ err }}
                        </small>
                    </div>
                </div>
                
                <label for="agence">Agence</label>
                <select class="select" name="agence" v-model="agence">
                    <option value="" disabled>-----</option>
                    <option v-for="agence in agences" :key="agence.id" :value="agence.id">{{ agence.nom }}
                    </option>
                </select>
                <small v-for="err in data_error?.agence" :key="err.id">
                    {{ err }}
                </small>

                <div class="inputRow">
                    <div class="inputColumn">
                        <label for="username">Username</label>
                        <input type="email" v-model="user.username" id="username" placeholder="Nom d'utilisateur">
                        <small v-for="err in data_error?.email" :key="err.id">
                            {{ err }}
                        </small>
                    </div>
                    <div class="inputColumn">
                        <label for="password">Mot de passe</label>
                        <input type="password" v-model="user.password" id="password" placeholder="Mot de passe">
                        <small v-for="err in data_error?.user?.password" :key="err.id">
                            {{ err }}
                        </small>
                    </div>
                </div>

                <!-- 
                    <label for="confirm_password">Confirmer le mot de passe.</label>
                    <input type="password" v-model="confirm_password" id="confirm_password" placeholder="Confirmer le mot de passe"> 
                -->
                <!-- </div> <div class="content" v-if="step == 3"> -->
                <div class="inputRow">
                    <div class="inputColumn">
                        <label for="photo">Photo</label>
                        <input type="file" @change="handleFileUpload($event, 'photo')" id="photo" accept="image/*" placeholder="Document">
                        <small v-for="err in data_error?.photo" :key="err.id">
                            {{ err }}
                        </small>
                    </div>
                    <div class="inputColumn">
                        <label for="document">Document</label>
                        <input type="file" @change="handleFileUpload($event, 'document')" id="document" accept="application/pdf" placeholder="Document">
                        <small v-for="err in data_error?.compte_data?.document" :key="err.id">
                            {{ err }}
                        </small>
                    </div>
                    <div class="inputColumn">
                        <label for="document">Dossier</label>
                        <input type="file" 
                            @change="handleFileUpload($event, 'dossier')" 
                            id="dossier" accept="application/pdf" placeholder="Document"
                        >
                        <small v-for="err in data_error?.dossier" :key="err.id">
                            {{ err }}
                        </small>
                    </div>
                </div>
                
            </div>
            <div class="content" v-if="step == 3">
                <label>L'ajouter dans les groupes.</label>
                <div v-for="group in groups" :key="group.id">
                    <input type="checkbox" :id="`group-${group.id}`" :value="group.id" v-model="user_groups" />
                    <label :for="`group-${group.id}`">{{ group.name }}</label>
                </div>
            </div>
            <div class="btns">
                <div class="btn-modal" v-if="step == 1" @click="step = 2">Suivant &nbsp; &#10095;</div>
                <div class="btn-modal" v-if="step == 2" @click="step = 1">&#10094; &nbsp; Précédent</div>
                <div class="btn-modal" v-if="step == 2" @click="step = 3">Suivant &nbsp; &#10095;</div>
                <div class="btn-modal" v-if="step == 3" @click="step = 2">&#10094; &nbsp; Précédent</div>
                <!-- <div class="btn-modal" v-if="step == 3" @click="step = 3">&#10094; &nbsp; Précédent</div>
                <div class="btn-modal" v-if="step == 3" @click="step = 3">Suivant &nbsp; &#10095;</div> -->
                <button class="btn-modal" v-if="step == 3">Créer &nbsp; &#10003;</button>
            </div>
        </form>
    </Modal>
    <Modal :isVisible="user_edit" @close="closeModal">
        <div class="form" v-if="user_groups.length">
            <span class="title">Les groupes dont {{ active_username }} fait partie.</span>
            <div class="content">
                <div v-for="(user_group, index) in user_groups" :key="index" class="viewer">
                    <span>{{ index + 1 }}. {{ user_group.group.name }}</span>
                </div>
            </div>
            <button @click="toEdit" class="btn-modal">Changer</button>
        </div>
        <div class="form" v-else>
            <span class="title">Aucun group.</span>
            <button @click="toEdit" class="btn-modal">
                L'ajouter dans un/des groupes.
            </button>
        </div>
    </Modal>
    <Modal :isVisible="show_modal" @close="closeModal">
        <div class="form">
            <div class="title">Reinitialiser le mot de passe</div>
            <div class="content">
                <label for="new">Nouveau mot de passe:</label>
                <input type="text" id="new" v-model="new_password" placeholder="Nouveau mot de passe">
                <small v-for="err in data_error?.new_password" :key="err.id">
                    {{ err }}
                </small>
                <label for="comfirm">Confirmer ce mot de passe:</label>
                <input type="text" v-model="comfirmer_password" id="comfirm" placeholder="Comfirmer ce mot de passe"
                    autocomplete="''" />
                <small v-for="err in data_error?.confirm_password" :key="err.id">
                    {{ err }}
                </small>
            </div>
            <button class="btn-modal" @click="resetPassword(id)">Changer</button>
        </div>
    </Modal>
    <Modal :isVisible="edit_groups" @close="closeModal">
        <div class="form">
            <span class="title">Groupes</span>
            <div class="content">
                <div v-for="group in groups" :key="group.id" class="permission">
                    <input type="checkbox" :id="`checkbox-${group.id}`" :value="group.id"
                        :checked="user_groups.includes(group.id)" @change="toggleGroup(group.id)" />
                    <label :for="`checkbox-${group.id}`">{{ group.name }}</label>
                </div>
            </div>
            <button class="btn-modal" @click="saveModification(active_user)">
                Modifier
            </button>
        </div>
    </Modal>
    <div class="btns">
        <span class="btn retour" @click="$router.back()">&#10094;</span>
        <button class="depot btn" @click="show_modal_user = true"><i class="fa-solid fa-plus"></i> Utilisateur</button>
    </div>
    <section class="table">
        <table>
            <tr>
                <th>Id</th>
                <th>Nom et Prenom</th>
                <th>Agence</th>
                <th>Telephone</th>
                <th>Balance</th>
                <th>Options</th>
            </tr>
            <tr v-for="(user, index) in users" :key="index" @dblclick="gotoRemise(user)">
                <td>{{ user.id }}</td>
                <td>
                    <span v-if="!user.user.first_name && !user.user.last_name">{{  user.user.username }}</span>
                    <span>{{ user.user.first_name }} {{ user.user.last_name }}</span>
                </td>
                <td>{{ user.agence?.nom }}</td>
                <td>{{ user.telephone }}</td>
                <td>{{ money(user.balance) }}</td>
                <td>
                    <i class="btn fa fa-ellipsis-v" @click="toggleOptions(user.id)"></i>
                    <div v-if="selected_user === user.id" :class="`menu_options ${ getPosition(index)}`" @mouseleave="toggleOptions(user.id)">
                        <!-- <button class="btn" @click="viewGroups(user.user)">
                            <i class="fa-solid fa-users"></i> &nbsp;
                            Voir ces groupes
                        </button> -->
                        <button class="btn" @click="goToHistory(user)">
                            <i class="fa-solid fa-clock-rotate-left"></i> &nbsp;
                            Historique
                        </button>
                        <button class="btn" @click="gotoRemise(user)">
                            <i class="fa-solid fa-hand-holding-dollar"></i> &nbsp;
                            Remise/Reprise
                        </button>
                        <button class="btn delete" @click="id = user.id, show_modal = true" title="Réinitialiser son mot de passe."> 
                            <i class="fa-solid fa-key"></i> &nbsp;
                            Mot de passe
                        </button>
                        <!-- <button class="btn delete" @click=" deleteUser(getFullName(user.user), user.id)">
                            <i class="fa-solid fa-trash"></i> Supprimer
                        </button> -->
                        <div class="menu_arrow">‣</div>
                    </div>
                </td>
            </tr>
        </table>
    </section>
</template>

<script>
import Modal from '@/Overlays/Modal.vue';
import store from '@/store';

export default {
    data() {
        return {
            is_loading: false,
            users: [],

            selected_user_id: null,
            last_name: '',
            first_name: '',
            email: '',
            username: '',
            user_groups: [],
            password: '',
            show_modal_user: false,
            user_groups_ids: [],
            confirm_password: '',
            user: {
                username: '',
                password: '',
                email: '',
                first_name: '',
                last_name: ''
            },
            document: null,
            proffession: '',
            residence: '',
            date_naissance: '',
            lieu_naissance: '',
            activite: '',
            file_name: '',
            adresse: '',
            telephone: '',
            commune: '',
            province: '',
            CNI: '',
            sex: '',
            dossier: null,
            agence: null,
            photo: '',
            agences: store.state.agences,
            groups: store.state.groups,
            show_password: false,
            selected: '',
            step: 1,
            user_edit: false,
            edit_groups: false,
            ready: false,

            active_username: '',
            active_user: [],

            error_message: '',
            success_message: '',
            data_error: [],
            groups: [],
            id: '',
            new_password: '',
            comfirmer_password: '',
            show_modal: false,
            selected_user: null,
            isAbove: false,
        }
    },
    components: {
        Modal
    },
    methods: {
        toggleOptions(id) {
            this.selected_user = this.selected_user === id ? null : id;
        },
        getPosition(index) {
            if(this.users.length > 10 ) {
                return index >= this.users.length - 4 ? 'above' : ''
            } else {
                return ''
            }
        },
        resetPassword(id) {
            const data = new FormData()
            data.append('new_password', this.new_password)
            data.append('confirm_password', this.comfirmer_password)
            axios.post(`personnels/${id}/reset_password/`, data)
                .then(() => {
                    this.$store.state.message.success = 'Mot de passe réinitialisé avec succès.'
                    this.closeModal()
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, () => this.resetPassword(id))
                    this.data_error = error?.response?.data
                })
        },
        async handleSubmit() {
            if (this.selected_user_id) {
                await this.updateUser();
            } else {
                await this.createUser();
            }
        },
        async getUsers(page_number = 1, all_users = []) {
            try {
                const response = await axios.get(`personnels/?page=${page_number}`)
                const data = response.data;
                all_users = all_users.concat(data.results);
                if (data.next) {
                    await this.getUsers(page_number + 1, all_users);
                } else {
                    this.users = all_users;
                    store.state.users = this.users
                }
            } catch (error) {
                this.displayErrorOrRefreshToken(error, this.getUsers)
            }
        },
        toEdit() {
            this.user_edit = false,
            this.edit_groups = true,
            this.user_groups = this.user_groups.map(group => group.group.id);
        },
        viewGroups(user) {
            this.user_edit = true;
            this.active_username = user.username;
            this.user_groups = this.groups.filter(group => {
                return user.groups.some(gp => gp === group.id);
            });
            this.active_user = user
        },
        toggleGroup(groupId) {
            const index = this.user_groups.indexOf(groupId);
            if (index === -1) {
                this.user_groups.push(groupId);
            } else {
                this.user_groups.splice(index, 1);
            }
        },
        closeModal() {
            this.show_modal_user = false;
            this.user = {
                username: '',
                password: '',
                email: '',
                first_name: '',
                last_name: ''
            };
            this.telephone = '';
            this.CNI = '';
            this.agence = null;
            this.document = null;
            this.step = 1;
            this.user_edit = false;
            this.user_groups = [];
            this.edit_groups = false;
            this.selected_user_id = null;
            this.ready = false,
            this.password = '',
            this.show_modal = false,
            this.new_password = '',
            this.comfirmer_password = ''
        },
        async deleteUser(name, id) {
            const confirmation = confirm(`Vous voulez vraiment supprimer l'utilisateur ${name}`)
            if (confirmation) {
                try {
                    await axios.delete(`personnels/${id}/`);
                    store.state.message.success = 'Supprimé avec succès.'
                    store.state.users = store.state.users.filter(user => user.id != id);
                    this.users = this.users.filter(user => user.id != id);
                    store.state.is_loading = false
                } catch (error) {
                    this.displayErrorOrRefreshToken(error, this.deleteUser)
                }
            }
            else {
            }
        },
        getFullName(user) {
            if (user.first_name && user.last_name) {
                return `${user.last_name} ${user.first_name} `;
            } else if (user.first_name) {
                return user.first_name;
            } else if (user.last_name) {
                return user.last_name;
            } else {
                return user.username
            }
        },
        async createUser() {
            this.data_error = []
            const formData = new FormData();
            formData.append('CNI', this.CNI);
            formData.append('telephone', this.telephone);
            formData.append('agence', this.agence);
            formData.append('dossier', this.document);

            formData.append('user.username', this.user.username);
            formData.append('user.password', this.user.password);
            formData.append('user.email', this.user.email);
            formData.append('user.first_name', this.user.first_name);
            formData.append('user.last_name', this.user.last_name);
            this.user_groups.forEach(groupId => {
                formData.append('user.groups', groupId);
            });
            formData.append('personne_physique.date_naissance', this.date_naissance)
            formData.append('personne_physique.lieu_naissance', this.lieu_naissance)
            formData.append('personne_physique.profession', this.proffession)
            formData.append('personne_physique.sexe', this.sex)
            formData.append('personne_physique.activite', this.activite)
            formData.append('personne_physique.residence', this.residence)

            formData.append('compte_data.adresse', this.adresse)
            formData.append('compte_data.commune', this.commune)
            formData.append('compte_data.document', this.document)
            formData.append('compte_data.photo', this.photo)
            formData.append('compte_data.organisation', 'individu')

            try {
                const response = await axios.post('personnels/', formData);
                this.closeModal();
                store.state.users.unshift(response.data)
                this.$store.state.message.success = `Utilisateurs ${this.user.username} a été créé avec succés.`
            } catch (error) {
                this.displayErrorOrRefreshToken(error, this.createUser)
                this.data_error = error.response?.data
                this.step = 1
            }
        },
        async getAgences(of = 1, agencies = []) {
            await axios.get(`agences/?page=${of}`)
                .then((response) => {
                    const data = response.data
                    if (data.next) {
                        agencies = agencies.concat(data.results)
                        this.getAgences(of + 1, agencies)
                    } else {
                        this.agences = agencies.concat(data.results)
                        store.state.agences = this.agences
                    }
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, this.getAgences)
                })
        },
        saveModification(user) {
            const data = new FormData();
            data.append('username', user.username);
            data.append('email', user.email);
            data.append('first_name', user.first_name);
            data.append('last_name', user.last_name);
            this.user_groups.forEach(groupId => {
                data.append('groups', groupId);
            })
            axios.put(`users/${user.id}/`, data)
                .then((response) => {
                    this.users = this.users.map((local_user) =>
                        local_user.user.id === user.id
                            ? { ...local_user, user: { ...local_user.user, ...response.data } }
                            : local_user
                    )
                    this.$store.state.message.success = 'Modification effectuée avec succès.';
                    this.closeModal()
                }).catch((error) => {
                    this.displayErrorOrRefreshToken(error, () => this.saveModification(user))
                })
        },
        gotoRemise(user) {
            store.state.compte_active = user
            this.$router.push({
                name: 'Remise personnels',
                query: { 'compte': user.user.id, 'username': user.user.username }
            });
        },
        goToHistory(user) {
            store.state.triger = 'personnel'
            store.state.compte_active = user
            this.$router.push({ name: 'HistoriqueClient' })
        },
        async getGroups(page_nmber = 1, all_groups = []) {
            try {
                const response = await axios.get(`groups/?page=${page_nmber}`);
                const data = response.data;
                all_groups = all_groups.concat(data.results);

                if (data.next) {
                    await this.getGroups(page_nmber + 1, all_groups);
                } else {
                    this.groups = all_groups;
                    store.state.groups = this.groups;
                }
            } catch (error) {
                this.displayErrorOrRefreshToken(error, this.getGroups)
            }
        }
    },
    mounted() {
        this.users = store.state.users?.length ? store.state.users : this.getUsers();
        this.agences = store.state.agences?.length ? store.state.agences : this.getAgences();
        this.groups = store.state.groups?.length ? store.state.groups : this.getGroups();
    }
}
</script>

<style>
td:has(.menu_options) {
    position: relative;
}

.menu_options {
    position: absolute;
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-radius: 5px;
    background-color: var(--primary);
    left: -10px;
    transform: translateX(-100%) translateY(0);
    gap: 5px;
    top: 0;
    animation: animate_menu .2s ease-in-out;
}

.username_message{
    display: block;
    text-align: center;
    padding: 7px;
    border-radius: 5px;
    background-color: var(--third);
}

.menu_options .btn {
    border: 1px solid var(--second);
}

.menu_options button {
    min-width: 155px;
}

.menu_options.above {
    top: unset;
    bottom: 10px;
}

.menu_arrow {
    font-size: 35px;
    position: absolute;
    left: 98%;
    top: -5px;
}

.menu_options.above .menu_arrow {
    top: unset;
    bottom: -10px
}

@keyframes animate_menu {
    100% {
        transform: translateX(-100%) translateY(-5px);
    }
}

</style>