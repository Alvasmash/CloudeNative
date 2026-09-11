export interface UserProfile {
  status: string;
  user: string;
  authorities: string[];
}

export interface AppUser {
  name: string;
  email: string;
  username: string;
  roles: string[];
  isAdmin: boolean;
}
