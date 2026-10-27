# Simón Café TV V2 — RESTOLIA

Sitio para Smart TV que muestra únicamente productos de categoría `COMBO` del menú público de RESTOLIA.

## Instalación
1. Subí **todos los archivos de esta carpeta** a la raíz del repositorio existente `simon-cafe-tv` en GitHub, reemplazando los anteriores.
2. Render desplegará la actualización (o elegí Manual Deploy > Deploy latest commit).
3. Conservá `Build Command: npm install` y `Start Command: npm start`.
4. Abrí el sitio en el Smart TV.

No hace falta ninguna clave ni variable de entorno. Por defecto usa:
`https://vertex.lambdaclass.com/api/v1/public/venues/sim-n-ram-n-andr-s-main/menu`

Opcionalmente se puede definir `RESTOLIA_FEED_URL` en Render para cambiar el origen.

## Funcionamiento
- Render consulta la dirección pública de RESTOLIA (servidor a servidor).
- Solo muestra `category_name = COMBO`, con nombre, precio final e `image_url`.
- Actualiza cada 5 minutos, repite en bucle y conserva la última lista cargada si hay una interrupción temporal.
- Si un producto no tiene foto, muestra el marcador Simón Café.
- Las fotos y los precios se gestionan en RESTOLIA.

## Comprobación
Abrí `https://TU-SITIO.onrender.com/api/promos` para ver el JSON de promociones filtradas. Si hay error 502, revisar logs de Render y la disponibilidad del menú público.

Este proyecto usa una URL pública no documentada como API oficial; RESTOLIA podría modificarla en el futuro.
