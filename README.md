# Regionales del Norte — sitio web (boceto)

Sitio institucional y tienda para **Regionales del Norte**, fábrica de escabeches de carnes silvestres y de criadero propio en Mariano I. Loza, Corrientes, Argentina.

Es un sitio **100 % estático** (HTML, CSS y JavaScript, sin dependencias ni compilación). El pedido se arma en la página y se envía por **WhatsApp** con el detalle y el total, así que no hace falta pasarela de pago ni servidor.

## Cómo verlo

- Abrir `index.html` con doble clic, o
- levantar un servidor local: `npx serve .` (o `python3 -m http.server`) y entrar a `http://localhost:3000` / `http://localhost:8000`.

## Secciones

1. **Inicio**: propuesta de valor, fotos de los productos, sello "Desde 1990" e indicadores de confianza.
2. **Nuestra historia**: relato de la empresa, valores y línea de tiempo.
3. **Del monte a tu mesa**: el proceso en 4 pasos.
4. **Productos**: catálogo con filtros, precios, cantidades y "Agregar al pedido".
5. **Mayoristas**: llamada para comercios y gastronomía.
6. **Calidad**: habilitaciones (RNE / RNPA), origen legal y faja de seguridad.
7. **Cómo comprar** y **Preguntas frecuentes**.
8. **Contacto**: datos, horario, formulario (por e-mail o WhatsApp) y mapa.
9. **Mi pedido**: panel lateral con el carrito; se guarda en el navegador y se envía por WhatsApp.

## Estructura

```
index.html        Página única con todas las secciones
css/styles.css    Estilos (paleta y tipografías al inicio, en :root)
js/main.js        Configuración, catálogo de productos, carrito y formularios
img/              Fotos de productos y favicon
```

## Datos a confirmar con la empresa

Este boceto usa **datos de ejemplo** que hay que reemplazar antes de publicar:

| Dato | Dónde se cambia |
|---|---|
| Número de WhatsApp | `js/main.js` → `CONFIG.whatsapp` (formato `549` + código de área + número, sin espacios) |
| Teléfono visible | `index.html` (barra superior, contacto, pie y JSON-LD): buscar `379 400-0000` y `+5493794000000` |
| E-mail | `js/main.js` → `CONFIG.email` y en `index.html`: buscar `ventas@regionalesdelnorte.com.ar` |
| Año de fundación | `js/main.js` → `CONFIG.foundedYear` (actualiza "Desde…" y "+XX años" en todo el sitio) |
| Historia y línea de tiempo | `index.html`, sección `#nosotros` (texto y años 1998, 2008, 2015 son propuestas) |
| Productos, descripciones y precios | `js/main.js` → `PRODUCTS`. Solo **Ciervo** y **Pavita** son productos reales con foto; Jabalí, Carpincho, Liebre y Codorniz son ejemplos |
| Peso del frasco | `js/main.js` → `size` de cada producto (se tomó 375 g de la etiqueta) |
| N.º de RNE y RNPA | `index.html`, pie de página |
| Horario de atención | `index.html`, sección `#contacto` |
| Afirmaciones a validar | "Envíos a todo el país", "Planta habilitada", formas de pago, retiro en fábrica |

## Cómo agregar o cambiar un producto

En `js/main.js`, dentro de `PRODUCTS`, copiar un bloque y editarlo:

```js
{
  id: 'vizcacha',                    // identificador único, sin espacios
  name: 'Vizcacha',
  style: 'Deshuesada en escabeche',
  category: 'monte',                 // 'monte' o 'aves' (filtros)
  size: 'Frasco 375 g',
  price: 11900,                      // en pesos, sin puntos
  image: 'img/vizcacha.jpg',         // opcional: sin foto se dibuja un frasco ilustrativo
  description: 'Texto breve del producto.',
},
```

Las fotos se ven mejor **cuadradas, con el frasco centrado sobre fondo oscuro** (como las actuales), de al menos 800 × 800 px. Las fotos de Ciervo y Pavita de este boceto se recortaron de una captura de pantalla y conviene reemplazarlas por los originales en alta resolución.

## Publicación

Al ser estático, se puede publicar gratis en GitHub Pages, Netlify o Vercel subiendo la carpeta tal cual. Para el dominio propio (por ejemplo `regionalesdelnorte.com.ar`) hay que registrarlo en NIC Argentina y apuntarlo al servicio elegido.
