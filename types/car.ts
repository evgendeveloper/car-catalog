export interface CarResponse {
  id: number
  make: string
  model: string
  year: number
  imageUrl?: string
}

export interface CarDetails {
  model_id: string
  model_make_id: string
  model_name: string
  model_trim: string
  model_year: string
  model_body: string
  model_engine_position: string
  model_engine_cc?: string
  model_engine_cylinders?: string
  model_engine_type?: string
  model_engine_valves_per_cylinder?: string
  model_engine_power_ps?: string
  model_engine_power_rpm?: string
  model_engine_torque_nm?: string
  model_engine_torque_rpm?: string
  model_engine_bore_mm?: string
  model_engine_stroke_mm?: string
  model_engine_compression?: string
  model_engine_fuel?: string
  model_top_speed_kph?: string
  model_0_to_100_kph?: string
  model_drive?: string
}

export interface CarDetailsResponse {
  details: CarDetails | null
}

export interface CarImageResponse {
  imageUrl: string | null
}
