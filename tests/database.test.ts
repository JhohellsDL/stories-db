import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  DbManifestSchema,
  SubjectFileSchema,
  LevelStoriesFileSchema,
} from '../src/schemas/story.schema.ts';

const rootDir = process.cwd();
const storiesDir = path.join(rootDir, 'stories');
const subjectsDir = path.join(storiesDir, 'subjects');

describe('Database Manifest & Educational Stories Integrity', () => {
  it('db-stories.json debe existir y ser válido con materias y niveles', () => {
    const manifestPath = path.join(storiesDir, 'db-stories.json');
    assert.equal(fs.existsSync(manifestPath), true);

    const json = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const parsed = DbManifestSchema.safeParse(json);
    assert.equal(parsed.success, true);
    assert.ok(parsed.data && parsed.data.subjects.length > 0);
    assert.ok(parsed.data && parsed.data.levels.length > 0);
  });

  it('todos los archivos de materia en stories/subjects/ deben ser válidos', () => {
    const files = (fs.readdirSync(subjectsDir) as string[]).filter((f: string) => f.endsWith('.json'));
    assert.ok(files.length > 0);

    for (const file of files) {
      const fullPath = path.join(subjectsDir, file);
      const json = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
      const parsed = SubjectFileSchema.safeParse(json);
      assert.equal(parsed.success, true, `El archivo ${file} debe cumplir SubjectFileSchema`);
    }
  });

  it('todas las imágenes referenciadas en las historias deben existir físicamente en images/', () => {
    const files = (fs.readdirSync(subjectsDir) as string[]).filter((f: string) => f.endsWith('.json'));

    for (const file of files) {
      const fullPath = path.join(subjectsDir, file);
      const data = SubjectFileSchema.parse(JSON.parse(fs.readFileSync(fullPath, 'utf-8')));

      for (const story of data.stories) {
        const imageFullPath = path.join(rootDir, story.cover_image_path);
        assert.equal(
          fs.existsSync(imageFullPath),
          true,
          `La imagen "${story.cover_image_path}" de la historia "${story.title}" debe existir físicamente`
        );
      }
    }
  });
});
