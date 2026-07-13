-- Synthetic, non-production Phase 5.4.1 migration fixture.
-- Values are deterministic and contain no real identities, tokens, or redeem codes.

INSERT INTO "User" (
  "id", "email", "emailLower", "nickname", "nicknameLower", "passwordHash",
  "role", "createdAt", "updatedAt"
) VALUES
  ('qa-user-001', 'qa-001@synthoma.invalid', 'qa-001@synthoma.invalid', 'QA-001', 'qa-001', 'synthetic-not-a-login', 'user', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('qa-user-002', 'qa-002@synthoma.invalid', 'qa-002@synthoma.invalid', 'QA-002', 'qa-002', 'synthetic-not-a-login', 'user', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z'),
  ('qa-user-003', 'qa-003@synthoma.invalid', 'qa-003@synthoma.invalid', 'QA-003', 'qa-003', 'synthetic-not-a-login', 'user', '2026-01-01T00:00:00Z', '2026-01-01T00:00:00Z');

INSERT INTO "MnemLedger" ("id", "userId", "amount", "reason", "createdAt") VALUES
  ('ledger-a-001', 'qa-user-001', 100, 'synthetic grant', '2026-01-01T01:00:00Z'),
  ('ledger-b-001', 'qa-user-001', -30, 'synthetic spend', '2026-01-01T01:00:00Z'),
  ('ledger-c-001', 'qa-user-001', 20, 'synthetic grant', '2026-01-01T02:00:00Z'),
  ('ledger-d-001', 'qa-user-001', -40, 'synthetic spend', '2026-01-01T03:00:00Z'),
  ('ledger-a-002', 'qa-user-002', 200, 'synthetic grant', '2026-01-02T01:00:00Z'),
  ('ledger-b-002', 'qa-user-002', -64, 'synthetic spend', '2026-01-02T02:00:00Z'),
  ('ledger-c-002', 'qa-user-002', -64, 'synthetic spend', '2026-01-02T03:00:00Z'),
  ('ledger-d-002', 'qa-user-002', -64, 'synthetic spend', '2026-01-02T04:00:00Z'),
  ('ledger-a-003', 'qa-user-003', 100, 'synthetic grant', '2026-01-03T01:00:00Z'),
  ('ledger-b-003', 'qa-user-003', -20, 'synthetic spend', '2026-01-03T02:00:00Z'),
  ('ledger-c-003', 'qa-user-003', -10, 'synthetic spend', '2026-01-03T03:00:00Z');

INSERT INTO "Entitlement" (
  "id", "userId", "packageId", "chapterId", "source", "createdAt"
) VALUES
  ('ent-alias-001', 'qa-user-001', NULL, '0-11-orgie-1', 'legacy_chapter', '2026-01-01T04:00:00Z'),
  ('ent-package-a-001', 'qa-user-001', 'act-1', NULL, 'legacy_package', '2026-01-01T05:00:00Z'),
  ('ent-package-b-001', 'qa-user-001', 'act-1', NULL, 'legacy_package', '2026-01-01T05:00:00Z'),
  ('ent-package-002', 'qa-user-002', 'archiv-1024', NULL, 'legacy_package', '2026-01-02T05:00:00Z'),
  ('ent-chapter-003', 'qa-user-003', NULL, '0-4-searching', 'legacy_chapter', '2026-01-03T05:00:00Z');

INSERT INTO "FragmentUnlock" (
  "id", "userId", "fragmentId", "cost", "source", "unlockedAt"
) VALUES (
  'fragment-legacy-001', 'qa-user-001', 'frag-tai-diagnostic-0-4', 0,
  'legacy_fragment', '2026-01-01T06:00:00Z'
);

INSERT INTO "UserArtifact" (
  "id", "userId", "artifactId", "source", "unlockedAt"
) VALUES (
  'artifact-legacy-002', 'qa-user-002', 'glitchka-blanket',
  'legacy_artifact', '2026-01-02T06:00:00Z'
);

INSERT INTO "UserCosmeticUnlock" (
  "id", "userId", "cosmeticId", "source", "unlockedAt"
) VALUES (
  'cosmetic-legacy-003', 'qa-user-003', 'theme-green-matrix',
  'legacy_cosmetic', '2026-01-03T06:00:00Z'
);

INSERT INTO "AccessCode" (
  "id", "codeHash", "packageId", "userId", "used", "usedAt",
  "stripeSessionId", "createdAt"
) VALUES
  ('redeem-legacy-001', 'synthetic-hash-001', 'act-1', 'qa-user-001', true, '2026-01-01T07:00:00Z', NULL, '2026-01-01T07:00:00Z'),
  ('redeem-legacy-002', 'synthetic-hash-002', 'archiv-1024', 'qa-user-002', true, '2026-01-02T07:00:00Z', 'cs_test_synthetic_002', '2026-01-02T07:00:00Z');

INSERT INTO "ReadingProgress" (
  "id", "userId", "collection", "chapterId", "progressPercent", "readMs",
  "completed", "completedAt", "updatedAt"
) VALUES
  ('progress-001', 'qa-user-001', 'main', '0-4-searching', 100, 120000, true, '2026-01-01T08:00:00Z', '2026-01-01T08:00:00Z'),
  ('progress-002', 'qa-user-002', 'main', '0-3-mirror', 50, 60000, false, NULL, '2026-01-02T08:00:00Z');
