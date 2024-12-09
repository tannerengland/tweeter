import { SqsDaoDynamoDB } from "../model/dao/dynamodb/SqsDaoDynamoDB";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { StatusDto } from "tweeter-shared";
import sinon from "sinon";
import { strict as assert } from "assert";

function SqsTest() {
    let currSqs = new SqsDaoDynamoDB();
    const currStatus: StatusDto = {
        post: "okay testing for 10k",
        user: { firstName: "Daisy", lastName: "Duck", alias: "@daisy", imageUrl: "https://profilepicturebucketcs340.s3.us-east-2.amazonaws.com/image/@daisy" },
        timestamp: 1630512000,
    };

    currSqs.postStatus(currStatus);
}

SqsTest();
