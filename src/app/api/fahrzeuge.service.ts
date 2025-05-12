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
export type Motorraeder= Motorrad[]

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

  constructor(private http: HttpClient) {
  }

  getMotorraeder(marke:string="honda"): Observable<Motorraeder> {
    return this.http.get<Motorraeder>(`/motorcycleAPI/v1/motorcycles?make=${marke}`);
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
