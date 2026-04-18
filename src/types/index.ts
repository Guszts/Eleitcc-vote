export interface Candidate {
  id: string;
  name: string;
  slogan: string;
  grade: string;
  description: string;
  photoUrl: string;
  createdAt: number;
}

export interface Voter {
  id: string;
  name: string;
  votedForId: string;
  timestamp: number;
}

export interface ElectionState {
  status: 'ongoing' | 'finished';
  winner?: Candidate;
  vice?: Candidate;
}

export interface SystemData {
  candidates: Candidate[];
  votes: Voter[];
  state: ElectionState;
}
