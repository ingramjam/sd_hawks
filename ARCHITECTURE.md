# Bronco Padres Baseball Manager - Architecture & Build Documentation

## Project Overview

**Bronco Padres Manager** is a web-based team management application for youth baseball (11-12U age group). It enables coaches and parents to manage lineups, fielding assignments, pitch counts, team schedules, and game records—all synchronized across devices via cloud storage.

**Team Details:**
- Team: Bronco Padres (11-12 years old)
- Roster: 12 players
- Season: Jan-May 2026
- Field: 6 innings per game
- Fielding Rules: No player sits 2 innings until all sit 1; everyone must play 1 inning infield

---

## Technology Stack

### Frontend
- **Language:** Vanilla JavaScript (ES6+)
- **HTML5** with responsive mobile-first design
- **CSS3** with media queries for mobile optimization (≤768px)
- **Library:** Sortable.js v1.15.0 (drag-drop functionality)
- **No build tools:** Runs directly in browser, no webpack/babel needed

### Backend/Cloud
- **JSONBin.io** - Free tier (500 API calls/month, bin storage)
- **Local Storage** - Browser localStorage for offline access
- **REST API** - JSON HTTP requests with custom headers

### Hosting
- **GitHub Pages** or local HTTP server
- **Static files only** - HTML, CSS, JS, JSON data

---

## Architecture & Data Flow

### Application Structure

```
┌─────────────────────────────────────────────────────┐
│         Bronco Padres Manager App (SPA)             │
├─────────────────────────────────────────────────────┤
│  Tabs: Lineup | Fielding | Rules | Pitch | Sched   │
├─────────────────────────────────────────────────────┤
│                    STATE LAYER                      │
│  currentRosterOrder[] | fieldingData{} | outPlayers │
│  pitchCounts{} | isReadOnly | currentPitcher       │
├─────────────────────────────────────────────────────┤
│                   STORAGE LAYER                     │
│  localStorage (offline)  │  JSONBin.io API (cloud)  │
├─────────────────────────────────────────────────────┤
│                 EXTERNAL INTEGRATIONS                │
│  GameChanger (team schedule link) | data.js (rules) │
└─────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│ User Opens App (window.onload)                           │
└──────────────────────────────────────────────────────────┘
        │
        ├─ Check URL: ?bin=[ID] or #state=[encoded]?
        │  YES → applyState(data, readOnly=true) [Shared link]
        │  NO → continue
        │
        ├─ Check localStorage for credentials
        │  MISSING → showCredentialModal()
        │
        ├─ Load DEFAULT_BIN_ID from JSONBin.io
        │  (admin's master roster)
        │  applyState(data, readOnly=false) [Admin/Home]
        │
        └─ Render UI + startAutoSync()
                │
                ├─ renderLineup() - Drag-drop batting order
                ├─ renderFielding() - Validation + 6 innings
                ├─ renderSchedule() - Events by month
                ├─ renderRules() - League rules
                ├─ initPitchCount() - Per-pitcher counts
                │
                └─ Every 30 min: periodicSync() [if changed]
                   └─ PUT to JSONBin.io → update DEFAULT_BIN_ID
```

### Credential Flow

```
┌─────────────────────────┐
│ User navigates to app   │
└────────┬────────────────┘
         │
    ┌────▼─────────────────┐
    │ Check localStorage    │
    │ jsonbin_credentials   │
    └────┬─────────────────┘
         │
    ┌────▼──────────────────────────────────┐
    │ Credentials found?                    │
    ├───────────────────────────────────────┤
    │ NO  → Show modal (gate on first load) │
    │ YES → Continue, skip modal            │
    └───┬──────────┬───────────────────────┘
        │          │
    ┌───▼──┐   ┌───▼──┐
    │ User │   │Skip  │
    │enters│   │&close│
    │keys  │   │modal │
    └───┬──┘   └──────┘
        │
    ┌───▼─────────────────────────┐
    │ saveCredentials()            │
    │ Store in localStorage        │
    │ X-Master-Key (for writing)   │
    │ X-Access-Key (for reading)   │
    └─────────────────────────────┘
```

