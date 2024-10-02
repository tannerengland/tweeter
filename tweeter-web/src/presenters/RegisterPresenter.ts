import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Buffer } from "buffer";


export interface RegisterView {
    authenticate: (currentUser: User, authToken: AuthToken) => void;
    navigateTo: (url: string) => void;
    displayErrorMessage: (message: string) => void;
    setImageUrl: (value: React.SetStateAction<string>) => void;
    setImageBytes: (value: React.SetStateAction<Uint8Array>) => void;
    setImageFileExtension: (value: React.SetStateAction<string>) => void;

}

export class RegisterPresenter {

    private setIsLoading = false;

    private userService: UserService;
    private view: RegisterView;

    public constructor(view: RegisterView) {
        this.userService = new UserService();
        this.view = view;
    }

    public async doRegister(firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array, imageFileExtension: string) {
        try {
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
        } catch (error) {
            this.view.displayErrorMessage(
            `Failed to register user because of exception: ${error}`
          );
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