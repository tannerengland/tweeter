import { GetUserRequest, GetUserResponse } from "tweeter-shared"
import { DaoFactoryDynamoDB } from "../../model/dao/dynamodb/DaoFactoryDynamoDB";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
    const userService = new UserService(new DaoFactoryDynamoDB);
    // console.log("request alias " + request.alias)
    // console.log("request token " + request.token)


    const user = await userService.getUser(request.token, request.alias);
    // console.log("handler user " + user)

    return {
        success: true,
        message: undefined,
        user: user
    }
}