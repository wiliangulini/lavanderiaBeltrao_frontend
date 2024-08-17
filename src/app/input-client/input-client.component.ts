import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

const INPUT_FIELD_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputClientComponent),
  multi: true
};
@Component({
  selector: 'app-input-client',
  templateUrl: './input-client.component.html',
  styleUrls: ['./input-client.component.scss'],
  providers: [INPUT_FIELD_VALUE_ACCESSOR]
})
export class InputClientComponent implements ControlValueAccessor {

  @Input() classeCss: any;
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() type = 'text';
  @Input() placeholder: string = '';
  @Input() control: any;
  @Input() isReadOnly = false;
  @Input() required: boolean = true;
  @Input() blur: any;

  private innerValue: any;

  blurValid = false;

  @Input()
  set validateOnBlur(value: any) {
    this.blurValid = value;
  }
  get value(): any {
    return this.innerValue;
  }

  set value(v: any) {
    if(v !== this.innerValue) {
      if(v !== null) {
      this.innerValue = v;
      this.onChangeCb(v);
      }
    }
  }

  constructor() { }

  onChangeCb: (_: any) => void = () => {};
  onTouchedCb: (_: any) => void = () => {};

  ngOnInit(): void {}

  writeValue(v: any): void {
    if(v !== this.innerValue) {
      if(v !== null) {
        this.innerValue = v;
        this.onChangeCb(v);
      }
    }
  }
  registerOnChange(fn: any): void {
    this.onChangeCb = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isReadOnly = isDisabled;
  }

  onBlur(v: any): void {
    console.log(v.target.value)
    this.blurValid = false;
    this.onTouchedCb(v.target.value);
  }
}
