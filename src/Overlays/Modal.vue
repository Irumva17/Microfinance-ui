<template>
    <div v-if="isVisible" class="modal-overlay">
        <div class="modal-content">
            <span class="modal-close" @click="close">&times;</span>
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isVisible: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        close() {
            this.$emit('close');
        }
    }
}
</script>

<style>
.modal-overlay {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.5);
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    min-width: 320px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 1000;
}

.modal-content {
    position: relative;
    box-sizing: border-box;
    max-height: 80%;
    overflow: hidden;
    display: flex;
}

.modal-close {
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;
    border-radius: 5px;
    color: var(--primary);
    font-size: 25px;
    padding: 0 8px;

    &:hover {
        background: var(--red);
        color: var(--second);
    }
}

.content {
    overflow-y: auto;
    padding: 0 0 10px 0;
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 3px;
}

.title {
    font-size: 20px;
}

.btn-modal {
    padding: 8px 10px;
    background-color: var(--primary);
    color: var(--second);
    border-radius: 5px;
    border: 0;
    cursor: pointer;
    width: 100%;
    text-align: center;
    min-width: 120px;
    text-transform: capitalize;
}
.btn-modal:not(:disabled):hover {
    background-color: var(--primary);
    opacity: 0.9;
}

.btn-modal:disabled {
    opacity: 0.9;
    cursor: not-allowed;
}

.form,
.form-nini {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: var(--second);
    box-sizing: border-box;
    padding: 20px;
    width: 320px;
    border-radius: 5px;
}
.form-nini {
    width: 550px;
    box-shadow: 4px 8px 24px rgba(0, 0, 0, 0.2);
}
input,
select {
    padding: 6px;
    border-radius: 5px;
    outline: none;
    background: var(--second);
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--primary);
}
.select-amortissement {
  width: 200px;
}
.inputRow {
    display: flex;
    align-items: center;
    gap: 10px;
}

.inputColumn {
    flex: 1;
}

.permission {
    display: flex;
    gap: 5px;
    padding: 4px 0;
    min-width: 250px;
}

input[type="checkbox"] {
    min-width: 20px;
    margin: 0;
    padding: 5px;
    max-height: 20px;
}

.found {
    display: flex;
    align-items: center;
    gap: 5px;
}
</style>