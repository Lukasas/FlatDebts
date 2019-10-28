import { CacheService } from "./cache.service";
import { User } from "./../models/user.model";
import { DebtItem, Debtor } from "./../models/debt-item.model";
import { switchMap, take, map } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { AngularFirestore, DocumentReference } from "@angular/fire/firestore";
import { Injectable } from "@angular/core";
import { concat, zip, from, Observable, forkJoin } from "rxjs";
import { ChangeDetectionStrategy } from "@angular/compiler/src/core";

@Injectable({
  providedIn: "root"
})
export class PullDebtsService {
  constructor(
    private afstore: AngularFirestore,
    private auth: AuthService,
    private cacheSvc: CacheService
  ) {}

  getAvailableDebtors() {
    return this.afstore.collection("users").valueChanges();
  }

  getDebts() {
    return this.afstore
      .collection("debts")
      .valueChanges()
      .pipe(
        map(debtItems => {
          debtItems = debtItems.filter(
            (debtItem: DebtItem) => debtItem.deleted !== true
          );
          return debtItems;
        })
      );
  }

  removeDebt(debtId: string) {
    this.afstore
      .collection("debts")
      .doc(debtId)
      .update({ deleted: true });
  }

  pushDebt(item_name: string, price: number, debtors: string[]) {
    localStorage.setItem("selectedDebtorsHistory", debtors.join(";"));
    const debtors$ = debtors.map(uid => {
      return this.afstore.doc(`users/${uid}`).get();
    });

    zip(this.auth.user$, forkJoin(debtors$))
      .pipe(
        map(([user, debtorsUsers]) => {
          const item = {
            item_name,
            buyer: { displayName: user.displayName, uid: user.uid },
            price,
            added_at: Date.now(),
            deleted: false,
            debtors: debtorsUsers.map(snap => {
              const debtor: User = snap.data() as User;
              return {
                displayName: debtor.displayName,
                uid: debtor.uid,
                paid: false
              };
            })
          };
          return item;
        })
      )
      .subscribe(item => {
        from(this.afstore.collection("debts").add(item)).subscribe(value =>
          value.update({ item_id: value.id })
        );
      });
  }
}
