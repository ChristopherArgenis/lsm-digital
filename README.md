# Lsm Digital

Quiero que diseñes un prototipo de alta fidelidad de una aplicación web que será el producto final de un proyecto de investigación sobre un Corpus de Lengua de Señas Mexicana (LSM).

El objetivo de esta primera versión es crear un prototipo visual y funcional tipo Beta, que posteriormente pueda iterarse hasta convertirse en una aplicación real conectada a una base de datos PostgreSQL.

1. CONTEXTO DEL PROYECTO

El proyecto consiste en construir una base de datos estructurada de un corpus de lengua de señas.

La información está organizada alrededor de:

Palabras en español.

Glosas de LSM.

Relación entre palabras y glosas.

Muestras de video asociadas a cada glosa.

Información lingüística y fonológica de cada glosa.

La base de datos no almacena simplemente "palabra → video". La intención es representar información lingüística suficientemente estructurada como para permitir posteriormente búsquedas en ambas direcciones:

Información lingüística → video

y

Video / glosa → información lingüística.

A futuro se busca que el sistema pueda recuperar muestras de video a partir de características lingüísticas y fonológicas, así como permitir consultar la información lingüística asociada a una muestra.

2. MODELO CONCEPTUAL

El modelo actual tiene cuatro entidades principales:

PALABRA

Representa una palabra del español.

id_palabra

palabra

GLOSA

Representa una glosa de LSM.

Contiene información como:

id_glosa

nombre

descripción

configuración de la mano

otros parámetros fonológicos y lingüísticos

Los atributos fonológicos pueden manejarse mediante estructuras JSONB cuando corresponda, permitiendo que determinadas características estén presentes solamente cuando existen datos para ellas.

GLOSA_PALABRA

Tabla intermedia que relaciona palabras con glosas.

Esto permite relaciones muchos-a-muchos.

Una palabra puede relacionarse con varias glosas y una glosa puede relacionarse con varias palabras.

MUESTRA

Representa una muestra audiovisual de una glosa.

Una glosa puede tener múltiples muestras de video.

La estructura conceptual es:

PALABRA ←→ GLOSA → MUESTRA

La aplicación debe reflejar este modelo conceptual sin mostrar al usuario detalles innecesarios de implementación de PostgreSQL.

3. OBJETIVO DE LA APLICACIÓN

La aplicación debe funcionar como una plataforma de consulta y exploración de un corpus de LSM.

El usuario debe poder:

Buscar una palabra en español.

Encontrar las glosas relacionadas.

Consultar información lingüística/fonológica de una glosa.

Reproducir las muestras de video disponibles.

Explorar las relaciones entre palabras, glosas y muestras.

En una etapa posterior, realizar búsquedas utilizando características fonológicas.

En una etapa posterior, poder partir de una muestra/video y recuperar su información lingüística.

IMPORTANTE:

No quiero que la aplicación parezca un simple "diccionario de traducción español → lengua de señas".

Debe transmitir que se trata de un sistema de consulta y exploración de un corpus lingüístico estructurado.

4. USUARIO OBJETIVO

Diseña la interfaz pensando principalmente en:

Investigadores de lingüística.

Investigadores de lengua de señas.

Estudiantes.

Docentes.

Personas que quieran explorar el corpus.

Desarrolladores que posteriormente utilizarán la aplicación como interfaz de consulta de la base de datos.

La interfaz debe ser suficientemente sencilla para usuarios no técnicos, pero transmitir que detrás existe información lingüística estructurada.

5. PANTALLA PRINCIPAL

Diseña un dashboard/home moderno.

Debe contener:

Nombre del proyecto.

Una explicación muy breve del corpus.

Barra de búsqueda principal.

Accesos rápidos a:

Buscar palabra.

Explorar glosas.

Explorar muestras.

Búsqueda fonológica.

Un pequeño resumen estadístico del corpus:

número de palabras

número de glosas

número de muestras

Una sección de "Explorar corpus".

La búsqueda principal debe ser protagonista.

Ejemplo conceptual:

"Buscar una palabra, glosa o característica..."

No inventes cifras como si fueran datos reales. Si necesitas datos para mostrar el prototipo, utiliza valores claramente identificados como datos de demostración.

6. FLUJO 1 — BÚSQUEDA POR PALABRA

Diseña el flujo completo:

Usuario escribe:

"casa"

La aplicación muestra las palabras coincidentes y las glosas relacionadas.

Por ejemplo:

CASA

Glosas relacionadas:

CASA-1

CASA-2

Cada resultado debe mostrar:

nombre de la glosa

breve descripción

cantidad de muestras disponibles

botón "Ver glosa"

botón "Ver muestras"

No inventes diferencias lingüísticas específicas entre las glosas. Utiliza contenido ficticio claramente marcado como ejemplo.

7. FLUJO 2 — DETALLE DE UNA GLOSA

Diseña una pantalla dedicada a una glosa.

Debe ser una de las pantallas principales del prototipo.

Debe mostrar:

Encabezado

Nombre de la glosa.

Palabras asociadas.

Descripción.

Información lingüística

Crear una sección organizada visualmente para características como:

Configuración de la mano.

Orientación.

Ubicación.

Movimiento.

Contacto.

Otros parámetros fonológicos disponibles.

Los campos deben ser visualmente fáciles de leer.

Cuando una característica no esté disponible, no mostrarla como "N/A" repetidamente. El diseño debe contemplar que algunos atributos simplemente estén ausentes.

Muestras

Mostrar tarjetas o una cuadrícula con las muestras disponibles.

Cada muestra debe tener:

miniatura de video

identificador

información básica

