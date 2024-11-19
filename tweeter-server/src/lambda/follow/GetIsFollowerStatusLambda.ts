import { GetIsFollowerStatusResponse } from "tweeter-shared";
import { GetIsFollowerStatusRequest } from "tweeter-shared";
import { DaoFactoryDynamoDB } from "../../model/dao/dynamodb/DaoFactoryDynamoDB";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> => {
    const followService = new FollowService(new DaoFactoryDynamoDB);
    const isFollower = await followService.getIsFollowerStatus(request.token, request.user, request.selectedUser);

    return {
        success: true,
        message: undefined,
        isFollower: isFollower
    }
}

