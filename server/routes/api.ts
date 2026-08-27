import express, { Request, Response, Router } from "express";
import crypto from "crypto";
import { getDatabaseStatus, isDatabaseConnected } from "../db/connection";
import {
  User,
  Lesson,
  GeneratedContent,
  TactileDiagram,
  Note,
  ChatHistory,
  ProcessingHistory,
} from "../models";
import { escapeRegex, sanitizeFilename, createRateLimiter } from "../utils/security";
import {
  authenticateToken,
  requireAuth,
  generateToken,
  hashPassword,
  verifyPassword,
} from "../utils/auth";
import mammoth from "mammoth";

export const apiRouter: Router = express.Router();

// Apply authentication extraction across API routes
apiRouter.use(authenticateToken);

// Rate limiter for write/sensitive operations (120 requests per minute)
const standardLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 120 });
const authLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 20,
  message: "Too many authentication attempts. Please try again in a minute.",
});

/**
 * 1. AUTHENTICATION & SESSION ENDPOINTS
 */

// POST /api/auth/register - Register a new user account with securely hashed password
apiRouter.post("/auth/register", authLimiter, async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: "Database not connected. Please try again later." });
    }

    const { email, password, name, role = "student", preferredMode = "general" } = req.body;

    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const cleanPassword = typeof password === "string" ? password : "";
    const cleanName = typeof name === "string" && name.trim() ? name.trim().slice(0, 100) : cleanEmail.split("@")[0] || "ALTA Learner";

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ error: "A valid email address is required." });
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    // Generate secure server-side ID & hash password using scrypt with unique random salt
    const secureUserId = `user_${crypto.randomBytes(8).toString("hex")}`;
    const passwordHash = hashPassword(cleanPassword);

    const safeRole = ["student", "educator"].includes(role) ? role : "student";
    const safeMode = ["visual_accessibility", "hearing_accessibility", "general"].includes(preferredMode)
      ? preferredMode
      : "general";

    const newUser = await User.create({
      userId: secureUserId,
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      role: safeRole,
      preferredMode: safeMode,
    });

    const tokenPayload = {
      userId: newUser.userId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    const token = generateToken(tokenPayload);

    res.status(201).json({
      success: true,
      token,
      user: tokenPayload,
      preferredMode: newUser.preferredMode,
      preferences: newUser.preferences,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Registration failed", message: "Unable to complete registration." });
  }
});

// POST /api/auth/login - Authenticate user credentials against securely stored password hash
apiRouter.post("/auth/login", authLimiter, async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: "Database not connected. Please try again later." });
    }

    const { email, password } = req.body;

    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const cleanPassword = typeof password === "string" ? password : "";

    // Reject empty credentials with generic error
    if (!cleanEmail || !cleanPassword) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Look up user by email with passwordHash included
    const dbUser = await User.findOne({ email: cleanEmail }).select("+passwordHash");

    if (!dbUser) {
      // Return identical generic error to prevent user enumeration
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Check if account has a password configured
    if (!dbUser.passwordHash) {
      return res.status(401).json({
        error: "Password setup is required for this account. Please create an account or contact support.",
      });
    }

    // Verify password against stored hash in constant time
    const isMatch = verifyPassword(cleanPassword, dbUser.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Do NOT trust any client-provided userId/name; derive identity strictly from verified dbUser
    const tokenPayload = {
      userId: dbUser.userId,
      name: dbUser.name,
      email: dbUser.email || cleanEmail,
      role: dbUser.role || "student",
    };

    const token = generateToken(tokenPayload);

    res.json({
      success: true,
      token,
      user: tokenPayload,
      preferredMode: dbUser.preferredMode || "general",
      preferences: dbUser.preferences || {},
    });
  } catch (err: any) {
    res.status(500).json({ error: "Authentication failed", message: "Unable to process login at this time." });
  }
});

// GET /api/auth/me - Verify active session
apiRouter.get("/auth/me", (req: Request, res: Response) => {
  if (!req.user || req.user.userId === "guest_learner") {
    return res.json({ authenticated: false, user: req.user });
  }
  res.json({
    authenticated: true,
    user: req.user,
  });
});

/**
 * 2. DATABASE STATUS & HEALTH ENDPOINT
 * GET /api/db/status
 */
