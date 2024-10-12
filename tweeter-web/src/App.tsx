import "./App.css";
// import { useContext } from "react";
// import { UserInfoContext } from "./components/userInfo/UserInfoProvider";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
// import FeedScroller from "./components/mainLayout/FeedScroller";
// import StoryScroller from "./components/mainLayout/StoryScroller";
// import { AuthToken, User, FakeData, Status } from "tweeter-shared";
// import UserItemScroller from "./components/mainLayout/UserItemScroller";
// import StatusItemScroller from "./components/mainLayout/StatusItemScroller";
import useUserInfo from "./components/userInfo/userInfoHook";
import { FolloweePresenter } from "./presenters/FolloweePresenter";
import { UserItemView } from "./presenters/UserItemPresenter";
import { FollowerPresenter } from "./presenters/FollowerPresenter";
import { StoryPresenter } from "./presenters/StoryPresenter";
import { StatusItemView } from "./presenters/StatusItemPresenter";
import { FeedPresenter } from "./presenters/FeedPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import { Status, User } from "tweeter-shared";
import UserItem from "./components/userItem/UserItem";
import StatusItem from "./components/statusItem/StatusItem";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {


  // const loadMoreStoryItems = async (
  //   authToken: AuthToken,
  //   userAlias: string,
  //   pageSize: number,
  //   lastItem: Status | null
  // ): Promise<[Status[], boolean]> => {
  //   // TODO: Replace with the result of calling server
  //   return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  // };

  // const loadMoreFeedItems = async (
  //   authToken: AuthToken,
  //   userAlias: string,
  //   pageSize: number,
  //   lastItem: Status | null
  // ): Promise<[Status[], boolean]> => {
  //   // TODO: Replace with the result of calling server
  //   return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  // };

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route path="feed" element={
          // <StatusItemScroller key={1} presenterGenerator={(view: StatusItemView) => new FeedPresenter(view)}  />
          <ItemScroller 
            key={1} 
            presenterGenerator={(view: StatusItemView) => new FeedPresenter(view)}  
            itemComponentGenerator={(item: Status) => <StatusItem user={item.user} status={item}/> }
          />
        } />
        {/* <Route path="story" element={<StatusItemScroller key={2} presenterGenerator={(view: StatusItemView) => new StoryPresenter(view)}  */}
        <Route path="story" element={
          <ItemScroller
            key={2} 
            presenterGenerator={(view: StatusItemView) => new StoryPresenter(view)} 
            itemComponentGenerator={(item: Status) => <StatusItem user={item.user} status={item}/> }
          />
        } />
        <Route
          path="followees"
          element={
            // <UserItemScroller
            //   key={3}
            //   // loadItems={loadMoreFollowees}
            //   //   itemDescription="followees"
            //   presenterGenerator={(view: UserItemView) => new FolloweePresenter(view)}
            // />
            <ItemScroller
            key={3}
            presenterGenerator={(view: UserItemView) => new FolloweePresenter(view)}
            itemComponentGenerator={(item: User) => <UserItem value={item} />}
            />
          }
        />
        <Route
          path="followers"
          element={
            // <UserItemScroller
            //   key={4} 
            //   // loadItems={loadMoreFollowers}
            //   //   itemDescription="followers"
            //     presenterGenerator={(view: UserItemView) => new FollowerPresenter(view)}
            //   />
            <ItemScroller
              key={4} 
              presenterGenerator={(view: UserItemView) => new FollowerPresenter(view)}
              itemComponentGenerator={(item: User) => <UserItem value={item} />}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
