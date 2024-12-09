import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import { StatusService } from "../../src/model/service/StatusService";
import { UserService } from "../../src/model/service/UserService";
import { PostStatusPresenter, PostStatusView } from "../../src/presenters/PostStatusPresenter"
import { AuthToken, AuthTokenDto, Status, StatusDto, User } from "tweeter-shared";
import "isomorphic-fetch";

describe("Post Status Integration Test", () => {
    // let mockStatusService: StatusService;
    // let mockUserService: UserService;
    let userService = new UserService();
    let statusService = new StatusService();
    let postStatusPresenter: PostStatusPresenter;
    let mockPostStatusView: PostStatusView;


    beforeEach(() => {
        mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusViewInstance = instance(mockPostStatusView);

        postStatusPresenter = new PostStatusPresenter(mockPostStatusViewInstance);
        // postStatusPresenter = instance(postStatusPresenterSpy);

        // mockStatusService = mock<StatusService>();
        // const mockStatusServiceInstance = instance(mockStatusService);

        // when(postStatusPresenterSpy.statusService).thenReturn(mockStatusServiceInstance);

        // mockUserService = mock<UserService>();
    });

    it("should post a status and verify it is appended to the user's story", async () => {
        const userAlias = "@testUser";
        const password = "123";
        const status: StatusDto = {
            post: "Test status post",
            user: {
                firstName: "Test",
                lastName: "User",
                alias: userAlias,
                imageUrl: "https://example.com/image.png",
            },
            timestamp: Date.now(),
        };

        let [user, token] = await userService.login(userAlias, password);
        expect(token).toBeDefined();
        // verify(userService.login(userAlias, password)).once();

        await postStatusPresenter.submitPost(token, status.post, user);

        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
        
        let [stories, hasMore] = await statusService.loadMoreStoryItems(token, userAlias, 1, Status.fromDto(status));

        // console.log(stories[0]);
        expect(stories[0].post).toEqual(status.post);
    });
});