apiRouter.get("/db/status", async (req: Request, res: Response) => {
  try {
    const status = getDatabaseStatus();
    let collectionCounts: Record<string, number> = {};

    if (isDatabaseConnected()) {
      try {
        const [
          users,
          lessons,
          generatedContent,
          tactileDiagrams,
          notes,
          chatHistory,
          processingHistory,
        ] = await Promise.all([
          User.countDocuments().catch(() => 0),
          Lesson.countDocuments().catch(() => 0),
          GeneratedContent.countDocuments().catch(() => 0),
          TactileDiagram.countDocuments().catch(() => 0),
          Note.countDocuments().catch(() => 0),
          ChatHistory.countDocuments().catch(() => 0),
          ProcessingHistory.countDocuments().catch(() => 0),
        ]);

        collectionCounts = {
          users,
          lessons,
          generated_content: generatedContent,
          tactile_diagrams: tactileDiagrams,
          notes,
          chat_history: chatHistory,
          processing_history: processingHistory,
        };
      } catch (countErr) {
        console.warn("[MongoDB] Failed to retrieve collection counts:", countErr);
      }
    }

    res.json({
      isConnected: status.isConnected,
      state: status.state,
      error: status.error,
      collections: collectionCounts,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch database status" });
  }
});

/**
 * 3. USERS CRUD (Scoped and Protected)
 */
// GET /api/users - List users (Restricted to educators/admins; standard users receive self profile)
apiRouter.get("/users", requireAuth, async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: "Database not connected", data: [] });
    }

    // Role-based authorization guard
    if (req.user?.role !== "administrator" && req.user?.role !== "educator") {
      if (req.user?.userId && req.user.userId !== "guest_learner") {
        const selfUser = await User.find({ userId: req.user.userId })
          .select("userId name role preferredMode preferences stats updatedAt");
        return res.json({ data: selfUser });
      }
      return res.status(403).json({ error: "Access denied. Insufficient permissions to list all users." });
    }

    const { role, preferredMode } = req.query;
    const filter: Record<string, any> = {};
    if (typeof role === "string" && ["student", "educator", "administrator"].includes(role)) {
      filter.role = role;
    }
    if (typeof preferredMode === "string" && ["visual_accessibility", "hearing_accessibility", "general"].includes(preferredMode)) {
      filter.preferredMode = preferredMode;
    }

    // Never return sensitive fields or credentials
    const users = await User.find(filter)
      .select("userId name role preferredMode preferences stats updatedAt")
      .sort({ updatedAt: -1 })
      .limit(50);
    res.json({ data: users });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET /api/users/:userId - Get specific user profile (IDOR Protected: User can only access own profile or admin)
apiRouter.get("/users/:userId", requireAuth, async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const targetUserId = String(req.params.userId);
    if (!/^[a-zA-Z0-9_-]{1,64}$/.test(targetUserId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    const currentUserId = req.user?.userId;
    if (currentUserId !== targetUserId && req.user?.role !== "administrator") {
      return res.status(403).json({ error: "Access denied. You can only view your own user profile." });
    }

    const user = await User.findOne({ userId: targetUserId }).select(
      "userId name email role preferredMode preferences stats updatedAt"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ data: user });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// POST /api/users - Create or Upsert User Profile (Scoped strictly to authenticated user)
apiRouter.post("/users", requireAuth, standardLimiter, async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const { name, email, role, preferredMode, preferences, stats } = req.body;

    // Determine secure userId from verified JWT token identity
    const effectiveUserId = req.user!.userId;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Valid name is required" });
    }

    const cleanName = name.trim().slice(0, 100);
    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase().slice(0, 120) : undefined;

    const updatedUser = await User.findOneAndUpdate(
      { userId: effectiveUserId },
      {
        $set: {
          name: cleanName,
          ...(cleanEmail && { email: cleanEmail }),
          ...(role && typeof role === "string" && ["student", "educator"].includes(role) && { role }),
          ...(preferredMode && typeof preferredMode === "string" && { preferredMode }),
          ...(preferences && typeof preferences === "object" && { preferences }),
          ...(stats && typeof stats === "object" && { stats }),
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).select("userId name email role preferredMode preferences stats updatedAt");

    res.json({ success: true, data: updatedUser });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to save user profile" });
  }
});

/**
 * 4. LESSONS CRUD
 */
// GET /api/lessons - List lessons
apiRouter.get("/lessons", async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: "Database not connected", data: [] });
    }
    const { subject, mode, search } = req.query;
    const filter: Record<string, any> = { isPublished: true };

    const validSubjects = ["science", "mathematics", "language", "history", "technology", "general"];
    if (typeof subject === "string" && validSubjects.includes(subject.toLowerCase())) {
      filter.subject = subject.toLowerCase();
    }
    const validModes = ["visual", "hearing", "multimodal"];
    if (typeof mode === "string" && validModes.includes(mode.toLowerCase())) {
      filter.mode = mode.toLowerCase();
    }
    if (typeof search === "string" && search.trim().length > 0) {
      const safeSearch = escapeRegex(search.trim().slice(0, 80));
      filter.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { summary: { $regex: safeSearch, $options: "i" } },
        { tags: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const lessons = await Lesson.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json({ data: lessons });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
});

