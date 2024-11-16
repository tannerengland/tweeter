import { S3DaoDynamoDB } from "./dynamodb/S3DaoDynamoDB";
import { SessionDaoDynamoDB } from "./dynamodb/SessionDaoDynamoDB";
import { UserDaoDynamoDB } from "./dynamodb/UserDaoDynamoDB";
import { StoryDaoDynamoDB } from "./dynamodb/StoryDaoDynamoDB";
import { FollowDaoDynamoDB } from "./dynamodb/FollowDaoDynamoDB";


export class DaoFactory {
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
}