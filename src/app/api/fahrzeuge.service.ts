import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {forkJoin, map, Observable} from "rxjs";

export interface Auto {
  collection: AColl;
  data: ADatum[];
}

export interface AColl {
  url: string;
  count: number;
  pages: number;
  total: number;
  next: string;
  prev: string;
  first: string;
  last: string;
}

export interface ADatum {
  id: number;
  make_id: number;
  name: string;
  make: AMake;
  trims?: ATrim[];
}

export interface AMake {
  id: number;
  name: string;
}


export interface ATrim {
  id: number
  make_model_id: number
  year: number
  name: string
  description: string
  msrp: number
  invoice: number
  created: string
  modified: string
}



@Injectable({
  providedIn: 'root'
})
export class FahrzeugeService {

  constructor(private http: HttpClient) {
  }

  getAutos(year: number): Observable<Auto> {
    return this.http.get<Auto>(`/carAPI/models?verbose=yes&year=${year}`);
  }
    getAttributes(year:number): Observable<any> {
    return this.http.get<any>(`/carAPI/trims?year=${year}`);
  }

  getAutosWithAttributes(year: number): Observable<Auto> {
    return forkJoin({
      models: this.getAutos(year),
      trims: this.getAttributes(year)
    }).pipe(
      map(result => {
        console.log('Models:', result.models.data);
        console.log('Trims:', result.trims.data);

        const modelsWithTrims = result.models.data.map(model => {
          const modelTrims = result.trims.data.filter((trim: { make_model_id: number; }) => trim.make_model_id === model.id);

          console.log(`Model ID: ${model.id} -> Found Trims:`, modelTrims);

          return {
            ...model,
            trims: modelTrims
          };
        });

        return {
          ...result.models,
          data: modelsWithTrims
        };
      })
    );
  }
}
