new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data() {
    return {
      products_: []
    }
  },
  computed: {
    products: {
      get() {
        if (this.products_ != undefined) return this.products_
        return []
      },
      set (newValue) {
        this.products_ = newValue
      }
    }
  },
  created() {
    axios.get('https://api.1bot.edugid.org/product/list').then(response => {
      response.data.forEach(x => {
        this.products.push({
          id: x.id,
          amount: 0,
          img: x.img,
          name: x.name,
          description: x.description
        })
      });
    })
  }
})