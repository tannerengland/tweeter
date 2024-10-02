// import { useContext } from "react";
import { useState } from "react";
import { UserNavigationPresenter, UserNavigationView } from "../../presenters/UserNavigationPresenter";
// import { UserInfoContext } from "../userInfo/UserInfoProvider";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/userInfoHook";


interface UserNavigationListener {
    navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

const useUserNavigationListener = (): UserNavigationListener => {
    const { setDisplayedUser, currentUser, authToken } =
    useUserInfo();
    const { displayErrorMessage } = useToastListener();

    const listener: UserNavigationView = {
      displayErrorMessage: displayErrorMessage,
      setDisplayedUser: setDisplayedUser,
    }
    
    const [presenter] = useState(new UserNavigationPresenter(listener));


    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
      // event.preventDefault();

      // presenter.navigateToUser(event, authToken!, currentUser!.alias, currentUser);
      
        event.preventDefault();
    
        // try {
          const alias = presenter.extractAlias(event.target.toString());

          await presenter.navigateToUser(authToken!, alias, currentUser!)
    
          // const user = await getUser(authToken!, alias);
    
          // if (!!user) {
          //   if (currentUser!.equals(user)) {
          //     setDisplayedUser(currentUser!);
          //   } else {
          //     setDisplayedUser(user);
          //   }
          // }
        // } catch (error) {
        //   // displayErrorMessage(`Failed to get user because of exception: ${error}`);
        //   presenter.displayErrorMessage(error);
        // }
      };
    
      // const extractAlias = (value: string): string => {
      //   const index = value.indexOf("@");
      //   return value.substring(index);
      // };
    
      // const getUser = async (
      //   authToken: AuthToken,
      //   alias: string
      // ): Promise<User | null> => {
      //   // TODO: Replace with the result of calling server
      //   return FakeData.instance.findUserByAlias(alias);
      // };

    return {navigateToUser: navigateToUser};
}

export default useUserNavigationListener;
