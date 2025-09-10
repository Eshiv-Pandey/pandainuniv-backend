// src/db/dynamoWrapper.js
const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, BatchWriteCommand, QueryCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { ddbDocClient } = require("./dynamoClient");

async function putItem(params){ return ddbDocClient.send(new PutCommand(params)); }
async function getItem(params){ return ddbDocClient.send(new GetCommand(params)); }
async function updateItem(params){ return ddbDocClient.send(new UpdateCommand(params)); }
async function deleteItem(params){ return ddbDocClient.send(new DeleteCommand(params)); }
async function batchWrite(params){ return ddbDocClient.send(new BatchWriteCommand(params)); }
async function query(params){ return ddbDocClient.send(new QueryCommand(params)); }
async function scan(params){ return ddbDocClient.send(new ScanCommand(params)); }

module.exports = { putItem, getItem, updateItem, deleteItem, batchWrite, query, scan };
