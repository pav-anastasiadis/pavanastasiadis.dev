# Decisions — blog-immerse-mode

## [2026-04-06] Architecture Decisions

### Immerse Activation
- **Decision**: "Immerse" toggle button solves browser autoplay-with-sound restriction
- **Rationale**: Browsers block autoplay with sound without user gesture; the button IS the user gesture
- **Alternative considered**: Auto-unmute on page load (rejected — browsers block it)

### iframe Hiding Strategy
- **Decision**: `position:absolute; left:-9999px; width:1px; height:1px; overflow:hidden`
- **Rationale**: `display:none` and `visibility:hidden` both pause playback in browsers
- **Alternative considered**: `display:none` (rejected — pauses YouTube iframe)

### YouTube API Loading
- **Decision**: Load `https://www.youtube.com/iframe_api` via `<script>` tag in useEffect
- **Rationale**: No npm dependencies needed, compatible with static export
- **Race condition handling**: Dual-path initialization (callback + fallback check)

### Visual Modes
- **Decision**: Build BOTH spotlight/vignette AND full dark-mode-shift; default to spotlight
- **Rationale**: User wants to compare both before deciding which to keep
- **Implementation**: `mode` prop on BlogImmerse component ('spotlight' | 'dark-shift')

### Scope
- **Decision**: Blog pages only (`/blog` and `/blog/[slug]`)
- **Rationale**: User requested blog-only; layout unmounts on nav away (expected)

### localStorage
- **Decision**: Store preference as `{ active: boolean, mode: string }` under key `blog-immerse`
- **Rationale**: Returning users auto-immerse if they previously activated it

### Volume
- **Decision**: `player.setVolume(30)` on player ready (30% volume)
- **Rationale**: Avoid jarring full-volume unmute on first click

## [2026-04-07] Verification Notes
- The dark-shift mode wiring is correct as-is: the wrapper class is conditional on both `mode === 'dark-shift'` and `isImmersed`, and the overlay is spotlight-only.
- A pre-existing runtime bug surfaced during validation: `VIDEO_ID` was undefined in the YouTube iframe URL. Restoring the constant was required to make `/blog` load for browser verification.
