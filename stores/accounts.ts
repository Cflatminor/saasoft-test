import {defineStore} from "pinia";

import type {Account} from "@/src/core/types/account";

interface iState {
  accounts: Account[]
}

export const useAccountsStore = defineStore('accountsStore', {
  state: (): iState => ({
    accounts: []
  }),
  getters: {
    getAccounts: (state) => state.accounts,
  },
  actions: {
    async setAccounts(accounts: Account[]): Promise<void> {
      this.accounts = accounts;
    }
  },
  persist: {
    storage: process.client ? sessionStorage : undefined
  }
})

export default useAccountsStore;