export interface NavItem {
  id: string;
  label: string;
  iconName: string;
  badge?: string;
  children?: NavSubItem[];
}

export interface NavSubItem {
  id: string;
  label: string;
  tableReference?: string;
}

export interface CompanyScope {
  companyName: string;
  branchName: string;
  yardName: string;
  currencyCode: string;
  currencySymbol: string;
}

export interface UserProfilePlaceholder {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  roleName: string;
  branchName: string;
  avatarUrl?: string;
}
