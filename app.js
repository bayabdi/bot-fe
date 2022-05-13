new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data() {
    return {
      categories_: []
    }
  },
  methods: {
    run() {
      alert('inner' + window.innerHeight)
      alert('avail' + screen.availHeight)
      alert('h' + screen.height)    
    }
  },
  computed: {
    categories: {
      get() {
        if (this.categories_ != undefined) return this.categories_
        return []
      },
      set (newValue) {
        this.categories_ = newValue
      }
    },
    toPay() {
      let sum = 0
      this.categories.forEach(c => {
        c.products.forEach(p => {
            sum += p.amount * p.price
        })
      })

      return sum
    },
    height() {
      return window.innerHeight
    }
  },
  created() {
    axios.get('https://api.1bot.edugid.org/category/list').then(response => {
      response.data.forEach(x => {    
        category = {
          id: x.id,
          name: x.name,
          products: []
        }
        
        x.products.forEach(p => {
          category.products.push({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            img: p.img,
            amount: 0
          })
        })      

        this.categories.push(category)
      })
    })
  }
})