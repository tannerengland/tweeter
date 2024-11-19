import { StatusService } from "../../model/service/StatusService";
import { PostStatusRequest } from "tweeter-shared"
import { TweeterResponse } from "tweeter-shared/dist/model/net/response/TweeterResponse";
import { DaoFactoryDynamoDB } from "../../model/dao/dynamodb/DaoFactoryDynamoDB";

export const handler = async (request: PostStatusRequest): Promise<TweeterResponse> => {
    const statusService = new StatusService(new DaoFactoryDynamoDB);
    await statusService.postStatus(request.token, request.newStatus);
    return {
        success: true,
        message: undefined
    }
}
