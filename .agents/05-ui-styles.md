# 🎨 UI y Estilos

### Reglas de Estilizado

1. **SOLO Tailwind utility classes** en templates
2. **NO** usar `<style scoped>` ni `<style>` en componentes
3. **NO** crear archivos CSS nuevos
4. Variables CSS para tema dinámico están en `style.css`
5. **Siempre** importar componentes base ui desde `@/shared/components/ui/`
6. **No se debe crear componentes personalizdos** se deben mantener un mismo estilo para toda la app

```vue
<!-- ✅ CORRECTO -->
<template>
  <div class="flex items-center gap-4 p-6 bg-dark-surface rounded-lg">
    <BaseButton variant="primary">Comprar</BaseButton>
  </div>
</template>

<!-- ❌ INCORRECTO -->
<template>
  <div class="container">
    <button class="btn-primary">Comprar</button>
  </div>
</template>
<style scoped>
.container { padding: 2rem; }
.btn-primary { background: red; }
</style>
```

### Componentes UI Disponibles

Importar desde `@/shared/components/ui/`:

```typescript
import { ... } from '@/shared/components/ui';
```

### Layout & Tipografía

| Componente      | Props Principales                                                                                                                                            | Events |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| `PageContainer` | `maxWidth: 'sm' | 'md' | 'lg' | 'xl' | 'full'`, `padding: boolean`                                                                                       | —      |
| `Title` (h1-h6) | `level: 1 | 2 | 3 | 4 | 5 | 6`, `variant: 'display' | 'heading' | 'subheading'`, `truncate: boolean`                                                  | —      |
| `Text`          | `variant: 'body' | 'caption' | 'overline'`, `color: 'default' | 'muted' | 'primary' | 'danger'`, `weight: 'normal' | 'medium' | 'semibold' | 'bold'` | —      |


### Botones

| Componente    | Props Principales                                                                                                                                                                                            | Events  |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `BaseButton`  | `variant: 'primary' | 'secondary' | 'danger' | 'info' | 'warning'`, `size: 'sm' | 'md' | 'lg'`, `disabled: boolean`, `loading: boolean`, `fullWidth: boolean`, `iconLeft: string`, `iconRight: string` | `click` |
| `FloatButton` | `variant: 'primary' | 'secondary'`, `icon: string`, `position: 'bottom-right' | 'bottom-left'`, `offset: number`                                                                                           | `click` |

### Formularios

| Componente        | Props Principales                                                                                                                                                                                                                                                                                              | Events                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `BaseInput`       | `modelValue: string`, `label: string`, `placeholder: string`, `type: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'`, `error: string`, `hint: string`, `iconLeft: string`, `iconRight: string`, `clearable: boolean`, `disabled: boolean`, `readonly: boolean`, `maxLength: number` | `update:modelValue`, `blur`, `focus`, `clear` |
| `BaseSelect`      | `modelValue: T`, `label: string`, `options: SelectOption[]`, `placeholder: string`, `error: string`, `multiple: boolean`, `searchable: boolean`, `disabled: boolean`                                                                                                                                           | `update:modelValue`, `search`                 |
| `BaseTextArea`    | `modelValue: string`, `label: string`, `placeholder: string`, `rows: number`, `maxLength: number`, `error: string`, `hint: string`, `autoResize: boolean`, `disabled: boolean`                                                                                                                                 | `update:modelValue`, `blur`, `focus`          |
| `BaseCheckbox`    | `modelValue: boolean`, `label: string`, `indeterminate: boolean`, `disabled: boolean`                                                                                                                                                                                                                          | `update:modelValue`                           |
| `BaseRadio`       | `modelValue: T`, `options: RadioOption[]`, `label: string`, `error: string`, `disabled: boolean`                                                                                                                                                                                                               | `update:modelValue`                           |
| `BaseSwitch`      | `modelValue: boolean`, `label: string`, `disabled: boolean`, `loading: boolean`                                                                                                                                                                                                                                | `update:modelValue`                           |
| `BaseColorPicker` | `modelValue: string`, `label: string`, `presetColors: string[]`, `disabled: boolean`                                                                                                                                                                                                                           | `update:modelValue`                           |
| `BaseDatePicker`  | `modelValue: Date | null`, `label: string`, `placeholder: string`, `format: string`, `minDate: Date`, `maxDate: Date`, `disabled: boolean`                                                                                                                                                                    | `update:modelValue`, `open`, `close`          |
| `BaseTimePicker`  | `modelValue: string`, `label: string`, `format: '12h' | '24h'`, `disabled: boolean`                                                                                                                                                                                                                           | `update:modelValue`                           |
| `BaseUpload`      | `modelValue: File[]`, `label: string`, `accept: string`, `maxSize: number`, `maxFiles: number`, `multiple: boolean`, `disabled: boolean`                                                                                                                                                                       | `update:modelValue`, `error`, `remove`        |

