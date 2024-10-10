import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Buffer } from "buffer";
import { Presenter, View } from "./Presenter";


export interface RegisterView extends View {
    authenticate: (currentUser: User, authToken: AuthToken) => void;
    navigateTo: (url: string) => void;
    // displayErrorMessage: (message: string) => void;
    setImageUrl: (value: React.SetStateAction<string>) => void;
    setImageBytes: (value: React.SetStateAction<Uint8Array>) => void;
    setImageFileExtension: (value: React.SetStateAction<string>) => void;

}

export class RegisterPresenter extends Presenter<RegisterView>{

    private setIsLoading = false;

    private userService: UserService;
    // private view: RegisterView;

    public constructor(view: RegisterView) {
      // this.view = view;
      super(view);
      this.userService = new UserService();
    }

    protected get view(): RegisterView {
      return super.view as RegisterView;
    }

    public async doRegister(firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array, imageFileExtension: string) {
      try {
        this.doFailureReportingOperation(async () => {
          this.setIsLoading = true;
      
          const [user, authToken] = await this.userService.register(
            firstName,
            lastName,
            alias,
            password,
            imageBytes,
            imageFileExtension
          );
    
          this.view.authenticate(user, authToken);
          this.view.navigateTo("/");
        }, "register user");
      } finally {
        this.setIsLoading = false;
      }
    };

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

}