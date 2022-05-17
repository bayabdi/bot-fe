new Vue({
  el: "#admin",
  vuetify: new Vuetify(),
  data() {
    return {
      orders_: [],
      page: 1,
      pageSize: 12
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
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll)
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll)
  },
  methods: {
    getOrders() {
      axios
        .get(
          "https://api.1bot.edugid.org/order/list?page=" +
            this.page +
            "&pageSize=" +
            this.pageSize
            + "&isDone=False&isPaid=False"
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
    }
  },
  created() {
    this.getOrders()
  },
})
