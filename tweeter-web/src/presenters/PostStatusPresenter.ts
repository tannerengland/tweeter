import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export interface PostStatusView {
    displayErrorMessage: (message: string) => void
}

export class PostStatusPresenter {
    private statusService: StatusService;
    private view: PostStatusView; 

    public constructor(view: PostStatusView) {
        this.statusService = new StatusService();
        this.view = view;
    }

    public async submitPost(authToken: AuthToken, post: string, currentUser: User | null) {

        const status = new Status(post, currentUser!, Date.now());

        await this.statusService.postStatus(authToken!, status);

    };

    public displayErrorMessage(error: unknown) {
        this.view.displayErrorMessage(`Failed to post the status because of exception: ${error}`);
    }



}