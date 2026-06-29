CREATE TABLE IF NOT EXISTS token_blacklists (
    id BIGSERIAL PRIMARY KEY,
    jti VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_token_blacklists_jti ON token_blacklists(jti);
CREATE INDEX idx_token_blacklists_expires_at ON token_blacklists(expires_at);
