<template>
    <div class="image-container d-flex justify-content-end align-items-start"
        :class="showLoading && loading ? 'd-block' : 'd-none'">
        <button @click="hide">Hide</button>
    </div>
</template>
<script>
export default {
    name: 'loading-modal',
    data: () => ({
        loading: true
    }),
    props: {
        showLoading: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        hide() {
            this.loading = false;
        }
    }

}
</script>
<style scoped>
.image-container {
    z-index: 100;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: no-repeat center url("../assets/spinner.gif");
    background-color: #f1f2f3;
}
</style>