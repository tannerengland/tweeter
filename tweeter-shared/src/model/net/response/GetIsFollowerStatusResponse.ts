import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

export interface GetIsFollowerStatusResponse extends TweeterResponse {
    readonly isFollower: boolean;
}