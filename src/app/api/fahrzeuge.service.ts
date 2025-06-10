import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, forkJoin, map, Observable, retry, throwError} from "rxjs";
import {Storage} from "@ionic/storage-angular";



export interface Auto {
  collection: Collection
  data: AutoData[]
}

export interface Collection {
  url: string
  count: number
  pages: number
  total: number
  next: string
  prev: string
  first: string
  last: string
}

export interface AutoData {
  id: number
  make_id: number
  model_id: number
  submodel_id: number
  trim_id: number
  year: number
  make: string
  model: string
  series: string
  submodel: string
  trim: string
  trim_description: string
  engine_type: string
  fuel_type: string
  cylinders: string
  size: number
  horsepower_hp: number
  horsepower_rpm: number
  torque_ft_lbs: number
  torque_rpm: number
  valves: number
  valve_timing: string
  cam_type: string
}

export interface Trim {
  collection: Collection
  data: TrimData[]
}


export interface TrimData {
  id: number
  make_id: number
  model_id: number
  submodel_id: number
  year: number
  make: string
  model: string
  submodel: string
  series: string
  trim: string
  description: string
  msrp: number
  invoice: number
  created: string
  modified: string
}



export interface Motorraeder {
  collection: Collection;
  data: Motorrad[];
}

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

export interface AutosWithAttributesAndEngineResult {
  auto: Auto;
  trim: Trim;
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

  async ready() {
    if (!this._storage) {
      await this.init();
    }
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

  getMotorraeder(marke: string = '', modell: string = '', jahr: number | string = ''): Observable<Motorraeder> {
    let url = `/motorcycleAPI/v1/motorcycles?`;
    if (marke) url += `make=${encodeURIComponent(marke)}&`;
    if (modell) url += `model=${encodeURIComponent(modell)}&`;
    if (jahr) url += `year=${jahr}&`;
    url = url.replace(/[&?]$/, '');
    return this.http.get<any>(url).pipe(
      retry(3),
      map((apiResult: any) => {
        // Erwartet: { collection: ..., data: [...] }
        return {
          collection: apiResult.collection || {},
          data: apiResult.data || []
        };
      })
      //catchError(this.handleError)
    );
  }

  getAttributes(year:number, make:string,  model:string, page:number): Observable<Trim> {
    return this.http.get<Trim>(`/carAPI/trims/v2/?year=${year}&make=${make}&model=${model}&page=${page}&limit=50`).pipe(
      retry(3),
      catchError(this.handleError));
  }

  getEngine(year:number, make:string,  model:string, page:number): Observable<Auto> {
    return this.http.get<Auto>(`/carAPI/engines/v2/?verbose=yes&year=${year}&make=${make}&model=${model}&page=${page}&limit=50`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getAutosWithAttributesAndEngine(
    year: number,
    make: string,
    model: string,
    currentPage: number
  ): Observable<AutosWithAttributesAndEngineResult> {
    return forkJoin({
      trim: this.getAttributes(year, make, model, currentPage),
      auto: this.getEngine(year, make, model, currentPage)
    });
  }


}
