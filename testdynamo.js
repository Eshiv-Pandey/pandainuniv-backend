const { ddbDocClient } = require("./db/dynamoClient");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");

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
