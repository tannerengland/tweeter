import { UserService } from "../../model/service/UserService";
import { RegisterRequest } from "tweeter-shared";
import { LoginRegisterResponse } from "tweeter-shared";

export const handler = async (request: RegisterRequest): Promise<LoginRegisterResponse> => {
    const userService = new UserService();
    const [user, authToken] = await userService.register(request.firstName, request.lastName, request.alias, request.password, request.userImageBytes, request.imageFileExtension);
    return {
        success: true,
        message: undefined,
        user: user,
        authToken: authToken
    }
}

