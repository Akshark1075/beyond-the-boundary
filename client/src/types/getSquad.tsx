export interface GetSquad {
  players: Players;
}

export interface Players {
  "playing XI": PlayingXi[];
  bench: Bench[];
}

export interface PlayingXi {
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
  faceImageId: number;
}

export interface Bench {
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
  faceImageId: number;
}
