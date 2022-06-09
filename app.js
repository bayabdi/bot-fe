new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data() {
    return {
      categories_: [],
      isOrder_: false,
      comment: "",
      snackBar: false,
      isError: false,
      isEmptyBranch: false,
      orders: [],
      user_id: 0,
      category_id: 0,
      chat_id: 0,
      telegram: window.Telegram.WebApp,
      isLoading: true,
      products_: [],
      branches: [],
      branch_id: 0
    }
  },
  methods: {
    orderAdd() {
      if (this.branch_id === 0){
        this.isEmptyBranch = true
        return
      }
      sendData = {
        products: [],
        comment: this.comment,
        sum: 0,
        user_id: this.user_id,
        chat_id: this.chat_id,
        branch_id: this.branch_id,
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

      axios.post("https://api.1bot.edugid.org/order/add", sendData).then((data) => {
        this.snackBar = true
        axios.post("https://api.telegram.org/bot5310334974:AAEzCchxDhtm-7HYnvjdzx6umzSkptGdQM8/answerWebAppQuery", {
          web_app_query_id: this.telegram.initDataUnsafe.query_id,
          result: {
            type: 'article',
            id: data.data,
            title: 'Заказ',
            input_message_content: {
              message_text: 'Заказ #' + data.data
            }
          }
        })
      }).catch(err => {
        this.isError = true
        console.log(err)
      })
    },
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
    products: {
      get() {
        return this.products_
      },
      set(val) {
        this.products_ = val
      }
    }
  },
  watch: {
    category_id(nv, ov) {
      this.categories.forEach(x => {
        if (this.category_id === x.id) {
          this.products = x.products
        }
      })
    }
  },
  created() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    this.user_id = urlParams.get('user_id')
    this.chat_id = urlParams.get("chat_id")

    console.log(this.telegram.colorScheme)

    axios.get("https://api.1bot.edugid.org/category/list").then((response) => {
      if(response.data.length > 0)
        this.category_id = response.data[0].id
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
    axios.get("https://api.1bot.edugid.org/branch/list").then((response) => {
      this.branches = response.data
    })
  },
  mounted () {
    setTimeout(() => {
      this.isLoading = false
    }, 1500)
  }
})
