<template>
    <Navbar />
    <div class="container">
        <!-- <div class="btns">
            <span class="btn retour" @click="$router.back()">&#10094;</span>
            <button :class="['btn-switch', { btn_active: selected === 'utilisateurs' }]"
                @click="setSelected('utilisateurs')">
                Utilisateurs
            </button>
            <button :class="['btn-switch', { btn_active: selected === 'groups' }]"
                @click="setSelected('groups')">Groupes
            </button>
        </div> -->
        <Users v-if="selected === 'utilisateurs'" />
        <!-- <Groups v-if="selected === 'groups'" /> -->
    </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Modal from '@/Overlays/Modal.vue';
import Users from '@/components/permissions/users.vue';
import Groups from '@/components/permissions/groups.vue';

export default {
    data() {
        return {
            initial_permissions: [],
            show_modal: false,
            show_modal_u: false,
            comfirm_password: '',
            selected: 'utilisateurs',
            microfinances: [],
        };
    },
    components: {
        Navbar,
        Modal,
        Users,
        Groups
    },
    methods: {
        setSelected(element) {
            this.selected = element;
        },
    }
}
</script>

<style></style>