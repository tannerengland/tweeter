import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface AuthenticateView extends View {
    authenticate: (currentUser: User, authToken: AuthToken) => void;
    navigateTo: (url: string) => void;
}

export abstract class AuthenticatePresenter extends Presenter<AuthenticateView> {
    private _service: UserService;
    private _setIsLoading = false;

    protected get service() {
        return this._service;
    }

    protected set setIsLoading(value: boolean) {
        this._setIsLoading = value;
    }

    protected get setIsLoading() {
        return this._setIsLoading;
    }

    public constructor(view: AuthenticateView) {
        super(view);
        this._service = new UserService();
    }

    protected async doAuthenticate(authOperation: () => Promise<[User, AuthToken]>, navOperation: () => void) {
        await this.doFailureReportingWithPostTask(async () => {
            this.setIsLoading = true;
            const [user, authToken] = await authOperation();

            this.view.authenticate(user, authToken);

            navOperation();
        }, this.getOperationDescription(), () => {
            this.setIsLoading = false;
        })
    }

    // protected abstract doOperation(firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array, imageFileExtension: string): Promise<[User, AuthToken]>;

    protected abstract getNavigationFunction(url: string): void;

    protected abstract getOperationDescription(): string;


    // public async doRegister(firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array, imageFileExtension: string) {
    //     this.doFailureReportingWithPostTask(async () => {
    //       this.setIsLoading = true;
    //       const [user, authToken] = await this.userService.register(
    //         firstName,
    //         lastName,
    //         alias,
    //         password,
    //         imageBytes,
    //         imageFileExtension
    //       );
    
    //       this.view.authenticate(user, authToken);
    //       this.view.navigateTo("/");
    //     }, "register user", () => {
    //       this.setIsLoading = false;
    //     });
    // };

    // public async doLogin(alias: string, password: string, originalUrl?: string) {
    //     this.doFailureReportingWithPostTask(async () => {
    //       this.setIsLoading = true;
      
    //       const [user, authToken] = await this.userService.login(alias, password);
    
    //       this.view.authenticate(user, authToken);
    
    //       if (!!originalUrl) {
    //         this.view.navigateTo(originalUrl);
    //       } else {
    //         this.view.navigateTo("/");
    //       }

    //     }, "log user in", () => {
    //       this.setIsLoading = false;
    //     });
    // };
}