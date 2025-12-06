export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string, optional
  averageReadTime: string;
}

