# Moto Moto Rifas - Frontend Vue 3

Aplicación moderna para gestión de rifas online, construida con las mejores prácticas de desarrollo.

## 🚀 Stack Tecnológico

- **Vue 3** - Framework progresivo con Composition API
- **TypeScript** - Tipado fuerte para mayor seguridad
- **Vite** - Build tool ultra rápido
- **Tailwind CSS v4** - Estilos utilitarios con tema dinámico
- **Pinia** - State management
- **Vue Router** - Navegación con guards de autenticación
- **TanStack Query (Vue Query)** - Gestión de estado del servidor
- **Axios** - Cliente HTTP con interceptors
- **Zod** - Validación de esquemas

## 📁 Estructura del Proyecto

```
vue/
├── src/
│   ├── config/              # Configuración validada con Zod
│   ├── core/                # Infraestructura (API, types)
│   ├── features/            # Vertical Slices
│   │   ├── home/            # Landing page
│   │   ├── tickets/         # Selección de boletos
│   │   ├── purchase/        # Flujo de compra
│   │   ├── verification/    # Verificador público
│   │   ├── winners/         # Ganadores
│   │   ├── auth/            # Login/Registro
│   │   └── account/         # Mi Cuenta
│   ├── shared/              # Código compartido
│   │   ├── components/ui/   # Componentes base
│   │   └── utils/           # Helpers
│   ├── stores/              # Pinia stores
│   └── mocks/               # API mocks para desarrollo
└── ...
```

## 🎨 Características

### Arquitectura
- ✅ **Vertical Slice Architecture** - Cada feature es independiente
- ✅ **SOLID Principles** - Código mantenible y escalable
- ✅ **Clean Code** - Nombres descriptivos, funciones pequeñas
- ✅ **TypeScript Strict** - Tipado fuerte en todo el proyecto

### Patrones de Diseño
- ✅ **Composables** - Lógica reutilizable con Single Responsibility
- ✅ **Managers por Vista** - Orquestadores de features
- ✅ **Componentes Puros** - Solo reciben props y emiten events
- ✅ **Services** - Llamadas API separadas de la UI
- ✅ **TanStack Query** - Cache, reintentos, deduplicación

### Estado Global
- ✅ **Pinia** - Stores modulares (auth, tickets, ui, theme, purchase)
- ✅ **Tema Dinámico** - Claro/Oscuro + colores configurables

### API & HTTP
- ✅ **Axios Wrapper** - Interceptors centralizados
- ✅ **Manejo de Errores** - Global + validaciones
- ✅ **Mocks** - API simulada para desarrollo

## 🛠️ Instalación

```bash
cd vue
npm install
```

## 📝 Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Moto Moto Rifas
VITE_RECAPTCHA_KEY=tu_clave_recaptcha
```

## 🏃 Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Build

```bash
npm run build
```

El output se genera en `dist/`

## 🧪 Preview

```bash
npm run preview
```

## 🗺️ Rutas

| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/` | Home - Landing | Público |
| `/boletos` | Selección de boletos | Requiere Auth |
| `/verificar` | Verificador de boletos | Público |
| `/ganadores` | Ganadores (actual + histórico) | Público |
| `/login` | Inicio de sesión | Público |
| `/registro` | Registro de usuario | Público |
| `/cuenta` | Dashboard de cuenta | Protegido |
| `/cuenta/numeros` | Historial de compras | Protegido |
| `/cuenta/premios` | Premios ganados | Protegido |
| `/cuenta/perfil` | Editar perfil | Protegido |
| `/cuenta/notificaciones` | Configuración | Protegido |

## 🔐 Flujo de Autenticación

La autenticación es **inteligente e integrada en la compra**:

1. Usuario selecciona boletos → Click "Continuar"
2. Sistema pide: Email, Teléfono, Cédula
3. Verifica si existe:
   - **Si existe** → Pide contraseña → Login automático
   - **Si no existe** → Crea cuenta → Envía emails → Continúa
4. Finaliza compra con usuario autenticado

## 🎨 Tema

- **Modo Oscuro/Claro** - Toggle manual + detección automática del sistema
- **Colores Dinámicos** - Configurables desde backend (mock por ahora)
- **Paleta Actual**:
  - Primary: Rojo intenso (#DC2626) - Urgencia, emoción
  - Secondary: Ámbar (#FBBF24) - Premio, lujo
  - Accent: Verde (#16A34A) - Éxito, ganar

## 📱 Responsive

- Mobile-first design
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Menú mobile con animaciones

## 🔧 Componentes UI (Shared)

- `BaseButton` - Variants: primary, secondary, danger, ghost, outline
- `BaseInput` - Con label, error, hint, icon
- `BaseSelect` - Dropdown estilizado
- `BaseModal` - Con overlay, animaciones, slots
- `BaseCard` - Contenedor con variantes
- `BaseBadge` - Badges de estados
- `BaseLoader` - Spinner de carga
- `BaseAlert` - Notificaciones (success, error, warning, info)

## 📊 Features Principales

### Home
- Hero con imagen del premio
- Countdown al sorteo
- Barra de progreso de venta
- Lista de premios
- CTA a compra

### Tickets
- Grilla de números paginada
- Búsqueda por número
- Selección aleatoria
- Cálculo de precios y descuentos
- Barra fija de seleccionados

### Purchase (Wizard)
- Paso 1: Datos personales
- Paso 2: Método de pago
- Paso 3: Comprobante
- Auth inline integrado

### Verification
- Búsqueda por teléfono
- Búsqueda por ticket
- Resultados con detalles

### Winners
- Banner del sorteo actual
- Histórico paginado (6 por página)
- Buscador por nombre

### Account
- Mis Números (historial)
- Mis Premios
- Perfil editable
- Notificaciones (email/WhatsApp)

## 🔮 Próximos Pasos

- [ ] Conectar con API real (actualmente usa mocks)
- [ ] Implementar upload de vouchers
- [ ] Emails de bienvenida y ticket
- [ ] Validaciones más robustas
- [ ] Tests unitarios
- [ ] Tests E2E
- [ ] Optimización de imágenes
- [ ] PWA para mobile

## 📄 Licencia

Todos los derechos reservados - Moto Moto Rifas © 2025

---

**Desarrollado con ❤️ usando Vue 3 + TypeScript**
