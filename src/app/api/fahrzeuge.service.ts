import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {forkJoin, map, Observable} from "rxjs";

export interface Auto {
  collection: Collection;
  data: AutoData[];
}

export interface Collection {
  url: string;
  count: number;
  pages: number;
  total: number;
}

export interface AutoData {
  id: number;
  make_model_trim_id: number;
  engine_type: string;
  fuel_type: string;
  horsepower_hp: number;
  torque_ft_lbs: number;
  transmission: string;
  make_model_trim: MakeModelTrim;
  trims: Trim[];
}

export interface MakeModelTrim {
  id: number;
  name: string;
  year: number;
  make_model: MakeModel;
}

export interface MakeModel {
  name: string;
  make: Make;
}

export interface Make {
  name: string;
}

export interface Trim {
  name: string;
  msrp: number;
  description: string;
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
    getAttributes(year:number, make:string,  model:string): Observable<any> {
    return this.http.get<any>(`/carAPI/trims?year=${year}&make=${make}&model=${model}`);
  }

  getEngine(year:number, make:string,  model:string): Observable<Auto> {
    return this.http.get<Auto>(`/carAPI/engines?verbose=yes&year=${year}&make=${make}&model=${model}`);
  }

  getAutosWithAttributesAndEngine(year: number, make:string,  model:string): Observable<Auto> {
    return forkJoin({
      trims: this.getAttributes(year, make,  model),
      engines: this.getEngine(year,make,model)
    }).pipe(
      map(result => {
        console.log('Trims:', result.trims.data);
        console.log('Engines:', result.engines.data);

        const modelsWithTrimsAndEngines = result.engines.data.map(engine => {

          const modelTrims = result.trims.data.filter((trim: { make_model_id: number; }) => trim.make_model_id === engine.make_model_trim_id);

          return {
            ...engine,
            trims: modelTrims
          };
        });

        return {
          ...result.engines,
          data: modelsWithTrimsAndEngines
        };
      })
    );
  }
}
