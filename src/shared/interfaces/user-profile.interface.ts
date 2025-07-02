export interface UserProfileInterface {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  photoUrl?: string | null;
  phone?: string | null;
  country?: string | null;
  dateOfBirth?: Date | null;
  language?: string | null;
  timezone?: string | null;
  bio?: string | null;
  receiveNotifications?: boolean;
  showEmail?: boolean;
  userId?: string;
}
