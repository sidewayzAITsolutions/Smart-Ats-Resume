# SmartATS Global Navigation System

## Overview

The SmartATS application now uses a unified `GlobalNavigation` component that provides consistent navigation across all pages while being flexible enough to adapt to different page requirements.

## Components

### GlobalNavigation Component
Location: `src/components/GlobalNavigation.tsx`

A flexible navigation component that adapts to different page contexts:

- **Logo**: Always positioned on the far left with the SmartATS branding
- **Center Content**: Contextual content (e.g., resume name and save status for builder)
- **Right Navigation**: Adaptive navigation items and user controls

### Navigation Hook
Location: `src/hooks/useNavigation.ts`

A utility hook that determines navigation configuration based on the current page route.

## Props

The `GlobalNavigation` component accepts the following props:

```typescript
interface GlobalNavigationProps {
  // Builder-specific props
  resumeName?: string;
  saveStatus?: 'saved' | 'saving' | 'unsaved';
  onPreview?: () => void;
  onExportPDF?: () => void;
  userData?: any;
  
  // Page-specific configuration
  showBuilderActions?: boolean;  // Show preview/export buttons
  showMainNav?: boolean;         // Show main navigation links
  showAuthButtons?: boolean;     // Show sign in/sign up buttons
}
```

## Usage Examples

### Landing Page
```tsx
<GlobalNavigation 
  showBuilderActions={false}
  showMainNav={true}
  showAuthButtons={true}
/>
```

### Builder Page
```tsx
<GlobalNavigation
  resumeName="My Resume"
  saveStatus="saved"
  onPreview={() => setShowPreview(true)}
  onExportPDF={handlePDFDownload}
  userData={userData}
  showBuilderActions={true}
  showMainNav={false}
  showAuthButtons={true}
/>
```

### Templates/Pricing/Other Pages
```tsx
<GlobalNavigation 
  userData={userData}
  showBuilderActions={false}
  showMainNav={true}
  showAuthButtons={true}
/>
```

### Auth Pages (Login/Signup)
```tsx
<GlobalNavigation 
  showBuilderActions={false}
  showMainNav={false}
  showAuthButtons={false}
/>
```

## Navigation Items

### Public Pages (Unauthenticated Users)
- Templates
- Pricing  
- Enterprise
- ATS Guide
- Contact

### Authenticated Users
- Builder
- Templates
- My Resumes
- Settings

## Features

### Responsive Design
- Desktop: Full navigation with all items visible
- Mobile: Hamburger menu with collapsible navigation

### Authentication Aware
- Shows appropriate navigation items based on user authentication status
- Integrates with UserDropdown component for authenticated users

### Builder Integration
- Special builder mode with resume name display
- Save status indicator (saved/saving/unsaved)
- Quick action buttons (Preview, Export PDF)

### Consistent Branding
- SmartATS logo and branding always visible
- Consistent styling across all pages
- Smooth transitions and hover effects

## Migration from Old Navigation

All pages have been successfully updated to use the new `GlobalNavigation` component:

1. ✅ Landing page (`src/app/page.tsx`)
2. ✅ Builder page (`src/app/builder/page.tsx`)
3. ✅ Templates page (`src/app/templates/page.tsx`)
4. ✅ Pricing page (`src/app/pricing/page.tsx`)
5. ✅ Profiles page (`src/app/profiles/page.tsx`)
6. ✅ Settings page (`src/app/settings/page.tsx`)
7. ✅ Auth pages (`src/app/login/page.tsx`, `src/app/signup/page.tsx`)
8. ✅ Enterprise page (`src/app/enterprise/page.tsx`)
9. ✅ Enterprise dashboard (`src/app/enterprise/dashboard/page.tsx`)
10. ✅ ATS Guide page (`src/app/ats-guide/page.tsx`)
11. ✅ Contact Sales page (`src/app/contact-sales/page.tsx`)

### Migration Complete ✅
- All pages now use the unified `GlobalNavigation` component
- Old `UnifiedNavigation` component has been removed
- Consistent navigation experience across the entire application

## Benefits

1. **Consistency**: Uniform navigation experience across all pages
2. **Maintainability**: Single component to maintain instead of multiple navigation implementations
3. **Flexibility**: Easily configurable for different page requirements
4. **Responsive**: Works seamlessly on desktop and mobile devices
5. **Future-proof**: Easy to add new navigation items or modify behavior

## Completed Tasks ✅

1. ✅ Updated all pages to use GlobalNavigation
2. ✅ Removed old UnifiedNavigation component
3. ✅ Implemented consistent navigation across entire application

## Future Enhancements

1. Add breadcrumb navigation for deeper pages
2. Implement navigation analytics tracking
3. Add keyboard navigation support
4. Consider adding search functionality to navigation
