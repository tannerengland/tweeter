import { User, UserDto } from "tweeter-shared";

export interface UserDao {
    getUser: (alias: string) => Promise<UserDto | null>;
    registerUser: (user: UserDto, password: string) => Promise<UserDto | null>;
    loginUser(alias: string): Promise<[ user: UserDto, password: string ] | null>;
}