import { TweeterResponse } from "./TweeterResponse";

export interface XFollowResponse extends TweeterResponse {
    followerCount: number, 
    followeeCount: number
}