### Sync Logic

```
┌──────────────────────────────────────────┐
│ periodicSync() runs every 30 minutes     │
└──────────┬───────────────────────────────┘
           │
    ┌──────▼──────────────────────────────┐
    │ Check conditions:                     │
    │ 1. NOT read-only? ✓                  │
    │ 2. State changed? ✓                  │
    │ 3. Credentials exist? ✓              │
    │ 4. API calls < 500/month? ✓          │
    └──────┬───────────────────────────────┘
           │
        YES│
           │
    ┌──────▼──────────────────────────────┐
    │ PUT /v3/b/[BIN_ID]                   │
    │ Headers: X-Master-Key                │
    │ Body: { order, fielding, out }       │
    └──────┬───────────────────────────────┘
           │
    ┌──────▼──────────────────────────────┐
    │ On success:                          │
    │ - Update lastSyncTime                │
    │ - Increment apiCallsThisMonth        │
    │ - Save to localStorage               │
    │ - Update sync status UI              │
    └──────────────────────────────────────┘
```

---

## Core Functions & Logic

### STATE MANAGEMENT

#### `applyState(state, readOnly = true)`
Loads roster, fielding, and OUT data into app state. Sets read-only flag for shared URLs.
```javascript
// Input: { order: [{name, pos, number}, ...], fielding: {name: [pos, ...]}, out: [...] }
// Sets: currentRosterOrder, fieldingData, outPlayers, isReadOnly
```

#### `getCurrentStateString()`
Serializes current state to JSON string for comparison (change detection).
```javascript
// Returns: JSON string of { order, fielding, out }
```

#### `hasStateChanged()`
Compares current state to last synced state. Returns true if changed.
```javascript
// Used by periodicSync to avoid unnecessary API calls
```

---

### LINEUP MANAGEMENT

#### `initLineup()`
Loads saved batting order from localStorage (`broncoLineup_v6`).

#### `renderLineup()`
Renders 12-player list with:
- Drag handles (≡) for reordering
- Batting position (1-12)
- Player name + number
- Position selector (-, P, C, 1B, 2B, 3B, SS, LF, CF, RF, BN, OUT)
- Song buttons (▶️) for walk-up music (if URL exists)
- OUT toggle button

#### `updateLineupPos(index, value)`
Updates position for batting order, handles OUT state transitions.

#### `saveLineup()` / `resetLineup()`
Persist/clear lineup to localStorage.

#### `toggleOut(playerName)`
Marks/unmarks player as OUT for the game (grayed out in fielding).

#### `initSortable()`
Initializes Sortable.js drag-drop on lineup container.

#### `shareLineup()` / `shareFielding()`
Creates shareable links via JSONBin.io OR URL hash encoding.
- Attempts to save to JSONBin.io and return `?bin=[ID]` URL
- Falls back to `#state=[encoded]` hash URL if offline

---

### FIELDING MANAGEMENT

#### `initFielding()`
Loads fielding assignments from localStorage (`broncoFielding_v6`).
Creates empty 6-inning matrix for each player: `["", "", "", "", "", ""]`

#### `renderFielding()`
Renders smart table with:
- **Player names** (sticky left column)
- **6 inning columns** (1-6)
- **Validation logic:** Sit violations, needs infield, good status
- **Color coding:** BN (bench gray), Infield (green), Outfield (white)
- **Position selects:** Disabled in read-only mode

**Validation Rules:**
1. No player sits more than others until all sit same amount (minSits + 1)
2. Dynamic max sits based on bench slots per inning and active player count
3. Everyone must play 1 inning infield
4. Calculates fairness: `activePlayers > 9` → some must bench each inning

#### `createPosSelect(playerName, inningIndex, currentVal, readOnly = false)`
Creates position dropdown or read-only span based on mode.
```javascript
// Positions: ["-", "P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "BN"]
// Infield = ["P", "C", "1B", "2B", "3B", "SS"]
```

#### `updateFielding(playerName, inningIndex, value)`
Updates position, saves to localStorage, re-validates.

#### `resetFielding()`
Clears all fielding assignments.

