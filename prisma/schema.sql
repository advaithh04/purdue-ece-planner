-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "name" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "careerGoals" TEXT[],
    "targetGPA" DOUBLE PRECISION,
    "maxWorkloadHours" INTEGER,
    "preferredDifficulty" TEXT,
    "completedCourses" TEXT[],
    "interests" TEXT[],
    "graduationSemester" TEXT,
    "currentSemester" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "description" TEXT,
    "prerequisites" TEXT[],
    "corequisites" TEXT[],
    "avgGPA" DOUBLE PRECISION,
    "gradeDistribution" JSONB,
    "difficultyRating" DOUBLE PRECISION,
    "workloadHours" DOUBLE PRECISION,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "semesters" TEXT[],
    "department" TEXT NOT NULL DEFAULT 'ECE',
    "level" INTEGER,
    "careerTags" TEXT[],
    "interestTags" TEXT[],
    "professors" TEXT[],
    "typicalDays" TEXT[],
    "hasMorningSection" BOOLEAN NOT NULL DEFAULT true,
    "hasAfternoonSection" BOOLEAN NOT NULL DEFAULT true,
    "hasEveningSection" BOOLEAN NOT NULL DEFAULT false,
    "hasFridayClass" BOOLEAN NOT NULL DEFAULT true,
    "hasOnlineOption" BOOLEAN NOT NULL DEFAULT false,
    "hasHybridOption" BOOLEAN NOT NULL DEFAULT false,
    "numExams" INTEGER,
    "isProjectBased" BOOLEAN NOT NULL DEFAULT false,
    "isExamBased" BOOLEAN NOT NULL DEFAULT true,
    "homeworkIntensity" TEXT,
    "isCodingHeavy" BOOLEAN NOT NULL DEFAULT false,
    "isMathHeavy" BOOLEAN NOT NULL DEFAULT false,
    "examIntensity" TEXT,
    "hasGroupProjects" BOOLEAN NOT NULL DEFAULT false,
    "isMajorRequirement" BOOLEAN NOT NULL DEFAULT false,
    "isTechElective" BOOLEAN NOT NULL DEFAULT false,
    "isGenEd" BOOLEAN NOT NULL DEFAULT false,
    "isLabCredit" BOOLEAN NOT NULL DEFAULT false,
    "requirementCategory" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "workload" INTEGER NOT NULL,
    "comment" TEXT,
    "professor" TEXT,
    "semester" TEXT,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannedCourse" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "grade" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlannedCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScraperLog" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "records" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScraperLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "UserPreferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_code_key" ON "Course"("code");

-- CreateIndex
CREATE INDEX "Course_department_idx" ON "Course"("department");

-- CreateIndex
CREATE INDEX "Course_level_idx" ON "Course"("level");

-- CreateIndex
CREATE INDEX "Course_isMajorRequirement_idx" ON "Course"("isMajorRequirement");

-- CreateIndex
CREATE INDEX "Course_isTechElective_idx" ON "Course"("isTechElective");

-- CreateIndex
CREATE INDEX "Review_courseId_idx" ON "Review"("courseId");

-- CreateIndex
CREATE INDEX "Review_source_idx" ON "Review"("source");

-- CreateIndex
CREATE INDEX "PlannedCourse_userId_idx" ON "PlannedCourse"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PlannedCourse_userId_courseCode_semester_key" ON "PlannedCourse"("userId", "courseCode", "semester");

-- CreateIndex
CREATE INDEX "ScraperLog_source_idx" ON "ScraperLog"("source");

-- CreateIndex
CREATE INDEX "ScraperLog_createdAt_idx" ON "ScraperLog"("createdAt");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedCourse" ADD CONSTRAINT "PlannedCourse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
