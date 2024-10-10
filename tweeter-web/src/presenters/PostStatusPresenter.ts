import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { Presenter, View } from "./Presenter";

export interface PostStatusView extends View {
    // displayErrorMessage: (message: string) => void,
    setIsLoading: any,
    displayInfoMessage: (message: string, duration: number) => void,
    setPost: (value: React.SetStateAction<string>) => void,
    clearLastInfoMessage: () => void,
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
    private statusService: StatusService;
    // private view: PostStatusView; 

    public constructor(view: PostStatusView) {
      // this.view = view;
      super(view);
      this.statusService = new StatusService();
    }

    protected get view(): PostStatusView {
      return super.view as PostStatusView;
    }

    public async submitPost(authToken: AuthToken, post: string, currentUser: User | null) {

        // const status = new Status(post, currentUser!, Date.now());

        // await this.statusService.postStatus(authToken!, status);

        try {
          this.doFailureReportingOperation(async () => {
            this.view.setIsLoading(true);
            this.view.displayInfoMessage("Posting status...", 0);
      
            // const status = new Status(post, currentUser!, Date.now());
      
            // await postStatus(authToken!, status);
      
            const status = new Status(post, currentUser!, Date.now());

            await this.statusService.postStatus(authToken!, status);
      
            this.view.setPost("");
            this.view.displayInfoMessage("Status posted!", 2000);
          }, "post the status")
        } finally {
          this.view.clearLastInfoMessage();
          this.view.setIsLoading(false);
        }

    };





}