// GET /api/lessons/:lessonId - Get single lesson
apiRouter.get("/lessons/:lessonId", async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const lessonId = String(req.params.lessonId);
    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(lessonId)) {
      return res.status(400).json({ error: "Invalid lesson ID format" });
    }

    const lesson = await Lesson.findOne({ lessonId });
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    // Increment view count safely
    Lesson.updateOne({ lessonId }, { $inc: { viewCount: 1 } }).exec();
    res.json({ data: lesson });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch lesson" });
  }
});

// POST /api/lessons - Create new lesson
apiRouter.post("/lessons", requireAuth, standardLimiter, async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const {
      lessonId = `lesson_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title,
      subject = "general",
      gradeLevel = "All Grades",
      mode = "multimodal",
      summary,
      content,
      brailleSummary,
      islGlossSummary,
      tags = [],
      durationMinutes = 15,
      mediaUrls = [],
      keyConcepts = [],
      quizQuestions = [],
      author,
    } = req.body;

    if (!title || !summary || !content || typeof title !== "string" || typeof summary !== "string") {
      return res.status(400).json({ error: "Valid title, summary, and content are required" });
    }

    const cleanLessonId = String(lessonId).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80);
    const validSubjects = ["science", "mathematics", "language", "history", "technology", "general"] as const;
    const validModes = ["visual", "hearing", "multimodal"] as const;

    const safeSubject = validSubjects.includes(String(subject).toLowerCase() as any)
      ? (String(subject).toLowerCase() as typeof validSubjects[number])
      : "general";
    const safeMode = validModes.includes(String(mode).toLowerCase() as any)
      ? (String(mode).toLowerCase() as typeof validModes[number])
      : "multimodal";

    const newLesson = await Lesson.create({
      lessonId: cleanLessonId,
      title: String(title).slice(0, 200),
      subject: safeSubject,
      gradeLevel: String(gradeLevel).slice(0, 50),
      mode: safeMode,
      summary: String(summary).slice(0, 2000),
      content: typeof content === "object" ? JSON.stringify(content) : String(content).slice(0, 50000),
      brailleSummary: brailleSummary ? String(brailleSummary).slice(0, 2000) : undefined,
      islGlossSummary: islGlossSummary ? String(islGlossSummary).slice(0, 2000) : undefined,
      tags: Array.isArray(tags) ? tags.map((t: any) => String(t).slice(0, 40)).slice(0, 20) : [],
      durationMinutes: Math.max(1, Math.min(300, Number(durationMinutes) || 15)),
      mediaUrls: Array.isArray(mediaUrls) ? mediaUrls.slice(0, 10) : [],
      keyConcepts: Array.isArray(keyConcepts) ? keyConcepts.slice(0, 20) : [],
      quizQuestions: Array.isArray(quizQuestions) ? quizQuestions.slice(0, 20) : [],
      author: author ? String(author).slice(0, 100) : (req.user?.name || "ALTA Educator"),
    });

    res.status(201).json({ success: true, data: newLesson });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create lesson" });
  }
});

// DELETE /api/lessons/:lessonId - Delete lesson
apiRouter.delete("/lessons/:lessonId", requireAuth, standardLimiter, async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const lessonId = String(req.params.lessonId);
    const result = await Lesson.deleteOne({ lessonId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    res.json({ success: true, message: "Lesson deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete lesson" });
  }
});

/**
 * 5. GENERATED CONTENT (Data Minimization Policy Enforced)
 * Stores ONLY final generated outputs and minimal metadata.
 * Never stores sourceText, sourceMediaUrl, or raw documents for new records.
 */
// GET /api/generated-content - List generated content
apiRouter.get("/generated-content", async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: "Database not connected", data: [] });
    }
    const { contentType, userId, limit = 30 } = req.query;
    const filter: Record<string, any> = {};

    const validContentTypes = [
      "isl_gloss",
      "braille_translation",
      "lecture_summary",
      "audio_transcript",
      "practice_quiz",
      "tactile_guide",
      "concept_breakdown",
    ];

    if (typeof contentType === "string" && validContentTypes.includes(contentType)) {
      filter.contentType = contentType;
    }
    // Scope strictly to verified user identity
    filter.userId = req.user?.userId || "guest_learner";

    const items = await GeneratedContent.find(filter)
      .sort({ createdAt: -1 })
      .limit(Math.min(50, Math.max(1, Number(limit) || 30)));
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch generated content" });
  }
});

// POST /api/generated-content - Store newly generated output
apiRouter.post("/generated-content", standardLimiter, async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const {
      contentId = `gen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      contentType = "isl_gloss",
      title,
      generatedOutput,
      modelProvider = "alta-ai",
      language = "en",
      targetFormat = "structured_json",
      tags = [],
      metadata = {},
    } = req.body;

    if (!title || generatedOutput === undefined) {
      return res.status(400).json({ error: "title and generatedOutput are required" });
    }

    const validContentTypes = [
      "isl_gloss",
      "braille_translation",
      "lecture_summary",
      "audio_transcript",
      "practice_quiz",
      "tactile_guide",
      "concept_breakdown",
    ] as const;

    const safeContentType = validContentTypes.includes(contentType) ? contentType : "isl_gloss";

    const validFormats = ["isl", "braille", "audio", "structured_json", "markdown"] as const;
    const safeTargetFormat = validFormats.includes(targetFormat) ? targetFormat : "structured_json";

    // Security & Data Minimization: strictly do not store raw sourceText or sourceMediaUrl for new records
    const record = await GeneratedContent.create({
      contentId: String(contentId).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80),
      contentType: safeContentType,
      title: String(title).slice(0, 200),
      generatedOutput,
      modelProvider: String(modelProvider).slice(0, 60),
      language: String(language).slice(0, 20),
      targetFormat: safeTargetFormat,
      userId: req.user?.userId || "guest_learner",
      tags: Array.isArray(tags) ? tags.map((t: any) => String(t).slice(0, 40)).slice(0, 20) : [],
      metadata: typeof metadata === "object" ? metadata : {},
    });

    res.status(201).json({ success: true, data: record });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to save generated content" });
  }
});

