// backend/models/applicationsDynamo.js
const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { ddbDocClient } = require("../db/dynamoClient");
const crypto = require("crypto");

const TABLE_NAME = "Applications";

// -----------------------------
// Create a new application
// -----------------------------
const createApplication = async (data, userId) => {
  const applicationID = crypto.randomUUID(); // Always generate unique ID

  const item = {
    ...data,
    applicationID,
    userId,
  };

  try {
    await ddbDocClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      })
    );
    return item;
  } catch (err) {
    console.error("Error inserting application:", err);
    throw new Error("Failed to create application in DynamoDB");
  }
};

// -----------------------------
// Get all applications
// -----------------------------
const getAllApplications = async () => {
  try {
    const result = await ddbDocClient.send(
      new ScanCommand({ TableName: TABLE_NAME })
    );
    return result.Items || [];
  } catch (err) {
    console.error("Error fetching all applications:", err);
    throw err;
  }
};

// -----------------------------
// Get applications by userId
// -----------------------------
const getApplicationsByUser = async (userId) => {
  try {
    const result = await ddbDocClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "userId = :uid",
        ExpressionAttributeValues: { ":uid": userId },
      })
    );
    return result.Items || [];
  } catch (err) {
    console.error("Error fetching applications by user:", err);
    throw err;
  }
};

// -----------------------------
// Get applications by University
// -----------------------------
const getApplicationsByUniversity = async (university) => {
  try {
    const result = await ddbDocClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "University = :uni",
        ExpressionAttributeValues: { ":uni": university },
      })
    );
    return result.Items || [];
  } catch (err) {
    console.error("Error fetching applications by university:", err);
    throw err;
  }
};

module.exports = {
  createApplication,
  getAllApplications,
  getApplicationsByUser,
  getApplicationsByUniversity,
};
