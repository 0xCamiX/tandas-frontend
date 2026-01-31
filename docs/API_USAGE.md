# Guía de Uso de la API - YAKU Backend

Esta guía documenta cómo usar los endpoints de la API para los módulos de **Cursos**, **Inscripciones**, **Módulos** y **Quizzes** desde el frontend.

## Tabla de Contenidos

- [Configuración Base](#configuración-base)
- [Autenticación](#autenticación)
- [Cursos (Courses)](#cursos-courses)
- [Inscripciones (Enrollments)](#inscripciones-enrollments)
- [Módulos (Modules)](#módulos-modules)
- [Quizzes](#quizzes)
- [Manejo de Errores](#manejo-de-errores)

---

## Configuración Base

### URL Base

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
const API_VERSION = '/api/v1';
const BASE_URL = `${API_BASE_URL}${API_VERSION}`;
```

### Helper para Peticiones Autenticadas

```typescript
async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem('auth_token'); // O desde donde guardes el token
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });
}
```

---

## Autenticación

Todas las rutas protegidas requieren el header `Authorization: Bearer {token}`.

```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
}
```

---

## Cursos (Courses)

### Tipos TypeScript

```typescript
type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
type CourseStatus = 'ACTIVE' | 'INACTIVE';

interface Course {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  category: string;
  level: CourseLevel;
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
}

interface CourseWithModules extends Course {
  modules: Array<{
    id: string;
    title: string;
    order: number;
    duration: number | null;
  }>;
}

interface CreateCourseDto {
  title: string;
  description?: string;
  imageUrl?: string;
  category: string;
  level: CourseLevel;
  status?: CourseStatus;
}

interface UpdateCourseDto {
  title?: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  level?: CourseLevel;
  status?: CourseStatus;
}

interface CourseFilters {
  status?: CourseStatus;
  category?: string;
  level?: CourseLevel;
  search?: string;
}
```

### 1. Obtener Todos los Cursos

**Endpoint:** `GET /api/v1/courses`

**Autenticación:** No requerida

**Query Parameters:**
- `status` (opcional): `ACTIVE` | `INACTIVE`
- `category` (opcional): string
- `level` (opcional): `BEGINNER` | `INTERMEDIATE` | `ADVANCED`
- `search` (opcional): string (busca en título y descripción)

**Ejemplo:**

```typescript
// Obtener todos los cursos activos
async function getCourses(filters?: CourseFilters): Promise<Course[]> {
  const params = new URLSearchParams();
  
  if (filters?.status) params.append('status', filters.status);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.level) params.append('level', filters.level);
  if (filters?.search) params.append('search', filters.search);
  
  const response = await fetch(`${BASE_URL}/courses?${params.toString()}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Error al obtener cursos');
  }
  
  return data.data;
}

// Uso
const activeCourses = await getCourses({ status: 'ACTIVE' });
const beginnerCourses = await getCourses({ level: 'BEGINNER' });
const searchResults = await getCourses({ search: 'agua' });
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Introducción al Tratamiento de Agua",
      "description": "Curso básico sobre...",
      "imageUrl": "https://example.com/image.jpg",
      "category": "Tratamiento",
      "level": "BEGINNER",
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. Obtener Curso por ID

**Endpoint:** `GET /api/v1/courses/:id`

**Autenticación:** No requerida

**Ejemplo:**

```typescript
async function getCourseById(courseId: string): Promise<Course> {
  const response = await fetch(`${BASE_URL}/courses/${courseId}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Curso no encontrado');
  }
  
  return data.data;
}
```

### 3. Obtener Curso con Módulos

**Endpoint:** `GET /api/v1/courses/:id/modules`

**Autenticación:** No requerida

**Ejemplo:**

```typescript
async function getCourseWithModules(courseId: string): Promise<CourseWithModules> {
  const response = await fetch(`${BASE_URL}/courses/${courseId}/modules`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Error al obtener curso');
  }
  
  return data.data;
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Introducción al Tratamiento de Agua",
    "description": "...",
    "modules": [
      {
        "id": "456e7890-e89b-12d3-a456-426614174001",
        "title": "Módulo 1: Fundamentos",
        "order": 1,
        "duration": 30
      }
    ]
  }
}
```

### 4. Crear Curso

**Endpoint:** `POST /api/v1/courses`

**Autenticación:** Requerida

**Ejemplo:**

```typescript
async function createCourse(courseData: CreateCourseDto): Promise<Course> {
  const response = await authenticatedFetch('/courses', {
    method: 'POST',
    body: JSON.stringify(courseData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Error al crear curso');
  }
  
  return data.data;
}

// Uso
const newCourse = await createCourse({
  title: 'Nuevo Curso',
  description: 'Descripción del curso',
  category: 'Tratamiento',
  level: 'BEGINNER',
  status: 'ACTIVE',
});
```

### 5. Actualizar Curso

**Endpoint:** `PUT /api/v1/courses/:id`

**Autenticación:** Requerida

**Ejemplo:**

```typescript
async function updateCourse(
  courseId: string,
  updates: UpdateCourseDto
): Promise<Course> {
  const response = await authenticatedFetch(`/courses/${courseId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Error al actualizar curso');
  }
  
  return data.data;
}
```

### 6. Eliminar Curso

**Endpoint:** `DELETE /api/v1/courses/:id`

**Autenticación:** Requerida

**Ejemplo:**

```typescript
async function deleteCourse(courseId: string): Promise<void> {
  const response = await authenticatedFetch(`/courses/${courseId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error?.message || 'Error al eliminar curso');
  }
}
```

---

## Inscripciones (Enrollments)

### Tipos TypeScript

```typescript
interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  progress: number; // 0.0 a 1.0
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface EnrollmentWithRelations extends Enrollment {
  course: {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    category: string;
    level: string;
    status: string;
  };
}

interface CreateEnrollmentDto {
  courseId: string;
}
```

### 1. Obtener Todas las Inscripciones

**Endpoint:** `GET /api/v1/enrollments`

**Autenticación:** Requerida

**Query Parameters:**
- `userId` (opcional): UUID
- `courseId` (opcional): UUID

**Ejemplo:**

```typescript
async function getEnrollments(filters?: {
  userId?: string;
  courseId?: string;
}): Promise<Enrollment[]> {
  const params = new URLSearchParams();
  if (filters?.userId) params.append('userId', filters.userId);
  if (filters?.courseId) params.append('courseId', filters.courseId);
  
  const response = await authenticatedFetch(`/enrollments?${params.toString()}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Error al obtener inscripciones');
  }
  
  return data.data;
}
```

### 2. Obtener Mis Inscripciones

**Endpoint:** `GET /api/v1/enrollments/me`

**Autenticación:** Requerida

**Ejemplo:**

```typescript
async function getMyEnrollments(): Promise<Enrollment[]> {
  const response = await authenticatedFetch('/enrollments/me');
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Error al obtener inscripciones');
  }
  
  return data.data;
}
```

### 3. Inscribirse en un Curso

**Endpoint:** `POST /api/v1/enrollments/courses/:courseId`

**Autenticación:** Requerida

**Ejemplo:**

```typescript
async function enrollInCourse(courseId: string): Promise<Enrollment> {
  const response = await authenticatedFetch(`/enrollments/courses/${courseId}`, {
    method: 'POST',
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    if (data.error?.code === 'ALREADY_ENROLLED') {
      throw new Error('Ya estás inscrito en este curso');
    }
    throw new Error(data.error?.message || 'Error al inscribirse');
  }
  
  return data.data;
}

// Uso
try {
  const enrollment = await enrollInCourse('123e4567-e89b-12d3-a456-426614174000');
  console.log('Inscripción exitosa:', enrollment);
} catch (error) {
  if (error.message === 'Ya estás inscrito en este curso') {
    // Manejar caso de ya inscrito
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "789e0123-e89b-12d3-a456-426614174000",
    "userId": "456e7890-e89b-12d3-a456-426614174001",
    "courseId": "123e4567-e89b-12d3-a456-426614174000",
    "enrolledAt": "2024-01-01T00:00:00.000Z",
    "progress": 0.0,
    "completedAt": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Inscripción exitosa"
}
```

### 4. Obtener Inscripción por ID

**Endpoint:** `GET /api/v1/enrollments/:id`

**Autenticación:** Requerida

**Ejemplo:**

```typescript
async function getEnrollmentById(enrollmentId: string): Promise<EnrollmentWithRelations> {
  const response = await authenticatedFetch(`/enrollments/${enrollmentId}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Inscripción no encontrada');
  }
  
  return data.data;
}
```

### 5. Desinscribirse de un Curso

**Endpoint:** `DELETE /api/v1/enrollments/courses/:courseId`

**Autenticación:** Requerida

**Ejemplo:**

```typescript
async function unenrollFromCourse(courseId: string): Promise<void> {
  const response = await authenticatedFetch(`/enrollments/courses/${courseId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error?.message || 'Error al desinscribirse');
  }
}
```

---

## Módulos (Modules)

### Tipos TypeScript

```typescript
interface Module {
  id: string;
  courseId: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  order: number;
  duration: number | null;
  createdAt: string;
  updatedAt: string;
}

interface ModuleWithRelations extends Module {
  course: {
    id: string;
    title: string;
  };
  quizzes: Array<{
    id: string;
    question: string;
  }>;
  resources: Array<{
    id: string;
    resourceType: string;
    url: string;
    title: string | null;
  }>;
}

interface CreateModuleDto {
  courseId: string;
  title: string;
  content?: string;
  videoUrl?: string;
  order?: number;
  duration?: number;
}

interface UpdateModuleDto {
  title?: string;
  content?: string;
  videoUrl?: string;
  order?: number;
  duration?: number;
}
```

### 1. Obtener Todos los Módulos

**Endpoint:** `GET /api/v1/modules`

**Autenticación:** No requerida

**Query Parameters:**
- `courseId` (opcional): UUID

**Ejemplo:**

```typescript
async function getModules(courseId?: string): Promise<Module[]> {
  const url = courseId 
    ? `/modules?courseId=${courseId}`
    : '/modules';
  
  const response = await fetch(`${BASE_URL}${url}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Error al obtener módulos');
  }
  
  return data.data;
}
```

### 2. Obtener Módulos de un Curso

**Endpoint:** `GET /api/v1/courses/:courseId/modules`

**Autenticación:** No requerida

**Ejemplo:**

```typescript
async function getModulesByCourse(courseId: string): Promise<Module[]> {
  const response = await fetch(`${BASE_URL}/courses/${courseId}/modules`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Error al obtener módulos');
  }
  
  return data.data;
}
```

### 3. Obtener Módulo por ID

**Endpoint:** `GET /api/v1/modules/:id`

**Autenticación:** No requerida

**Ejemplo:**

```typescript
async function getModuleById(moduleId: string): Promise<Module> {
  const response = await fetch(`${BASE_URL}/modules/${moduleId}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Módulo no encontrado');
  }
  
  return data.data;
}
```

### 4. Obtener Módulo con Relaciones

**Endpoint:** `GET /api/v1/modules/:id/relations`

**Autenticación:** No requerida

**Ejemplo:**

```typescript
async function getModuleWithRelations(moduleId: string): Promise<ModuleWithRelations> {
  const response = await fetch(`${BASE_URL}/modules/${moduleId}/relations`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Error al obtener módulo');
  }
  
  return data.data;
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "789e0123-e89b-12d3-a456-426614174000",
    "courseId": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Módulo 1: Fundamentos",
    "content": "Contenido del módulo...",
    "videoUrl": "https://example.com/video.mp4",
    "order": 1,
    "duration": 30,
    "course": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Introducción al Tratamiento de Agua"
    },
    "quizzes": [
      {
        "id": "abc123",
        "question": "¿Qué es la sedimentación?"
      }
    ],
    "resources": [
      {
        "id": "res123",
        "resourceType": "PDF",
        "url": "https://example.com/doc.pdf",
        "title": "Guía de estudio"
      }
    ]
  }
}
```

### 5. Crear Módulo

**Endpoint:** `POST /api/v1/modules`

**Autenticación:** Requerida

**Ejemplo:**

```typescript
async function createModule(moduleData: CreateModuleDto): Promise<Module> {
  const response = await authenticatedFetch('/modules', {
    method: 'POST',
    body: JSON.stringify(moduleData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Error al crear módulo');
  }
  
  return data.data;
}
```

### 6. Actualizar Módulo

**Endpoint:** `PUT /api/v1/modules/:id`

**Autenticación:** Requerida

**Ejemplo:**

```typescript
async function updateModule(
  moduleId: string,
  updates: UpdateModuleDto
): Promise<Module> {
  const response = await authenticatedFetch(`/modules/${moduleId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Error al actualizar módulo');
  }
  
  return data.data;
}
```

### 7. Eliminar Módulo

**Endpoint:** `DELETE /api/v1/modules/:id`

**Autenticación:** Requerida

**Ejemplo:**

```typescript
async function deleteModule(moduleId: string): Promise<void> {
  const response = await authenticatedFetch(`/modules/${moduleId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error?.message || 'Error al eliminar módulo');
  }
}
```

---

## Quizzes

### Tipos TypeScript

```typescript
type QuizType = 'MULTIPLE_CHOICE';

interface Quiz {
  id: string;
  moduleId: string;
  question: string;
  type: QuizType;
  explanation: string | null;
  createdAt: string;
  updatedAt: string;
}

interface QuizWithOptions extends Quiz {
  options: Array<{
    id: string;
    optionText: string;
    isCorrect: boolean;
    order: number;
  }>;
}

interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number; // 0.0 a 1.0
  isCorrect: boolean;
  attemptedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateQuizDto {
  moduleId: string;
  question: string;
  type?: QuizType;
  explanation?: string;
  options: Array<{
    optionText: string;
    isCorrect: boolean;
    order?: number;
  }>;
}

interface CreateQuizAttemptDto {
  quizId: string;
  responses: Array<{
    quizOptionId: string;
  }>;
}
```

### 1. Obtener Todos los Quizzes

**Endpoint:** `GET /api/v1/quizzes`

**Autenticación:** No requerida

**Query Parameters:**
- `moduleId` (opcional): UUID

**Ejemplo:**

```typescript
async function getQuizzes(moduleId?: string): Promise<Quiz[]> {
  const url = moduleId 
    ? `/quizzes?moduleId=${moduleId}`
    : '/quizzes';
  
  const response = await fetch(`${BASE_URL}${url}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Error al obtener quizzes');
  }
  
  return data.data;
}
```

### 2. Obtener Quizzes de un Módulo

**Endpoint:** `GET /api/v1/quizzes/modules/:moduleId`

**Autenticación:** No requerida

**Ejemplo:**

```typescript
async function getQuizzesByModule(moduleId: string): Promise<Quiz[]> {
  const response = await fetch(`${BASE_URL}/quizzes/modules/${moduleId}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Error al obtener quizzes');
  }
  
  return data.data;
}
```

### 3. Obtener Quiz por ID

**Endpoint:** `GET /api/v1/quizzes/:id`

**Autenticación:** No requerida

**Ejemplo:**

```typescript
async function getQuizById(quizId: string): Promise<Quiz> {
  const response = await fetch(`${BASE_URL}/quizzes/${quizId}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Quiz no encontrado');
  }
  
  return data.data;
}
```

### 4. Obtener Quiz con Opciones

**Endpoint:** `GET /api/v1/quizzes/:id/options`

**Autenticación:** No requerida

**Ejemplo:**

```typescript
async function getQuizWithOptions(quizId: string): Promise<QuizWithOptions> {
  const response = await fetch(`${BASE_URL}/quizzes/${quizId}/options`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Error al obtener quiz');
  }
  
  return data.data;
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "quiz123",
    "moduleId": "789e0123-e89b-12d3-a456-426614174000",
    "question": "¿Qué es la sedimentación?",
    "type": "MULTIPLE_CHOICE",
    "explanation": "La sedimentación es...",
    "options": [
      {
        "id": "opt1",
        "optionText": "Proceso de filtración",
        "isCorrect": false,
        "order": 1
      },
      {
        "id": "opt2",
        "optionText": "Proceso de separación de sólidos",
        "isCorrect": true,
        "order": 2
      }
    ]
  }
}
```

### 5. Crear Quiz

**Endpoint:** `POST /api/v1/quizzes`

**Autenticación:** Requerida

**Ejemplo:**

```typescript
async function createQuiz(quizData: CreateQuizDto): Promise<Quiz> {
  const response = await authenticatedFetch('/quizzes', {
    method: 'POST',
    body: JSON.stringify(quizData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Error al crear quiz');
  }
  
  return data.data;
}

// Uso
const newQuiz = await createQuiz({
  moduleId: '789e0123-e89b-12d3-a456-426614174000',
  question: '¿Qué es la sedimentación?',
  type: 'MULTIPLE_CHOICE',
  explanation: 'La sedimentación es un proceso...',
  options: [
    { optionText: 'Opción 1', isCorrect: false, order: 1 },
    { optionText: 'Opción 2', isCorrect: true, order: 2 },
  ],
});
```

### 6. Actualizar Quiz

**Endpoint:** `PUT /api/v1/quizzes/:id`

**Autenticación:** Requerida

**Ejemplo:**

```typescript
async function updateQuiz(
  quizId: string,
  updates: { question?: string; explanation?: string }
): Promise<Quiz> {
  const response = await authenticatedFetch(`/quizzes/${quizId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Error al actualizar quiz');
  }
  
  return data.data;
}
```

### 7. Eliminar Quiz

**Endpoint:** `DELETE /api/v1/quizzes/:id`

**Autenticación:** Requerida

**Ejemplo:**

```typescript
async function deleteQuiz(quizId: string): Promise<void> {
  const response = await authenticatedFetch(`/quizzes/${quizId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error?.message || 'Error al eliminar quiz');
  }
}
```

### 8. Responder un Quiz (Crear Intento)

**Endpoint:** `POST /api/v1/quizzes/:quizId/attempt`

**Autenticación:** Requerida

**Ejemplo:**

```typescript
async function submitQuizAttempt(
  quizId: string,
  responses: Array<{ quizOptionId: string }>
): Promise<QuizAttempt> {
  const response = await authenticatedFetch(`/quizzes/${quizId}/attempt`, {
    method: 'POST',
    body: JSON.stringify({ responses }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Error al enviar respuesta');
  }
  
  return data.data;
}

// Uso
const attempt = await submitQuizAttempt('quiz123', [
  { quizOptionId: 'opt2' }, // Respuesta seleccionada
]);

console.log('Puntuación:', attempt.score); // 0.0 a 1.0
console.log('Es correcto:', attempt.isCorrect); // true o false
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "attempt123",
    "userId": "456e7890-e89b-12d3-a456-426614174001",
    "quizId": "quiz123",
    "score": 1.0,
    "isCorrect": true,
    "attemptedAt": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Intento de quiz creado exitosamente"
}
```

### 9. Obtener Intentos de Quiz

**Endpoint:** `GET /api/v1/quizzes/:quizId/attempts`

**Autenticación:** Requerida

**Ejemplo:**

```typescript
async function getQuizAttempts(quizId: string): Promise<QuizAttempt[]> {
  const response = await authenticatedFetch(`/quizzes/${quizId}/attempts`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Error al obtener intentos');
  }
  
  return data.data;
}
```

---

## Manejo de Errores

### Estructura de Error

Todas las respuestas de error siguen este formato:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje de error descriptivo"
  }
}
```

### Códigos de Error Comunes

- `UNAUTHORIZED` (401): No autenticado o token inválido
- `NOT_FOUND` (404): Recurso no encontrado
- `VALIDATION_ERROR` (400): Error de validación
- `ALREADY_ENROLLED` (409): Ya estás inscrito en el curso
- `NOT_ENROLLED` (403): No estás inscrito en el curso
- `INTERNAL_ERROR` (500): Error interno del servidor

### Ejemplo de Manejo de Errores

```typescript
async function handleApiCall<T>(
  apiCall: () => Promise<T>
): Promise<{ data?: T; error?: string }> {
  try {
    const data = await apiCall();
    return { data };
  } catch (error: any) {
    if (error.message) {
      return { error: error.message };
    }
    return { error: 'Error desconocido' };
  }
}

// Uso
const result = await handleApiCall(() => enrollInCourse(courseId));
if (result.error) {
  console.error('Error:', result.error);
  // Mostrar mensaje al usuario
} else {
  console.log('Éxito:', result.data);
}
```

### Errores de Validación

Cuando hay errores de validación (código 400), la respuesta incluye detalles:

```json
{
  "success": false,
  "errors": [
    {
      "path": ["title"],
      "message": "El título es requerido",
      "type": "string"
    }
  ]
}
```

---

## Ejemplos de Flujos Completos

### Flujo: Ver Catálogo y Inscribirse en un Curso

```typescript
// 1. Obtener cursos activos
const courses = await getCourses({ status: 'ACTIVE' });

// 2. Mostrar catálogo al usuario
courses.forEach(course => {
  console.log(`${course.title} - ${course.category}`);
});

// 3. Usuario selecciona un curso
const selectedCourse = courses[0];

// 4. Obtener detalles del curso con módulos
const courseDetails = await getCourseWithModules(selectedCourse.id);

// 5. Inscribirse en el curso
try {
  const enrollment = await enrollInCourse(selectedCourse.id);
  console.log('Inscripción exitosa! Progreso:', enrollment.progress);
} catch (error) {
  if (error.message === 'Ya estás inscrito en este curso') {
    console.log('Ya estás inscrito');
  }
}
```

### Flujo: Estudiar un Módulo y Responder Quiz

```typescript
// 1. Obtener módulos del curso
const modules = await getModulesByCourse(courseId);

// 2. Seleccionar un módulo
const currentModule = modules[0];

// 3. Obtener módulo con relaciones (quizzes, resources)
const moduleDetails = await getModuleWithRelations(currentModule.id);

// 4. Mostrar contenido del módulo
console.log('Título:', moduleDetails.title);
console.log('Contenido:', moduleDetails.content);
console.log('Video:', moduleDetails.videoUrl);

// 5. Obtener quiz del módulo
const quiz = await getQuizWithOptions(moduleDetails.quizzes[0].id);

// 6. Mostrar pregunta y opciones
console.log('Pregunta:', quiz.question);
quiz.options.forEach(option => {
  console.log(`- ${option.optionText}`);
});

// 7. Usuario responde
const userResponse = quiz.options[1].id; // Opción seleccionada

// 8. Enviar respuesta
const attempt = await submitQuizAttempt(quiz.id, [
  { quizOptionId: userResponse }
]);

// 9. Mostrar resultado
if (attempt.isCorrect) {
  console.log('¡Correcto! Puntuación:', attempt.score);
} else {
  console.log('Incorrecto. Puntuación:', attempt.score);
  console.log('Explicación:', quiz.explanation);
}
```

---

## Notas Importantes

1. **Autenticación**: Todas las rutas que requieren autenticación deben incluir el header `Authorization: Bearer {token}`.

2. **IDs**: Todos los IDs son UUIDs en formato string.

3. **Fechas**: Todas las fechas vienen en formato ISO 8601 (string).

4. **Progreso**: El campo `progress` en enrollments es un número entre 0.0 y 1.0 (0% a 100%).

5. **Puntuación**: El campo `score` en quiz attempts es un número entre 0.0 y 1.0.

6. **Orden**: Los módulos tienen un campo `order` que indica su posición en el curso.

7. **Validación**: Todos los endpoints validan los datos de entrada. Revisa los mensajes de error para ver qué campos son requeridos.

---

## Recursos Adicionales

- **Swagger Documentation**: `http://localhost:3000/api/v1/docs` (cuando el servidor está corriendo)
- **Base URL**: Configurar en variables de entorno `NEXT_PUBLIC_BACKEND_URL`

