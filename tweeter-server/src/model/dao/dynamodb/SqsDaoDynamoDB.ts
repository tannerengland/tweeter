import { StatusDto } from "tweeter-shared";
import { SqsDao } from "../SqsDao";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { UpdateFeedsDto } from "../../util/UpdateFeedsDto";



export class SqsDaoDynamoDB implements SqsDao {

    // private sqsClient = new SQSClient();
    private sqsClient = new SQSClient({});

    
    public async postStatus(status: StatusDto): Promise<void> {
        // const messageBody = JSON.stringify({
        //     status: status,
        // });
        const messageBody = JSON.stringify(status);

        let sqsUrl: string = "https://sqs.us-east-2.amazonaws.com/194722415156/postStatus1";
        


        const params = {
            DelaySeconds: 10,
            MessageBody: messageBody,
            QueueUrl: sqsUrl,
        };

        // console.log("POSTSTATUS SQS HIT")

        // if (this.sqsClient != undefined) {
            try {
                const data = await this.sqsClient.send(new SendMessageCommand(params));
                console.log("Success, 1st sqs message sent. MessageID:", data.MessageId);
            } catch (err) {
                throw err;
            }
        // }
    };

    public async postToFeeds(updateFeedDto: UpdateFeedsDto): Promise<void> {


        let sqsUrl: string = "https://sqs.us-east-2.amazonaws.com/194722415156/updateFeed";


        // console.log("POSTTOFEEDS SQS HIT")
        // console.log(updateFeedDto.status)


        // console.log(`${updateFeedDto.followers}`)

        // if (this.sqsClient != undefined) {
            try {
                // console.log("about to send 2nd sqs")

                // for (let i=0; i < followers.length; i += 100){
                //     let currBatch = followers.slice(i, i + 100);
                //     console.log(currBatch);

                    const messageBody = JSON.stringify({updateFeedDto});
                    const params = {
                        DelaySeconds: 10,
                        MessageBody: messageBody,
                        QueueUrl: sqsUrl,
                    };
                    const data = await this.sqsClient.send(new SendMessageCommand(params));
                    console.log("Success, 2nd sqs message sent. MessageID:", data.MessageId);
                // }
            } catch (err) {
                throw err;
            }   
        // }

    };


}