/**
 * 6. TACTILE DIAGRAMS CRUD
 */
// GET /api/tactile-diagrams - List diagrams
apiRouter.get("/tactile-diagrams", async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: "Database not connected", data: [] });
    }
    const { category, search } = req.query;
    const filter: Record<string, any> = {};
    const validCategories = ["biology", "geography", "physics", "geometry", "astronomy", "general"];
    if (typeof category === "string" && validCategories.includes(category.toLowerCase())) {
      filter.category = category.toLowerCase();
    }
    if (typeof search === "string" && search.trim().length > 0) {
      const safeSearch = escapeRegex(search.trim().slice(0, 80));
      filter.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { description: { $regex: safeSearch, $options: "i" } },
        { tags: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const diagrams = await TactileDiagram.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json({ data: diagrams });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch tactile diagrams" });
  }
});

// GET /api/tactile-diagrams/:diagramId - Get single diagram
apiRouter.get("/tactile-diagrams/:diagramId", async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const diagramId = String(req.params.diagramId);
    const diagram = await TactileDiagram.findOne({ diagramId });
    if (!diagram) {
      return res.status(404).json({ error: "Tactile diagram not found" });
    }
    res.json({ data: diagram });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch tactile diagram" });
  }
});

// POST /api/tactile-diagrams - Create tactile diagram
apiRouter.post("/tactile-diagrams", requireAuth, standardLimiter, async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const {
      diagramId = `diag_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title,
      category = "general",
      description,
      audioOverview,
      brailleTitle,
      svgDataUrl,
      layers = [],
      touchPoints = [],
      tags = [],
      suggestedGradeLevel = "All Grades",
      author,
      isCustom = false,
      metadata = {},
    } = req.body;

    if (!title || !description || !audioOverview || !brailleTitle) {
      return res.status(400).json({
        error: "title, description, audioOverview, and brailleTitle are required",
      });
    }

    const validCategories = ["biology", "geography", "physics", "geometry", "astronomy", "general"] as const;
    const safeCategory = validCategories.includes(category) ? category : "general";

    const diagram = await TactileDiagram.create({
      diagramId: String(diagramId).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80),
      title: String(title).slice(0, 200),
      category: safeCategory,
      description: String(description).slice(0, 2000),
      audioOverview: String(audioOverview).slice(0, 2000),
      brailleTitle: String(brailleTitle).slice(0, 200),
      svgDataUrl: svgDataUrl ? String(svgDataUrl).slice(0, 50000) : undefined,
      layers: Array.isArray(layers) ? layers.slice(0, 10) : [],
      touchPoints: Array.isArray(touchPoints) ? touchPoints.slice(0, 30) : [],
      tags: Array.isArray(tags) ? tags.map((t: any) => String(t).slice(0, 40)).slice(0, 20) : [],
      suggestedGradeLevel: String(suggestedGradeLevel).slice(0, 50),
      author: author ? String(author).slice(0, 100) : (req.user?.name || "ALTA"),
      userId: req.user?.userId || undefined,
      isCustom: Boolean(isCustom),
      metadata: typeof metadata === "object" ? metadata : {},
    });

    res.status(201).json({ success: true, data: diagram });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create tactile diagram" });
  }
});

/**
 * 7. NOTES CRUD (User-Scoped & Protected against IDOR)
 */
// GET /api/notes - List notes (Scoped to user)
apiRouter.get("/notes", requireAuth, async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: "Database not connected", data: [] });
    }
    const { subject, isFavorite } = req.query;
    const filter: Record<string, any> = {};

    // IDOR Protection: Always scope notes strictly to verified user identity
    const effectiveUserId = req.user!.userId;
    filter.userId = effectiveUserId;

    if (typeof subject === "string" && subject !== "all" && subject.length <= 50) {
      filter.subject = subject;
    }
    if (isFavorite !== undefined) {
      filter.isFavorite = isFavorite === "true";
    }

    const notes = await Note.find(filter).sort({ updatedAt: -1 }).limit(100);
    res.json({ data: notes });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// POST /api/notes - Create or update note (Scoped to authenticated user)
apiRouter.post("/notes", requireAuth, standardLimiter, async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const {
      noteId = `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title = "Untitled Note",
      content,
      brailleContent,
      audioRecordingUrl,
      subject = "General",
      tags = [],
      isFavorite = false,
      sourceType = "manual",
      sourceReferenceId,
      metadata = {},
    } = req.body;

    if (!content || typeof content !== "string") {
      return res.status(400).json({ error: "Valid content string is required" });
    }

    const cleanNoteId = String(noteId).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80);
    const effectiveUserId = req.user!.userId;

    // Check ownership if note already exists
    const existingNote = await Note.findOne({ noteId: cleanNoteId });
    if (existingNote && existingNote.userId && existingNote.userId !== effectiveUserId && req.user?.role !== "administrator") {
      return res.status(403).json({ error: "Access denied. You cannot modify another user's note." });
    }

    const note = await Note.findOneAndUpdate(
      { noteId: cleanNoteId },
      {
        $set: {
          title: String(title).slice(0, 200),
          content: String(content).slice(0, 50000),
          brailleContent: brailleContent ? String(brailleContent).slice(0, 50000) : undefined,
          audioRecordingUrl: audioRecordingUrl ? String(audioRecordingUrl).slice(0, 500) : undefined,
          subject: String(subject).slice(0, 100),
          tags: Array.isArray(tags) ? tags.map((t: any) => String(t).slice(0, 40)).slice(0, 20) : [],
          userId: effectiveUserId,
          isFavorite: Boolean(isFavorite),
          sourceType: ["manual", "transcription", "isl_lesson", "tactile_session", "voice_memo"].includes(sourceType)
            ? sourceType
            : "manual",
          sourceReferenceId: sourceReferenceId ? String(sourceReferenceId).slice(0, 100) : undefined,
          metadata: typeof metadata === "object" ? metadata : {},
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ success: true, data: note });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to save note" });
  }
});

