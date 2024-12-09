import { StatusDto, UserDto } from "tweeter-shared";
import { UpdateFeedsDto } from "../util/UpdateFeedsDto";

export interface SqsDao {
    readonly postStatus: (status: StatusDto) => void;
    readonly postToFeeds: (updateFeedDto: UpdateFeedsDto) => void;
}