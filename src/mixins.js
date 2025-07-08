export default {
  data() {
    return {
      time_out: null,
    };
  },
  watch: {
    "$store.state.compte_active": {
      deep: true,
      handler(new_val) {
        localStorage.setItem("compte_active", JSON.stringify(new_val));
      },
    },
    "$store.state.message": {
      deep: true,
      handler() {
        if (this.time_out) clearTimeout(this.time_out);
        this.time_out = setTimeout(
          () => this.$store.commit("clearMessage"),
          5000
        );
      },
    },
    "$store.state.user": {
      deep: true,
      handler(new_val) {
        localStorage.setItem("_mic_user", JSON.stringify(new_val));
      },
    },
  },
  methods: {
    getItemName(item) {
      if (!item?.last_name && !item?.first_name) return item?.username;
      return `${item?.last_name} ${item?.first_name}`;
    },
    checkNum() {
      if (this.telephone.length > 16) {
        this.$store.state.message.error = "Le téléphone ne doit pas deppasser 16 caractères.";
        // this.current_slide = 1;
        return false;
      } else return true
    },
    add_account(account, search_for) {
      search_for === "compte"
        ? (this.compte = account)
        : (this.got_bank_account = account);
    },
    handleFileUpload(event, type) {
      if (event.target.files[0].name.length >= 100) {
        this.$store.state.message.error =
          "Les caractères du nom de ce fichier doivent être inférieurs à 100.";
        event.target.value = "";
        type === "document" ? (this.document = null) : (this.photo = null);
        return;
      }
      if(type === "document"){
        this.document = event.target.files[0]
      } else if(type === "dossier") {
        this.dossier = event.target.files[0]
      } else {
        this.photo = event.target.files[0]
      }
      // type === "document"
        // ? (this.document = event.target.files[0])
        // : (this.photo = event.target.files[0]);
    },
    goBack() {
      this.$router.back();
    },
    money(x, decimals = 2) {
      if (!x && x != 0) return "";
      let cash = parseFloat(x).toFixed(decimals);
      if (isNaN(x) || x == null) return "-";
      return cash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    datetime(x) {
      if (!x) return "-";
      let date = new Date(x);
      return new Intl.DateTimeFormat("en-GB", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(date);
    },
    logout() {
      this.$store.state.user = null;
      localStorage.removeItem("_mic_user");
      localStorage.removeItem("compte_active");
      localStorage.removeItem("error_audio");
      localStorage.removeItem("success_audio");
    },
    async getAgences(of = 1, agences = []) {
      await axios
        .get(`agences/?page=${of}`)
        .then((response) => {
          const data = response.data;
          agences = agences.concat(data.results);
          data.next
            ? this.getAgences(of + 1, agences)
            : (this.$store.state.agences = this.agences = agences);
        })
        .catch((error) => {
          this.displayErrorOrRefreshToken(error, this.getAgences);
        });
    },
    async getPlans(page = 1, plans = []) {
      await axios
        .get(`plancomptable/?page=${page}`)
        .then((rep) => {
          const data = rep.data;
          plans = plans.concat(data.results);
          data.next
            ? this.getPlans(page + 1, plans)
            : ((this.plan_comptables = plans.filter(
              (plan) => plan.numero.length >= 3
            )),
              (this.$store.state.plan_comptables = this.plan_comptables));
        })
        .catch((error) => {
          this.displayErrorOrRefreshToken(error, this.getPlans);
        });
    },
    async getCompteBancaires(of = 1, comptebancaires = []) {
      await axios
        .get(`comptebancaire/?page=${of}`)
        .then((response) => {
          const data = response.data;
          if (data.next) {
            comptebancaires = comptebancaires.concat(data.results);
            this.getCompteBancaires(of + 1, comptebancaires);
          } else {
            this.comptebancaires = comptebancaires.concat(data.results);
            this.$store.state.comptebancaires = this.comptebancaires;
          }
        })
        .catch((error) => {
          this.displayErrorOrRefreshToken(error, this.getCompteBancaires);
        });
    },
    displayErrorOrRefreshToken(error, callback) {
      if (error.response) {
        if (error.response.data.code === "token_not_valid") {
          let refresh = this.$store.state.user.refresh;
          if (!refresh) {
            // this.$store.state.user = null;
            this.logout();
            return;
          }
          axios
            .post("login/refresh/", { refresh: refresh })
            .then((response) => {
              this.$store.state.user.access = response.data.access;
              if (typeof callback == "function") callback();
            })
            .catch((error) => {
              this.$store.state.user = null;
              this.$store.state.message.error =
                error.response.data?.status || error.response.data?.errors[0];
            });
        } else {
          if (error.code === "ERR_NETWORK") {
            this.$store.state.message.error = 'Echec de connexion'
            this.$store.state.online = false;
          }
          else if (error.message === "Network error") {
            this.$store.state.online = false;
          }
          this.alertError();
          this.$store.state.message.error =
            error.response.data?.status ||
            error.response.data?.errors ||
            error.response.data?.message ||
            error.response.data?.error ||
            error.response.data?.detail ||
            'Une erreur s\'est produite.';
        }
      } else if (error.message === "Network error") {
        this.$store.state.online = false;
      } else {
        console.error(error);
      }
    },
    getUserMicrofinanceInfo() {
      if (!this.$store.state.microfinance_info) {
        axios
          .get("microfinances/")
          .then(
            (response) => (this.$store.state.microfinance_info = response.data)
          )
          .catch((error) =>
            this.displayErrorOrRefreshToken(
              error,
              () => this.getUserMicrofinanceInfo
            )
          );
      }
    },
    alertError() {
      const enable_error = localStorage?.getItem("error_audio");
      if (enable_error) {
        if (enable_error != "true") {
          return;
        }
      }
      const audio = new Audio("/error.mp3");
      audio.currentTime = 0;
      audio.play();
    },
    getAccountCreationPrice(
      required_prices = ['Adhesion', 'Tenue De Compte', 'Creation Compte', 'Commande Chequiers'],
      verify_for = 'compte'
    ) {
      axios.get('prix/')
        .then((rep) => {
          const missing_prices = [];
          required_prices.forEach((required) => {
            const found = rep.data.results.find(element => element.table === required);
            if (!found) {
              missing_prices.push(required);
            }
          });
          if (missing_prices.length > 0) {
            this.$store.state.message.error = `${missing_prices.length === 1 ? `Il n'y a pas le prix pour ${missing_prices[0]}` : `Les prix suivants sont manquants : ${missing_prices.join(', ')}`}`
            this.$emit('cancel')
            verify_for === 'virement' && this.closeModal()
          }
        }).catch((error) => this.displayErrorOrRefreshToken(error, this.getAccountCreationPrice));
    },
    // async putDatas(id) {
    //   this.isSucces = false;
    //   const formData = new FormData();
    //   formData.append('telephone', this.telephone);
    //   formData.append('adresse', this.colline);
    //   formData.append('commune', this.commune);
    //   formData.append('province', this.province);
    //   formData.append('organisation', this.organisation);
    //   // formData.append('payante', this.payante);
    //   formData.append('document', this.document);
    //   formData.append('photo', this.photo);
    //   try {
    //       const response = await axios.put(`comptes/${id}/`, formData)
    //       this.$store.commit('setSuccess', `Le compte de ${this.nom} a été créée avec succès.`);
    //       this.$store.state.clients.results.unshift(response.data)
    //       this.$nextTick(()=>{
    //           this.$emit('done')
    //       })
    //       this.isSucces = true;
    //   } catch (error) {
    //       this.displayErrorOrRefreshToken(error,() => this.putDatas(id))
    //   }
    // }
    
    async handleAccountCreation(url, type, data) {
      data.append(type + '.telephone', this.telephone);
      data.append(type + '.adresse', this.colline);
      data.append(type + '.commune', this.commune);
      data.append(type + '.province', this.province);
      data.append(type + '.organisation', this.organisation);
      // data.append(type + '.payante', this.payante);
      data.append('frais_creation_compte', this.frais_creation_compte);
      data.append('frais_adhesion', this.frais_adhesion);
      data.append('frais_commande_chequier', this.frais_commande_chequier);


      this.document != null
        ? (data.append(type + '.document', this.document))
        : (this.$store.state.compte_active.document != null
          ? (data.append(type + '.document', this.$store.state.compte_active.document))
          : '')
      this.photo != null
        ? (data.append(type + '.photo', this.photo))
        : (this.$store.state.compte_active.photo != null
          ? (data.append(type + '.photo', this.$store.state.compte_active.photo))
          : '')
      
      await axios.post(url, data)
        .then((response) => {
          this.compte = response.data.numero
          this.current_slide = 1
          this.$store.commit(
            'setSuccess',
            `Le compte de ${this.nom} a été créée avec succès.`
          );
          this.$emit('done', response.data?.compte)
          // this.clients?.results.unshift(response.data);
          // this.$store.state.clients.results.unshift(response.data);
        }).catch((error) => {
          this.data_error = error.response?.data
          this.displayErrorOrRefreshToken(error, ()=> this.handleAccountCreation(url, type, data))
        })
    }
  }
};
