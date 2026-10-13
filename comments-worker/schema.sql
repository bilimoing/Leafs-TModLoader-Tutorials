CREATE TABLE IF NOT EXISTS oauth_states (
  state TEXT PRIMARY KEY,
  expires INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  token TEXT NOT NULL,
  login TEXT NOT NULL,
  expires INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS submissions (
  login TEXT NOT NULL,
  request_id TEXT NOT NULL,
  created INTEGER NOT NULL,
  issue_number INTEGER,
  PRIMARY KEY (login, request_id)
);
