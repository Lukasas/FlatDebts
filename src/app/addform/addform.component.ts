import { User } from './../models/user.model';
import { DebtItem } from '../models/debt-item.model';
import { switchMap, map, filter } from 'rxjs/operators';
import { PullDebtsService } from './../Services/pull-debts.service';
import { AuthService } from './../Services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-addform',
  templateUrl: './addform.component.html',
  styleUrls: ['./addform.component.scss']
})
export class AddformComponent implements OnInit {
  oweTo: [];
  oweFrom: [];
  fgroup: FormGroup;
  data: Array<DebtItem> = [];
  items: Observable<DebtItem[]>;
  availableDebtors: Observable<any[]>;
  displayedColumns: string[] = ['item_name', 'username', 'price', 'added_at', 'debtors', 'actions'];

  selectedDebtorsHistory: string[];

  constructor(
    public debtssvc: PullDebtsService,
    public auth: AuthService,
    public snack: MatSnackBar
    ) {
    this.items = debtssvc.getDebts() as Observable<DebtItem[]>;
    /*this.items.subscribe(val => {
      val.forEach(debt => {
        this.prices += debt.price;
        console.log(this.prices);
      });
      console.log(this.prices);
    });*/
    this.availableDebtors = debtssvc.getAvailableDebtors();
    if (localStorage.getItem('selectedDebtorsHistory')) {
      this.selectedDebtorsHistory = localStorage.getItem('selectedDebtorsHistory').split(';');
    }
  }

  checkHistory(uid: string) {
    if (this.selectedDebtorsHistory) {
      return this.selectedDebtorsHistory.find(val => val === uid);
    } else {
      return undefined;
    }
  }

  checkEmptyTrim(len: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value) {
        const testLen = (control.value as string).trim().length;
        return testLen >= len ? null : { minlength: { requiredLength: len, currentLength: testLen } };
      } else {
        return null;
      }
    }
  }

  ngOnInit() {
    this.fgroup = new FormGroup({
      item_name: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
        this.checkEmptyTrim(2)
      ]),
      price: new FormControl('', [
        Validators.required,
        Validators.min(0)
      ]),
      debtors: new FormControl(this.selectedDebtorsHistory)
    });

  }

  pushAddItem() {
    let item_name = this.itemNameField.value as string;
    this.debtssvc.pushDebt(item_name.trim(), this.priceField.value as number, this.itemDebtors.value);
    this.fgroup.reset(); // Reset validators state
    this.itemDebtors.setValue(this.selectedDebtorsHistory)
  }

  pushRemoveItem(itemId: string) {
    if (confirm('Do you really want to remove ?')) {
      this.debtssvc.removeDebt(itemId);
    }
  }

  get itemNameField() {
    return this.fgroup.get('item_name');
  }

  get itemDebtors() {
    return this.fgroup.get('debtors');
  }

  get priceField() {
    return this.fgroup.get('price');
  }


}
