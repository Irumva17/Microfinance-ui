<template>
    <Modal :isVisible="show_persmissions" @close="closeModal">
        <div v-if="selected_group_permissions.length">
            <span v-for="permission in selected_group_permissions" :key="permission.id">
                <input type="checkbox" style="width: fit-content;" disabled checked>
                {{ permission.name }}
            </span>
            <button class="btn-modal" style="margin-top: 10px;">Les modifer</button>
        </div>
        <span v-else>Aucun permission</span>
    </Modal>
    <Modal :isVisible="show_modal" @close="closeModal">
        <div class="form-nini">
            <span class="title">{{ action === 'edit' ? 'Modifier le groupe' : 'Ajouter le groupe' }}</span>
            <label>Nom du groupe</label>
            <input type="text" v-model="group_name" class="gName" placeholder="Nom du group">
            <div class="row">
                <div class="searchbox">
                    <input class="input-search for_grps" type="text" v-model="keyword" id="key"
                        placeholder="Rechercher une permission ici">
                    <span class="btn-search">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </span>
                </div>
                <div class="searchbox">
                    <input class="input-search for_grps" type="text" v-model="keyword_attributed" id="key"
                        placeholder="Rechercher une permission ici">
                    <span class="btn-search">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </span>
                </div>
            </div>
            <div class="row-permission">
                <div class="column-permission">
                    <div v-for="permission in searched_permission" :key="permission.id" class="">
                        <input type="checkbox" :id="`checkbox-${permission.id}`" v-model="permission.checked"
                            @change="moveToAttributed(permission)" />
                        <label :for="`checkbox-${permission.id}`">{{ permission.name }}</label>
                    </div>
                </div>
                <div class="column-permission" v-if="selected_group_permissions.length">
                    <label v-for="permission in working_permissions" :key="permission.id">
                        <input type="checkbox" checked @change="moveToPermissions(permission)">
                        {{ permission.name }}
                    </label>
                </div>
            </div>
            <div class="row">
                <span class="btn-modal select_all" @click="checkAll(searched_permission)">Tout choisir &emsp; &#10095;</span>
                <span class="btn-modal select_all" @click="checkAllAttributed(working_permissions)">&#10094; &emsp; Enlever tout</span>
            </div>
            <button v-if="action == 'edit'" class="btn-modal" @click="savePermissions(selected_group_id)">
                <i class="fa-solid fa-floppy-disk"></i>
                Enregistrer les Modification
            </button>
            <button v-else class="btn-modal" @click="creerUnGroup">Créer</button>
        </div>
    </Modal>
    <button class="depot btn" @click="checkAction('create')"><i class="fa-solid fa-plus"></i> Groupe </button>
    <section class="table">
        <table>
            <tr>
                <th>Nom</th>
                <th>Option</th>
            </tr>
            <tr v-for="group in groups" :key="group.id">
                <td>{{ group.group.name }}</td>
                <td>
                    <div class="btns">
                        <button class="btn"
                            @click="checkAction('edit'), groupClickHandler(group.group.permissions, group.id, group.group.name)">
                            <i class="fa-solid fa-pencil"></i>
                        </button>
                    </div>
                </td>
            </tr>
        </table>
    </section>
</template>

<script>
import Modal from '@/Overlays/Modal.vue';
import SearchComponent from "@/components/SearchComponent.vue";

