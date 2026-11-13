-- 计数器（目前只有 pet：这只猫被摸的次数）
CREATE TABLE IF NOT EXISTS counters (
  key TEXT PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0
);
INSERT OR IGNORE INTO counters (key, value) VALUES ('pet', 0);

-- 贴纸留言墙。status: pending / approved / rejected
CREATE TABLE IF NOT EXISTS wall (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nick TEXT NOT NULL,
  sticker TEXT NOT NULL,
  text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  ip_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS wall_status_created ON wall (status, created_at DESC);

-- 每 IP 每日配额（ip_hash + 日期 + 动作）
CREATE TABLE IF NOT EXISTS quota (
  ip_hash TEXT NOT NULL,
  day TEXT NOT NULL,
  action TEXT NOT NULL,
  n INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (ip_hash, day, action)
);
