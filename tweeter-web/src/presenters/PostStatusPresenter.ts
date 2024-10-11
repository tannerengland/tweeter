import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
    // displayErrorMessage: (message: string) => void,
    setIsLoading: any,
    // displayInfoMessage: (message: string, duration: number) => void,
    setPost: (value: React.SetStateAction<string>) => void,
    // clearLastInfoMessage: () => void,
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
    private statusService: StatusService;

    public constructor(view: PostStatusView) {
      super(view);
      this.statusService = new StatusService();
    }

    public async submitPost(authToken: AuthToken, post: string, currentUser: User | null) {

          this.doFailureReportingWithPostTask(async () => {
            this.view.setIsLoading(true);
            this.view.displayInfoMessage("Posting status...", 0);
      
            const status = new Status(post, currentUser!, Date.now());

            await this.statusService.postStatus(authToken!, status);
      
            this.view.setPost("");
            this.view.displayInfoMessage("Status posted!", 2000);
          }, "post the status", () => {
            this.view.clearLastInfoMessage();
            this.view.setIsLoading(false);
          })
    };





}