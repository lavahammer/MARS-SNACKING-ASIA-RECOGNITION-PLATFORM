export interface Associate {
  id: string;
  name: string;
  department: string;
  avatarUrl: string;
  location: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Vote {
  id: string;
  nomineeName: string;
  nomineeDepartment: string;
  nomineeLocation: string;
  categoryId: string;
  nominatorName: string; // Anonymous for this demo, or "You"
  reason: string;
  timestamp: number;
}

export interface AggregatedVote {
  nomineeName: string;
  nomineeDepartment: string;
  nomineeLocation: string;
  count: number;
  categoryVotes: Record<string, number>; // categoryId -> count
}

export type ViewState = 'VOTE' | 'ADMIN' | 'WINNERS';