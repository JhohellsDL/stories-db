import fs from 'node:fs';
import path from 'node:path';
import {
  DbManifestSchema,
  SubjectFileSchema,
  LevelStoriesFileSchema,
} from '../src/schemas/story.schema.ts';

interface ValidationResult {
  file: string;
  errors: string[];
  warnings: string[];
}

const rootDir = process.cwd();
const storiesDir = path.join(rootDir, 'stories');
const subjectsDir = path.join(storiesDir, 'subjects');
const levelsDir = path.join(storiesDir, 'levels');
const imagesDir = path.join(rootDir, 'images');

const results: ValidationResult[] = [];
const referencedImages = new Set<string>();
const globalStoryIds = new Set<string>();

function logSection(title: string) {
  console.log(`\n\x1b[1m\x1b[36m=== ${title} ===\x1b[0m`);
}

function validateManifest(): void {
  const manifestPath = path.join(storiesDir, 'db-stories.json');
  const result: ValidationResult = { file: 'stories/db-stories.json', errors: [], warnings: [] };

  if (!fs.existsSync(manifestPath)) {
    result.errors.push('El archivo db-stories.json no existe.');
    results.push(result);
    return;
  }

  try {
    const raw = fs.readFileSync(manifestPath, 'utf-8');
    const json = JSON.parse(raw);
    const parsed = DbManifestSchema.safeParse(json);

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        result.errors.push(`[${issue.path.join('.')}] ${issue.message}`);
      });
    } else {
      for (const sub of parsed.data.subjects) {
        const fullPath = path.join(rootDir, sub.path);
        if (!fs.existsSync(fullPath)) {
          result.errors.push(`Materia "${sub.name}": el archivo en "${sub.path}" no existe.`);
        }
      }
      for (const lvl of parsed.data.levels) {
        const fullPath = path.join(rootDir, lvl.path);
        if (!fs.existsSync(fullPath)) {
          result.errors.push(`Nivel "${lvl.label}": el archivo en "${lvl.path}" no existe.`);
        }
      }
    }
  } catch (err: any) {
    result.errors.push(`Error de sintaxis JSON: ${err.message}`);
  }

  results.push(result);
}

function validateSubjects(): void {
  if (!fs.existsSync(subjectsDir)) {
    results.push({
      file: 'stories/subjects',
      errors: ['El directorio stories/subjects no existe.'],
      warnings: [],
    });
    return;
  }

  const files = (fs.readdirSync(subjectsDir) as string[]).filter((f: string) => f.endsWith('.json'));

  for (const file of files) {
    const relativePath = `stories/subjects/${file}`;
    const fullPath = path.join(subjectsDir, file);
    const result: ValidationResult = { file: relativePath, errors: [], warnings: [] };

    try {
      const raw = fs.readFileSync(fullPath, 'utf-8');
      const json = JSON.parse(raw);
      const parsed = SubjectFileSchema.safeParse(json);

      if (!parsed.success) {
        parsed.error.issues.forEach((issue) => {
          result.errors.push(`[${issue.path.join('.')}] ${issue.message}`);
        });
      } else {
        for (const [index, story] of parsed.data.stories.entries()) {
          if (globalStoryIds.has(story.id)) {
            result.errors.push(`Historia #${index + 1} (${story.title}): ID duplicado globalmente "${story.id}"`);
          }
          globalStoryIds.add(story.id);

          const localImagePath = path.join(rootDir, story.cover_image_path);
          if (!fs.existsSync(localImagePath)) {
            result.errors.push(
              `Historia #${index + 1} (${story.title}): imagen no encontrada en disco -> "${story.cover_image_path}"`
            );
          } else {
            referencedImages.add(path.basename(story.cover_image_path));
          }

          const pathExt = path.extname(story.cover_image_path);
          const urlExt = path.extname(new URL(story.cover_image_url).pathname);
          if (pathExt && urlExt && pathExt !== urlExt) {
            result.warnings.push(
              `Historia #${index + 1} (${story.title}): discrepancia de extensión entre cover_image_path (${pathExt}) y cover_image_url (${urlExt})`
            );
          }
        }
      }
    } catch (err: any) {
      result.errors.push(`Error de sintaxis JSON: ${err.message}`);
    }

    results.push(result);
  }
}

function validateLevels(): void {
  if (!fs.existsSync(levelsDir)) return;

  const files = (fs.readdirSync(levelsDir) as string[]).filter((f: string) => f.endsWith('.json'));

  for (const file of files) {
    const relativePath = `stories/levels/${file}`;
    const fullPath = path.join(levelsDir, file);
    const result: ValidationResult = { file: relativePath, errors: [], warnings: [] };

    try {
      const raw = fs.readFileSync(fullPath, 'utf-8');
      const json = JSON.parse(raw);
      const parsed = LevelStoriesFileSchema.safeParse(json);

      if (!parsed.success) {
        parsed.error.issues.forEach((issue) => {
          result.errors.push(`[${issue.path.join('.')}] ${issue.message}`);
        });
      }
    } catch (err: any) {
      result.errors.push(`Error de sintaxis JSON: ${err.message}`);
    }

    results.push(result);
  }
}

function checkOrphanImages(): void {
  if (!fs.existsSync(imagesDir)) return;

  const imageFiles = (fs.readdirSync(imagesDir) as string[]).filter((f: string) => !f.startsWith('.'));
  const orphanResult: ValidationResult = { file: 'images/', errors: [], warnings: [] };

  for (const img of imageFiles) {
    if (!referencedImages.has(img)) {
      orphanResult.warnings.push(`Imagen huérfana (no referenciada en ningún cuento): "${img}"`);
    }
  }

  if (orphanResult.warnings.length > 0) {
    results.push(orphanResult);
  }
}

// Execution
logSection('Iniciando Validación del Data Engine Educativo (stories-db)');
validateSubjects();
validateManifest();
validateLevels();
checkOrphanImages();

let totalErrors = 0;
let totalWarnings = 0;

for (const res of results) {
  if (res.errors.length > 0 || res.warnings.length > 0) {
    console.log(`\n📄 \x1b[1m${res.file}\x1b[0m`);
    res.errors.forEach((e) => {
      console.log(`  ❌ \x1b[31m[ERROR]\x1b[0m ${e}`);
      totalErrors++;
    });
    res.warnings.forEach((w) => {
      console.log(`  ⚠️  \x1b[33m[WARN]\x1b[0m ${w}`);
      totalWarnings++;
    });
  } else {
    console.log(`✅ \x1b[32m${res.file} -> Válido\x1b[0m`);
  }
}

logSection('Resumen de Validación');
if (totalErrors === 0) {
  console.log(`\x1b[32m✨ ¡Todo en orden! 0 errores, ${totalWarnings} advertencia(s).\x1b[0m\n`);
  process.exit(0);
} else {
  console.log(`\x1b[31m💥 Se encontraron ${totalErrors} error(es) y ${totalWarnings} advertencia(s).\x1b[0m\n`);
  process.exit(1);
}
