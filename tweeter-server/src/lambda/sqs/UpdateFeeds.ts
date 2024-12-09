import { StatusDto } from "tweeter-shared";
import { DaoFactoryDynamoDB } from "../../model/dao/dynamodb/DaoFactoryDynamoDB";
import { StatusService } from "../../model/service/StatusService";

export const handler = async function (event: any) {
    // console.log("UPDATEFEEDS LAMBDA HIT");
    const service = new StatusService(new DaoFactoryDynamoDB);


    for (let i = 0; i < event.Records.length; ++i) {
        const { body } = event.Records[i];

        // console.log("Raw body:", body); // Log the raw body for debugging

        try {
            // Parse the body into JSON
            const parsedBody = JSON.parse(body);

            // Access status and followers
            const status: StatusDto = parsedBody.updateFeedDto.status;
            const followers: string[] = parsedBody.updateFeedDto.followers;

            // console.log("Parsed status:", status);
            // console.log("Parsed followers:", followers);

            // Call the service with the parsed data
            await service.postFeeds(status, followers);

        } catch (err) {
            console.error("Error parsing body or processing feeds:", err);
        }

        // console.log(body); // Log the raw body for debugging

        // try {
        //     // Parse the body
        //     const status: StatusDto = JSON.parse(body).status;
        //     const followers: string[] = JSON.parse(body).followers;


        //     // Access the alias
        //     // const alias = status.status?.user?.alias;

        //     // if (alias) {
        //         // console.log(`Alias: ${alias}`);



        //     console.log(status);
        //     console.log(followers);

        //     service.postFeeds(status, followers);


            

        //     // } else {
        //     //     console.log("Alias not found in the message body.");
        //     // }
        // } catch (err) {
        //     console.log("Error parsing body or accessing alias:", err);
        // }
    }
    return null;
};
