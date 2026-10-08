import { z } from 'zod';

export const SubjectSchema = z.object({
  id: z.string().min(1, 'El ID de la materia no puede estar vacío'),
  name: z.string().min(2, 'El nombre de la materia debe tener al menos 2 caracteres'),
  emoji: z.string().min(1, 'El emoji no puede estar vacío'),
  color_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'color_hex debe ser un color hexadecimal válido (ej: #3B82F6)').optional(),
  description: z.string().optional(),
});

export type Subject = z.infer<typeof SubjectSchema>;

export const TopicSchema = z.object({
  id: z.string().min(1, 'El ID del tema no puede estar vacío'),
  name: z.string().min(2, 'El nombre del tema debe tener al menos 2 caracteres'),
  description: z.string().optional(),
});

export type Topic = z.infer<typeof TopicSchema>;

export const AgeRangeSchema = z
  .object({
    min: z.number().int().min(3, 'La edad mínima debe ser al menos 3 años'),
    max: z.number().int().max(18, 'La edad máxima no puede superar los 18 años'),
  })
  .refine((data) => data.max >= data.min, {
    message: 'La edad máxima debe ser mayor o igual a la edad mínima',
    path: ['max'],
  });

export type AgeRange = z.infer<typeof AgeRangeSchema>;

export const FunFactSchema = z.object({
  emoji: z.string().default('💡'),
  fact: z.string().min(5, 'El dato curioso debe tener al menos 5 caracteres'),
});

export type FunFact = z.infer<typeof FunFactSchema>;

export const GlossaryItemSchema = z.object({
  term: z.string().min(1, 'El término del glosario no puede estar vacío'),
  definition: z.string().min(5, 'La definición debe tener al menos 5 caracteres'),
  simple_example: z.string().optional(),
});

export type GlossaryItem = z.infer<typeof GlossaryItemSchema>;

export const QuestionTypeSchema = z.enum(['reading_comprehension', 'educational_concept']);
export type QuestionType = z.infer<typeof QuestionTypeSchema>;

export const QuestionSchema = z
  .object({
    id: z.string().min(1, 'El ID de la pregunta no puede estar vacío'),
    type: QuestionTypeSchema,
    question: z.string().min(5, 'La pregunta debe tener al menos 5 caracteres'),
    options: z.array(z.string().min(1)).min(2, 'Debe haber al menos 2 opciones de respuesta'),
    correct_answer: z.number().int().nonnegative('El índice de respuesta correcta debe ser >= 0'),
    explanation: z.string().min(5, 'La explicación pedagógica debe tener al menos 5 caracteres'),
    points: z.number().int().positive('Los puntos deben ser un entero positivo'),
  })
  .refine((data) => data.correct_answer < data.options.length, {
    message: 'correct_answer debe ser un índice válido dentro del arreglo de options',
    path: ['correct_answer'],
  });

export type Question = z.infer<typeof QuestionSchema>;

export const DifficultySchema = z.enum(['basic', 'intermediate', 'advanced']);
export type Difficulty = z.infer<typeof DifficultySchema>;

export const StorySchema = z
  .object({
    id: z.string().min(1, 'El ID de la historia no puede estar vacío'),
    slug: z.string().regex(/^[a-z0-9-]+$/, 'El slug debe contener solo letras minúsculas, números y guiones'),
    title: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
    summary: z.string().min(10, 'El resumen debe tener al menos 10 caracteres'),
    subject: SubjectSchema,
    topic: TopicSchema,
    age_range: AgeRangeSchema,
    difficulty: DifficultySchema,
    reading_time_min: z.number().int().positive('El tiempo de lectura debe ser de al menos 1 minuto'),
    cover_image_path: z.string().min(1, 'La ruta de imagen no puede estar vacía'),
    cover_image_url: z.string().url('cover_image_url debe ser una URL válida'),
    key_learnings: z.array(z.string().min(5)).min(1, 'Debe incluir al menos un aprendizaje clave'),
    fun_facts: z.array(FunFactSchema).default([]),
    glossary: z.array(GlossaryItemSchema).default([]),
    content: z.string().min(20, 'El contenido debe tener al menos 20 caracteres'),
    questions: z.array(QuestionSchema).min(1, 'La historia debe tener al menos 1 pregunta'),
    total_points: z.number().int().positive('total_points debe ser un entero positivo'),
  })
  .refine(
    (data) => {
      const calculatedPoints = data.questions.reduce((sum, q) => sum + q.points, 0);
      return data.total_points === calculatedPoints;
    },
    {
      message: 'total_points debe ser igual a la suma de los puntos de todas las preguntas',
      path: ['total_points'],
    }
  );

export type Story = z.infer<typeof StorySchema>;

export const SubjectFileSchema = z.object({
  version_db: z.number().int().positive(),
  subject: SubjectSchema,
  stories: z.array(StorySchema),
});

export type SubjectFile = z.infer<typeof SubjectFileSchema>;

export const LevelStoriesFileSchema = z.object({
  version_db: z.number().int().positive(),
  level_key: DifficultySchema,
  label: z.string(),
  emoji: z.string(),
  stories: z.array(StorySchema),
});

export type LevelStoriesFile = z.infer<typeof LevelStoriesFileSchema>;

export const SubjectManifestItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  emoji: z.string(),
  color_hex: z.string().optional(),
  path: z.string(),
  url: z.string().url(),
  story_count: z.number().int().nonnegative().default(0),
});

export const LevelManifestItemSchema = z.object({
  id: DifficultySchema,
  label: z.string().min(1),
  emoji: z.string().min(1),
  description: z.string().min(1),
  path: z.string().min(1),
  url: z.string().url(),
  story_count: z.number().int().nonnegative().default(0),
});

export const DbManifestSchema = z.object({
  version_db: z.number().int().positive(),
  total_stories: z.number().int().nonnegative(),
  subjects: z.array(SubjectManifestItemSchema),
  levels: z.array(LevelManifestItemSchema),
});

export type DbManifest = z.infer<typeof DbManifestSchema>;
