import { Injectable } from "@angular/core";

@Injectable()
export class PersistanceService {
  set(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.log("Error persisting localStorage", error);
    }
  }

  get(key: string): any {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (error) {
      console.log("Error getting data from localStorage", error);
      return null;
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.log("Error clearing localStorage", error);
    }
  }
}
