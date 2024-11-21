import { Status, StatusDto, User, UserDto } from "tweeter-shared";
import { DataPage } from "../util/DataPage";
import { StatusItem } from "../util/StatusItem";

export interface StoryDao {
    postStory: (currStatus: StatusDto) => Promise<void>;
    getStoriesPage: (authorAlias: string, pageSize: number, lastItem: StatusDto | null) => Promise<DataPage<StatusItem>> ;
}