botón de reproducción

8. FLUJO 3 — REPRODUCTOR DE VIDEO

Al seleccionar una muestra, mostrar un reproductor de video grande.

La pantalla debe mantener visible la información relevante de la glosa.

Diseña algo similar a:

[ VIDEO ]

Glosa: CASA-1

Palabras relacionadas:
CASA

Características fonológicas:
Configuración
Orientación
Ubicación
Movimiento

Debe quedar claro que el video es una muestra del corpus, no simplemente un video educativo.

9. FLUJO 4 — BÚSQUEDA FONOLÓGICA

Esta función es especialmente importante para la evolución futura del proyecto.

Diseña una pantalla llamada:

Búsqueda fonológica

El usuario podrá seleccionar características lingüísticas mediante controles como:

configuración de mano

orientación

ubicación

movimiento

contacto

otros parámetros

Debe existir una opción para combinar varios criterios.

Ejemplo conceptual:

Configuración de mano:
[ MD: ... ]

Movimiento:
[ circular ]

Ubicación:
[ ... ]

Botón:

Buscar en el corpus

El resultado debe mostrar las glosas y posteriormente sus muestras de video.

IMPORTANTE:

Esta función puede presentarse como Beta / experimental, porque representa una de las capacidades que se desarrollarán sobre la base de datos.

10. FLUJO 5 — EXPLORACIÓN DEL CORPUS

Crear una sección donde el usuario pueda explorar:

Palabras

Glosas

Muestras

Debe ser posible navegar de una entidad a otra.

Ejemplo:

PALABRA
↓
GLOSAS RELACIONADAS
↓
INFORMACIÓN LINGÜÍSTICA
↓
MUESTRAS
↓
VIDEO

La navegación debe hacer evidente esta relación.

11. FUTURA FUNCIÓN BIDIRECCIONAL

Quiero que el diseño deje preparada visualmente una segunda dirección de consulta:

Características lingüísticas → glosas → videos

y eventualmente:

Video → glosa → características lingüísticas → palabras relacionadas

No es necesario implementar reconocimiento automático de señas en esta primera Beta.

Sin embargo, la arquitectura visual debe dejar espacio para una futura sección llamada:

Analizar muestra

o

Buscar a partir de video

que pueda desarrollarse posteriormente.

Esta sección debe aparecer como una funcionalidad futura/experimental, no como una función ya implementada.

12. NAVEGACIÓN

Propón una navegación lateral o superior consistente.

Como mínimo:

Inicio

Buscar

Glosas

Muestras

Búsqueda fonológica

Explorar corpus

Y una sección secundaria:

Acerca del proyecto

No agregues funciones comerciales, perfiles sociales, pagos, carrito, publicidad ni elementos que no tengan relación con el proyecto.

13. DISEÑO VISUAL

Quiero una interfaz:

académica

moderna

limpia

tecnológica

profesional

accesible

orientada a datos

Evita que parezca:

una aplicación comercial de traducción

una red social

una app infantil

un sitio web genérico de diccionario.

Debe parecer una herramienta científica/lingüística moderna.

Utiliza una jerarquía visual clara.

Los videos deben tener suficiente protagonismo, pero la información lingüística también debe ser importante.

Usa tarjetas, tablas, filtros, etiquetas y paneles para organizar la información.

14. RESPONSIVE

El prototipo debe contemplar:

Desktop

Tablet

Mobile

La versión Desktop será la principal para esta primera Beta.

15. DATOS DE DEMOSTRACIÓN

Utiliza datos ficticios únicamente para demostrar el funcionamiento de la interfaz.

Marca internamente estos datos como:

"Datos de demostración"

No presentes datos inventados como resultados reales del corpus.

Puedes utilizar ejemplos como:

casa

perro

escuela

comer

agua

y glosas ficticias correspondientes.

16. LO QUE QUIERO QUE ENTREGUES

No quiero únicamente una serie de imágenes estáticas.

Quiero que el resultado se comporte visualmente como un prototipo navegable de una aplicación Beta.

Prioriza:

Home/dashboard.

Búsqueda.

Resultados.

Detalle de glosa.

Muestras.

Reproductor de video.

Búsqueda fonológica.

Exploración del corpus.

Conecta visualmente las pantallas para que pueda simular el recorrido:

Inicio → Buscar "casa" → Resultados → Glosa → Información fonológica → Muestras → Video

y:

Inicio → Búsqueda fonológica → Resultados → Glosa → Video

17. IMPORTANTE SOBRE LA IMPLEMENTACIÓN FUTURA

Este prototipo será posteriormente convertido en una aplicación real.

Por ello:

utiliza componentes reutilizables;

mantén consistencia entre pantallas;

utiliza nombres claros para botones y secciones;

evita diseños imposibles de implementar;

piensa en una futura conexión con una API;

piensa en PostgreSQL como backend;

separa conceptualmente presentación, búsqueda y datos;

no acoples el diseño a datos ficticios.

El resultado debe servir como primer prototipo de producto, no solamente como presentación visual.

18. CRITERIO PRINCIPAL

La pregunta que debe responder visualmente el prototipo es:

"¿Cómo puede un investigador explorar un corpus de LSM estructurado lingüística y fonológicamente, encontrar las glosas relacionadas y recuperar sus muestras de video?"

La aplicación debe hacer evidente que el verdadero valor del proyecto está en la estructura de los datos y las relaciones lingüísticas, y que los videos son una de las formas de consultar y visualizar esa información.

Genera el prototipo completo con una experiencia coherente entre todas las pantallas.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://lsm-digital.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/28838d41-0881-43aa-9778-e3020ffabef3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
