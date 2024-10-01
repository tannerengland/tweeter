import { UserService } from "../model/service/UserService";

export interface PostView {

}

export class PostPresenter {

    private userService: UserService;
    private view: PostView; 

    public constructor(view: PostView) {
        this.userService = new UserService();
        this.view = view;
    }


    // public async navigateToUser(event: React.MouseEvent): Promise<void> {
    //     event.preventDefault();
    
    //     try {
    //       const alias = extractAlias(event.target.toString());
    
    //       const user = await getUser(authToken!, alias);
    
    //       if (!!user) {
    //         if (currentUser!.equals(user)) {
    //           setDisplayedUser(currentUser!);
    //         } else {
    //           setDisplayedUser(user);
    //         }
    //       }
    //     } catch (error) {
    //       displayErrorMessage(`Failed to get user because of exception: ${error}`);
    //     }
    // };

    // public extractAlias = (value: string): string => {
    //     const index = value.indexOf("@");
    //     return value.substring(index);
    // };
    
}