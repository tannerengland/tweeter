import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/userInfoHook";
import { PagedItemPresenter, PagedItemView } from "../../presenters/PagedItemPresenter";

interface Props<TItemType,TService> {
    presenterGenerator: (view: PagedItemView<TItemType>) => PagedItemPresenter<TItemType,TService>;
    itemComponentGenerator: (item: TItemType) => JSX.Element;
}

const ItemScroller = <TItemType,TService>(props: Props<TItemType,TService>) => {
  const { displayErrorMessage } = useToastListener();
  const [items, setItems] = useState<TItemType[]>([]);
  const [newItems, setNewItems] = useState<TItemType[]>([]);
  const [changedDisplayedUser, setChangedDisplayedUser] = useState(true);
  const { displayedUser, authToken } = useUserInfo();

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

    setChangedDisplayedUser(true);

    presenter.reset();
  }

  const listener: PagedItemView<TItemType> = {
    addItems: (newItems: TItemType[]) => setNewItems(newItems),
    displayErrorMessage: displayErrorMessage
  }

  const [presenter] = useState(props.presenterGenerator(listener));

  const loadMoreItems = async () => {
    presenter.loadMoreItems(authToken!, displayedUser!.alias);
    // THIS IS WHAT PREVENTS FROM LOADING UNTIL SCROLL
    // setChangedDisplayedUser(false);
  };

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
            {props.itemComponentGenerator(item)}
          </div>
        ))}
      </InfiniteScroll> 
    </div>
  );
}

export default ItemScroller;