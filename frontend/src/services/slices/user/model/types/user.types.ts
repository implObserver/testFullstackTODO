export interface UserState {
    isAuthenticated: boolean,
    user: {
        firstName?: string;
        // другие поля PublicUser
      };
}