### Contenedores

| Componente     | Props Principales                                                                                                                                           | Events              |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `BaseCard`     | `variant: 'default' | 'elevated' | 'outlined'`, `padding: 'none' | 'sm' | 'md' | 'lg'`, `hoverable: boolean`, `clickable: boolean`, `loading: boolean` | `click`             |
| `BaseForm`     | `submitLabel: string`, `cancelLabel: string`, `loading: boolean`, `showCancel: boolean`                                                                     | `submit`, `cancel`  |
| `BaseCollapse` | `modelValue: boolean`, `title: string`, `disabled: boolean`                                                                                                 | `update:modelValue` |

### Navegación

| Componente       | Props Principales                                                                                                                     | Events                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `BaseBreadcrumb` | `items: BreadcrumbItem[]`, `separator: 'slash' | 'arrow' | 'chevron'`                                                               | `click` (por item)               |
| `BaseMenu`       | `items: MenuItem[]`, `mode: 'vertical' | 'horizontal'`, `collapsed: boolean`, `selectedKeys: string[]`                               | `select`, `openChange`           |
| `BaseDropdown`   | `trigger: 'click' | 'hover'`, `placement: 'top' | 'bottom' | 'left' | 'right'`, `disabled: boolean`                               | `visibleChange`                  |
| `BasePagination` | `page: number`, `total: number`, `pageSize: number`, `pageSizeOptions: number[]`, `showSizeChanger: boolean`, `showTotal: boolean`    | `update:page`, `update:pageSize` |
| `BaseSteps`      | `current: number`, `items: StepItem[]`, `direction: 'horizontal' | 'vertical'`, `size: 'default' | 'small'`                         | `change`                         |
| `BaseTabs`       | `modelValue: string`, `items: TabItem[]`, `type: 'line' | 'card' | 'pill'`, `position: 'top' | 'left'`, `destroyInactive: boolean` | `update:modelValue`, `change`    |


### Feedback & Overlay

| Componente         | Props Principales                                                                                                                                                                                                 | Events                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `BaseModal`        | `modelValue: boolean`, `title: string`, `width: string | number`, `closable: boolean`, `maskClosable: boolean`, `footer: boolean`, `confirmLoading: boolean`, `okText: string`, `cancelText: string`             | `update:modelValue`, `ok`, `cancel`, `close` |
| `BaseAlert`        | `variant: 'info' | 'success' | 'warning' | 'error'`, `title: string`, `message: string`, `closable: boolean`, `showIcon: boolean`, `banner: boolean`                                                           | `close`                                      |
| `BaseDrawer`       | `modelValue: boolean`, `title: string`, `placement: 'left' | 'right' | 'top' | 'bottom'`, `width: string | number`, `closable: boolean`, `maskClosable: boolean`                                              | `update:modelValue`, `close`                 |
| `BaseNotification` | `type: 'info' | 'success' | 'warning' | 'error'`, `message: string`, `description: string`, `duration: number`, `placement: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'`, `closable: boolean` | `close`, `click`                             |
| `BaseTour`         | `steps: TourStep[]`, `current: number`, `mask: boolean`, `type: 'default' | 'primary'`, `showArrow: boolean`                                                                                                     | `change`, `finish`, `close`                  |
| `BasePopover`      | `trigger: 'click' | 'hover' | 'focus'`, `placement: Placement`, `title: string`, `content: string`, `disabled: boolean`                                                                                         | `visibleChange`                              |
| `BaseTooltip`      | `trigger: 'hover' | 'focus' | 'click'`, `placement: Placement`, `content: string`, `disabled: boolean`                                                                                                          | —                                            |

### Datos & Media

