import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  QuestionSchema,
  StorySchema,
  type Story,
} from '../src/schemas/story.schema.ts';

describe('Educational QuestionSchema', () => {
  it('debe validar una pregunta de comprensión lectora correcta', () => {
    const validQuestion = {
      id: 'q1',
      type: 'reading_comprehension' as const,
      question: '¿Por qué Riley fue al dentista?',
      options: ['Porque se lastimó un diente', 'Porque tenía hambre'],
      correct_answer: 0,
      explanation: 'Riley fue al consultorio para que le revisaran el diente roto.',
      points: 10,
    };

    const parsed = QuestionSchema.safeParse(validQuestion);
    assert.equal(parsed.success, true);
  });

  it('debe validar una pregunta de concepto educativo', () => {
    const conceptQuestion = {
      id: 'q2',
      type: 'educational_concept' as const,
      question: '¿Cómo se llama la capa dura que protege a los dientes?',
      options: ['Esmalte dental', 'Cartílago'],
      correct_answer: 0,
      explanation: 'El esmalte dental es la capa externa que recubre la corona del diente.',
      points: 10,
    };

    const parsed = QuestionSchema.safeParse(conceptQuestion);
    assert.equal(parsed.success, true);
  });

  it('debe fallar si correct_answer está fuera del rango de options', () => {
    const invalidQuestion = {
      id: 'q1',
      type: 'reading_comprehension' as const,
      question: '¿Pregunta con índice inválido?',
      options: ['Opción 1', 'Opción 2'],
      correct_answer: 5,
      explanation: 'Explicación válida',
      points: 10,
    };

    const parsed = QuestionSchema.safeParse(invalidQuestion);
    assert.equal(parsed.success, false);
  });
});

describe('Educational StorySchema', () => {
  const validStory: Story = {
    id: 'story_bio_001',
    slug: 'el-cuidado-de-los-dientes',
    title: 'Riley y el misterio del diente',
    summary: 'Una niña aprende cómo cuidar su esmalte dental y evitar el azúcar en exceso.',
    subject: {
      id: 'biology',
      name: 'Biología y Salud',
      emoji: '🧬',
    },
    topic: {
      id: 'dental-anatomy',
      name: 'Anatomía Dental',
    },
    age_range: {
      min: 6,
      max: 9,
    },
    difficulty: 'basic',
    reading_time_min: 3,
    cover_image_path: 'images/story_01_003.png',
    cover_image_url: 'https://raw.githubusercontent.com/JhohellsDL/stories-db/main/images/story_01_003.png',
    key_learnings: ['El esmalte protege al diente de bacterias'],
    fun_facts: [
      {
        emoji: '🦷',
        fact: 'El esmalte dental es la sustancia más dura del cuerpo.',
      },
    ],
    glossary: [
      {
        term: 'Esmalte',
        definition: 'Capa dura que protege el diente.',
      },
    ],
    content: 'Texto descriptivo y emocionante de la historia educativa para niños.',
    questions: [
      {
        id: 'q1',
        type: 'reading_comprehension',
        question: '¿Qué aprendió Riley?',
        options: ['A cuidar sus dientes', 'A correr rápido'],
        correct_answer: 0,
        explanation: 'Aprendió a cepillarse y no comer caramelos duros.',
        points: 10,
      },
      {
        id: 'q2',
        type: 'educational_concept',
        question: '¿Cuál es la sustancia más dura del cuerpo?',
        options: ['El esmalte dental', 'Las uñas'],
        correct_answer: 0,
        explanation: 'El esmalte dental es el tejido más duro del cuerpo humano.',
        points: 10,
      },
    ],
    total_points: 20,
  };

  it('debe validar una historia con metadatos educativos completos', () => {
    const parsed = StorySchema.safeParse(validStory);
    assert.equal(parsed.success, true);
  });

  it('debe rechazar si total_points no coincide con la suma de puntos', () => {
    const invalidStory = {
      ...validStory,
      total_points: 999,
    };

    const parsed = StorySchema.safeParse(invalidStory);
    assert.equal(parsed.success, false);
  });

  it('debe rechazar un slug con formato inválido', () => {
    const invalidStory = {
      ...validStory,
      slug: 'Slug Con Mayusculas Y Espacios!',
    };

    const parsed = StorySchema.safeParse(invalidStory);
    assert.equal(parsed.success, false);
  });
});
