import { PostStatusPresenter, PostStatusView } from "../../src/presenters/PostStatusPresenter";
import { instance, mock, verify, spy, when, capture, anything } from "ts-mockito";
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";

describe("PostStatusPresenter", () => {
    let mockPostStatusView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;
    let mockStatusService: StatusService;

    const authToken = new AuthToken("abc123", Date.now());
    const currentUser = new User("tanner", "england", "taneng", "asdf")
    const status = new Status("hello", currentUser, Date.now())

    beforeEach(() => {
        mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusViewInstance = instance(mockPostStatusView);

        const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
        postStatusPresenter = instance(postStatusPresenterSpy);

        mockStatusService = mock<StatusService>();
        const mockStatusServiceInstance = instance(mockStatusService);

        when(postStatusPresenterSpy.statusService).thenReturn(mockStatusServiceInstance);
    });

    it("tells the view to display a posting status message", async () => {
        await postStatusPresenter.submitPost(authToken, status.post, status.user);
        verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
    });

    it("calls postStatus on the post status service with the correct status string and auth token", async () => {
        await postStatusPresenter.submitPost(authToken, status.post, status.user);
        verify(mockStatusService.postStatus(authToken, anything())).once();

        let [currAuthToken, currPost] = capture(mockStatusService.postStatus).last();
        expect(currPost.post).toEqual(status.post);
        // console.log(auth + " " + currStatus);

        // let [capturedAuthToken] = capture(mockUserService.logout).last();
        // expect(capturedAuthToken).toEqual(authToken);
    });

    it("tells the view to clear the last info message, clear the post, and display a status posted message when post is successful", async () => {
        await postStatusPresenter.submitPost(authToken, status.post, status.user);
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
        verify(mockPostStatusView.setPost("")).once();
        verify(mockPostStatusView.clearLastInfoMessage()).once();
    });

    it("tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message when post fails", async () => {
        const error = new Error("An error occurred");
        when(mockStatusService.postStatus(authToken, anything())).thenThrow(error);

        // try {
        //     await postStatusPresenter.submitPost(authToken, status.post, status.user);
        // } catch (error) {
        //     console.log(error); // Logs the error thrown by postStatus
        // }

        await postStatusPresenter.submitPost(authToken, status.post, status.user);

        // let [capturedErrorMessage] = capture(mockAppNavbarView.displayErrorMessage).last();
        // console.log(capturedErrorMessage);
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never();
        verify(mockPostStatusView.setPost("")).never();

        verify(mockPostStatusView.displayErrorMessage("Failed to post the status because of exception: An error occurred")).once();
        verify(mockPostStatusView.clearLastInfoMessage()).once();


        // verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never();


    });
});