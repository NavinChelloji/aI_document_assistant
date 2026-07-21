export interface Document {
  id: string; // UUID
  file_name: string;           // backend field name
  filename?: string;           // alias used in some places
  storage_path?: string;
  file_path?: string;
  content_type?: string;
  file_type?: string;          // backend field name
  file_size?: number;          // backend field name
  size_bytes?: number;         // alias
  workspace_id: string;        // UUID
  workspace_name?: string;
  status?: 'pending' | 'processing' | 'processed' | 'failed';
  upload_status?: string;      // backend field
  created_at: string;
  updated_at?: string;
}

export interface DocumentState {
  documents: Document[];
  setDocuments: (docs: Document[]) => void;
  addDocument: (doc: Document) => void;
  removeDocument: (id: string) => void;
  updateDocument: (doc: Document) => void;
}
