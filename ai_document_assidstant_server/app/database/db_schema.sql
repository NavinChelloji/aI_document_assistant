BEGIN;

CREATE TABLE alembic_version (
    version_num VARCHAR(32) NOT NULL, 
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

-- Running upgrade  -> 3656dbde7ae5

CREATE TABLE users (
    id UUID NOT NULL, 
    name VARCHAR(100) NOT NULL, 
    email VARCHAR(255) NOT NULL, 
    password_hash TEXT NOT NULL, 
    role VARCHAR(20), 
    is_active BOOLEAN, 
    is_superuser BOOLEAN, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX ix_users_email ON users (email);

CREATE INDEX ix_users_id ON users (id);

CREATE TABLE audit_logs (
    id UUID NOT NULL, 
    user_id UUID NOT NULL, 
    action VARCHAR(100) NOT NULL, 
    entity VARCHAR(50) NOT NULL, 
    entity_id UUID NOT NULL, 
    ip_address VARCHAR(50), 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE INDEX ix_audit_logs_id ON audit_logs (id);

CREATE INDEX ix_audit_logs_user_id ON audit_logs (user_id);

CREATE TABLE notifications (
    id UUID NOT NULL, 
    user_id UUID NOT NULL, 
    title VARCHAR(255) NOT NULL, 
    message TEXT NOT NULL, 
    is_read BOOLEAN, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE INDEX ix_notifications_id ON notifications (id);

CREATE INDEX ix_notifications_user_id ON notifications (user_id);

CREATE TABLE refresh_tokens (
    id UUID NOT NULL, 
    user_id UUID NOT NULL, 
    token_hash TEXT NOT NULL, 
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    revoked BOOLEAN, 
    PRIMARY KEY (id), 
    FOREIGN KEY(user_id) REFERENCES users (id), 
    UNIQUE (token_hash)
);

CREATE INDEX ix_refresh_tokens_id ON refresh_tokens (id);

CREATE INDEX ix_refresh_tokens_user_id ON refresh_tokens (user_id);

CREATE TABLE settings (
    id UUID NOT NULL, 
    user_id UUID NOT NULL, 
    theme VARCHAR(20), 
    language VARCHAR(10), 
    notifications_enabled BOOLEAN, 
    PRIMARY KEY (id), 
    FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE INDEX ix_settings_id ON settings (id);

CREATE UNIQUE INDEX ix_settings_user_id ON settings (user_id);

CREATE TABLE workspaces (
    id UUID NOT NULL, 
    user_id UUID NOT NULL, 
    name VARCHAR(255) NOT NULL, 
    description TEXT, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(user_id) REFERENCES users (id)
);

CREATE INDEX ix_workspaces_id ON workspaces (id);

CREATE INDEX ix_workspaces_user_id ON workspaces (user_id);

CREATE TABLE chat_sessions (
    id UUID NOT NULL, 
    workspace_id UUID NOT NULL, 
    title VARCHAR(255) NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(workspace_id) REFERENCES workspaces (id)
);

CREATE INDEX ix_chat_sessions_id ON chat_sessions (id);

CREATE INDEX ix_chat_sessions_workspace_id ON chat_sessions (workspace_id);

CREATE TABLE documents (
    id UUID NOT NULL, 
    workspace_id UUID NOT NULL, 
    file_name VARCHAR(255) NOT NULL, 
    file_type VARCHAR(20) NOT NULL, 
    file_size BIGINT NOT NULL, 
    storage_path TEXT NOT NULL, 
    upload_status VARCHAR(20), 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(workspace_id) REFERENCES workspaces (id)
);

CREATE INDEX ix_documents_id ON documents (id);

CREATE INDEX ix_documents_upload_status ON documents (upload_status);

CREATE INDEX ix_documents_workspace_id ON documents (workspace_id);

CREATE TABLE chat_messages (
    id UUID NOT NULL, 
    session_id UUID NOT NULL, 
    question TEXT NOT NULL, 
    answer TEXT NOT NULL, 
    model VARCHAR(100), 
    token_usage INTEGER, 
    response_time_ms INTEGER, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(session_id) REFERENCES chat_sessions (id)
);

CREATE INDEX ix_chat_messages_id ON chat_messages (id);

CREATE INDEX ix_chat_messages_session_id ON chat_messages (session_id);

CREATE TABLE document_chunks (
    id UUID NOT NULL, 
    document_id UUID NOT NULL, 
    page_number INTEGER NOT NULL, 
    chunk_number INTEGER NOT NULL, 
    text TEXT NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(document_id) REFERENCES documents (id)
);

CREATE INDEX ix_document_chunks_document_id ON document_chunks (document_id);

CREATE INDEX ix_document_chunks_id ON document_chunks (id);

CREATE TABLE document_versions (
    id UUID NOT NULL, 
    document_id UUID NOT NULL, 
    version INTEGER NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(document_id) REFERENCES documents (id)
);

CREATE INDEX ix_document_versions_document_id ON document_versions (document_id);

CREATE INDEX ix_document_versions_id ON document_versions (id);

INSERT INTO alembic_version (version_num) VALUES ('3656dbde7ae5');

COMMIT;