# ⚡ Actividad 2: PokeAPI BaaS Explorer

![Angular](https://img.shields.io/badge/Angular-17+-dd0031?style=flat&logo=angular)
![.NET](https://img.shields.io/badge/.NET-8.0-512bd4?style=flat&logo=dotnet)
![TailwindCSS](https://img.shields.io/badge/Tailwind-38bdf8?style=flat&logo=tailwindcss)
![PokeAPI](https://img.shields.io/badge/API-PokeAPI-yellow?style=flat&logo=pokemon)

Solución técnica para la exploración del universo Pokémon implementando una arquitectura **BFF (Backend for Frontend)**. El sistema destaca por su interfaz de usuario avanzada (Carousel 3D, Glassmorphism) y una optimización inteligente de datos en el backend.

---

## 🏛️ Arquitectura y Optimización

El Backend actúa como una capa de abstracción sobre la PokeAPI pública para resolver problemas de rendimiento y estructura de datos:

### 1. Patrón BFF (Backend for Frontend)

El Frontend no consume `pokeapi.co` directamente. El Backend propio centraliza las peticiones, permitiendo:

- **Enriquecimiento de Datos:** La API pública devuelve URLs para las imágenes. Nuestro Backend procesa estas URLs, extrae el ID y construye la URL directa al CDN de arte oficial (`official-artwork`), entregando al frontend un objeto listo para usar.
- **Auditoría:** Cada interacción (búsqueda o cambio de página) se persiste en MySQL.

### 2. Estrategia de Paginación (`Limit` & `Offset`)

A diferencia de la paginación por "Páginas" (1, 2, 3), este sistema implementa el estándar técnico de PokeAPI:

- **Limit:** Define cuántos recursos traer (Dinámico: 5, 10, 20).
- **Offset:** Define cuántos recursos saltar.
  - _Ejemplo:_ Para ver la página 2 con límite 5, el offset es 5 (saltar los primeros 5).
  - _Fórmula:_ `NewOffset = CurrentOffset ± Limit`.

### 3. Estrategia de Búsqueda Híbrida

- **Por Nombre:** Consulta directa al endpoint de detalle.
- **Por Tipo:** PokeAPI no soporta paginación nativa en el endpoint `/type`.
  - _Solución:_ El Backend descarga la lista completa de IDs del tipo solicitado y realiza la **paginación en memoria** (LINQ Skip/Take) antes de responder al cliente, manteniendo la interfaz de paginación consistente.

---

## 🛠️ Instrucciones de Ejecución

### 1. Base de Datos

Ejecute el script `Database/schema.sql` en su cliente MySQL para crear la BD `PokeDB`.

### 2. Ejecución del Backend (.NET 8)

1. Navegue a la carpeta del backend:
   - cd Backend_PT2
2. Restaure los paquetes y ejecute:
   - dotnet restore
   - dotnet run
3. El servidor iniciará en: http://localhost:5285 (o el puerto indicado en consola).
   - Swagger disponible en: http://localhost:5285/swagger
   - Nota: Configure su conexión MySQL en Program.cs si es necesario.

### 3. Ejecución del Frontend (Angular)

1. Abra una nueva terminal y navegue al frontend:
   - cd Frontend-PT1
2. Instale las dependencias:
   - npm install
3. Inicie el servidor de desarrollo:
   - ng serve -o
4. La aplicación se abrirá en el puerto:
   - http://localhost:4200.

---

## ✨ Características Visuales (UI/UX)

1. Carousel Infinito: Navegación horizontal con "Scroll Snap" y Auto-Play inteligente (se pausa al interactuar).
2. Diseño Pop-Out: Las imágenes de los Pokémon sobresalen de las tarjetas para un efecto 3D.
3. Feedback Visual: Indicadores de paginación (dots), loaders animados y estados vacíos.
4. Estética: Paleta de colores moderna (Gradientes Cyan/Emerald) alejándose del rojo estándar para un look más corporativo/tech.

---

## 📂 Estructura del Proyecto

| Carpeta                           | Descripción                                     |
| --------------------------------- | ----------------------------------------------- |
| `/Backend`                        | API .NET 8 (Controlador de paginación y proxy)  |
| `/Backend/Services`               | Lógica de consumo HTTP y transformación de DTOs |
| `/Backend/Models`                 | Modelos tipados                                 |
| `/Backend/Data`                   | Contexto de Entity Framework Core               |
| `/Frontend`                       | Cliente Angular                                 |
| `/Frontend/src/app/services`      | Lógica de cliente HTTP                          |
| `/Frontend/src/app/app.component` | Lógica de UI, carrusel y filtros                |
| `/Database`                       | Scripts SQL                                     |
