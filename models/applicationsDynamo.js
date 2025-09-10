// backend/models/applicationsDynamo.js
const { PutCommand, QueryCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { ddbDocClient } = require("../db/dynamoClient");
const crypto = require("crypto");

const TABLE_NAME = "Applications";

// Submit new application
async function createApplication(data, userId) {
  const item = {
    applicationId: crypto.randomUUID(), // Auto-generate unique ID
    userId,
    ...data,
  };

  await ddbDocClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
  }));

  return item;
}

// Get applications by user
async function getApplicationsByUser(userId) {
  const result = await ddbDocClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: "GSI_userId", // Make sure your GSI exists
    KeyConditionExpression: "userId = :u",
    ExpressionAttributeValues: { ":u": userId },
  }));

  return result.Items || [];
}

// Get all applications
async function getAllApplications() {
  const result = await ddbDocClient.send(new ScanCommand({
    TableName: TABLE_NAME,
  }));
  return result.Items || [];
}

// Get applications by University
async function getApplicationsByUniversity(university) {
  const result = await ddbDocClient.send(new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: "University = :u",
    ExpressionAttributeValues: { ":u": university },
  }));
  return result.Items || [];
}

module.exports = {
  createApplication,
  getApplicationsByUser,
  getAllApplications,
  getApplicationsByUniversity,
};
