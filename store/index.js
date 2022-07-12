const axios = require('axios')

axios.get('http://localhost:3000/api/data')
  .then((response) => {
    console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);
  });
    

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





