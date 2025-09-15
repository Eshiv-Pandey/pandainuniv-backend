const { ddbDocClient } = require("./db/dynamoClient");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");
require("dotenv").config();
console.log("AWS_ACCESS_KEY_ID:", process.env.AWS_ACCESS_KEY_ID);
console.log("AWS_SECRET_ACCESS_KEY:", process.env.AWS_SECRET_ACCESS_KEY ? "✅ loaded" : "❌ missing");
console.log("AWS_REGION:", process.env.AWS_REGION);


async function test() {
  try {
    const item = {
      applicationID: "test123",
      userId: "me",
      University: "Test Uni",
    };

    console.log("Item to put:", item);

    await ddbDocClient.send(
      new PutCommand({
        TableName: "Applications",
        Item: item,
      })
    );

    console.log("DynamoDB test succeeded ✅");
  } catch (err) {
    console.error("DynamoDB test failed:", err);
  }
}

test();
