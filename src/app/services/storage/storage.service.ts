import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setStorage(key, value) {
    Plugins.Storage.set({key: key, value: value});
  }

  getStorage(key) {
    return Plugins.Storage.get({key: key});
  }

  removeStorage(key) {
    Plugins.Storage.remove({key: key});
  }

  clearStorage() {
    Plugins.Storage.clear();
  }
}
