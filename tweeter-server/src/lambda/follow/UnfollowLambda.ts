import { UnfollowRequest } from "tweeter-shared";
import { XFollowResponse } from "tweeter-shared";
import { DaoFactoryDynamoDB } from "../../model/dao/dynamodb/DaoFactoryDynamoDB";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: UnfollowRequest): Promise<XFollowResponse> => {
    const followService = new FollowService(new DaoFactoryDynamoDB);
    const [followerCount, followeeCount] = await followService.unfollow(request.token, request.userToUnfollow);

    return {
        success: true,
        message: undefined,
        followerCount: followerCount, 
        followeeCount: followeeCount
    }
}

