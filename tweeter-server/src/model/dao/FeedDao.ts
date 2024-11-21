import { StatusDto, UserDto } from "tweeter-shared";
import { DataPage } from "../util/DataPage";
import { StatusItem } from "../util/StatusItem";

export interface FeedDao {
    postFeed: (newStatus: StatusDto, followers: UserDto[]) => Promise<void>;
    getFeedPage: (author_alias: string, pageSize: number, lastItem: StatusDto | null) => Promise<DataPage<StatusItem>>;
}