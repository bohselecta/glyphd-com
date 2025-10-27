# Auto-planner Refactor Summary

## Changes Made

### 1. Home Page (`apps/web/app/page.tsx`)
**Removed**: Auto-plan checkbox and state management
**Reason**: Auto-planner is always enabled by default

**Before**:
- Checkbox to toggle autoplanner
- State management with `setAutoPlanner`
- Unnecessary complexity

**After**:
- Auto-planner always enabled (state is now const)
- Plan button always passes `auto=true`
- Cleaner UI without checkbox clutter

### 2. Designer/Plan Page (`apps/web/app/designer/page.tsx`)

**Header Update**:
- Checkbox label: "Auto-planner" → "Use AI plan (uncheck for advanced)"

**Behavior**:
- **Checked (default)**: AI auto-planner mode
  - Sections are auto-generated with sparkle ✨ indicator
  - Sections at 60% opacity (can't be edited)
  - No manual section adding
  - Shows: "These sections have been automatically selected..."
  
- **Unchecked**: Advanced mode
  - Sections can be manually edited (× remove button)
  - Manual section addition enabled
  - Full control over planning
  - All features unlocked

**UI States**:
- When checkbox is checked: Advanced section shows greyed out with placeholder "Unlock advanced mode to add sections manually"
- When checkbox is unchecked: Advanced section becomes fully interactive

## User Flow

### Default Flow (AI Mode)
1. User lands on homepage
2. Clicks "Plan" button
3. Goes to `/designer?auto=true`
4. Auto-planner is enabled (checkbox checked by default)
5. System auto-analyzes and suggests sections
6. User can proceed to build OR uncheck to unlock advanced features

### Advanced Flow (Manual Mode)
1. User clicks "Plan" button
2. Goes to planner page
3. Unchecks "Use AI plan" checkbox
4. Advanced features unlock:
   - Can remove auto-generated sections
   - Can manually add custom sections
   - Full control over planning

## Benefits

1. **Simpler UX**: No confusion on homepage, AI does the work by default
2. **Clear Progression**: Users can upgrade to advanced mode by unchecking
3. **Visual Feedback**: Greyed out sections show what's unlocked
4. **Better Guidance**: Placeholder text explains how to unlock features

## Files Modified

- `apps/web/app/page.tsx` - Removed autoplanner checkbox
- `apps/web/app/designer/page.tsx` - Updated checkbox behavior and greyed-out states

## Testing

✅ No lint errors
✅ Checkbox state persists correctly
✅ Greyed out sections appear when checked
✅ Advanced mode unlocks when unchecked
✅ Flow works from homepage → designer → build