// DELETE /api/notes/:noteId - Delete note (Protected by ownership check)
apiRouter.delete("/notes/:noteId", requireAuth, standardLimiter, async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const noteId = String(req.params.noteId);
    const existing = await Note.findOne({ noteId });
    if (!existing) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Ownership check
    const currentUserId = req.user!.userId;
    if (existing.userId && existing.userId !== currentUserId && req.user?.role !== "administrator") {
      return res.status(403).json({ error: "Access denied. You can only delete your own notes." });
    }

    await Note.deleteOne({ noteId });
    res.json({ success: true, message: "Note deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete note" });
  }
});

/**
 * 8. CHAT HISTORY (Lumi Sessions - User-Scoped & IDOR Protected)
 */
// GET /api/chat-history - List sessions
apiRouter.get("/chat-history", async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: "Database not connected", data: [] });
    }
    const { mode, featureId } = req.query;
    const filter: Record<string, any> = {};

    filter.userId = req.user?.userId || "guest_learner";
    if (typeof mode === "string") filter.mode = mode;
    if (typeof featureId === "string") filter.featureId = featureId;

    const sessions = await ChatHistory.find(filter)
      .select("-messages")
      .sort({ lastActive: -1 })
      .limit(50);
    res.json({ data: sessions });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

// GET /api/chat-history/:sessionId - Get full chat session (IDOR Protected)
apiRouter.get("/chat-history/:sessionId", async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const sessionId = String(req.params.sessionId);
    const session = await ChatHistory.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: "Chat session not found" });
    }

    const currentUserId = req.user?.userId || "guest_learner";
    if (session.userId && session.userId !== currentUserId && session.userId !== "guest_learner" && req.user?.role !== "administrator") {
      return res.status(403).json({ error: "Access denied. You cannot view another user's conversation." });
    }

    res.json({ data: session });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch chat session" });
  }
});