---

### PITCH COUNTING

#### `initPitchCount()`
Loads per-pitcher counts from localStorage (`broncoPitchCounts_v2`).
Format: `{ "Jace Ingram": 24, "Myles Gonzalez": 15, ... }`

#### `switchPitcher(playerName)`
Changes active pitcher and updates display.

#### `updatePitch(c)`
Adds/subtracts from current pitcher's count. `-999` resets to 0.
```javascript
// Example: updatePitch(1) increments, updatePitch(-1) decrements
```

#### `updatePitchDisplay()`
Shows:
- Current pitch count (large)
- Days rest required (based on thresholds)
- Pitches until next rest tier

**Rest Thresholds:**
- 0-20 pitches = 0 Days Rest
- 21-35 = 1 Day Rest
- 36-50 = 2 Days Rest
- 51-65 = 3 Days Rest
- 66-85 = 4 Days Rest
- 85+ = MAX LIMIT (finish batter only)

#### `renderPitcherSelect()`
Populates dropdown showing all rostered players with pitch counts: `"Jace Ingram (24)"`

---

### SCHEDULE

#### `renderSchedule()`
Renders embedded schedule data grouped by month.
```javascript
// scheduleEvents: [
//   { month: 'January 2026', events: [
//     { date: 'TUE 27', type: 'Practice', opponent: '', location: '...', time: '...' }
//   ]}
// ]
```

**Event Types & Icons:**
- Practice (blue, 🏃) - Regular training
- Game (red, ⚾) - Competitive matches
- Special (orange, 🎉) - Picture Day, Hit-a-Thon, Pony Day

**Embedded Events:** Full Jan-May 2026 schedule with all opponents and times.

---

### GAME RECORDS

#### `saveGameRecord()`
Saves game snapshot with:
- Pitcher name
- Pitch count for that pitcher
- All pitch counts (all pitchers)
- Lineup (order, position, OUT status)
- Fielding (all assignments)
- OUT players list

Stored in localStorage (`broncoGameRecords`), prepended to array.

#### `exportGameRecords()`
Downloads game records as JSON file for external analysis.

---

### CLOUD SYNC

#### `getCredentials()`
Retrieves stored JSONBin credentials from localStorage.
```javascript
// Returns: { masterKey: '...', accessKey: '...' }
```

#### `saveCredentials()` / `clearCredentials()`
Store/remove credentials in localStorage + update UI status.

#### `updateCredentialStatus()`
Shows masked credential display in Settings (first 10 chars + asterisks).

#### `loadFromCloud(binId)` / `saveToCloud()`
Low-level fetch wrappers for JSONBin.io API.

**loadFromCloud:**
```
GET /v3/b/[binId]/latest
Headers: X-Access-Key: [credentials.accessKey]
Returns: { record: { order, fielding, out } }
```

**saveToCloud:**
```
POST /v3/b/
Headers: X-Master-Key, X-Bin-Private: false
Body: { order, fielding, out }
Returns: { metadata: { id: '<newBinId>' } }
```

