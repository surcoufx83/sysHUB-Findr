import { Injectable, enableProdMode } from '@angular/core';
import * as configjson from '../../assets/config/config.json'
import { FindrEnvironment } from '../types';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {
  public environment: FindrEnvironment;
  constructor() {
    this.environment = configjson as FindrEnvironment;
  }
}
