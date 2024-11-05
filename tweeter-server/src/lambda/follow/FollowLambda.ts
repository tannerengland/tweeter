import { FollowRequest } from "tweeter-shared";
import { XFollowResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: FollowRequest): Promise<XFollowResponse> => {
    const followService = new FollowService();
    const [followerCount, followeeCount] = await followService.follow(request.token, request.userToFollow);

    return {
        success: true,
        message: undefined,
        followerCount: followerCount, 
        followeeCount: followeeCount
    }
}

