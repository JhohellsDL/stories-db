# 📚 Documentación de Consumo - stories-db (Educational Data Engine)

`stories-db` es un **Data Engine estático y Headless** diseñado para alimentar aplicaciones infantiles de lectura educativa y comprensión lectora. Los datos se distribuyen como JSONs optimizados a través del CDN de GitHub (`raw.githubusercontent.com`).

---

## 🌐 URLs Base

```text
https://raw.githubusercontent.com/JhohellsDL/stories-db/main/
```

---

## 🧭 1. Manifiesto Maestro (`db-stories.json`)

Contiene el catálogo completo de materias (`subjects`) y niveles de dificultad (`levels`), con sus rutas y conteos actualizados.

- **URL:** `https://raw.githubusercontent.com/JhohellsDL/stories-db/main/stories/db-stories.json`
- **Método:** `GET`

```json
{
  "version_db": 4,
  "total_stories": 7,
  "subjects": [
    {
      "id": "biology",
      "name": "Biología y Salud",
      "emoji": "🧬",
      "color_hex": "#10B981",
      "description": "El cuerpo humano, los seres vivos y los hábitos saludables",
      "images_url": [
        "https://raw.githubusercontent.com/JhohellsDL/stories-db/main/images/story_01_001.jpg",
        "https://raw.githubusercontent.com/JhohellsDL/stories-db/main/images/story_01_002.jpg",
        "https://raw.githubusercontent.com/JhohellsDL/stories-db/main/images/story_01_003.jpg"
      ],
      "path": "stories/subjects/biology.json",
      "url": "https://raw.githubusercontent.com/JhohellsDL/stories-db/main/stories/subjects/biology.json",
      "story_count": 4
    },
    {
      "id": "environment",
      "name": "Medio Ambiente y Ecosistemas",
      "emoji": "🌱",
      "color_hex": "#059669",
      "path": "stories/subjects/environment.json",
      "url": "https://raw.githubusercontent.com/JhohellsDL/stories-db/main/stories/subjects/environment.json",
      "story_count": 1
    }
  ],
  "levels": [
    {
      "id": "basic",
      "label": "Básico (Exploradores)",
      "emoji": "🌱",
      "description": "Cuentos cortos (5-7 años) con conceptos iniciales y vocabulario claro",
      "path": "stories/levels/basic-stories.json",
      "url": "https://raw.githubusercontent.com/JhohellsDL/stories-db/main/stories/levels/basic-stories.json",
      "story_count": 3
    }
  ]
}
```

---

## 📖 2. Cuentos por Materia Educativa (`stories/subjects/*.json`)

| Materia | Emoji | URL |
| :--- | :--- | :--- |
| **Biología y Salud** | 🧬 | `https://raw.githubusercontent.com/JhohellsDL/stories-db/main/stories/subjects/biology.json` |
| **Medio Ambiente** | 🌱 | `https://raw.githubusercontent.com/JhohellsDL/stories-db/main/stories/subjects/environment.json` |
| **Ciencias Sociales y Geografía** | 🧭 | `https://raw.githubusercontent.com/JhohellsDL/stories-db/main/stories/subjects/social-sciences.json` |
| **Física y Tecnología** | ⚙️ | `https://raw.githubusercontent.com/JhohellsDL/stories-db/main/stories/subjects/technology-physics.json` |
| **Historia y Civilizaciones** | 🏛️ | `https://raw.githubusercontent.com/JhohellsDL/stories-db/main/stories/subjects/history.json` |
| **Ciencias y Astronomía** | 🔭 | `https://raw.githubusercontent.com/JhohellsDL/stories-db/main/stories/subjects/science-astronomy.json` |
| **Física Óptica y Luz** | 💡 | `https://raw.githubusercontent.com/JhohellsDL/stories-db/main/stories/subjects/physics-optics.json` |

---

## 🎯 3. Cuentos por Nivel de Dificultad (`stories/levels/*.json`)

- **Básico (5-7 años):** `https://raw.githubusercontent.com/JhohellsDL/stories-db/main/stories/levels/basic-stories.json`
- **Medio (8-10 años):** `https://raw.githubusercontent.com/JhohellsDL/stories-db/main/stories/levels/medium-stories.json`
- **Avanzado (11-14 años):** `https://raw.githubusercontent.com/JhohellsDL/stories-db/main/stories/levels/advanced-stories.json`

---

## 📦 4. Catálogo Consolidado Completo (`all-stories.json`)

Ideal para cachear todo el contenido en local al abrir la app o para modo sin conexión (*offline first*).

- **URL:** `https://raw.githubusercontent.com/JhohellsDL/stories-db/main/stories/all-stories.json`

---

## 📑 5. Especificación del Esquema de una Historia

```typescript
interface Story {
  id: string;                      // ej: "story_bio_001"
  slug: string;                    // ej: "riley-y-el-cuidado-de-los-dientes"
  title: string;                   // Título de la historia
  summary: string;                 // Resumen para catálogo
  subject: {
    id: string;                    // "biology", "history", etc.
    name: string;
    emoji: string;
    color_hex?: string;
  };
  topic: {
    id: string;                    // "dental-anatomy", "water-cycle"
    name: string;
  };
  age_range: {
    min: number;                   // ej: 6
    max: number;                   // ej: 9
  };
  difficulty: "basic" | "intermediate" | "advanced";
  reading_time_min: number;        // Minutos estimados de lectura
  cover_image_path: string;        // "images/story_01_003.jpg"
  cover_image_url: string;         // URL directa en GitHub CDN
  key_learnings: string[];         // Lista de conceptos educativos aprendidos
  fun_facts: {                     // Datos curiosos para el niño
    emoji: string;
    fact: string;
  }[];
  glossary: {                      // Glosario para palabras clickeables
    term: string;
    definition: string;
    simple_example?: string;
  }[];
  content: string;                 // Texto completo del cuento
  questions: {
    id: string;
    type: "reading_comprehension" | "educational_concept";
    question: string;
    options: string[];
    correct_answer: number;        // Índice (0-based) de la opción correcta
    explanation: string;           // Retroalimentación formativa
    points: number;
  }[];
  total_points: number;
}
```

---

## 🛠️ Comandos de Desarrollo

```bash
# Validar tipos TypeScript
npm run typecheck

# Ejecutar suite de pruebas unitarias
npm run test:unit

# Validar integridad de esquemas, imágenes y coherencia
npm run validate

# Ejecutar verificación completa
npm test

# Compilar niveles, manifiestos y catálogo unificado
npm run build
```