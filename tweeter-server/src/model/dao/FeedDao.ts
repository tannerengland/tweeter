import { StatusDto, UserDto } from "tweeter-shared";
import { DataPage } from "../util/DataPage";

export interface FeedDao {
    postFeed: (newStatus: StatusDto, followers: UserDto[]) => Promise<void>;
    getFeedPage: (author_alias: string, pageSize: number, lastItem: StatusDto | null) => Promise<DataPage<StatusDto>>;
}