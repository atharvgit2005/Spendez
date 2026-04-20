export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface Group {
  id: string;
  name: string;
  type: 'HOME' | 'TRIP' | 'OFFICE' | 'OTHER';
  description?: string;
  avatarUrl?: string;
  memberIds: string[];
  ownerId: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  groupId: string;
  title: string;
  amount: number;
  category: string;
  paidBy: string;
  splitType: 'EQUAL' | 'PERCENTAGE' | 'EXACT' | 'WEIGHTED';
  splitConfig: {
    participants: string[];
    details?: any;
  };
  createdAt: string;
}
