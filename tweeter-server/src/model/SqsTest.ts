import { SqsDaoDynamoDB } from "../model/dao/dynamodb/SqsDaoDynamoDB";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { StatusDto } from "tweeter-shared";
import sinon from "sinon";
import { strict as assert } from "assert";

function SqsTest() {
    let currSqs = new SqsDaoDynamoDB();
    const currStatus: StatusDto = {
        post: "Hello, goose!",
        user: { firstName: "Nate", lastName: "Skon", alias: "@daisy", imageUrl: "http://example.com/avatar.jpg" },
        timestamp: 1630512000,
    };

    currSqs.postStatus(currStatus);
}

SqsTest();
