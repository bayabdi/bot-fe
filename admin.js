new Vue({
  el: "#admin",
  vuetify: new Vuetify(),
  data() {
    return {
      orders_: [],
      page: 1,
      pageSize: 12,
      isDone_: false,
      id: null,
      order: null,
      isLoading: true
    }
  },
  computed: {
    orders: {
      get() {
        return this.orders_
      },
      set(val) {
        this.orders_ = val
      },
    },
    isDone: {
      get() {
        return this.isDone_
      },
      set(val) {
        this.isDone_ = val
      },
    }
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll)
        setTimeout(() => {
          this.isLoading = false
        }, 1500)
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll)
  },
  methods: {
    getOrders(toClear = false) {
      if (toClear) {
        this.orders = []
        this.page = 1
      }

      axios
        .get(
          "https://api.1bot.edugid.org/order/list?page=" +
            this.page +
            "&pageSize=" +
            this.pageSize +
            "&isDone=" +
            this.isDone +
            "&isPaid=False" +
            "&branch_id=1"
        )
        .then((response) => {
          response.data.list.forEach((x) => {
            this.orders.push(x)
          })
          this.page++
        })
    },
    onScroll(e) {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        this.getOrders()
      }
    },
    done(id) {
      axios
        .post(
          "https://api.1bot.edugid.org/order/done?id=" + id
        )
        .then((response) => {
          this.isDone = true
          this.getOrders(true)
        })
    },
    getOrder() {
      axios.get("https://api.1bot.edugid.org/order/get?id=" + this.id)
      .then(res => {
        this.order = res.data
        console.log(this.order)
      })
    }
  },
  created() {
    
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    this.id = urlParams.get("id")
    
    console.log(this.id)

    if (this.id === null)
      this.getOrders()
    else
      this.getOrder()
  }
})
