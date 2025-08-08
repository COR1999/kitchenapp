# Theme System Documentation

## Overview
The Kitchen App now uses a centralized theme system that allows you to easily change the entire color scheme across all components.

## How to Change Color Scheme

### Method 1: Quick Theme Switch
1. Open `src/theme/theme.ts`
2. Change line: `export const currentTheme = defaultTheme;`
3. To: `export const currentTheme = purpleTheme;` (or any other theme)
4. Rebuild the app - all colors will update automatically!

### Method 2: Create Custom Theme
1. Open `src/theme/theme.ts`
2. Create a new theme object following the `ThemeConfig` interface:

```typescript
export const myCustomTheme: ThemeConfig = {
  colors: {
    primary: 'indigo-500',        // Main action buttons
    primaryHover: 'indigo-600',   // Hover state
    success: 'emerald-500',       // Success buttons/badges
    successHover: 'emerald-600',
    warning: 'amber-500',         // Warning badges
    warningHover: 'amber-600', 
    danger: 'rose-500',           // Delete/danger buttons
    dangerHover: 'rose-600',
    secondary: 'slate-500',       // Secondary buttons
    secondaryHover: 'slate-600',
    // ... rest of colors
  },
  // ... rest of theme config
};
```

3. Update the export: `export const currentTheme = myCustomTheme;`

## Available Themes
- `defaultTheme` - Blue-based color scheme (current)
- `purpleTheme` - Purple-based color scheme
- Additional themes can be found in `themeSwitcher.ts`

## Components Using Theme System
✅ **Fully Themed Components:**
- Button
- Modal 
- Badge
- Input
- TextArea
- CreditNoteManager

⚠️ **Partially Themed Components:**
- Dashboard (some hardcoded colors remain)
- InvoiceDetails (some hardcoded colors remain)

❌ **Components Needing Theme Updates:**
- FoodTraceability
- DamageReportDialog
- InvoiceEditor
- SpellCheckDialog
- InvoiceScanner

## Theme Structure

### Color Categories:
- **Primary**: Main brand color for primary actions
- **Success**: Green tones for positive actions/status
- **Warning**: Yellow/amber tones for caution/pending
- **Danger**: Red tones for destructive actions/errors
- **Secondary**: Gray tones for secondary actions
- **Neutral**: Gray tones for text and borders

### Usage Examples:
```typescript
// In a component:
import { currentTheme } from '../theme';

// Button with theme colors
<button className={`bg-${currentTheme.colors.primary} hover:bg-${currentTheme.colors.primaryHover}`}>
  Click me
</button>

// Status badge
<span className={currentTheme.statusColors.pending}>
  Pending
</span>
```

## Benefits
1. **Global Color Changes**: Change one file to update entire app
2. **Consistency**: All components use the same color palette
3. **Maintainability**: No scattered hardcoded colors
4. **Flexibility**: Easy to create brand-specific themes
5. **Accessibility**: Consistent color ratios and contrast

## Next Steps
1. Update remaining components to use theme system
2. Add more theme variants (dark mode, high contrast, etc.)
3. Implement runtime theme switching with React context
4. Add color customization UI for end users