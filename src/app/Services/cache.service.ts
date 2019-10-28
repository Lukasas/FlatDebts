import { User } from '../models/user.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  cacheUsers: Map<string, string>;

  constructor() {
    this.cacheUsers = new Map<string, string>();
  }

  pushUser(uid: string, user: string): string {
    this.cacheUsers.set(uid, user);
    return user;
  }

  hasUser(uid: string): boolean{
    return this.cacheUsers.has(uid);
  }

  getUser(uid: string): string | null {
    return this.cacheUsers[uid];
  }
}
