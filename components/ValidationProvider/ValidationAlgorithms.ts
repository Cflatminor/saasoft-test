import type {Field} from "./index";

export enum FieldTypesEnum {
  labels = 'labels',
  password = 'password',
  login = 'login',
  type = 'type',
}

export class ValidationAlgorithms {
  public static hasError(field: Field) {
    switch (field.type) {
      case FieldTypesEnum.login:
        return typeof field.value !== "string" || field.value === "";

      case FieldTypesEnum.password:
        return typeof field.value !== "string" || field.value === "";
    }

    return false;
  }
}