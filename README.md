# Simón Café TV — primera versión

Pantalla 16:9 de promociones con logo oficial, fondo de granos de café, efecto máquina de escribir, precio animado, pausa de 5 segundos y reproducción circular.

## Instalar en Render
1. Subir **todos** estos archivos a un repositorio de GitHub (mantener las carpetas).
2. Render → New → Web Service → conectar el repositorio.
3. Runtime: Node; Build Command: `npm install`; Start Command: `npm start`.
4. Abrir la URL de Render en el navegador del Smart TV y activar pantalla completa si el navegador lo permite.

## Cargar promociones e imágenes
Por ahora, editar `promos.json` en GitHub: cada producto debe tener `category: "COMBO"`, `name`, `price` e `image`.
Para fotos propias, subir imágenes JPG/PNG/WEBP a `assets/` y poner en `image` una ruta como `/assets/combo-latte.jpg`.
Los cambios publicados en GitHub requieren un nuevo despliegue de Render; luego la TV verá la versión actualizada al recargar o al consultar el catálogo si el servidor ya fue actualizado.
Los tres productos iniciales son **ejemplos de demostración**; sus precios no están sincronizados con RESTOLIA.

## Conectar RESTOLIA (pendiente de verificar)
Si se obtiene un endpoint HTTPS autorizado que devuelva JSON con productos, configurar la variable de entorno `RESTOLIA_FEED_URL` en Render. El servidor filtrará `category` / `categoria` igual a `COMBO` y actualizará cada 60 segundos. El enlace público del menú de RESTOLIA **no es necesariamente un endpoint JSON** y no debe colocarse directamente en esta variable. El formato de datos real podría exigir un adaptador adicional o credenciales de API.

## Nota sobre imágenes
Si una promoción no tiene imagen, aparece una ilustración provisional. No se descarga ni se inventa la fotografía del producto. Para una imagen real, agregar el archivo en `assets/`.

## Uso local
`npm start` y visitar `http://localhost:3000`.
