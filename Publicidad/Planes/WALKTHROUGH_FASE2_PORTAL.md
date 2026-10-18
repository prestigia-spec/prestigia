# 🚀 Walkthrough: Portal del Negocio Multi-Sede & Radar Google con IA (`/portal`)

Hemos construido y desplegado exitosamente la **Fase 2 de Prestigia Pro**: el **Portal de Gestión del Negocio (`/portal`)**, diseñado tanto para el **Dueño de la Marca** como para los **Encargados de Sede**, con total blindaje contra suspensiones de Google y máxima velocidad operativa.

---

## 🔑 1. Acceso Dual con Roles Segregados

### A. Vista de Dueño General (Owner)
- **Credenciales Demo**:
  - **Identificador**: `la-burguesia`
  - **Contraseña**: `admin`
- **Capacidades**:
  - Selector superior desplegable para alternar entre **"Todas las Sedes (Consolidado)"** o enfocarse en una sucursal específica (*Sede Chapinero*, *Sede Usaquén*).
  - Visibilidad de métricas globales de toda la marca (calificación promedio, total de críticas privadas contenidas, reseñas de Google pendientes).

### B. Vista de Encargado de Sede (Branch Manager)
- **Credenciales Demo**:
  - **Identificador**: `la-burguesia-chapinero`
  - **PIN**: `1234`
- **Capacidades**:
  - **Aislamiento de seguridad**: El encargado **solo ve y gestiona los datos de su sede**. No tiene acceso al selector de sedes ni a las estadísticas de las demás sucursales.

---

## ⭐ 2. Radar de Reseñas de Google Maps con IA Anti-Spam

- **Alerta Activa**: Badge en vivo con el número de reseñas públicas de Google pendientes por responder.
- **Cumplimiento Estricto de Políticas de Google ("Human-in-the-Loop")**:
  - **Cero Spam / Cero Respuestas Repetidas**: Cada respuesta generada por la IA utiliza variaciones dinámicas, saludos contextuados y referencias específicas al comentario del cliente.
  - **Sin enlaces ni números de teléfono**: Cumple al 100% las directrices de Google Business Profile para evitar bloqueos o suspensiones silenciosas.
  - **Selector de 3 Tonos**:
    1. 💖 *Empático y Cercano*
    2. 👔 *Profesional y Distinguido*
    3. 🚀 *Promocional y Fidelización*
  - **Flujo de 1 Toque**: El botón **"Copiar Respuesta"** guarda el texto en el portapapeles y el botón **"Pegar en Google Maps"** abre la ficha exacta del negocio para que el dueño/encargado solo pegue y envíe.

---

## 🛡️ 3. Bandeja de Quejas Privadas (Rescate 1-Clic WhatsApp)

- Visualización inmediata de quejas privadas (1 a 3★) capturadas por el filtro que **NUNCA llegaron a Google**.
- Botón verde pulsante: **"Rescatar Cliente por WhatsApp"**:
  - Abre directamente `https://wa.me/{telefono}?text=...` con el mensaje empático pre-redactado mencionando el nombre del cliente y el motivo exacto de su molestia para resolverlo antes de que se enfríe.
- Opción de marcar la queja como *"Resuelta"*.

---

## 📱 4. Centro de Descargas Smart QR Digital

- Generación visual en tiempo real del código QR dinámico de la sede que apunta a su enrutador protegido (`prestigia.pro/r/[sede]`).
- Botón para **Descargar PNG en Alta Definición** (ideal para la pantalla del celular del personal o técnicos).
- Instrucciones listas para enviar a imprentas locales para placas acrílicas o stickers.
- Indicador en vivo del **Kill Switch** activo.

---

## 🧪 Pruebas Realizadas

1. **Autenticación Dueño vs. Encargado**:
   - `POST /api/portal/auth` con `la-burguesia` / `admin` ➔ Retorna rol `owner` con todas las sedes.
   - `POST /api/portal/auth` con `la-burguesia-chapinero` / `1234` ➔ Retorna rol `branch_manager` con 1 sola sede aislada.
2. **Generación de Respuestas con IA**:
   - `POST /api/portal/ai-reply` ➔ Genera 3 opciones con tono personalizado y sin datos de contacto prohibidos.
   - Verificado el gating de planes: si la cuenta es `basic`, se bloquea con el modal de Upgrade a Pro.
3. **Página Web y Rutas**:
   - `http://localhost:3000/portal` responde con código `200 OK`.
   - Botón de acceso directo agregado en el encabezado principal de `http://localhost:3000`.
