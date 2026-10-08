import fs from 'node:fs';
import path from 'node:path';
import {
  SubjectFileSchema,
  LevelStoriesFileSchema,
  DbManifestSchema,
  type Story,
  type Difficulty,
} from '../src/schemas/story.schema.ts';

const rootDir = process.cwd();
const storiesDir = path.join(rootDir, 'stories');
const subjectsDir = path.join(storiesDir, 'subjects');
const levelsDir = path.join(storiesDir, 'levels');

if (!fs.existsSync(levelsDir)) {
  fs.mkdirSync(levelsDir, { recursive: true });
}

console.log('\n\x1b[1m\x1b[36m=== Compilando Data Engine Educativo (stories-db) ===\x1b[0m\n');

const subjectFiles = (fs.readdirSync(subjectsDir) as string[]).filter((f: string) => f.endsWith('.json'));

const allStories: Story[] = [];
const subjectManifestList: any[] = [];

// 1. Process each subject
for (const file of subjectFiles) {
  const filePath = path.join(subjectsDir, file);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = SubjectFileSchema.parse(JSON.parse(raw));

  const relPath = `stories/subjects/${file}`;
  const rawUrl = `https://raw.githubusercontent.com/JhohellsDL/stories-db/main/${relPath}`;

  subjectManifestList.push({
    id: parsed.subject.id,
    name: parsed.subject.name,
    emoji: parsed.subject.emoji,
    color_hex: parsed.subject.color_hex,
    path: relPath,
    url: rawUrl,
    story_count: parsed.stories.length,
  });

  for (const story of parsed.stories) {
    allStories.push(story);
  }

  console.log(`📚 Materia: \x1b[32m${parsed.subject.name}\x1b[0m (${parsed.subject.emoji}) -> ${parsed.stories.length} cuentos`);
}

// 2. Group stories by difficulty level
const levelConfigs: {
  key: Difficulty;
  label: string;
  emoji: string;
  description: string;
  filename: string;
}[] = [
  {
    key: 'basic',
    label: 'Básico (Exploradores)',
    emoji: '🌱',
    description: 'Cuentos cortos (5-7 años) con conceptos iniciales y vocabulario claro',
    filename: 'basic-stories.json',
  },
  {
    key: 'intermediate',
    label: 'Medio (Aventureros)',
    emoji: '🔥',
    description: 'Narrativas guiadas (8-10 años) con retos y conceptos educativos aplicados',
    filename: 'medium-stories.json',
  },
  {
    key: 'advanced',
    label: 'Avanzado (Investigadores)',
    emoji: '⚡',
    description: 'Textos enriquecidos (11-14 años) con razonamiento crítico y científico',
    filename: 'advanced-stories.json',
  },
];

const levelManifestList: any[] = [];

for (const lvl of levelConfigs) {
  const filteredStories = allStories.filter((s) => s.difficulty === lvl.key);
  const levelPayload = {
    version_db: 4,
    level_key: lvl.key,
    label: lvl.label,
    emoji: lvl.emoji,
    stories: filteredStories,
  };

  const levelFilePath = path.join(levelsDir, lvl.filename);
  fs.writeFileSync(levelFilePath, JSON.stringify(levelPayload, null, 2) + '\n', 'utf-8');

  const relPath = `stories/levels/${lvl.filename}`;
  const rawUrl = `https://raw.githubusercontent.com/JhohellsDL/stories-db/main/${relPath}`;

  levelManifestList.push({
    id: lvl.key,
    label: lvl.label,
    emoji: lvl.emoji,
    description: lvl.description,
    path: relPath,
    url: rawUrl,
    story_count: filteredStories.length,
  });

  console.log(`🎯 Nivel: \x1b[34m${lvl.label}\x1b[0m -> ${filteredStories.length} cuentos`);
}

// 3. Generate master db-stories.json manifest
const dbManifest = {
  version_db: 4,
  total_stories: allStories.length,
  subjects: subjectManifestList,
  levels: levelManifestList,
};

DbManifestSchema.parse(dbManifest);

const manifestPath = path.join(storiesDir, 'db-stories.json');
fs.writeFileSync(manifestPath, JSON.stringify(dbManifest, null, 2) + '\n', 'utf-8');
console.log(`\n✅ Manifiesto maestro actualizado: \x1b[33mstories/db-stories.json\x1b[0m`);

// 4. Generate all-stories.json
const aggregatedPath = path.join(storiesDir, 'all-stories.json');
const aggregatedPayload = {
  version_db: 4,
  total_stories: allStories.length,
  updated_at: new Date().toISOString(),
  stories: allStories,
};

fs.writeFileSync(aggregatedPath, JSON.stringify(aggregatedPayload, null, 2) + '\n', 'utf-8');
console.log(`✅ Catálogo agregado generado: \x1b[33mstories/all-stories.json\x1b[0m (Total: ${allStories.length} historias)\n`);
