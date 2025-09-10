// backend/models/usersDynamo.js
const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { ddbDocClient } = require("../db/dynamoClient");
const crypto = require("crypto");

const TABLE_NAME = "Users";

// Create a new user
async function createUser(username, email) {
  const item = {
    userId: crypto.randomUUID(),
    username,
    email,
  };

  await ddbDocClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
  }));

  return item;
}

// Get all users
async function getAllUsers() {
  const result = await ddbDocClient.send(new ScanCommand({
    TableName: TABLE_NAME,
  }));
  return result.Items || [];
}

module.exports = {
  createUser,
  getAllUsers,
};
