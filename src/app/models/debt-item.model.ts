import { Observable } from 'rxjs';
import { User } from './user.model';
import { DocumentReference } from '@angular/fire/firestore';

export interface Debtor {
  uid: string;
  paid: boolean;
  displayName: string;
}

export interface Buyer {
  uid: string;
  displayName: string;
 }

export interface DebtItem {
  item_id: string;
  item_name: string;
  buyer: Buyer;
  price: number;
  added_at: number;
  deleted: boolean;
  debtors: Debtor[];
}
