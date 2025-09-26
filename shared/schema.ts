import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Management
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Farmer Profile with existing schema structure
export const farmers = pgTable("farmers", {
  id: varchar("id").primaryKey(),
  phone: text("phone").notNull().unique(),
  region: text("region").notNull(),
  isVerified: boolean("is_verified").default(true),
  latitude: integer("latitude"),
  longitude: integer("longitude"),
  // Quiz-specific fields
  totalCoins: integer("total_coins").default(0),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  level: text("level").default("pupil"), // pupil, specialist, master
  totalQuizzes: integer("total_quizzes").default(0),
  correctAnswers: integer("correct_answers").default(0),
  lastQuizDate: timestamp("last_quiz_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Animal Groups (from existing schema)
export const animalGroups = pgTable("animal_groups", {
  id: varchar("id").primaryKey(),
  farmerId: varchar("farmer_id").references(() => farmers.id),
  groupName: text("group_name").notNull(),
  animalType: text("animal_type").notNull(), // pig, poultry, cattle
  breedType: text("breed_type").notNull(),
  totalAnimals: integer("total_animals").default(0),
  vaccinatedCount: integer("vaccinated_count").default(0),
  ageRange: json("age_range"), // {min: number, max: number}
  risks: json("risks"), // ["humid", "wild_boars"]
  createdAt: timestamp("created_at").defaultNow(),
});

// Quiz Questions
export const quizQuestions = pgTable("quiz_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  options: json("options").notNull(), // ["A", "B", "C", "D"]
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  category: text("category").notNull(), // ASF, AvianFlu, Hygiene, etc.
  animalType: text("animal_type"), // pig, poultry, cattle
  difficulty: text("difficulty").default("medium"), // easy, medium, hard
  createdAt: timestamp("created_at").defaultNow(),
});

// Daily Challenges
export const dailyChallenges = pgTable("daily_challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull().unique(), // YYYY-MM-DD format
  questionId: varchar("question_id").references(() => quizQuestions.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quiz Sessions
export const quizSessions = pgTable("quiz_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  farmerId: varchar("farmer_id").references(() => farmers.id),
  questionIds: json("question_ids").notNull(), // array of question IDs
  answers: json("answers").notNull(), // {questionId: selectedAnswer}
  score: integer("score").default(0),
  coinsEarned: integer("coins_earned").default(0),
  accuracy: integer("accuracy").default(0), // percentage
  completedAt: timestamp("completed_at").defaultNow(),
  sessionType: text("session_type").default("practice"), // daily, practice
});

// Leaderboards
export const leaderboards = pgTable("leaderboards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  farmerId: varchar("farmer_id").references(() => farmers.id),
  region: text("region").notNull(),
  totalCoins: integer("total_coins").default(0),
  accuracy: integer("accuracy").default(0),
  rank: integer("rank"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFarmerSchema = createInsertSchema(farmers).omit({
  id: true,
  createdAt: true,
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({
  id: true,
  createdAt: true,
});

export const insertQuizSessionSchema = createInsertSchema(quizSessions).omit({
  id: true,
  completedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Farmer = typeof farmers.$inferSelect;
export type InsertFarmer = z.infer<typeof insertFarmerSchema>;
export type AnimalGroup = typeof animalGroups.$inferSelect;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type QuizSession = typeof quizSessions.$inferSelect;
export type InsertQuizSession = z.infer<typeof insertQuizSessionSchema>;
export type DailyChallenge = typeof dailyChallenges.$inferSelect;
export type Leaderboard = typeof leaderboards.$inferSelect;

// Enums and Constants
export const ANIMAL_TYPES = ["pig", "poultry", "cattle"] as const;
export const LEVELS = ["pupil", "specialist", "master"] as const;
export const QUIZ_CATEGORIES = ["ASF", "AvianFlu", "Hygiene", "Vaccination", "Compliance"] as const;

// Level thresholds
export const LEVEL_THRESHOLDS = {
  pupil: { min: 0, max: 500 },
  specialist: { min: 501, max: 2000 },
  master: { min: 2001, max: Infinity },
} as const;
