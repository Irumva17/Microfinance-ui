<template>
    <div class="createAccount">
    <span class="btn"><i class="fa-solid fa-plus"></i> &nbsp; Creer</span>
    <div class="links">
        <div class="submenuLink l" @click="$emit('createAccount', 'physique')">
            <span>&#9656;</span>
            Compte personnel
        </div>
        <div class="submenuLink l"  @click="$emit('createAccount', 'morale')">
            <span>&#9656;</span>
            Compte d'une organisation
        </div>
    </div>
</div>

</template>

<script>

export default{

}
</script>

<style scoped>
.createAccount {
    position: relative;
    width: fit-content;
}

.visible {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 90;
}

.links {
    position: absolute;
    display: flex;
    flex-direction: column;
    z-index: 80;
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out; 
    transform: translateY(-10px); 
    opacity: 0; 
    box-sizing: border-box;
    top: 100%; 
    left: 0; 
    pointer-events: none; 
    width: 250px;

    padding: 5px;
    background-color: var(--primary);
    border-radius: 5px;
    border: 1px solid var(--second);
    box-shadow: 2px 4px 12px var(--primary);
}

.submenuLink {
    cursor: pointer;
    padding: 7px 15px;
    background: var(--primary);
    color: var(--second);
    border: 0;
    text-decoration: none;
    font-weight: 400;
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
    border-radius: 3px;
}

.submenuLink.l span {
    position: relative;
    left: -5px;
    opacity: 0;
    transition: left 0.2s ease-in-out, opacity 0.2s ease-in-out;
}

.submenuLink.l:hover {
    background-color: var(--second);
    color: var(--primary);
}

.submenuLink.l:hover span {
    left: 0;
    opacity: 1;
    color: var(--primary);
}

.createAccount:hover .links {
    transform: translateY(0); 
    opacity: 1; 
    pointer-events: auto;
}

</style>