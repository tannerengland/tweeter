import { UserService } from "../../model/service/UserService";
import { TweeterRequest, LogoutRequest } from "tweeter-shared"
import { TweeterResponse } from "tweeter-shared/dist/model/net/response/TweeterResponse";
import { DaoFactoryDynamoDB } from "../../model/dao/dynamodb/DaoFactoryDynamoDB";

export const handler = async (request: LogoutRequest): Promise<TweeterResponse> => {
    const userService = new UserService(new DaoFactoryDynamoDB);
    await userService.logout(request.token);
    return {
        success: true,
        message: undefined
    }
}
