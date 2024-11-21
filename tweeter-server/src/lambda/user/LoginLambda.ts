import { UserService } from "../../model/service/UserService";
import { AuthToken, LoginRequest } from "tweeter-shared";
import { LoginRegisterResponse } from "tweeter-shared";
import { DaoFactoryDynamoDB } from "../../model/dao/dynamodb/DaoFactoryDynamoDB";

export const handler = async (request: LoginRequest): Promise<LoginRegisterResponse> => {
    const userService = new UserService(new DaoFactoryDynamoDB);
    const [user, authToken] = await userService.login(request.alias, request.password);
    console.log("handler token: " + authToken.token)
    return {
        success: true,
        message: undefined,
        user: user,
        authToken: authToken
    }
}

