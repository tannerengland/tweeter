// import { useContext } from "react";
// import { UserInfoContext } from "../userInfo/UserInfoProvider";
import { Status } from "tweeter-shared";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
// import { Link } from "react-router-dom";
// import Post from "../statusItem/Post";
import useToastListener from "../toaster/ToastListenerHook";
// import UserItem from "../userItem/UserItem";
import StatusItem from "../statusItem/StatusItem";
import useUserInfo from "../userInfo/userInfoHook";
// import { StoryPresenter, StoryView } from "../../presenters/StoryPresenter";
import { StatusItemPresenter, StatusItemView } from "../../presenters/StatusItemPresenter";

// export const PAGE_SIZE = 10;

interface Props {
    // itemType: string;
    // loadMore: (
    //     authToken: AuthToken,
    //     userAlias: string,
    //     pageSize: number,
    //     lastItem: Status | null
    //   ) => Promise<[Status[], boolean]>;
    presenterGenerator: (view: StatusItemView) => StatusItemPresenter;
}

const StatusItemScroller = (props: Props) => {
    const { displayErrorMessage } = useToastListener();
    const [items, setItems] = useState<Status[]>([]);
    const [newItems, setNewItems] = useState<Status[]>([]);
    // const [hasMoreItems, setHasMoreItems] = useState(true);
    // const [lastItem, setLastItem] = useState<Status | null>(null);
    const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);
  
    // const addItems = (newItems: Status[]) =>
    //   setNewItems(newItems);
  
    const { displayedUser, authToken } =
      useUserInfo();
  
    // Initialize the component whenever the displayed user changes
    useEffect(() => {
      reset();
    }, [displayedUser]);
  
    // Load initial items whenever the displayed user changes. Done in a separate useEffect hook so the changes from reset will be visible.
    useEffect(() => {
      if(changedDisplayedUser) {
        loadMoreItems();
      }
    }, [changedDisplayedUser]);
  
    // Add new items whenever there are new items to add
    useEffect(() => {
      if(newItems) {
        setItems([...items, ...newItems]);
      }
    }, [newItems])
  
    const reset = async () => {
      setItems([]);
      setNewItems([]);

      // setLastItem(null);
      // setHasMoreItems(true);

      setChangedDisplayedUser(true);

      presenter.reset();
    }

    const listener: StatusItemView = {
      addItems: (newItems: Status[]) => setNewItems(newItems),
      displayErrorMessage: displayErrorMessage

    }

    const [presenter] = useState(props.presenterGenerator(listener));
  
    const loadMoreItems = async () => {
      presenter.loadMoreItems(authToken!, displayedUser!.alias);
      setChangedDisplayedUser(false);


      // try {
      //   const [newItems, hasMore] = await props.loadMore(
      //     authToken!,
      //     displayedUser!.alias,
      //     PAGE_SIZE,
      //     lastItem
      //   );
  
      //   setHasMoreItems(hasMore);
      //   setLastItem(newItems[newItems.length - 1]);
      //   addItems(newItems);
      //   setChangedDisplayedUser(false)
      // } catch (error) {
      //   displayErrorMessage(
      //     `Failed to load ${props.itemType} items because of exception: ${error}`
      //   );
      // }
    };


    // const loadMoreStoryItems = async (
    //   authToken: AuthToken,
    //   userAlias: string,
    //   pageSize: number,
    //   lastItem: Status | null
    // ): Promise<[Status[], boolean]> => {
    //   // TODO: Replace with the result of calling server
    //   return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
    // };
    // const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    //   event.preventDefault();
  
    //   try {
    //     const alias = extractAlias(event.target.toString());
  
    //     const user = await getUser(authToken!, alias);
  
    //     if (!!user) {
    //       if (currentUser!.equals(user)) {
    //         setDisplayedUser(currentUser!);
    //       } else {
    //         setDisplayedUser(user);
    //       }
    //     }
    //   } catch (error) {
    //     displayErrorMessage(`Failed to get user because of exception: ${error}`);
    //   }
    // };
  
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
  
    return (
      <div className="container px-0 overflow-visible vh-100">
        <InfiniteScroll
          className="pr-0 mr-0"
          dataLength={items.length}
          next={loadMoreItems}
          hasMore={presenter.hasMoreItems}
          loader={<h4>Loading...</h4>}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="row mb-3 mx-0 px-0 border rounded bg-white"
            >
              <StatusItem user={item.user} status={item}/>
              {/* <div className="col bg-light mx-0 px-0">
                <div className="container px-0">
                  <div className="row mx-0 px-0">
                    <div className="col-auto p-3">
                      <img
                        src={item.user.imageUrl}
                        className="img-fluid"
                        width="80"
                        alt="Posting user"
                      />
                    </div>
                    <div className="col">
                      <h2>
                        <b>
                          {item.user.firstName} {item.user.lastName}
                        </b>{" "}
                        -{" "}
                        <Link
                          to={item.user.alias}
                          onClick={(event) => navigateToUser(event)}
                        >
                          {item.user.alias}
                        </Link>
                      </h2>
                      {item.formattedDate}
                      <br />
                      <Post status={item} />
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          ))}
        </InfiniteScroll>
      </div>
    );
}

export default StatusItemScroller;