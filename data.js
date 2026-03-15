// hawks-data.js — San Diego Hawks team data

// 1. RULE SET
const hawksRules = [
    { category: "Roster", title: "Team Size", content: "Roster: 10-13 players. Age: 11-12.", important: false, source: "Appx F.1" },
    { category: "Game Time", title: "Duration & Limits", content: "Regulation: 7 innings. Complete: 4 innings. No new inning after 1 hr 50 mins. Hard stop 9:45 PM. Ties permitted.", important: true, source: "Appx F.3.A-B, F.9.C" },
    { category: "Roster & Batting", title: "Minimum Play", content: "No player sits 2 innings until all sit 1. No player sits 3 until all sit 2. Must play 1 inning infield (Rec only).", important: true, source: "Appx F.3.D" },
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
    { category: "Playoffs", title: "Tie Breaker", content: "Max 2 open innings. If still tied, coin flip determines winner.", important: false, source: "Appx F.12.B" }
];

// 2. MANUAL SCHEDULE
const manualGames = [
    { date: "SAT<br>FEB 24", opponent: "vs. Dodgers", info: "10:00 AM • Field 3 (Home)" },
    { date: "TUE<br>FEB 27", opponent: "@ Angels", info: "5:30 PM • Field 1 (Visitor)" }
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
    { name: "Jace Ingram",      number: "#3",  songUrl: "Jace.mp3" },
    { name: "Jaxson Fonseca",   number: "#29", songUrl: "Jaxson.mp3" },
    { name: "JD Mayberry",      number: "#51", songUrl: "JD.mp3" },
    { name: "Adam Enriquez",    number: "",    songUrl: "Adam.mp3" },
    { name: "Blake Taylor",     number: "",    songUrl: "Blake.mp3" },
    { name: "Brooks Schott",    number: "",    songUrl: "Brooks.mp3" },
    { name: "Declan Riley",     number: "",    songUrl: "Dec.mp3" },
    { name: "Donovan Cox",      number: "",    songUrl: "Donovan.mp3" },
    { name: "Giovani Preciado", number: "",    songUrl: "Gio.mp3" },
    { name: "Landon Hodgson",   number: "",    songUrl: "Landon.mp3" },
    { name: "Myles Gonzalez",   number: "",    songUrl: "Myles.mp3" },
    { name: "Thomas Cabral",    number: "",    songUrl: "Tommy.mp3" }
];
