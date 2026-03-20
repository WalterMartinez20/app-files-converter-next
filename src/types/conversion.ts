export interface Conversion {
  id: string;
  user_id: string;
  file_name: string;
  original_format: string;
  target_format: string;
  status: "pending" | "processing" | "completed" | "failed";
  file_size: number;
  storage_path: string;
  created_at: string;
}

export interface CreateConversionDTO {
  file_name: string;
  original_format: string;
  target_format: string;
  file_size: number;
  storage_path: string;
}
