// hawks-data.js — San Diego Hawks team data (Updated 2026)

// 1. RULE SET
const hawksRules = [
    { category: "Roster", title: "Team Size", content: "Roster: 10-13 players. Age: 13U.", important: false, source: "Appx F.1" },
    { category: "Game Time", title: "Duration & Limits", content: "Regulation: 7 innings. Complete: 4 innings. No new inning after 1 hr 50 mins. Hard stop 9:45 PM. Ties permitted.", important: true, source: "Appx F.3.A-B, F.9.C" },
    { category: "Roster & Batting", title: "Minimum Play", content: "No player sits 2 innings until all sit 1. No player sits 3 until all sit 2. No infield/outfield position requirement.", important: true, source: "Appx F.3.D" },
    { category: "Game Time", title: "Mercy Rule", content: "10 run lead after 5 complete innings (4 ½ if Home leads).", important: true, source: "Appx F.4" },
    { category: "Pitching", title: "Daily Max Pitches", content: "Max 85 pitches/day. May finish batter if limit reached during AB.", important: true, source: "Appx F.5" },
    { category: "Pitching", title: "Rest Days (11-12)", content: "1-20: 0 Days | 21-35: 1 Day | 36-50: 2 Days | 51-65: 3 Days | 66+: 4 Days.", important: true, source: "Appx F.5 Table" },
    { category: "Pitching", title: "Pitcher Removal", content: "Once removed from mound, pitcher cannot return to pitch in same game.", important: true, source: "Appx F.5.D" },
    { category: "Manager", title: "Mound Visits", content: "2 visits in one inning (same pitcher) = mandatory removal. Exception: Injury.", important: true, source: "Appx F.5.E" },
    { category: "Pitching", title: "Hit Batters", content: "Pitcher removed immediately if they hit 3 batters in one game.", important: true, source: "Appx F.5.F" },
    { category: "Roster & Batting", title: "Batting Order", content: "Continuous batting order. Everyone bats.", important: false, source: "Appx F.6" },
    { category: "Base Running", title: "Courtesy Runners", content: "Allowed for Catcher w/ 2 outs. Must be last recorded out. Pinch runner allowed for injury only.", important: false, source: "Appx F.7" },
    { category: "Conduct", title: "Unsportsmanlike", content: "Foul language or throwing equipment = Ejection + 1 game suspension. Must report to scorekeeper.", important: true, source: "Appx F.8" },
    { category: "Base Running", title: "Slide or Avoid", content: "Must slide or avoid contact. Malicious contact = declared out.", important: true, source: "Appx F.10" },
    { category: "Manager", title: "Umpire Interaction", content: "Judgment calls are final. Objecting to calls/unsportsmanlike conduct = Ejection.", important: true, source: "Appx F.11.B-C" },
    { category: "Manager", title: "Appeals", content: "No appeals on Junior Umpire decisions. For rules appeals, Manager ONLY contacts Senior Umpire/Board.", important: true, source: "Appx F.11.D-E" },
    { category: "Playoffs", title: "Tie Breaker", content: "Max 2 open innings. If still tied, coin flip determines winner.", important: false, source: "Appx F.12.B" },
    { category: "Park Policies", title: "Roster Registration", content: "ALL PLAYERS MUST BE LISTED ON YOUR ONLINE ROSTER IN ORDER TO PLAY. Teams not registered with USSSA must do so online at www.usssa.com. Players may NOT be penciled in on rosters. Players will not play if birth certificate/ID card is not available for verification at check-in.", important: true, source: "Park Policies" },
    { category: "Park Policies", title: "Insurance & Documentation", content: "Bring copies of Birth Certificates or State Issued ID Card. Bring Proof of Insurance with proper coverage dates. If using non-USSSA insurance, Certificate must include additional insured endorsements for USSSA and Top Choice Sports. Two insured addresses required.", important: true, source: "Park Policies" },
    { category: "Park Policies", title: "Team Check-in", content: "Team check-in/Game Card pick up is MANDATORY with tournament director (45 minutes prior to first game). Players do not need to be present at check-in. You MUST pick up the Game Card at the director's table.", important: true, source: "Park Policies" },
    { category: "Park Policies", title: "Age Cutoff", content: "Age cut off is May 1st, 2025 (e.g., 12U player can't turn 13 prior to May 1st, 2025). Players may play up, but not down in age.", important: false, source: "Park Policies" },
    { category: "Park Policies", title: "Steel Cleats", content: "Steel cleats may NOT be worn on portable mounds at any park. Pitchers MUST have extra pair of shoes to pitch in. Umpires will strictly enforce this and eject managers if not followed.", important: true, source: "Park Policies" },
    { category: "Park Policies", title: "Field Rules", content: "No Hitting Stations allowed on grass at any park. Have team ready to play up to 15 minutes before posted game time to account for run rule in prior games.", important: false, source: "Park Policies" },
    { category: "Park Policies", title: "Tournament Pitching Limits", content: "13U: 6 innings max per day, 8 innings max per tournament. Player pitching more than 3 innings in one day MUST rest next day. Tracked by full innings only.", important: true, source: "Park Policies" },
    { category: "Park Policies", title: "Schedule & Brackets", content: "Check website daily for schedule revisions. Bracket schedule at check-in supersedes all other revisions. Recheck brackets online the night before tournament. Pitching reports tracked on schedule. Playoff seedings posted online after pool play.", important: false, source: "Park Policies" }
];

// 2. MANUAL SCHEDULE
const manualGames = [
    { date: "SAT<br>MAR 15", opponent: "vs. Tigers", info: "10:00 AM • Field 1 (Home)" },
    { date: "SAT<br>MAR 22", opponent: "@ Padres", info: "9:00 AM • Field 2 (Visitor)" }
];

// 3. PITCHING THRESHOLDS
const pitchThresholds = [
    { limit: 20, rest: "0 Days", next: "1 Day" },
    { limit: 35, rest: "1 Day", next: "2 Days" },
    { limit: 50, rest: "2 Days", next: "3 Days" },
    { limit: 65, rest: "3 Days", next: "4 Days" },
    { limit: 85, rest: "4 Days", next: "MAX" }
];

// 4. ROSTER
const teamRoster = [
    { name: "Ramzey Frantz",     number: "",    songUrl: "Ramzey.mp3" },
    { name: "Eddie O'Connell",   number: "",    songUrl: "Eddie.mp3" },
    { name: "Reese Spady",       number: "",    songUrl: "Reese.mp3" },
    { name: "Liam Ibarra",       number: "22",  songUrl: "Liam.mp3" },
    { name: "Decian Riley",      number: "#19", songUrl: "Decian.mp3" },
    { name: "Rocco Smeyres",     number: "#29", songUrl: "Rocco.mp3" },
    { name: "Jace Ingram",       number: "#45", songUrl: "Jace.mp3" },
    { name: "Tommy Cabral",      number: "#77", songUrl: "Tommy.mp3" },
    { name: "Asher Cox",         number: "#9",  songUrl: "Asher.mp3" },
    { name: "Mason Ricciardi",   number: "#99", songUrl: "Mason.mp3" },
    { name: "Charlie Pennington", number: "#44", songUrl: "Charlie.mp3"},
    { name: "Preston Chavarria",  number: "", songUrl: "Preston.mp3" },
    { name: "Dominic Montanari",  number: "", songUrl: "Dominic.mp3" }
];
