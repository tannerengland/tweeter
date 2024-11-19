import { AuthTokenDto } from "tweeter-shared";

export interface SessionDao {
    createSession: (alias: string, authToken: AuthTokenDto) => Promise<AuthTokenDto | null>;
    verifySession: (authToken: string) => Promise<boolean>;
    deleteSession: (token: string) => Promise<void>;
    updateSession: (token: string) => Promise<void>;
    getAliasFromSession: (token: string) => Promise<string | null>;
}