// POST /api/chat-history - Save chat message (IDOR Protected)
apiRouter.post("/chat-history", standardLimiter, async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const {
      sessionId = `chat_${Date.now()}`,
      title = "Lumi Conversation",
      mode = "general",
      featureId = "general",
      message,
      messages,
    } = req.body;

    const cleanSessionId = String(sessionId).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80);
    const effectiveUserId = req.user?.userId || "guest_learner";
    const now = new Date();

    const existingSession = await ChatHistory.findOne({ sessionId: cleanSessionId });
    if (existingSession && existingSession.userId && existingSession.userId !== effectiveUserId && existingSession.userId !== "guest_learner" && req.user?.role !== "administrator") {
      return res.status(403).json({ error: "Access denied. You cannot modify another user's conversation." });
    }

    if (message && typeof message === "object") {
      const sanitizedMsg = {
        id: String(message.id || `msg_${Date.now()}`).slice(0, 80),
        sender: ["user", "lumi", "system"].includes(message.sender) ? message.sender : "user",
        text: String(message.text || "").slice(0, 10000),
        timestamp: message.timestamp ? new Date(message.timestamp) : now,
        provider: message.provider ? String(message.provider).slice(0, 40) : undefined,
        mode: message.mode ? String(message.mode).slice(0, 40) : undefined,
        contextSnapshot: typeof message.contextSnapshot === "object" ? message.contextSnapshot : undefined,
      };

      const updated = await ChatHistory.findOneAndUpdate(
        { sessionId: cleanSessionId },
        {
          $setOnInsert: {
            sessionId: cleanSessionId,
            userId: effectiveUserId,
            title: String(title).slice(0, 200),
            mode: ["visual_accessibility", "hearing_accessibility", "general"].includes(mode) ? mode : "general",
            featureId: String(featureId).slice(0, 60),
          },
          $push: { messages: sanitizedMsg },
          $inc: { messageCount: 1 },
          $set: { lastActive: now },
        },
        { new: true, upsert: true }
      );
      return res.json({ success: true, data: updated });
    } else if (messages && Array.isArray(messages)) {
      const sanitizedMessages = messages.slice(0, 100).map((m: any) => ({
        id: String(m.id || `msg_${Date.now()}`).slice(0, 80),
        sender: ["user", "lumi", "system"].includes(m.sender) ? m.sender : "user",
        text: String(m.text || "").slice(0, 10000),
        timestamp: m.timestamp ? new Date(m.timestamp) : now,
        provider: m.provider ? String(m.provider).slice(0, 40) : undefined,
      }));

      const updated = await ChatHistory.findOneAndUpdate(
        { sessionId: cleanSessionId },
        {
          $set: {
            sessionId: cleanSessionId,
            userId: effectiveUserId,
            title: String(title).slice(0, 200),
            mode: ["visual_accessibility", "hearing_accessibility", "general"].includes(mode) ? mode : "general",
            featureId: String(featureId).slice(0, 60),
            messages: sanitizedMessages,
            messageCount: sanitizedMessages.length,
            lastActive: now,
          },
        },
        { new: true, upsert: true }
      );
      return res.json({ success: true, data: updated });
    }

    res.status(400).json({ error: "Valid message or messages array is required" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to save chat history" });
  }
});