export default {
    data() {
        return {
            groups: [],
            permissions: [],
            selected_group_id: null,
            group_name: '',
            address: '',
            details: '',
            show_modal: false,
            show_modal_edit: false,
            show_persmissions: false,
            show_groups: false,
            selected_group_permissions: [],
            selected_permissions_of_group: [],
            selected: '',
            new_group_permissions: [],
            initial_permissions : [],
            data_error: {},
            keyword: '',
            keyword_attributed: '',
            action : '',
            can_edit : true
        }
    },
    computed: {
        working_permissions(){
            return this.selected_group_permissions.filter(permission =>
                permission.name.toLowerCase().includes(this.keyword_attributed.toLowerCase())
            );
        },
        searched_permission() {
            return this.permissions.filter(permission =>
                permission.name.toLowerCase().includes(this.keyword.toLowerCase())
            );
        }
    },
    components: {
        Modal, SearchComponent
    },
    methods: {
        checkAction(action){
            if(!this.can_edit){
                this.$store.state.message.error = 'Vous n\'avez peut pas assez des permissions.'
                return
            }
            this.show_modal = true
            this.action = action
            action === 'create' && (
                this.selected_group_permissions = [], 
                this.selected_permissions_of_group = [],
                this.group_name = ''
            )
        },
        async getGroups(page_nmber = 1, all_groups = []) {
            try {
                const response = await axios.get(`groupmicrofinance/?page=${page_nmber}`);
                const data = response.data;
                all_groups = all_groups.concat(data.results);
                if (data.next) {
                    await this.getGroups(page_nmber + 1, all_groups);
                } else {
                    this.groups = all_groups;
                    this.$store.state.groups = this.groups;
                }
            } catch (error) {
                this.displayErrorOrRefreshToken(error, this.getGroups)
            }
        },
        viewPermissions(permissions) {
            this.show_persmissions = true
            this.selected_group_permissions = permissions
        },
        groupClickHandler(permissions, groupId, name) {
            this.selected_group_permissions = permissions;
            this.selected_permissions_of_group = permissions
            this.selected_group_id = groupId;
            this.group_name = name;
            this.show_modal_edit = true
            this.permissions = this.permissions.filter(p => 
                !permissions.some(perm => perm.id === p.id)
            );
        },
        async deleteGroup(name, id) {
            const confirmation = confirm(`Vous voulez vraiment supprimer le group ${name}?`);
            if (confirmation) {
                try {
                    await axios.delete(`groupmicrofinance/${id}/`);
                    this.$store.state.message.success = `Le groupe ${name} a été supprimé avec succès.`
                    this.groups = this.groups.filter(group => group.id !== id);
                    this.$store.state.groups = this.$store.state.groups.filter(group => group.id !== id);
                } catch (error) {
                    this.displayErrorOrRefreshToken(error, () => this.deleteGroup(name, id))
                    this.$store.state.message.error = this.data_error?.status
                } finally {
                }
            } else {
            }
        },
        closeModal() {
            this.show_modal = false;
            this.show_modal_edit = false;
            this.show_persmissions = false;
            this.show_groups = false;this.group_name = '';
            this.selected_group_permissions = [];
            this.selected_group_id = null;
            this.data_error = {},
            this.permissions = this.$store.state.permissions
            this.keyword = ''
            this.keyword_attributed = ''
            this.selected_group_permissions = this.selected_permissions_of_group 
        },
        moveToAttributed(permission) {
            this.permissions = this.permissions.filter(
                p => p.id !== permission.id
            );
            this.selected_group_permissions.unshift(permission);
        },
        moveToPermissions(permission) {
            this.selected_group_permissions = this.selected_group_permissions.filter(
                p => p.id !== permission.id
            );
            this.permissions.unshift({ ...permission, checked: false });
        },
        checkAll(permissions){
            permissions.forEach(element => {
                this.moveToAttributed(element)
            });
        },
        checkAllAttributed(permissions){
            permissions.forEach(element => {
                this.moveToPermissions(element)
            });
        },
        async savePermissions(groupId) {
            if(this.group_name == ''){
                this.$store.state.message.error = 'Le nom du groupe ne peut ëtre vide.'
                return
            }

            const updated_permissions = this.working_permissions.map(permission => permission.id);
            const data = {
                name: this.group_name,
                permissions: updated_permissions
            };

            try {
                const response = await axios.put(`groupmicrofinance/${groupId}/`, data);
                this.$store.state.message.success = 'Modification effectuée avec succès.';
                this.closeModal();
                this.$store.state.groups = this.$store.state.groups.map(group =>
                    group.id === groupId ? { ...group, ...response.data } : group
                );
                this.groups = this.groups.map(group =>
                    group.id === groupId ? { ...group, ...response.data } : group
                );
            } catch (error) {
                this.displayErrorOrRefreshToken(error, () => this.savePermissions(groupId));
                this.data_error = error.response?.data
                this.$store.state.message.error = this.data_error?.status
                this.$store.state.groups = this.$store.state.groups.map(group =>
                    group.id === groupId ? { ...group, ...this.selected_group_permissions } : group
                );
                this.groups = this.groups.map(group =>
                    group.id === groupId ? { ...group, ...this.selected_group_permissions } : group
                );
            }
        },
        async getPermissions(page_number = 1, all_permissions = []) {
            try {
                const response = await axios.get(`permissions/?page=${page_number}`);
                const data = response.data;
                all_permissions = all_permissions.concat(data.results);
                if (data.next) {
                    await this.getPermissions(page_number + 1, all_permissions);
                } else {
                    if(!all_permissions.length){
                        this.can_edit = false
                    }
                    this.permissions = all_permissions;
                    this.$store.state.permissions = this.permissions
                    this.initial_permissions = JSON.stringify(all_permissions)
                }
            } catch (error) {
                this.displayErrorOrRefreshToken(error, () => this.getPermissions)
            }
        },
        async creerUnGroup() {
            if(this.group_name == ''){
                this.$store.state.message.error = 'Le nom du groupe ne peut ëtre vide.'
                return
            }
            const data = {
                group: {
                    name: this.group_name,
                    permissions: this.selected_group_permissions.map(permission => permission.id)
                }
            };
            try {
                const response = await axios.post('groupmicrofinance/', data);
                this.closeModal();
                this.$store.state.message.success = 'Création du groupe avec succèss!';
                this.$store.state.groups.unshift(response.data)
            } catch (error) {
                this.displayErrorOrRefreshToken(error, this.creerUnGroup)
                this.data_error = error.response?.data
            }
        },
    },
    mounted() {
        this.permissions = this.$store.state.permissions?.length ? this.$store.state.permissions : this.getPermissions();
        this.groups = this.$store.state.groups?.length ? this.$store.state.groups : this.getGroups();
    }
}
</script>

<style>
.for_grps{
    width: 209px;
}
.got_permissions {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
}
.select_all{
    font-size: 13px;
}

.row-permission {
    overflow-y: auto;
    padding: 0 0 10px 0;
    display: flex;
    flex: 1;
    gap: 3px;
}

.column-permission {
    overflow-y: auto;
    padding: 0 0 10px 0;
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 3px;
}

.btn:has(.fa-floppy-disk) {
    margin-top: 5px;
    align-self: center;
    padding: 10px;
}
</style>