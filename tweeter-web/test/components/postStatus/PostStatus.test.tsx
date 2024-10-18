import PostStatus from "../../../src/components/postStatus/PostStatus"
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
// import { library } from "@fortawesome/fontawesome-svg-core";
// import { fab } from "@fortawesome/free-brands-svg-icons";
import { PostStatusPresenter } from "../../../src/presenters/PostStatusPresenter";
import { capture, instance, mock, verify } from "ts-mockito";
import useUserInfo from "../../../src/components/userInfo/userInfoHook";
import { AuthToken, User } from "tweeter-shared";
import { StatusService } from "../../../src/model/service/StatusService";

// library.add(fab);

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
    ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
    __esModule: true,
    default: jest.fn(),
}));  

describe("PostStatus Component", () => {
    let mockAuthTokenInstance: AuthToken;
    let mockUserInstance: User;

    beforeAll(() => {
        const mockUser = mock<User>();
        mockUserInstance = instance(mockUser);
    
        const mockAuthToken = mock<AuthToken>();
        mockAuthTokenInstance = instance(mockAuthToken);

        (useUserInfo as jest.Mock).mockReturnValue({
            currentUser: mockUserInstance,
            authToken: mockAuthTokenInstance,
        }); 
    });

    it("first rendered the Post Status and Clear buttons are both disabled", () => {
        const { postStatusButton, clearButton } = renderPostStatusAndGetElements();
        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    it("Both buttons are enabled when the text field has text", async () => {
        const { postStatusButton, clearButton, statusField, user } = renderPostStatusAndGetElements();

        await userEvent.type(statusField, "a");

        // console.log(statusField.innerHTML);

        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled();
    });

    it("Both buttons are disabled when the text field is cleared", async () => {
        const { postStatusButton, clearButton, statusField, user } = renderPostStatusAndGetElements();

        await user.type(statusField, "a");

        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled();

        await user.clear(statusField);

        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    it("postStatus method is called with correct parameters when the Post Status button is pressed", async () => {
        
        const mockPresenter = mock<PostStatusPresenter>();
        const mockPresenterInstance = instance(mockPresenter);
       
        const postText = "Ayo";
        const { postStatusButton, clearButton, statusField, user } = renderPostStatusAndGetElements(mockPresenterInstance);
        
        await user.type(statusField, postText);
        await user.click(postStatusButton);

        verify(mockPresenter.submitPost(mockAuthTokenInstance, postText, mockUserInstance)).once();
    })
});

let renderPostStatus = ( presenter? : PostStatusPresenter ) => {
    return render(
        <MemoryRouter>
            {/* <PostStatus /> */}
            {!!presenter ? (
                <PostStatus presenter={presenter} />
            ) : (
                <PostStatus />
            )}
        </MemoryRouter>
    );
};

let renderPostStatusAndGetElements = (presenter?: PostStatusPresenter) => {
    const user = userEvent.setup();

    renderPostStatus(presenter);

    const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
    const clearButton = screen.getByRole("button", { name: /Clear/i });
    const statusField = screen.getByLabelText("statusField");

    return { postStatusButton, clearButton, statusField, user };
};

// const fillOutFields = async (aliasField: HTMLElement, passwordField: HTMLElement, user: UserEvent) => {
//     await user.type(aliasField, "a");
//     await user.type(passwordField, "b");
// }
