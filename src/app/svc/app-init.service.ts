import { Injectable } from '@angular/core';
import { FindrEnvironment } from '../types';
import { HttpStatusCode } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  public environment!: FindrEnvironment;
  public loading: boolean = true;

  constructor() { }

  load() {
    return new Promise<boolean>((resolve) => {
      fetch('/findr/assets/config/config.json').then((response) => {
        if (response.status == HttpStatusCode.Ok) {
          response.json().then((json) => {
            let tempenv = { ...<FindrEnvironment>json };
            tempenv.appInitializationFailure = {
              configStatusCode: response.status,
            };
            this.environment = { ...tempenv };
            resolve(true);
          });
        } else {
          let tempenv = { ...MissingConfigJson };
          tempenv.appInitializationFailure = {
            configStatusCode: response.status,
          };
          this.environment = { ...tempenv };
          resolve(true);
        }
      }).catch((reason) => {
        let tempenv = { ...MissingConfigJson };
        tempenv.appInitializationFailure = {
          configStatusCode: 0,
        };
        this.environment = { ...tempenv };
        resolve(true);
      })
    });
  }

}

const MissingConfigJson: FindrEnvironment = {
  api: {
    host: 'http://localhost:8088/',
    oauth: {
      enabled: true,
      clientId: '<<missing client>>',
      clientSecret: '<<missing client>>',
      scope: 'private+public'
    },
  },
};