#### `updateTeamRoster()` [ADMIN]
Admin function: PUTs current state to DEFAULT_BIN_ID (team's shared roster).
Alerts all users to sync.

#### `loadDefaultsManual()` [TEAM MEMBER]
Manual button: Pulls latest from DEFAULT_BIN_ID and loads locally.

#### `periodicSync()` [AUTO]
Runs every 30 minutes if state changed. Increments API call counter.

#### `startAutoSync()` / `stopAutoSync()`
Initialize/cleanup auto-sync interval and status display.

#### `updateSyncStatusDisplay()`
Shows in Settings:
- Last synced time
- API calls used today
- Percentage of 500/month limit
- Warning at 80% usage

---

### MODAL & UI

#### `showCredentialModal()` / `hideCredentialModal()`
Gate credential entry on first load.

#### `submitModalCredentials()`
Validates and saves credentials from modal inputs.

#### `switchTab(id)`
Tab navigation with fade animation. Triggers `renderFielding()` when fielding tab clicked.

#### `switchTab('fielding')`
Specifically re-renders fielding on tab switch to show current validation state.

---

### RULES & SEARCH

#### `renderRules(rules)`
Renders rule cards from `data.js` broncoRules array.
Each rule has: title, category, content, source, important flag.

#### `filterRules(cat)`
Search + filter by category (All, Pitching, Manager, Game Time, Roster & Batting).

#### `document.getElementById('searchInput').addEventListener('input', ...)`
Live search as user types in search box.

---

### AUTH & SHARING

#### `loadFromUrlHash()`
Detects `#state=[encoded]` in URL and decodes/applies state (read-only).

#### `encodeState()` / `decodeState(encoded)`
Base64 encode/decode state for URL sharing.

#### `getShareUrl()`
Returns full URL ready to share for read-only link (via hash).

---

## Data Models

### Team Roster
```javascript
{
  name: "Jace Ingram",
  number: "#3",
  songUrl: "https://...(optional)",
  pos: "", // from POSITIONS array
  order: 1 // populated during game
}
```

### Fielding Data
```javascript
fieldingData = {
  "Jace Ingram": ["P", "C", "1B", "2B", "3B", "SS"],  // 6 innings
  "Myles Gonzalez": ["BN", "", "SS", "BN", "", "CF"],
  ...
}
```

### Game Record
```javascript
{
  id: 1709078400000,  // timestamp
  date: "2/27/2026",
  time: "3:45 PM",
  pitcher: "Jace Ingram",
  pitchCount: 67,
  allPitchCounts: { "Jace Ingram": 67, "Myles Gonzalez": 45 },
  lineup: [
    { order: 1, name: "Jace Ingram", number: "#3", pos: "P", out: false },
    ...
  ],
  fielding: { ... },
  outPlayers: ["Adam Enriquez"]
}
```

### Schedule Event
```javascript
{
  date: "SAT 28",  // weekday + day
  type: "Game",   // 'Game' | 'Practice' | 'Special'
  opponent: "vs. Rockies Bronco",
  location: "EYB Fields at Kit Carson Park - Bronco",
  time: "5:15 PM"
}
```

---

## APIs & Third-Party Integrations

### JSONBin.io REST API

**Endpoint:** `https://api.jsonbin.io/v3/b`

**Operations:**

1. **Create Bin (POST)**
   ```
   POST /v3/b/
   X-Master-Key: [key]
   X-Bin-Name: padres-lineup
   X-Bin-Private: false
   
   Body: { order: [...], fielding: {...}, out: [...] }
   Response: { metadata: { id: "<binId>" } }
   ```

2. **Read Bin (GET)**
   ```
   GET /v3/b/[binId]/latest
   X-Access-Key: [key]
   
   Response: { record: { order, fielding, out } }
   ```

3. **Update Bin (PUT)**
   ```
   PUT /v3/b/[binId]
   X-Master-Key: [key]
   
   Body: { order: [...], fielding: {...}, out: [...] }
   Response: { success: true }
   ```

**Rate Limits:**
- Free tier: 500 API calls/month
- Monitored via `apiCallsThisMonth` counter
- Warned at 80% usage (400 calls)

**Keys:**
- **Master Key:** Can create/update bins. User must provide.
- **Access Key:** Can read bins. User must provide.
- **Default Bin ID:** `69a21a9443b1c97be9a4c2f3` (hardcoded, team's shared roster)

---

### GameChanger

**Integration:** Link-only (no API)
```
https://web.gc.com/teams/oygknL58ynlG
```
Coaches click link to check live scores, standings, opposing lineups.

---

### Local Storage (Browser)

**Keys Used:**
1. `broncoLineup_v6` - Current batting order
2. `broncoFielding_v6` - Current fielding assignments
3. `broncoOut_v1` - OUT players list
4. `broncoPitchCounts_v2` - Per-pitcher pitch counts
5. `broncoPitchCount` - [DEPRECATED] Old single-pitcher counter
6. `broncoGameRecords` - Array of past game snapshots
7. `jsonbin_credentials` - User's JSONBin API keys
8. `syncStatus` - Last sync time + API call count

**Max Storage:** ~5-10MB per domain (browser dependent)

---

## Mobile Optimization

### Responsive Design

**Breakpoint:** 768px (tablets + phones)

**Fielding Table (Mobile):**
- Reduced font sizes (0.75-0.8rem)
- Smaller padding (2px vs 4-8px)
- Player column width: 85px (sticky)
- Inning selects: min-height 32px (thumb-friendly)
- Horizontal scroll still enabled for 6 innings

**Other Tabs:**
- Full width (max-width: 800px on desktop)
- Touch-friendly buttons (44px+ height)
- Readable text (0.8rem minimum)

---

## Security Considerations

### Credential Storage
- ⚠️ **Client-side only:** Credentials stored in `localStorage` (not encrypted)
- **Best Practice:** User should not share browser storage
- **Recommendation:** For production, use environment variables on server

### Read-Only Mode
- Shared URLs set `isReadOnly = true`
- Fielding selects disabled for non-admins
- Drag-drop lineup disabled for non-admins

### No Authentication Layer
- No login required (team-based, not multi-user)
- Assumes sharing link = trusted recipient
- Could add password protection if needed

---

## Development Workflow

### File Structure
```
/Users/James/Documents/bronco_padres/
├── index.html          # Main SPA (1100+ lines)
├── data.js             # Team roster + rules (read-only reference)
├── bingo.html          # Separate bingo game
├── game-records.json   # Static example (not used)
├── tests.html          # QA test suite
├── roster-template.json # JSONBin initialization template
└── ARCHITECTURE.md     # This file
```

### Local Development
```bash
# Start local HTTP server
python3 -m http.server 8000

# Open browser
open http://localhost:8000
```

### Deploy to GitHub Pages
```bash
git add .
git commit -m "message"
git push origin main
```

Auto-deployed to `ingramjam.github.io/bronco_padres`

---

## Future Enhancement Ideas

1. **Multi-Sport Support** - Extend to soccer, basketball
2. **Parent Notifications** - SMS/email when lineup posted
3. **Weather Integration** - Auto-cancel practices based on rain
4. **Stats Tracking** - Home runs, strikeouts, fielding errors
5. **Photo Gallery** - Game day photos synced to cloud
6. **Live Scoring** - Real-time game updates during matches
7. **Payment Tracking** - Fees, uniforms, tournament costs
8. **Player Progression** - Skill development over season

---

## Testing Checklist

- [ ] Create shared lineup link → coach loads read-only
- [ ] Admin updates roster → team syncs & sees changes
- [ ] Fielding validation catches sit violations
- [ ] Pitch counter increments per player independently
- [ ] Game record saves all data (pitcher, lineup, fielding)
- [ ] Mobile layout readable on iPhone 6s (375px width)
- [ ] Auto-sync triggers every 30 min
- [ ] API call counter doesn't exceed 500/month
- [ ] Credential modal doesn't appear on shared links
- [ ] Schedule displays all months/events correctly

---

## Support & Troubleshooting

**App won't load:**
- Clear `localStorage` and refresh
- Check browser console for JS errors
- Verify internet connection (for cloud features)

**Credentials not saving:**
- Check browser allows localStorage
- Verify JSONBin keys are correct (copy-paste from account)

**Shared link doesn't work:**
- Ensure URL includes full query string or hash
- Check recipient has access to their own roster (for reading)

**Fielding won't update:**
- Check you're not in read-only mode (yellow banner)
- Refresh page if UI stuck
- Try clearing fielding with "Clear All Positions" button

---

## Version History

**v1.0** (Feb 27, 2026)
- ✅ Lineup management with drag-drop
- ✅ Fielding assignments + validation
- ✅ Pitch counting (per-pitcher)
- ✅ Game records export
- ✅ Cloud sync (JSONBin.io)
- ✅ Mobile optimization
- ✅ Read-only shared links
- ✅ Full season schedule (Jan-May 2026)
- ✅ Rules reference + search
- ✅ Auto-sync every 30 min with API limiting

---

**Built by:** GitHub Copilot + James  
**Last Updated:** February 27, 2026  
**License:** MIT (personal use)
