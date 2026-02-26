import fixture from "./fixture.json";

import { AccountTypeEnum } from "@/src/core/types/account";
import type { Account } from "@/src/core/types/account";

interface iRepository<T> {
  getAccounts(): Promise<T[]>;
  createAccount(account: Account): Promise<Account>;
  updateAccount(account: Account): Promise<Account>;
  deleteAccount(id: string): Promise<string>;
}

/**
 * В идеале тут должны использоваться DTO с декораторами для валидации
 */

const defaultAccount: Account = {
  id: '',
  login: '',
  type: AccountTypeEnum.Local,
  password: "",
  labels: []
}

function normalizeAccount(raw: Partial<Account> | any): Account {
  return {
    id: typeof raw.id === 'string' ? raw.id : defaultAccount.id,
    login: typeof raw.login === 'string' ? raw.login : defaultAccount.login,
    type: typeof raw.type === 'string' ? raw.type : AccountTypeEnum.Local,
    password: typeof raw.password === 'string' ? raw.password : defaultAccount.password,
    labels: Array.isArray(raw.labels) ? raw.labels : defaultAccount.labels
  }
}

class Repository implements iRepository<Account> {
  async getAccounts(): Promise<Account[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const rawData: any[] = fixture;

        resolve(rawData.map(normalizeAccount));
      }, 1812);
    });
  }

  async createAccount(): Promise<Account> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(normalizeAccount({id: Math.random().toString(36).substr(2, 5)}));
      }, 250);
    });
  }

  async updateAccount(account: Account): Promise<Account> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(account);
      }, 240);
    });
  }

  async deleteAccount(id: string): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(id);
      }, 312);
    });
  }
}

export default Repository;