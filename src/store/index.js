import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      user: null,
      user_microfinance: '',
      compte_active: null,
      credit: null,
      print_credit:[],
      credits: [],
      clients: [],
      agences: [],
      comptebancaires: [],
      retraitbanques: [],
      microfinance_info : [],

      groups: [],
      users: [],
      permissions: [],
      microfinances: [],
      print_cheques: [],
      grand_livre: [],

      triger: 'client',
      compte_compttable: [],
      plan_comptables: [],
      message : {
        error : '',
        success : ''
      },
      is_loading : false,
      online : true
    }
  },
  mutations: {
    UPDATE_DEBLOCAGES(state, updated_deblocages) {
      state.compte_active.deblocages = updated_deblocages;
    },
    setError(state, error_message) {
      state.message.error = error_message;
    },
    setSuccess(state, success_message) {
      state.message.success = success_message;
    },
    clearMessage(state) {
      state.message.success = '';
      state.message.error = '';
    }
  },
})

export default store;
