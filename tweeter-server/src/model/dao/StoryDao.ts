import { Status, StatusDto, User, UserDto } from "tweeter-shared";
import { DataPage } from "./DataPage";

export interface StoryDao {
    postStory: (currStatus: StatusDto) => Promise<void>;
    getStoriesPage: (authorAlias: string, pageSize: number, lastItem: StatusDto | null) => Promise<DataPage<StatusDto>> ;
}