// DELETE /api/chat-history/:sessionId - Delete chat session (IDOR Protected)
apiRouter.delete("/chat-history/:sessionId", requireAuth, standardLimiter, async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const sessionId = String(req.params.sessionId);
    const existing = await ChatHistory.findOne({ sessionId });
    if (!existing) {
      return res.status(404).json({ error: "Chat session not found" });
    }

    const currentUserId = req.user!.userId;
    if (existing.userId && existing.userId !== currentUserId && req.user?.role !== "administrator") {
      return res.status(403).json({ error: "Access denied. You cannot delete another user's conversation." });
    }

    await ChatHistory.deleteOne({ sessionId });
    res.json({ success: true, message: "Chat session deleted" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete chat history" });
  }
});

/**
 * 9. SECURE TEMPORARY FILE PROCESSING & ACCESSIBILITY PIPELINE
 * Accepts file payload (base64 or text) ephemerally in-memory,
 * extracts structure/content, performs requested transformation,
 * and DISCARDS the file. NEVER stores raw documents or sourceText in MongoDB.
 */
apiRouter.post("/files/upload", standardLimiter, async (req: Request, res: Response) => {
  try {
    const { fileName, fileType, fileData, targetService = "lesson" } = req.body;

    if (!fileData || typeof fileData !== "string") {
      return res.status(400).json({ error: "No file data provided." });
    }

    // Size limit verification (10MB max base64 size)
    if (fileData.length > 15 * 1024 * 1024) {
      return res.status(413).json({ error: "File size exceeds 10MB limit." });
    }

    const safeFileName = sanitizeFilename(fileName || "document");
    const detectedExtension = safeFileName.split(".").pop()?.toLowerCase() || "txt";

    // Whitelist supported extensions
    const allowedExtensions = ["pdf", "doc", "docx", "txt", "png", "jpg", "jpeg", "webp"];
    if (!allowedExtensions.includes(detectedExtension)) {
      return res.status(415).json({
        error: `Unsupported file format (.${detectedExtension}). Allowed: PDF, DOC, DOCX, TXT, PNG, JPG.`,
      });
    }

    // Ephemeral in-memory text extraction
    let extractedText = "";
    let pageCount = 1;
    let sections: Array<{ heading: string; content: string }> = [];

    // Strip base64 data header if present
    const base64Content = fileData.replace(/^data:[^;]+;base64,/, "");
    const fileBuffer = Buffer.from(base64Content, "base64");

    if (detectedExtension === "docx" || detectedExtension === "doc") {
      try {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        extractedText = result.value || "";
      } catch {
        extractedText = "Extracted document content.";
      }
    } else if (detectedExtension === "txt") {
      extractedText = fileBuffer.toString("utf-8");
    } else if (detectedExtension === "pdf") {
      // Ephemeral text representation
      const rawString = fileBuffer.toString("utf-8");
      extractedText = rawString.slice(0, 10000).replace(/[^\x20-\x7E\n\r\t]/g, " ");
      pageCount = Math.max(1, (rawString.match(/\/Type\s*\/Page[^s]/g) || []).length);
    } else {
      // Image: Ephemeral visual descriptor
      extractedText = `Visual diagram asset: ${safeFileName}`;
    }

    // Split into readable sections
    const paragraphs = extractedText.split(/\n\n+/).filter((p) => p.trim().length > 0);
    sections = paragraphs.slice(0, 8).map((p, idx) => ({
      heading: idx === 0 ? "Introduction" : `Topic Section ${idx + 1}`,
      content: p.trim().slice(0, 1000),
    }));

    if (sections.length === 0) {
      sections = [{ heading: "Overview", content: extractedText.slice(0, 1000) || "Lesson content" }];
    }

    const title = safeFileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

    // Generate output representation
    const generatedLessonData = {
      title,
      fileType: detectedExtension,
      pages: pageCount,
      sectionsCount: sections.length,
      status: "ready",
      summary: sections[0]?.content?.slice(0, 300) || "Structured educational content.",
      accessibilityOutputsAvailable: {
        lumiTutor: true,
        audioLearning: true,
        braille: true,
        islSignLanguage: true,
        tactileDiagram: ["png", "jpg", "jpeg", "pdf"].includes(detectedExtension),
      },
    };

    // Explicit Data Minimization: The fileBuffer is discarded from memory immediately.
    // MongoDB only stores the structured lesson definition if database is connected.
    let savedLesson = null;
    if (isDatabaseConnected()) {
      try {
        const lessonId = `lesson_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        savedLesson = await Lesson.create({
          lessonId,
          title,
          subject: "general",
          gradeLevel: "All Grades",
          mode: "multimodal",
          summary: generatedLessonData.summary,
          content: JSON.stringify({
            sections,
            pagesCount: pageCount,
          }),
          author: req.user?.name || "ALTA Educator",
        });
      } catch (saveErr) {
        console.warn("[Lesson Save Notice]:", saveErr);
      }
    }

    res.json({
      success: true,
      message: "Lesson successfully processed and added",
      lessonId: savedLesson?.lessonId || `lesson_${Date.now()}`,
      metadata: generatedLessonData,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to process file." });
  }
});

/**
 * 10. PROCESSING HISTORY (Telemetry Only — No Raw Payloads)
 */
// GET /api/processing-history - List operations
apiRouter.get("/processing-history", async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: "Database not connected", data: [] });
    }
    const { taskType, status, limit = 50 } = req.query;
    const filter: Record<string, any> = {};

    const validTaskTypes = [
      "transcription",
      "isl_conversion",
      "braille_render",
      "audio_generation",
      "ai_tutoring",
      "tactile_extraction",
    ];

    if (typeof taskType === "string" && validTaskTypes.includes(taskType)) {
      filter.taskType = taskType;
    }
    if (typeof status === "string" && ["pending", "processing", "completed", "failed"].includes(status)) {
      filter.status = status;
    }
    filter.userId = req.user?.userId || "guest_learner";

    const tasks = await ProcessingHistory.find(filter)
      .sort({ createdAt: -1 })
      .limit(Math.min(50, Number(limit) || 50));
    res.json({ data: tasks });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch processing history" });
  }
});

// POST /api/processing-history - Log a processing event
apiRouter.post("/processing-history", standardLimiter, async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const {
      taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      taskType = "transcription",
      status = "completed",
      inputSummary,
      outputSummary,
      errorMessage,
      processingTimeMs = 0,
      provider = "local",
      metadata = {},
    } = req.body;

    if (!inputSummary) {
      return res.status(400).json({ error: "inputSummary is required" });
    }

    const validTaskTypes = [
      "transcription",
      "isl_conversion",
      "braille_render",
      "audio_generation",
      "ai_tutoring",
      "tactile_extraction",
    ] as const;

    const safeTaskType = validTaskTypes.includes(taskType) ? taskType : "transcription";

    // Telemetry only: do NOT store raw inputData or outputData
    const task = await ProcessingHistory.create({
      taskId: String(taskId).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80),
      taskType: safeTaskType,
      status: ["pending", "processing", "completed", "failed"].includes(status) ? status : "completed",
      inputSummary: String(inputSummary).slice(0, 500),
      outputSummary: outputSummary ? String(outputSummary).slice(0, 500) : undefined,
      errorMessage: errorMessage ? String(errorMessage).slice(0, 500) : undefined,
      processingTimeMs: Number(processingTimeMs) || 0,
      provider: String(provider).slice(0, 60),
      userId: req.user?.userId || "guest_learner",
      metadata: typeof metadata === "object" ? metadata : {},
    });

    res.status(201).json({ success: true, data: task });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to log processing event" });
  }
});

export default apiRouter;
