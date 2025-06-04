export interface Motorrad {

  make_model_trim: {
    make_model: {
      make: {
        name: string;
      };
      name: string;
    };
    name?: string;
  };
  engine_type?: string;
  horsepower_hp?: number;
  transmission?: string;
  year?: number;

}
