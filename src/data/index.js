import matchesRaw2023 from './seasons/matches_2023.json';
import standingsRaw2023 from './seasons/standings_2023.json';
import matchesRaw2024 from './seasons/matches_2024.json';
import standingsRaw2024 from './seasons/standings_2024.json';

export const matches2023 = matchesRaw2023.matches;
export const standings2023 = standingsRaw2023;

export const matches2024 = matchesRaw2024.matches;
export const standings2024 = standingsRaw2024;

// 2022/23 final standings → used as initial positions for 2023/24 reverse table.
// Relegated: Leicester, Leeds, Southampton → Promoted: Luton, Burnley, Sheffield Utd.
export const initialStandings2023 = [
  { position:  1, name: "Manchester City FC",           shortName: "Man City",       crest: "https://crests.football-data.org/65.png"   },
  { position:  2, name: "Arsenal FC",                   shortName: "Arsenal",        crest: "https://crests.football-data.org/57.png"   },
  { position:  3, name: "Manchester United FC",         shortName: "Man United",     crest: "https://crests.football-data.org/66.png"   },
  { position:  4, name: "Newcastle United FC",          shortName: "Newcastle",      crest: "https://crests.football-data.org/67.png"   },
  { position:  5, name: "Liverpool FC",                 shortName: "Liverpool",      crest: "https://crests.football-data.org/64.png"   },
  { position:  6, name: "Brighton & Hove Albion FC",    shortName: "Brighton Hove",  crest: "https://crests.football-data.org/397.png"  },
  { position:  7, name: "Aston Villa FC",               shortName: "Aston Villa",    crest: "https://crests.football-data.org/58.png"   },
  { position:  8, name: "Tottenham Hotspur FC",         shortName: "Tottenham",      crest: "https://crests.football-data.org/73.png"   },
  { position:  9, name: "Brentford FC",                 shortName: "Brentford",      crest: "https://crests.football-data.org/402.png"  },
  { position: 10, name: "Fulham FC",                    shortName: "Fulham",         crest: "https://crests.football-data.org/63.png"   },
  { position: 11, name: "Crystal Palace FC",            shortName: "Crystal Palace", crest: "https://crests.football-data.org/354.png"  },
  { position: 12, name: "Chelsea FC",                   shortName: "Chelsea",        crest: "https://crests.football-data.org/61.png"   },
  { position: 13, name: "Wolverhampton Wanderers FC",   shortName: "Wolverhampton",  crest: "https://crests.football-data.org/76.png"   },
  { position: 14, name: "West Ham United FC",           shortName: "West Ham",       crest: "https://crests.football-data.org/563.png"  },
  { position: 15, name: "AFC Bournemouth",              shortName: "Bournemouth",    crest: "https://crests.football-data.org/bournemouth.png" },
  { position: 16, name: "Nottingham Forest FC",         shortName: "Nottingham",     crest: "https://crests.football-data.org/351.png"  },
  { position: 17, name: "Everton FC",                   shortName: "Everton",        crest: "https://crests.football-data.org/62.png"   },
  // Newly promoted teams start at 18/19/20
  { position: 18, name: "Luton Town FC",                shortName: "Luton Town",     crest: "https://crests.football-data.org/389.png"  },
  { position: 19, name: "Burnley FC",                   shortName: "Burnley",        crest: "https://crests.football-data.org/328.png"  },
  { position: 20, name: "Sheffield United FC",          shortName: "Sheffield Utd",  crest: "https://crests.football-data.org/356.png"  },
];

// 2023/24 final standings → used as initial positions for 2024/25 reverse table.
// Relegated: Luton Town, Burnley, Sheffield United → Promoted: Leicester City, Ipswich Town, Southampton.
export const initialStandings2024 = [
  { position:  1, name: "Manchester City FC",           shortName: "Man City",       crest: "https://crests.football-data.org/65.png"   },
  { position:  2, name: "Arsenal FC",                   shortName: "Arsenal",        crest: "https://crests.football-data.org/57.png"   },
  { position:  3, name: "Liverpool FC",                 shortName: "Liverpool",      crest: "https://crests.football-data.org/64.png"   },
  { position:  4, name: "Aston Villa FC",               shortName: "Aston Villa",    crest: "https://crests.football-data.org/58.png"   },
  { position:  5, name: "Tottenham Hotspur FC",         shortName: "Tottenham",      crest: "https://crests.football-data.org/73.png"   },
  { position:  6, name: "Chelsea FC",                   shortName: "Chelsea",        crest: "https://crests.football-data.org/61.png"   },
  { position:  7, name: "Newcastle United FC",          shortName: "Newcastle",      crest: "https://crests.football-data.org/67.png"   },
  { position:  8, name: "Manchester United FC",         shortName: "Man United",     crest: "https://crests.football-data.org/66.png"   },
  { position:  9, name: "West Ham United FC",           shortName: "West Ham",       crest: "https://crests.football-data.org/563.png"  },
  { position: 10, name: "Crystal Palace FC",            shortName: "Crystal Palace", crest: "https://crests.football-data.org/354.png"  },
  { position: 11, name: "Brighton & Hove Albion FC",    shortName: "Brighton Hove",  crest: "https://crests.football-data.org/397.png"  },
  { position: 12, name: "Everton FC",                   shortName: "Everton",        crest: "https://crests.football-data.org/62.png"   },
  { position: 13, name: "AFC Bournemouth",              shortName: "Bournemouth",    crest: "https://crests.football-data.org/bournemouth.png" },
  { position: 14, name: "Fulham FC",                    shortName: "Fulham",         crest: "https://crests.football-data.org/63.png"   },
  { position: 15, name: "Wolverhampton Wanderers FC",   shortName: "Wolverhampton",  crest: "https://crests.football-data.org/76.png"   },
  { position: 16, name: "Brentford FC",                 shortName: "Brentford",      crest: "https://crests.football-data.org/402.png"  },
  { position: 17, name: "Nottingham Forest FC",         shortName: "Nottingham",     crest: "https://crests.football-data.org/351.png"  },
  // Newly promoted teams start at 18/19/20
  { position: 18, name: "Leicester City FC",            shortName: "Leicester City", crest: "https://crests.football-data.org/338.png"  },
  { position: 19, name: "Ipswich Town FC",              shortName: "Ipswich Town",   crest: "https://crests.football-data.org/349.png"  },
  { position: 20, name: "Southampton FC",               shortName: "Southampton",    crest: "https://crests.football-data.org/340.png"  },
];

// 2024/25 final standings → used as initial positions for 2025/26 reverse table.
// Relegated: Leicester City, Ipswich Town, Southampton → Promoted: Sunderland, Burnley, Sheffield United (TBC).
// Derived from the standings_2024 API data; promoted teams placed at 18/19/20.
export const initialStandings2025 = standingsRaw2024.standings[0].table
  .slice(0, 17)
  .map((row) => ({
    position: row.position,
    name: row.team.name,
    shortName: row.team.shortName,
    crest: row.team.crest,
  }))
  .concat([
    { position: 18, name: "Sunderland AFC",      shortName: "Sunderland",   crest: "https://crests.football-data.org/394.png"  },
    { position: 19, name: "Burnley FC",           shortName: "Burnley",      crest: "https://crests.football-data.org/328.png"  },
    { position: 20, name: "Sheffield United FC",  shortName: "Sheffield Utd",crest: "https://crests.football-data.org/356.png"  },
  ]);
