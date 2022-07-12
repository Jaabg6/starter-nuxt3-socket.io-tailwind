<template>
  <div>
    <Navbar />
    <h1>Client: {{ this.statusClient }} server: {{ this.statusServer}}</h1>
    <h1>VUEX {{ vx.products }}</h1>
  </div>

</template>

<script>
import Navbar from "../components/Navbar/Navbar.vue";
export default {
    name: "IndexPage",
    data() {
        return {
            statusClient: "Connecting...",
            statusServer: "Connecting...",
            products: ["potato", "carrot", "tomato"],
            store: this.$store,
            vx: this.$store.state,
        };
    },
    mounted() {
        this.socket = this.$nuxtSocket({
            name: "main", // select "main" socket from nuxt.config.js - we could also skip this because "main" is the default socket
        });

        this.store.commit('setProducts', (this.products));


        this.socket.on("connect", () => {
            this.statusClient = "Connected";
            this.socket.on("statusServerConnect", (data) => {
                this.statusServer = data;
            });
        });
    },
    components: { Navbar }
}
</script>