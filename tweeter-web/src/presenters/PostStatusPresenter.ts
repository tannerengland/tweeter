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
    private _statusService: StatusService | null = null;

    // private _statusService: StatusService;
    

    // public constructor(view: PostStatusView) {
    //   super(view);
    //   this._statusService = new StatusService();
    // }

    // public get statusService() {
    //   return this._statusService;
    // }

    public constructor(view: PostStatusView) {
      super(view);
      // this._statusService = new StatusService();
    }

    public get statusService() {
      if (this._statusService == null) {
        this._statusService = new StatusService();
      }
      return this._statusService;
    }

    public async submitPost(authToken: AuthToken, post: string, currentUser: User | null) {

          await this.doFailureReportingWithPostTask(async () => {
            this.view.setIsLoading(true);
            this.view.displayInfoMessage("Posting status...", 0);
      
            const status = new Status(post, currentUser!, Date.now());

            await this.statusService.postStatus(authToken!, status);
      
            this.view.setPost("");
            this.view.displayInfoMessage("Status posted!", 2000);
            // this.view.clearLastInfoMessage();

            // this.view.clearLastInfoMessage();
            // this.view.setIsLoading(false);


          }, "post the status", () => {
            // console.log("finally block")
            this.view.clearLastInfoMessage();
            this.view.setIsLoading(false);
          }
          )
    };

}