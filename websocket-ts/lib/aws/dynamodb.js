"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ddb = void 0;
// https://docs.aws.amazon.com/ja_jp/sdk-for-javascript/v2/developer-guide/dynamodb-example-table-read-write.html
const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    region: 'REGION',
    endpoint: "http://localhost:8000"
});
// Create the DynamoDB service object
exports.ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
