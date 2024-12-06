import { StatusDto } from "tweeter-shared";
import { DaoFactoryDynamoDB } from "../../model/dao/dynamodb/DaoFactoryDynamoDB";
import { StatusService } from "../../model/service/StatusService";

export const handler = async function (event: any) {
    for (let i = 0; i < event.Records.length; ++i) {
        const { body } = event.Records[i];
        // console.log(body); // Log the raw body for debugging

        try {
            // Parse the body
            const status: StatusDto = JSON.parse(body).status;

            // Access the alias
            // const alias = status.status?.user?.alias;

            // if (alias) {
                // console.log(`Alias: ${alias}`);
            console.log("POSTUPDATEFEEDMESSAGES LAMBDA HIT");

            console.log(status);

            const service = new StatusService(new DaoFactoryDynamoDB);

            // console.log("currUSER" + status.user.alias);

            await service.postToFeed(status);
            // } else {
            //     console.log("Alias not found in the message body.");
            // }
        } catch (err) {
            console.log("Error parsing body or accessing alias:", err);
        }
    }
    return null;
};
