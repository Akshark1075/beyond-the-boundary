export interface GetOvers {
  inningsId: number;
  batsmanStriker: BatsmanNStriker;
  batsmanNonStriker: BatsmanNStriker;
  batTeam: BatTeam;
  bowlerStriker: BowlerStriker;
  bowlerNonStriker: BowlerStriker;
  overs: number;
  recentOvsStats: string;
  target: number;
  partnerShip: PartnerShip;
  currentRunRate: number;
  requiredRunRate: number;
  lastWicket: string;
  matchScoreDetails: MatchScoreDetails;
  latestPerformance: LatestPerformance[];
  ppData: PpData;
  overSummaryList: OverSummaryList[];
  status: string;
  lastWicketScore: number;
  remRunsToWin: number;
  matchHeader: MatchHeader;
  responseLastUpdated: number;
  event: string;
}

export interface BatTeam {
  teamId: number;
  teamScore: number;
  teamWkts: number;
}

export interface BatsmanNStriker {
  batBalls: number;
  batDots: number;
  batFours: number;
  batId: number;
  batName: string;
  batMins: number;
  batRuns: number;
  batSixes: number;
  batStrikeRate: number;
}

export interface BowlerStriker {
  bowlId: number;
  bowlName: string;
  bowlMaidens: number;
  bowlNoballs: number;
  bowlOvs: number;
  bowlRuns: number;
  bowlWides: number;
  bowlWkts: number;
  bowlEcon: number;
}

export interface LatestPerformance {
  runs: number;
  wkts: number;
  label: string;
}

export interface MatchHeader {
  matchId: number;
  matchDescription: string;
  matchFormat: string;
  matchType: string;
  complete: boolean;
  domestic: boolean;
  matchStartTimestamp: number;
  matchCompleteTimestamp: number;
  dayNight: boolean;
  year: number;
  dayNumber: number;
  state: string;
  status: string;
  tossResults: RevisedTarget;
  result: Result;
  revisedTarget: RevisedTarget;
  playersOfTheMatch: PlayersOfTheMatch[];
  playersOfTheSeries: any[];
  matchTeamInfo: MatchTeamInfo[];
  isMatchNotCovered: boolean;
  team1: Team;
  team2: Team;
  seriesDesc: string;
  seriesId: number;
  seriesName: string;
  alertType: string;
  livestreamEnabled: boolean;
}

export interface MatchTeamInfo {
  battingTeamId: number;
  battingTeamShortName: string;
  bowlingTeamId: number;
  bowlingTeamShortName: string;
}

export interface PlayersOfTheMatch {
  id: number;
  name: string;
  fullName: string;
  nickName: string;
  captain: boolean;
  role: string;
  keeper: boolean;
  substitute: boolean;
  teamId: number;
  battingStyle: string;
  bowlingStyle: string;
  teamName: string;
  faceImageId: number;
}

export interface Result {
  resultType: string;
  winningTeam: string;
  winningteamId: number;
  winningMargin: number;
  winByRuns: boolean;
  winByInnings: boolean;
}

export interface RevisedTarget {}

export interface Team {
  id: number;
  name: string;
  playerDetails: any[];
  shortName: string;
}

export interface MatchScoreDetails {
  matchId: number;
  inningsScoreList: InningsScoreList[];
  tossResults: RevisedTarget;
  matchTeamInfo: MatchTeamInfo[];
  isMatchNotCovered: boolean;
  matchFormat: string;
  state: string;
  customStatus: string;
  highlightedTeamId: number;
}

export interface InningsScoreList {
  inningsId: number;
  batTeamId: number;
  batTeamName: string;
  score: number;
  wickets: number;
  overs: number;
  isDeclared: boolean;
  isFollowOn: boolean;
  ballNbr: number;
}

export interface OverSummaryList {
  score: number;
  wickets: number;
  inningsId: number;
  o_summary: string;
  runs: number;
  batStrikerIds: number[];
  batStrikerNames: string[];
  batStrikerRuns: number;
  batStrikerBalls: number;
  batNonStrikerIds: number[];
  batNonStrikerNames: string[];
  batNonStrikerRuns: number;
  batNonStrikerBalls: number;
  bowlIds: number[];
  bowlNames: string[];
  bowlOvers: number;
  bowlMaidens: number;
  bowlRuns: number;
  bowlWickets: number;
  timestamp: number;
  overNum: number;
  batTeamName: BatTeamName;
  event: Event;
}

export enum BatTeamName {
  Uaeu19 = "UAEU19",
}

export enum Event {
  OverBreak = "over-break",
}

export interface PartnerShip {
  balls: number;
  runs: number;
}

export interface PpData {
  pp_1: Pp1;
}

export interface Pp1 {
  ppId: number;
  ppOversFrom: number;
  ppOversTo: number;
  ppType: string;
  runsScored: number;
}
