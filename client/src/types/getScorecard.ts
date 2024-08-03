export interface GetScorecard {
  scoreCard: ScoreCard[];
  matchHeader: MatchHeader;
  isMatchComplete: boolean;
  status: string;
  videos: any[];
  responseLastUpdated: number;
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
  playersOfTheMatch: PlayersOfThe[];
  playersOfTheSeries: PlayersOfThe[];
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

export interface PlayersOfThe {
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

export interface ScoreCard {
  matchId: number;
  inningsId: number;
  timeScore: number;
  batTeamDetails: BatTeamDetails;
  bowlTeamDetails: BowlTeamDetails;
  scoreDetails: ScoreDetails;
  extrasData: ExtrasData;
  ppData: RevisedTarget;
  wicketsData: { [key: string]: WicketsDatum };
  partnershipsData: { [key: string]: PartnershipsDatum };
}

export interface BatTeamDetails {
  batTeamId: number;
  batTeamName: string;
  batTeamShortName: string;
  batsmenData: { [key: string]: BatsmenDatum };
}

export interface BatsmenDatum {
  batId: number;
  batName: string;
  batShortName: string;
  isCaptain: boolean;
  isKeeper: boolean;
  runs: number;
  balls: number;
  dots: number;
  fours: number;
  sixes: number;
  mins: number;
  strikeRate: number;
  outDesc: string;
  bowlerId: number;
  fielderId1: number;
  fielderId2: number;
  fielderId3: number;
  ones: number;
  twos: number;
  threes: number;
  fives: number;
  boundaries: number;
  sixers: number;
  wicketCode: string;
  isOverseas: boolean;
  inMatchChange: string;
  playingXIChange: string;
}

export interface BowlTeamDetails {
  bowlTeamId: number;
  bowlTeamName: string;
  bowlTeamShortName: string;
  bowlersData: { [key: string]: Bowl };
}

export interface Bowl {
  bowlerId: number;
  bowlName: string;
  bowlShortName: string;
  isCaptain: boolean;
  isKeeper: boolean;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  no_balls: number;
  wides: number;
  dots: number;
  balls: number;
  runsPerBall: number;
  isOverseas: boolean;
  inMatchChange: string;
  playingXIChange: string;
}

export interface ExtrasData {
  noBalls: number;
  total: number;
  byes: number;
  penalty: number;
  wides: number;
  legByes: number;
}

export interface PartnershipsDatum {
  bat1Id: number;
  bat1Name: string;
  bat1Runs: number;
  bat1fours: number;
  bat1sixes: number;
  bat2Id: number;
  bat2Name: string;
  bat2Runs: number;
  bat2fours: number;
  bat2sixes: number;
  totalRuns: number;
  totalBalls: number;
  bat1balls: number;
  bat2balls: number;
  bat1Ones: number;
  bat1Twos: number;
  bat1Threes: number;
  bat1Fives: number;
  bat1Boundaries: number;
  bat1Sixers: number;
  bat2Ones: number;
  bat2Twos: number;
  bat2Threes: number;
  bat2Fives: number;
  bat2Boundaries: number;
  bat2Sixers: number;
}

export interface ScoreDetails {
  ballNbr: number;
  isDeclared: boolean;
  isFollowOn: boolean;
  overs: number;
  revisedOvers: number;
  runRate: number;
  runs: number;
  wickets: number;
  runsPerBall: number;
}

export interface WicketsDatum {
  batId: number;
  batName: string;
  wktNbr: number;
  wktOver: number;
  wktRuns: number;
  ballNbr: number;
}
