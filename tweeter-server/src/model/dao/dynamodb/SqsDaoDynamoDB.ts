import { StatusDto } from "tweeter-shared";
import { SqsDao } from "../SqsDao";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";



export class SqsDaoDynamoDB implements SqsDao {

    // private sqsClient = new SQSClient();
    private sqsClient = new SQSClient({ region: "us-east-2" });

    
    public async postStatus(status: StatusDto): Promise<void> {
        const messageBody = JSON.stringify({
            status: status,
        });

        let sqsUrl: string = "https://sqs.us-east-2.amazonaws.com/194722415156/postStatus";
        


        const params = {
            DelaySeconds: 10,
            MessageBody: messageBody,
            QueueUrl: sqsUrl,
        };

        // console.log("POSTSTATUS SQS HIT")

        try {
            const data = await this.sqsClient.send(new SendMessageCommand(params));
            console.log("Success, message sent. MessageID:", data.MessageId);
        } catch (err) {
            throw err;
        }
    };

    public async postToFeeds(status: StatusDto, followers: string[]): Promise<void> {
        const messageBody = JSON.stringify({
            status: status,
            followers: followers
        });

        let sqsUrl: string = "https://sqs.us-east-2.amazonaws.com/194722415156/updateFeeds";


        const params = {
            DelaySeconds: 10,
            MessageBody: messageBody,
            QueueUrl: sqsUrl,
        };

        console.log("POSTTOFEEDS SQS HIT")


        console.log(`${status} ${followers}`)

        try {
            const data = await this.sqsClient.send(new SendMessageCommand(params));
            console.log("Success, message sent. MessageID:", data.MessageId);
        } catch (err) {
            throw err;
        }
    };


}