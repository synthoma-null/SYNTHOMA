-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."AccessCode" (
    "id" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "userId" TEXT,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "stripeSessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChoiceEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collection" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "blockId" TEXT,
    "choiceId" TEXT,
    "choiceText" TEXT NOT NULL,
    "nextBlockId" TEXT,
    "tags" JSONB,
    "functionDelta" JSONB,
    "emotionDelta" JSONB,
    "tone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChoiceEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Entitlement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packageId" TEXT,
    "chapterId" TEXT,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entitlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EntityRelation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "trust" INTEGER NOT NULL DEFAULT 0,
    "suspicion" INTEGER NOT NULL DEFAULT 0,
    "sync" INTEGER NOT NULL DEFAULT 0,
    "protection" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntityRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FragmentUnlock" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fragmentId" TEXT NOT NULL,
    "cost" INTEGER NOT NULL DEFAULT 0,
    "source" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FragmentUnlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GameMove" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "playerId" TEXT,
    "turnNumber" INTEGER NOT NULL,
    "actionType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "stateAfter" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameMove_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GameRoom" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "hostUserId" TEXT,
    "hostPlayerId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'lobby',
    "mode" TEXT NOT NULL DEFAULT 'party',
    "maxPlayers" INTEGER NOT NULL DEFAULT 6,
    "stateJson" JSONB NOT NULL,
    "stateVersion" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "GameRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GameRoomPlayer" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT,
    "clientTokenHash" TEXT,
    "nickname" TEXT NOT NULL,
    "seatIndex" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "isHost" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'connected',
    "lastSeenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameRoomPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MnemLedger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "stripeSessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MnemLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PsycheStats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ni" INTEGER NOT NULL DEFAULT 50,
    "fe" INTEGER NOT NULL DEFAULT 50,
    "ti" INTEGER NOT NULL DEFAULT 50,
    "se" INTEGER NOT NULL DEFAULT 50,
    "joy" INTEGER NOT NULL DEFAULT 0,
    "trust" INTEGER NOT NULL DEFAULT 0,
    "fear" INTEGER NOT NULL DEFAULT 0,
    "surprise" INTEGER NOT NULL DEFAULT 0,
    "sadness" INTEGER NOT NULL DEFAULT 0,
    "disgust" INTEGER NOT NULL DEFAULT 0,
    "anger" INTEGER NOT NULL DEFAULT 0,
    "anticipation" INTEGER NOT NULL DEFAULT 0,
    "shadow" INTEGER NOT NULL DEFAULT 0,
    "tone" TEXT NOT NULL DEFAULT 'neutrální_sarkastický',
    "initiative" TEXT NOT NULL DEFAULT 'standardní',
    "risk" TEXT NOT NULL DEFAULT 'standardní',
    "tempo" TEXT NOT NULL DEFAULT 'normální',
    "strategy" TEXT NOT NULL DEFAULT 'nezjištěno',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PsycheStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReadingProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collection" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "chapterTitle" TEXT,
    "lastBlockId" TEXT,
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "readMs" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadingProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubjectBadge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL DEFAULT 'behavior',

    CONSTRAINT "SubjectBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubjectVote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "votedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubjectVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailLower" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "nicknameLower" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserArtifact" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "artifactId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserArtifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserCosmeticUnlock" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cosmeticId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL,

    CONSTRAINT "UserCosmeticUnlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserMission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'locked',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "unlockedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserNameFragment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fragment" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserNameFragment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "title" TEXT NOT NULL DEFAULT 'Nezmapovaný subjekt',
    "publicProfile" BOOLEAN NOT NULL DEFAULT false,
    "showPsycheMap" BOOLEAN NOT NULL DEFAULT false,
    "showProgress" BOOLEAN NOT NULL DEFAULT true,
    "showChoices" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserRun" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cycleNumber" INTEGER NOT NULL DEFAULT 1,
    "stability" INTEGER NOT NULL DEFAULT 50,
    "memoryPressure" INTEGER NOT NULL DEFAULT 0,
    "shadow" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'synthoma',
    "animations" BOOLEAN NOT NULL DEFAULT true,
    "glass" BOOLEAN NOT NULL DEFAULT true,
    "typewriterSpeed" TEXT NOT NULL DEFAULT 'normal',
    "fontScale" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "audioEnabled" BOOLEAN NOT NULL DEFAULT true,
    "ttsEnabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WeeklyMemory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "accessLevel" TEXT NOT NULL DEFAULT 'archiv_plus',
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeeklyMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Whisper" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "publicMode" TEXT NOT NULL DEFAULT 'anonymous',
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "placement" TEXT NOT NULL DEFAULT 'random',
    "chapterId" TEXT,
    "emotionTags" TEXT NOT NULL DEFAULT '[]',
    "functionTags" TEXT NOT NULL DEFAULT '[]',
    "resonanceCount" INTEGER NOT NULL DEFAULT 0,
    "displayCount" INTEGER NOT NULL DEFAULT 0,
    "boostedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "Whisper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WhisperPurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "whisperId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "mnemCost" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhisperPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WhisperResonance" (
    "id" TEXT NOT NULL,
    "whisperId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhisperResonance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccessCode_codeHash_key" ON "public"."AccessCode"("codeHash" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Entitlement_userId_chapterId_key" ON "public"."Entitlement"("userId" ASC, "chapterId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "EntityRelation_userId_entity_key" ON "public"."EntityRelation"("userId" ASC, "entity" ASC);

-- CreateIndex
CREATE INDEX "EntityRelation_userId_idx" ON "public"."EntityRelation"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "FragmentUnlock_userId_fragmentId_key" ON "public"."FragmentUnlock"("userId" ASC, "fragmentId" ASC);

-- CreateIndex
CREATE INDEX "FragmentUnlock_userId_idx" ON "public"."FragmentUnlock"("userId" ASC);

-- CreateIndex
CREATE INDEX "GameMove_roomId_idx" ON "public"."GameMove"("roomId" ASC);

-- CreateIndex
CREATE INDEX "GameMove_turnNumber_idx" ON "public"."GameMove"("turnNumber" ASC);

-- CreateIndex
CREATE INDEX "GameRoom_code_idx" ON "public"."GameRoom"("code" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "GameRoom_code_key" ON "public"."GameRoom"("code" ASC);

-- CreateIndex
CREATE INDEX "GameRoom_status_idx" ON "public"."GameRoom"("status" ASC);

-- CreateIndex
CREATE INDEX "GameRoomPlayer_roomId_idx" ON "public"."GameRoomPlayer"("roomId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "GameRoomPlayer_roomId_seatIndex_key" ON "public"."GameRoomPlayer"("roomId" ASC, "seatIndex" ASC);

-- CreateIndex
CREATE INDEX "GameRoomPlayer_userId_idx" ON "public"."GameRoomPlayer"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "PsycheStats_userId_key" ON "public"."PsycheStats"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ReadingProgress_userId_collection_chapterId_key" ON "public"."ReadingProgress"("userId" ASC, "collection" ASC, "chapterId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "SubjectBadge_userId_badgeId_key" ON "public"."SubjectBadge"("userId" ASC, "badgeId" ASC);

-- CreateIndex
CREATE INDEX "SubjectBadge_userId_idx" ON "public"."SubjectBadge"("userId" ASC);

-- CreateIndex
CREATE INDEX "SubjectVote_pollId_idx" ON "public"."SubjectVote"("pollId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "SubjectVote_userId_pollId_key" ON "public"."SubjectVote"("userId" ASC, "pollId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_emailLower_key" ON "public"."User"("emailLower" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_nicknameLower_key" ON "public"."User"("nicknameLower" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "public"."User"("nickname" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserArtifact_userId_artifactId_key" ON "public"."UserArtifact"("userId" ASC, "artifactId" ASC);

-- CreateIndex
CREATE INDEX "UserArtifact_userId_idx" ON "public"."UserArtifact"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserCosmeticUnlock_userId_cosmeticId_key" ON "public"."UserCosmeticUnlock"("userId" ASC, "cosmeticId" ASC);

-- CreateIndex
CREATE INDEX "UserCosmeticUnlock_userId_idx" ON "public"."UserCosmeticUnlock"("userId" ASC);

-- CreateIndex
CREATE INDEX "UserMission_userId_idx" ON "public"."UserMission"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserMission_userId_missionId_key" ON "public"."UserMission"("userId" ASC, "missionId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserNameFragment_userId_fragment_key" ON "public"."UserNameFragment"("userId" ASC, "fragment" ASC);

-- CreateIndex
CREATE INDEX "UserNameFragment_userId_idx" ON "public"."UserNameFragment"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "public"."UserProfile"("userId" ASC);

-- CreateIndex
CREATE INDEX "UserRun_userId_idx" ON "public"."UserRun"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserRun_userId_key" ON "public"."UserRun"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "public"."UserSettings"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyMemory_slug_key" ON "public"."WeeklyMemory"("slug" ASC);

-- CreateIndex
CREATE INDEX "Whisper_chapterId_idx" ON "public"."Whisper"("chapterId" ASC);

-- CreateIndex
CREATE INDEX "Whisper_placement_idx" ON "public"."Whisper"("placement" ASC);

-- CreateIndex
CREATE INDEX "Whisper_status_idx" ON "public"."Whisper"("status" ASC);

-- CreateIndex
CREATE INDEX "Whisper_userId_idx" ON "public"."Whisper"("userId" ASC);

-- CreateIndex
CREATE INDEX "WhisperPurchase_userId_idx" ON "public"."WhisperPurchase"("userId" ASC);

-- CreateIndex
CREATE INDEX "WhisperPurchase_whisperId_idx" ON "public"."WhisperPurchase"("whisperId" ASC);

-- CreateIndex
CREATE INDEX "WhisperResonance_whisperId_idx" ON "public"."WhisperResonance"("whisperId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "WhisperResonance_whisperId_userId_key" ON "public"."WhisperResonance"("whisperId" ASC, "userId" ASC);

-- AddForeignKey
ALTER TABLE "public"."AccessCode" ADD CONSTRAINT "AccessCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChoiceEvent" ADD CONSTRAINT "ChoiceEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Entitlement" ADD CONSTRAINT "Entitlement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GameMove" ADD CONSTRAINT "GameMove_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."GameRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GameRoomPlayer" ADD CONSTRAINT "GameRoomPlayer_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."GameRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MnemLedger" ADD CONSTRAINT "MnemLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PsycheStats" ADD CONSTRAINT "PsycheStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReadingProgress" ADD CONSTRAINT "ReadingProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WhisperPurchase" ADD CONSTRAINT "WhisperPurchase_whisperId_fkey" FOREIGN KEY ("whisperId") REFERENCES "public"."Whisper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WhisperResonance" ADD CONSTRAINT "WhisperResonance_whisperId_fkey" FOREIGN KEY ("whisperId") REFERENCES "public"."Whisper"("id") ON DELETE CASCADE ON UPDATE CASCADE;
