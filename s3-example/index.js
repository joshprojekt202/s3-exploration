"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AWS = require("aws-sdk");
var dotenv = require("dotenv");
dotenv.config();
var s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2'
});
// Ensure bucket name is defined
var bucketName = process.env.S3_BUCKET_NAME;
if (!bucketName) {
    throw new Error('Bucket name is undefined. Please set S3_BUCKET_NAME in your environment.');
}
// Function to list files in a bucket and generate signed URLs
function listFiles(bucketName) {
    var params = {
        Bucket: bucketName
    };
    s3.listObjectsV2(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        }
        else if (data.Contents) {
            console.log("Bucket contents:", data.Contents);
            generateSignedUrls(bucketName, data.Contents);
        }
        else {
            console.log("No contents found in the bucket.");
        }
    });
}
// Function to generate signed URLs for each object in the bucket
function generateSignedUrls(bucketName, objects) {
    objects.forEach(function (obj) {
        if (obj.Key) {
            var signedUrl = getSignedUrl(bucketName, obj.Key);
            console.log("Signed URL for ".concat(obj.Key, ": ").concat(signedUrl));
        }
    });
}
// Function to generate a signed URL for an S3 object
function getSignedUrl(bucketName, objectKey) {
    return s3.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: objectKey,
        Expires: 60 // URL expires in 60 seconds
    });
}
// Example usage
listFiles(bucketName);
