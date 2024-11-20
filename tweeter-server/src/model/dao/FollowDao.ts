import { User, UserDto } from "tweeter-shared";
import { DataPage } from "../util/DataPage";

export interface FollowDao {
    followUser: (userAlias: string, userToFollowAlias: string) => Promise<void>;
    unfollowUser: (userAlias: string, userToUnfollowAlias: string) => Promise<void>;
    getFollowerCount: (userAlias: string) => Promise<number>;
    getFolloweeCount: (userAlias: string) => Promise<number>;
    getIsFollowerStatus: (userAlias: string, selectedUserAlias: string) => Promise<boolean>;
    getPageOfFollowees: (followerHandle: string, pageSize: number, lastFolloweeHandle?: string) => Promise<DataPage<UserDto>>;
    getPageOfFollowers: (followerHandle: string, pageSize: number, lastFolloweeHandle?: string) => Promise<DataPage<UserDto>>;
    getFollowers: (userAlias: string) => Promise<UserDto[]>;
}