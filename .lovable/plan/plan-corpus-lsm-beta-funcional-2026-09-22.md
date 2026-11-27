# Plan: Corpus LSM Beta funcional

## Resultado
Ampliar el prototipo existente para convertirlo en la aplicación navegable Corpus LSM solicitada, manteniendo todos los datos y resultados claramente identificados como demostración.

## Implementación
- Actualizar la identidad visual y navegación: Corpus LSM, buscador global, Inicio, Buscar, Explorar, Favoritos, Historial, Configuración y acceso móvil.
- Reorganizar Inicio con las cuatro acciones principales y una sección de signos populares con reproducción y favoritos.
- Completar la búsqueda textual con filtros, ordenamiento, conteo, estados vacíos y acceso al detalle.
- Ampliar el detalle de glosa con reproductor, pestañas, muestras alternas, favoritos y atributos presentes/no especificados sin inventar datos.
- Convertir la búsqueda fonológica en una vista de dos paneles con filtros múltiples activos, limpieza y resultados calculados sobre datos de demostración.
- Completar el catálogo audiovisual con buscador, filtros, ordenamiento, reproducción y acceso a cada muestra.
- Añadir módulos navegables de análisis de video y relaciones fonológicas, ambos rotulados como simulaciones sin afirmar resultados reales.
- Implementar Favoritos e Historial en almacenamiento local del navegador, con controles funcionales y estados vacíos.
- Mantener una capa de datos separada y compatible con palabra, glosa, glosa_palabra, muestra y configuración JSON flexible.
- Añadir páginas y metadatos propios para cada sección nueva.

## Validación
- Probar recorridos principales en escritorio y móvil: búsqueda → glosa → muestra, filtros fonológicos, favoritos, historial y análisis demostrativo.
- Verificar que todos los controles visibles respondan, que no haya errores y que las etiquetas de demostración sean claras.

## Fuera de alcance
- Sin conexión PostgreSQL, autenticación real ni modelo de reconocimiento automático en esta Beta.
