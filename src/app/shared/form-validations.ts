import {AbstractControl, FormArray, FormControl} from '@angular/forms';

export class FormValidations {

  static cepValidator(control: FormControl) {

    let cep = control.value;

    cep = cep?.replace(/\D/g, '');

    if(cep && cep !== '') {
      const validacep = /^[0-9]{8}$/;
      return validacep.test(cep) ? null : { cepInvalido : true }
    }

    return null;
  }

  static requiredMinCheckbox(min = 1) {

    const validator = (formArray: AbstractControl) => {

      if(formArray instanceof FormArray) {
        const totalChecked = formArray.controls.map(v => v.value)
          .reduce((total: number, current: number) => (current ? total + current : total), 0);

        return totalChecked >= min ? null : { required: true };
      }
      throw new Error('formArray is not an instance of FormArray');

    };
    return validator;
  }

  static getErrorMsg(fieldName: string, validatorName: string, validatorValue?: any) {
    const config: any = {
      'required': `${fieldName} é obrigatório.`,
      'cepInvalido': 'CEP Inválido.',
    }

    return config[validatorName];
  }
}
