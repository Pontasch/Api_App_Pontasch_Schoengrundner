import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, forkJoin, map, Observable, retry, throwError} from "rxjs";
import {Storage} from "@ionic/storage-angular";


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
  cylinders:string;
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
export type Motorraeder = Motorrad[]

export interface Motorrad{
  make: string
  model: string
  year: string
  type: string
  displacement: string
  engine: string
  compression: string
  bore_stroke: string
  valves_per_cylinder: any
  fuel_system: string
  fuel_control?: string
  lubrication?: string
  cooling: string
  gearbox: string
  transmission: string
  clutch?: string
  frame: any
  front_suspension: string
  front_wheel_travel?: string
  rear_suspension?: string
  rear_wheel_travel?: string
  front_tire: string
  rear_tire: string
  front_brakes: string
  rear_brakes: string
  seat_height: string
  ground_clearance: string
  wheelbase: string
  fuel_capacity: string
  starter: string
  power?: string
  torque: string
  top_speed?: string
  fuel_consumption: string
  emission: string
  total_weight: string
  total_height: any
  total_length: string
  total_width: any
  ignition: any
  dry_weight: string
}

@Injectable({
  providedIn: 'root'
})
export class FahrzeugeService {
  private _storage: Storage | null = null;

  constructor(private http: HttpClient, private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  public async  set(key: string, value: any) {
    this._storage?.set(key, value);
  }
  public async get(key: string) {
    return this._storage?.get(key);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  getMotorraeder(marke:string="honda"): Observable<Motorraeder>{
    return this.http.get<Motorraeder>(`/motorcycleAPI/v1/motorcycles?make=${marke}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getAttributes(year:number, make:string,  model:string, page:number): Observable<any> {
    return this.http.get<any>(`/carAPI/trims?year=${year}&make=${make}&model=${model}&page=${page}`).pipe(
      retry(3),
      catchError(this.handleError));
  }

  getEngine(year:number, make:string,  model:string, page:number): Observable<Auto> {
    return this.http.get<Auto>(`/carAPI/engines?verbose=yes&year=${year}&make=${make}&model=${model}&page=${page}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getAutosWithAttributesAndEngine(year: number, make: string, model: string, currentPage: number): Observable<Auto> {
    return forkJoin({
      trims: this.getAttributes(year, make,  model, currentPage),
      engines: this.getEngine(year,make,model, currentPage)
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
