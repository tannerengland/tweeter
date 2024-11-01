// import { User, AuthToken } from "tweeter-shared";
// import { UserService } from "../model/service/UserService";
import { Buffer } from "buffer";
// import { View } from "./Presenter";
import { AuthenticatePresenter, AuthenticateView } from "./AuthenticatePresenter";


export interface RegisterView extends AuthenticateView {
    setImageUrl: (value: React.SetStateAction<string>) => void;
    setImageBytes: (value: React.SetStateAction<Uint8Array>) => void;
    setImageFileExtension: (value: React.SetStateAction<string>) => void;
}

export class RegisterPresenter extends AuthenticatePresenter {

    // private setIsLoading = false;

    // private userService: UserService;

    public constructor(view: RegisterView) {
      super(view);
      // this.userService = new UserService();
    }

    protected get view(): RegisterView {
      return super.view as RegisterView;
    }

    public doRegister(firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array, imageFileExtension: string): Promise<void> {
      return this.doAuthenticate(() => this.service.register(firstName, lastName, alias, password, imageBytes, imageFileExtension), () => this.getNavigationFunction()) 
    }

    // protected doOperation(firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array, imageFileExtension: string): Promise<[User, AuthToken]> {
    //   return this.service.register(
    //     firstName,
    //     lastName,
    //     alias,
    //     password,
    //     imageBytes,
    //     imageFileExtension
    //   );
    // }

    protected getOperationDescription(): string {
      return "register user";
    }

    protected getNavigationFunction(): void {
      return  this.view.navigateTo("/");
    }

      public handleImageFile (file: File | undefined)  {
        if (file) {
          this.view.setImageUrl(URL.createObjectURL(file));
    
          const reader = new FileReader();
          reader.onload = (event: ProgressEvent<FileReader>) => {
            const imageStringBase64 = event.target?.result as string;
    
            // Remove unnecessary file metadata from the start of the string.
            const imageStringBase64BufferContents =
              imageStringBase64.split("base64,")[1];
    
            const bytes: Uint8Array = Buffer.from(
              imageStringBase64BufferContents,
              "base64"
            );
    
            this.view.setImageBytes(bytes);
          };
          reader.readAsDataURL(file);
    
          // Set image file extension (and move to a separate method)
          const fileExtension = this.getFileExtension(file);
          if (fileExtension) {
            this.view.setImageFileExtension(fileExtension);
          }
        } else {
          this.view.setImageUrl("");
          this.view.setImageBytes(new Uint8Array());
        }
      };

      public getFileExtension (file: File): string | undefined {
        return file.name.split(".").pop();
      };

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

}