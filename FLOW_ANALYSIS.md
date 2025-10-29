# Glyphd Flow Analysis & Testing Results

## Current Flow: Make → Build → Editor → Preview

### 1. **Make Button Flow** ✅
**Location**: `apps/web/app/page.tsx`

1. User enters idea in textarea
2. Clicks "Make" button → redirects to `/build?prompt={idea}&slug={auto-generated}`
3. Build page calls `/api/build` (uses DeepSeek API now)
4. Files created in `apps/web/public/symbols/{slug}/`:
   - `metadata.json` - headline, sub, author, etc.
   - `schema.json` - nav, features, pricing, etc.
   - `hero.png` - generated image
   - `schemas/*.json` - structured data
5. Redirects to `/m/{slug}` which shows the preview

### 2. **Preview Display** ✅
**Location**: `apps/web/app/s/[slug]/page.tsx`

- Reads from `apps/web/public/symbols/{slug}/metadata.json` and `schema.json`
- Displays:
  - Hero section with headline, sub, and image
  - Features section
  - Integrations section  
  - Pricing section
  - Testimonials section
  - FAQ section
- EditDock component loaded via `EditWrapper` client component

### 3. **Editor (EditDock)** ⚠️
**Location**: `apps/web/components/EditDock.tsx`

**Current Implementation**:
- Conversation stored in `apps/web/public/symbols/{slug}/dock.json`
- Two modes:
  - **Ask**: Discuss ideas without making changes (uses DeepSeek assist)
  - **Code**: Implement changes (uses DeepSeek refine)
- Messages persisted in `DockSession` with metadata

**Current Issue**:
The `/api/marks/[slug]/dock/message` route currently only modifies `metadata.json` (appends text to the `sub` field). It doesn't actually modify the HTML/CSS files or schema data.

```typescript
// Current implementation (line 42-52 in dock/message/route.ts)
meta.sub = (meta.sub || '') + ' • ' + (text || 'refined')
fs.writeFileSync(path.join(baseDir, 'metadata.json'), ...)
```

This means changes are visible only in the subtitle, not in the actual content sections.

### 4. **Preview Updates After Editing** ⚠️
**Location**: `apps/web/components/EditDock.tsx` (line 173)

- After code mode changes, page reloads with `window.location.reload()`
- This works but is a full page refresh (not real-time)

## What's Working ✅

1. **DeepSeek Integration**: Successfully migrated from z.ai to DeepSeek v3.2-exp
   - Models: `deepseek-chat`, `deepseek-coder`, `deepseek-reasoner`
   - OpenAI-compatible endpoint at `https://api.deepseek.com/v1/chat/completions`

2. **Flow Completes**: Make button → build → preview all works

3. **Conversation History**: Stored in `dock.json` with full message history

4. **UI Flow**: EditDock slides up, messages display, mode switching works

## What Needs Improvement ⚠️

### 1. **Actual File Changes**
**Problem**: Currently only metadata is modified, not the actual HTML/schema

**Needed**: The `/api/marks/[slug]/dock/message` route should:
- Parse the AI response for structured changes
- Update `schema.json` with new features/pricing/nav/etc
- Generate new content files if needed
- Apply diff patches to existing files

### 2. **Edit Points / Go Back**
**Problem**: No way to revert to previous states

**Solution Structure** (already in place):
- Conversation history stored in `dock.json`
- Each message has `id`, `createdAt`, `annotations`
- Could add:
  - Timestamp snapshots in `dock.json`
  - File history (old files backed up)
  - "Jump back" button that reverts to a previous message's state

**Implementation needed**:
```typescript
interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  createdAt: string
  stateSnapshot?: {
    metadata: any
    schema: any
    timestamp: string
  }
}
```

### 3. **Real-time Preview Updates**
**Problem**: Full page reload is jarring

**Better**: Use React state + optimistic updates
- Don't reload the page
- Update the preview component state
- Show loading states during edits

## Conversation History Storage

**Location**: `apps/web/public/symbols/{slug}/dock.json`

```json
{
  "mode": "code" | "ask",
  "status": "idle" | "analyzing" | "implementing" | "complete",
  "messages": [
    {
      "id": "timestamp",
      "role": "user" | "assistant",
      "modeAtSend": "code" | "ask",
      "text": "...",
      "createdAt": "ISO string",
      "annotations": { "badge": "CODE" | "ASK" }
    }
  ],
  "lastPlan": [{ "id": "...", "title": "...", "description": "..." }]
}
```

**For Edit Points**: Add `stateSnapshot` to each message that modifies files:

```json
{
  "messages": [
    {
      "id": "123",
      "role": "user",
      "text": "Add pricing section",
      "createdAt": "2025-01-01T00:00:00Z",
      "stateSnapshot": {
        "metadata": { ... },
        "schema": { ... },
        "files": ["schema.json", "metadata.json"],
        "timestamp": "2025-01-01T00:00:00Z"
      }
    }
  ]
}
```

Then "Jump back" would:
1. Read the `stateSnapshot` from the target message
2. Restore metadata.json and schema.json
3. Reload the page
4. Truncate messages array to remove everything after that point

## Testing Results

✅ **Verified Working**:
- Make button redirects correctly
- Build API calls DeepSeek successfully  
- Files are created in correct location
- Preview page displays content
- EditDock loads and sends messages
- Conversation persists in dock.json
- Page reloads after changes (though changes are limited)

⚠️ **Needs Work**:
- AI edits need to actually modify schema/content files
- Edit points need implementation
- Real-time preview updates (without full reload)

## Recommendations

1. **Enhance `/api/marks/[slug]/dock/message`**:
   - Parse AI response for actionable changes
   - Update schema.json and other content files
   - Apply structured changes (features, pricing, nav updates)

2. **Add Edit Points UI**:
   - Add "Jump back" button to each message
   - Store state snapshots on file changes
   - Implement revert logic

3. **Improve Preview**:
   - Use client-side state updates
   - Show optimistic UI during edits
   - Avoid full page reloads

---

**Date**: ${new Date().toISOString()}
**Status**: Core flow works, enhancements needed for production

