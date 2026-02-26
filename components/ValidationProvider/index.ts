import {ValidationAlgorithms} from "./ValidationAlgorithms";

export interface Field {
  type: string;
  value: any;
  hasError: boolean;
}

export class ValidationProvider {
  public static async validate(fields: Field[]): Promise<Field[]> {
    let hasErrors = false;

    return await new Promise((resolve, reject) => {
      // fields.forEach(field => {
      //   if (ValidationAlgorithms.hasError(field)) {
      //     reject(field);
      //   } else {
      //     field.hasError = true;
      //     resolve(field);
      //   }
      // })
      const validatedFields = fields.map(field => {
        const hasError = ValidationAlgorithms.hasError(field);

        if (hasError) {
          hasErrors = true;
          field.hasError = hasError;
        }

        return field;
      })

      if (hasErrors) {
        reject(validatedFields);
      } else {
        resolve(validatedFields);
      }
    })
  }
}