import { TweeterRequest } from "./TweeterRequest";

export interface LogoutRequest extends TweeterRequest {
    readonly token: string
}