import { StatusDto, UserDto } from "tweeter-shared";

export interface SqsDao {
    readonly postStatus: (status: StatusDto) => void;
    readonly postToFeeds: (status: StatusDto, followers: string[]) => void;
}