export interface Document {
  id: number;
  filename: string;
  file_path: string;
  content_type: string;
  size_bytes: number;
  workspace_id: number;
  created_at: string;
  updated_at: string;
}
