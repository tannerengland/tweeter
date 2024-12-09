import { StatusDto } from "tweeter-shared";

export interface UpdateFeedsDto {
    readonly status: StatusDto
    readonly followers: string[];
}