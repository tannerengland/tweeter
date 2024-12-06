// import { S3DaoDynamoDB } from "./dynamodb/S3DaoDynamoDB";
// import { SessionDaoDynamoDB } from "./dynamodb/SessionDaoDynamoDB";
// import { UserDaoDynamoDB } from "./dynamodb/UserDaoDynamoDB";
// import { StoryDaoDynamoDB } from "./dynamodb/StoryDaoDynamoDB";
// import { FollowDaoDynamoDB } from "./dynamodb/FollowDaoDynamoDB";

import { DaoFactory } from "../DaoFactory";
import { FeedDaoDynamoDB } from "./FeedDaoDynamoDB";
import { FollowDaoDynamoDB } from "./FollowDaoDynamoDB";
import { S3DaoDynamoDB } from "./S3DaoDynamoDB";
import { SessionDaoDynamoDB } from "./SessionDaoDynamoDB";
import { SqsDaoDynamoDB } from "./SqsDaoDynamoDB";
import { StoryDaoDynamoDB } from "./StoryDaoDynamoDB";
import { UserDaoDynamoDB } from "./UserDaoDynamoDB";


export class DaoFactoryDynamoDB implements DaoFactory {
    public createUserDao() {
        return new UserDaoDynamoDB();
    }

    public createSessionDao() {
        return new SessionDaoDynamoDB();
    }

    public createS3Dao() {
        return new S3DaoDynamoDB();
    }

    public createStoryDao() {
        return new StoryDaoDynamoDB();
    }

    public createFollowDao() {
        return new FollowDaoDynamoDB();
    }

    public createFeedDao() {
        return new FeedDaoDynamoDB();
    }

    public createSqsDao() {
        return new SqsDaoDynamoDB();
    }
}