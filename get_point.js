new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data () {
    return {
      user_id: 0,
      order_id: null,
      order_: null,
      success: false,
      err: false,
      telegram: window.Telegram.WebApp
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
          "https://api.1bot.edugid.org/order/external?id=" + this.order_id + "&user_id=" + this.getUserId()
        )
        .then((response) => {
          axios.get(
            "https://api.1bot.edugid.org/order/get?id=" + this.order_id
          ).then(res => {
            this.order = res.data
            
            const br = String.fromCharCode(10)
            let text = '<b>Заказ:</b> ' + br + br
            res.data.products.forEach(x => {
                text += '<b>' + x.name + '</b>' + ' x ' + x.amount + ' = ' + x.sum + 'c'  + br
            });
            text += br + '<b>Общая сумма:</b> ' + res.data.sum + 'c'

            axios.post("https://api.telegram.org/bot5348269975:AAEy0BGl5BDk14kWvREa03gNvkFc5379_l4/sendMessage", {
              'chat_id': this.getUserId(),
              'text': text,
              'parse_mode': 'HTML'
            }).then(res => {
              this.success = true
              this.telegram.close()
            })
          })
        }).catch(err => {
          console.log(err);
          this.err = true
        })
    }
  }
})