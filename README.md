# 📖 stories-db — Plataforma de Lecturas Educativas para Niños

> Data Engine estático y Headless de cuentos infantiles orientados al aprendizaje narrativo (*Stealth Learning*) en diversas áreas del conocimiento (Biología, Física, Astronomía, Historia, Medio Ambiente y Geografía), con preguntas de comprensión lectora y conceptos educativos.

---

## 🌟 Características Principales

- **Aprendizaje Basado en Historias**: Cuentos entretenidos donde los conceptos científicos, históricos y matemáticos son parte central de la aventura.
- **Doble Dimensión de Evaluación**: Cada historia incluye preguntas de **Comprensión Lectora** y preguntas de **Conceptos Educativos**, con explicaciones pedagógicas formativas.
- **Glosario Interactivo y Datos Curiosos**: Soporte para términos destacados (*tap-to-define*) y coleccionables de curiosidades.
- **Acceso Dual**: Consumo segmentado por **Materias** (`stories/subjects/`) o por **Nivel de Dificultad** (`stories/levels/`), más un catálogo consolidado (`stories/all-stories.json`).
- **Validación Estricta con Zod**: Verificación de contratos, coherencia de puntos, edades y comprobación física de imágenes en disco.
- **Preparado para Migración a Supabase/PostgreSQL**: Modelado de datos 100% compatible con tablas relacionales.

---

## 📂 Estructura del Repositorio

```text
stories-db/
├── src/
│   └── schemas/
│       └── story.schema.ts      # Esquemas Zod y contratos TypeScript
├── scripts/
│   ├── validate.ts              # Validador de esquemas, imágenes y coherencia
│   └── build.ts                 # Compilador de materias, niveles y manifiestos
├── tests/
│   ├── story.schema.test.ts     # Pruebas unitarias de validaciones y casos borde
│   └── database.test.ts         # Pruebas de integración de datos reales
├── stories/
│   ├── db-stories.json          # Manifiesto maestro de materias y niveles
│   ├── all-stories.json         # Catálogo unificado completo
│   ├── subjects/                # Cuentos organizados por materia educativa
│   │   ├── biology.json
│   │   ├── environment.json
│   │   ├── history.json
│   │   ├── physics-optics.json
│   │   ├── science-astronomy.json
│   │   ├── social-sciences.json
│   │   └── technology-physics.json
│   └── levels/                  # Cuentos generados automáticamente por nivel
│       ├── basic-stories.json
│       ├── medium-stories.json
│       └── advanced-stories.json
├── images/                      # Ilustraciones y portadas
├── docs/
│   └── API.md                   # Guía detallada de consumo por CDN
└── .github/workflows/
    └── ci.yml                   # CI automatizado en GitHub Actions
```

---

## 🚀 Inicio Rápido y Validación

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar pruebas unitarias, tipado e integridad
npm test

# 3. Compilar manifiestos y niveles
npm run build
```

---

## 📡 Consumo de Datos

Revisa la [Documentación de la API](docs/API.md) para ver todas las URLs directas de GitHub CDN y ejemplos de integración.
