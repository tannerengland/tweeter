import { GetFollowCountResponse } from "tweeter-shared";
import { GetFollowCountRequest } from "tweeter-shared";
import { DaoFactoryDynamoDB } from "../../model/dao/dynamodb/DaoFactoryDynamoDB";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: GetFollowCountRequest): Promise<GetFollowCountResponse> => {
    const followService = new FollowService(new DaoFactoryDynamoDB);
    const followCount = await followService.getFolloweeCount(request.token, request.user);

    return {
        success: true,
        message: undefined,
        followCount: followCount
    }
}

