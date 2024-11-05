import { UserService } from "../../model/service/UserService";
import { AuthToken, LoginRequest } from "tweeter-shared";
import { LoginRegisterResponse } from "tweeter-shared";

export const handler = async (request: LoginRequest): Promise<LoginRegisterResponse> => {
    const userService = new UserService();
    const [user, authToken] = await userService.login(request.alias, request.password);
    return {
        success: true,
        message: undefined,
        user: user,
        authToken: authToken
    }
}