| Componente     | Props Principales                                                                                                                                                                                                            | Events                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `BaseTable`    | `data: T[]`, `columns: TableColumn[]`, `loading: boolean`, `pagination: PaginationConfig`, `rowSelection: RowSelection`, `sortable: boolean`, `filterable: boolean`, `emptyText: string`, `scroll: { x: number, y: number }` | `rowClick`, `sortChange`, `filterChange`, `selectionChange`, `pageChange` |
| `BaseAvatar`   | `src: string`, `alt: string`, `size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'`, `shape: 'circle' | 'square'`, `fallback: string`, `badge: AvatarBadge`                                                                          | `error`, `click`                                                          |
| `BaseImage`    | `src: string`, `alt: string`, `width: string | number`, `height: string | number`, `fit: 'fill' | 'contain' | 'cover' | 'none'`, `preview: boolean`, `loading: 'eager' | 'lazy'`, `fallback: string`                   | `load`, `error`, `click`                                                  |
| `BaseCarousel` | `items: CarouselItem[]`, `autoplay: boolean`, `interval: number`, `dots: boolean`, `arrows: boolean`, `effect: 'slide' | 'fade'`, `vertical: boolean`                                                                       | `change`, `click`                                                         |
| `BaseEmpty`    | `image: string`, `description: string`, `imageStyle: object`                                                                                                                                                                 | —                                                                         |
| `BaseSkeleton` | `active: boolean`, `avatar: boolean`, `paragraph: { rows: number, width: string | string[] }`, `title: boolean`, `loading: boolean`                                                                                         | —                                                                         |


### Estados & Tags

| Componente   | Props Principales                                                                                                                                                      | Events           |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `BaseBadge`  | `variant: 'default' | 'primary' | 'success' | 'warning' | 'danger'`, `text: string`, `dot: boolean`, `count: number`, `overflowCount: number`, `showZero: boolean` | —                |
| `BaseTag`    | `variant: 'default' | 'primary' | 'success' | 'warning' | 'danger'`, `closable: boolean`, `icon: string`, `disabled: boolean`                                      | `close`, `click` |
| `BaseLoader` | `size: 'xs' | 'sm' | 'md' | 'lg'`, `variant: 'spinner' | 'dots' | 'bar' | 'skeleton'`, `fullscreen: boolean`, `tip: string`                                      | —                |

### 📋 Catálogo organizado por categoría

| Categoría        | Componentes                                                                                                                                                           |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Layout**       | `PageContainer`                                                                                                                                                       |
| **Tipografía**   | `Title` (h1-h6), `Text`                                                                                                                                               |
| **Botones**      | `BaseButton`, `FloatButton`                                                                                                                                           |
| **Formularios**  | `BaseInput`, `BaseSelect`, `BaseTextArea`, `BaseCheckbox`, `BaseRadio`, `BaseSwitch`, `BaseColorPicker`, `BaseDatePicker`, `BaseTimePicker`, `BaseUpload`, `BaseForm` |
| **Contenedores** | `BaseCard`, `BaseCollapse`                                                                                                                                            |
| **Navegación**   | `BaseBreadcrumb`, `BaseMenu`, `BaseDropdown`, `BasePagination`, `BaseSteps`, `BaseTabs`                                                                               |
| **Feedback**     | `BaseAlert`, `BaseNotification`, `BaseDrawer`, `BaseTour`                                                                                                             |
| **Overlay**      | `BaseModal`, `BasePopover`, `BaseTooltip`                                                                                                                             |
| **Datos**        | `BaseTable`, `BaseEmpty`, `BaseSkeleton`                                                                                                                              |
| **Media**        | `BaseAvatar`, `BaseImage`, `BaseCarousel`                                                                                                                             |
| **Estados**      | `BaseBadge`, `BaseTag`, `BaseLoader`                                                                                                                                  |


### 🔴 Reglas de uso

| Regla                                      | Ejemplo correcto                          | Ejemplo incorrecto                          |
| ------------------------------------------ | ----------------------------------------- | ------------------------------------------- |
| **Nunca clases Tailwind sueltas**          | `<BaseButton variant="danger">`           | `<button class="bg-red-500 px-4 py-2">`     |
| **Nunca `<style>` en componentes**         | —                                         | `<style scoped>.btn { color: red }</style>` |
| **Props de variante, no clases**           | `<BaseCard variant="elevated">`           | `<BaseCard class="shadow-lg border">`       |
| **Iconos por nombre, no SVG inline**       | `<BaseButton iconLeft="trash">`           | `<BaseButton><svg>...</svg></BaseButton>`   |
| **Slots para contenido, no props de HTML** | `<BaseModal><p>Contenido</p></BaseModal>` | `<BaseModal content="<p>Contenido</p>">`    |


### Iconos

Usar `lucide-vue-next`:

```typescript
import { Check, X, Loader2, AlertCircle, Ticket, User } from 'lucide-vue-next';
```
