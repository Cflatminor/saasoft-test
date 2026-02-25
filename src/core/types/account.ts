import type { Label } from "./label";

export enum AccountTypeEnum {
  Local = 'local',
  LDAP = 'ldap'
}

export interface Account {
  id: string;
  labels: Label[];
  type: AccountTypeEnum;
  login: string;
  password: string | null;
}