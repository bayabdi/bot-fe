new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data () {
    return {
      user_id: 0,
      order_id: null,
      order_: null
    }
  },
  computed: {
    order: {
      get() {
        return this.order_
      },
      set(val) {
        this.order_ = val
      }
    }
  },
  methods: {
    getUserId() {
      const queryString = window.location.search
      const urlParams = new URLSearchParams(queryString)
      return urlParams.get("user_id")
    },
    apply() {
      axios
        .post(
          "https://api.1bot.edugid.org/order/external?id=" + this.order_id + "&user_id=" + this.user_id
        )
        .then((response) => {
          axios.get(
            "https://api.1bot.edugid.org/order/get?id=" + this.order_id
          ).then(res => {
            this.order = res.data
            console.log(this.order)
          })
        })
    }
  }
})