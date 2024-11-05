import { GetFollowCountResponse } from "tweeter-shared";
import { GetFollowCountRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: GetFollowCountRequest): Promise<GetFollowCountResponse> => {
    const followService = new FollowService();
    const followCount = await followService.getFollowerCount(request.token, request.user);

    return {
        success: true,
        message: undefined,
        followCount: followCount
    }
}

