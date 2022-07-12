export const state = () => ({
    products: [],
})

//mutations
export const mutations = {
    setProducts(state, products) {
        state.products = products

        console.log($nuxtSocket)
    }
}





