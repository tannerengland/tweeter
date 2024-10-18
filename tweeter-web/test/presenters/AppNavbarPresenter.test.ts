import { AppNavbarPresenter, AppNavbarView } from "../../src/presenters/AppNavbarPresenter";
import { instance, mock, verify, spy, when } from "ts-mockito";
import { AuthToken } from "tweeter-shared";
import { UserService } from "../../src/model/service/UserService";

describe("AppNavBarPresenter", () => {
    let mockAppNavbarView: AppNavbarView;
    let appNavbarPresenter: AppNavbarPresenter;
    let mockUserService: UserService;

    const authToken = new AuthToken("abc123", Date.now());

    beforeEach(() => {
        mockAppNavbarView = mock<AppNavbarView>();
        const mockAppNavbarViewInstance = instance(mockAppNavbarView);

        const appNavbarPresenterSpy = spy(new AppNavbarPresenter(mockAppNavbarViewInstance));
        appNavbarPresenter = instance(appNavbarPresenterSpy);

        mockUserService = mock<UserService>();
        const mockUserServiceInstance = instance(mockUserService);

        when(appNavbarPresenterSpy.userService).thenReturn(mockUserServiceInstance);
    });

    it("tells the view to display a logging out message", async () => {
        await appNavbarPresenter.logout(authToken);
        verify(mockAppNavbarView.displayInfoMessage("Logging Out...", 0)).once();
    });

    it("calls logout on the user service with the correct auth token", async () => {
        await appNavbarPresenter.logout(authToken);
        verify(mockUserService.logout(authToken)).once();

        // let [capturedAuthToken] = capture(mockUserService.logout).last();
        // expect(capturedAuthToken).toEqual(authToken);
    });

    it("tells the view to clear the last info message and clear the user info when logout is successful", async () => {
        await appNavbarPresenter.logout(authToken);
        verify(mockAppNavbarView.clearLastInfoMessage()).once();
        verify(mockAppNavbarView.clearUserInfo()).once();
    });

    it("tells the view to display an error message and does not tell it to clear the last info message or clear the user info when logout fails", async () => {
        const error = new Error("An error occurred");
        when(mockUserService.logout(authToken)).thenThrow(error);

        await appNavbarPresenter.logout(authToken);

        // let [capturedErrorMessage] = capture(mockAppNavbarView.displayErrorMessage).last();
        // console.log(capturedErrorMessage);
        verify(mockAppNavbarView.displayErrorMessage("Failed to log user out because of exception: An error occurred")).once();
        verify(mockAppNavbarView.clearLastInfoMessage()).never();
        verify(mockAppNavbarView.clearUserInfo()).never();
    });
});