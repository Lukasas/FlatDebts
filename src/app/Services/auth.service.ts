import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User> = null;
  user: User;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      }),
      tap(user => this.user = user)
    );
  }

  async signInWithEmailAndPass(email: string, password: string): Promise<void | string> {
    try {
      const credential = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      return this.updateUserData(credential.user);
    } catch (error) {
      return 'Unknown name of wrong password.';
    }
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    return this.router.navigate(['/login']);
  }

  private updateUserData({ uid, email }: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${uid}`);
    const data = {
      uid,
      email
    };
    return userRef.set(data, { merge: true });
  }
}
