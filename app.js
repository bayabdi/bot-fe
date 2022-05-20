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
      orders: [],
      user_id: 0,
      chat_id: 0,
      telegram: window.Telegram.WebApp
    }
  },
  methods: {
    orderAdd() {
      sendData = {
        user_id: "string",
        products: [],
        comment: this.comment,
        sum: 0,
        user_id: this.user_id,
        chat_id: this.chat_id
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

      axios.post("https://api.1bot.edugid.org/order/add", sendData).then((data) => {
        this.snackBar = true
        axios.post("https://api.telegram.org/5310334974:AAEzCchxDhtm-7HYnvjdzx6umzSkptGdQM8/answerWebAppQuery", {
          web_app_query_id: this.telegram.initDataUnsafe.query_id,
          result: {
            type: 'article',
            id: data.data,
            title: 'Заказ',
            input_message_content: {
              message_text: 'Заказбек'
            }
          }
        }).then(data => {
          console.log(data)
        }).catch(error => {
          console.log(error)
          alert(error)
        })
      }).catch(err => {
        this.isError = false
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
    }
  },
  created() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    this.user_id = urlParams.get('user_id')
    this.chat_id = urlParams.get("chat_id")

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
