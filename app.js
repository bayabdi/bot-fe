new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data() {
    return {
      categories_: [],
      isOrder_: false,
      comment: "",
      snackBar: false,
      orders: [],
    }
  },
  methods: {
    orderAdd() {
      sendData = {
        user_id: "string",
        products: [],
        comment: this.comment,
        sum: 0,
      }
      this.categories.forEach((category) => {
        category.products.forEach((product) => {
          if (product.amount > 0) {
            sendData.products.push({
              product_id: product.id,
              amount: product.amount,
            })
          }
        })
      })

      console.log(sendData)

      axios.post("https://api.1bot.edugid.org/order/add", sendData).then(() => {
        this.snackBar = true
      })
    }
  },
  computed: {
    categories: {
      get() {
        if (this.categories_ != undefined) return this.categories_
        return []
      },
      set(newValue) {
        this.categories_ = newValue
      },
    },
    toPay() {
      let sum = 0
      this.categories.forEach((c) => {
        c.products.forEach((p) => {
          sum += p.amount * p.price
        })
      })

      return sum
    },
    isOrder: {
      get() {
        return this.isOrder_
      },
      set(val) {
        this.isOrder_ = val
      },
    },
  },
  created() {
    axios.get("https://api.1bot.edugid.org/category/list").then((response) => {
      response.data.forEach((x) => {
        category = {
          id: x.id,
          name: x.name,
          products: [],
        }

        x.products.forEach((p) => {
          category.products.push({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            img: p.img,
            amount: 0,
          })
        })

        this.categories.push(category)
      })
    })
  },
})
