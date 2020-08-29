'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { StorageSharedKeyCredential, BlobServiceClient } = require('@azure/storage-blob');
const { AbortController } = require('@azure/abort-controller');
const fs = require("fs");
const path = require("path");

class AzureHelper {

    async uploadResumeToAzure(files) {

        let fileName = _config2.default.docs_sub_container + _config2.default.resumes_folder + files.resume.name;
        let filePath = files.resume.path;

        const credentials = new StorageSharedKeyCredential(_config2.default.azure_storage_account_name, _config2.default.azure_storage_access_key);

        const blobServiceClient = new BlobServiceClient(`https://${_config2.default.azure_storage_account_name}.blob.core.windows.net`, credentials);

        const containerClient = blobServiceClient.getContainerClient(_config2.default.azure_storage_container_name);
        // const blobClient = containerClient.getBlobClient(fileName);
        // const blockBlobClient = blobClient.getBlockBlobClient();

        const aborter = AbortController.timeout(30 * _config2.default.one_minute);

        //await containerClient.create();
        //console.log(`Container: "${containerName}" is created`);

        //console.log("Containers:");
        //await this.showContainerNames(aborter, blobServiceClient);

        //await blockBlobClient.upload(content, content.length, aborter);
        //console.log(`Blob "${blobName}" is uploaded`);

        //await uploadLocalFile(aborter, containerClient, localFilePath);
        //console.log(`Local file "${localFilePath}" is uploaded`);

        await this.uploadStream(aborter, containerClient, fileName, filePath);
        console.log(`Local file "${filePath}" is uploaded as a stream`);

        //console.log(`Blobs in "${config.azure_storage_container}" container:`);

        //await this.showBlobNames(aborter, containerClient);

        // const downloadResponse = await blockBlobClient.download(0,aborter);
        // const downloadedContent = await streamToString(downloadResponse.readableStreamBody);

        // console.log(`Downloaded blob content: "${downloadedContent}"`);

        //await blockBlobClient.delete(aborter);
        //console.log(`Block blob "${blobName}" is deleted`);

        //await containerClient.delete(aborter);
        //console.log(`Container "${containerName}" is deleted`);
    }

    async uploadAdditionalFilesToAzure(files) {

        let fileName = _config2.default.docs_sub_container + _config2.default.additional_files_folder + files.additional_file.name;
        let filePath = files.additional_file.path;

        const credentials = new StorageSharedKeyCredential(_config2.default.azure_storage_account_name, _config2.default.azure_storage_access_key);

        const blobServiceClient = new BlobServiceClient(`https://${_config2.default.azure_storage_account_name}.blob.core.windows.net`, credentials);

        const containerClient = blobServiceClient.getContainerClient(_config2.default.azure_storage_container_name);

        const aborter = AbortController.timeout(30 * _config2.default.one_minute);

        await this.uploadStream(aborter, containerClient, fileName, filePath);
        console.log(`Local file "${filePath}" is uploaded as a stream`);
    }

    async uploadProfilePictureToAzure(files) {

        let fileName = _config2.default.images_sub_container + _config2.default.profile_pictures_folder + files.profile_picture.name;
        let filePath = files.profile_picture.path;

        const credentials = new StorageSharedKeyCredential(_config2.default.azure_storage_account_name, _config2.default.azure_storage_access_key);

        const blobServiceClient = new BlobServiceClient(`https://${_config2.default.azure_storage_account_name}.blob.core.windows.net`, credentials);

        const containerClient = blobServiceClient.getContainerClient(_config2.default.azure_storage_container_name);

        const aborter = AbortController.timeout(30 * _config2.default.one_minute);

        await this.uploadStream(aborter, containerClient, fileName, filePath);
        console.log(`Local file "${filePath}" is uploaded as a stream`);
    }

    async uploadCompanyLogoToAzure(files) {

        let fileName = _config2.default.images_sub_container + _config2.default.company_logos_folder + files.profile_picture.name;
        let filePath = files.profile_picture.path;

        const credentials = new StorageSharedKeyCredential(_config2.default.azure_storage_account_name, _config2.default.azure_storage_access_key);

        const blobServiceClient = new BlobServiceClient(`https://${_config2.default.azure_storage_account_name}.blob.core.windows.net`, credentials);

        const containerClient = blobServiceClient.getContainerClient(_config2.default.azure_storage_container_name);

        const aborter = AbortController.timeout(30 * _config2.default.one_minute);

        await this.uploadStream(aborter, containerClient, fileName, filePath);
        console.log(`Local file "${filePath}" is uploaded as a stream`);
    }

    async uploadLocalFile(aborter, containerClient, filePath) {
        filePath = path.resolve(filePath);

        const fileName = path.basename(filePath);

        const blobClient = containerClient.getBlobClient(fileName);
        const blockBlobClient = blobClient.getBlockBlobClient();

        return await blockBlobClient.uploadFile(filePath, aborter);
    }

    async uploadStream(aborter, containerClient, fileName, filePath) {
        filePath = path.resolve(filePath);

        const blobClient = containerClient.getBlobClient(fileName);
        const blockBlobClient = blobClient.getBlockBlobClient();

        const stream = fs.createReadStream(filePath, {
            highWaterMark: _config2.default.four_megabytes
        });

        const uploadOptions = {
            bufferSize: _config2.default.four_megabytes,
            maxBuffers: 5
        };

        return await blockBlobClient.uploadStream(stream, uploadOptions.bufferSize, uploadOptions.maxBuffers, aborter);
    }

    // [Node.js only] A helper method used to read a Node.js readable stream into string
    async streamToString(readableStream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            readableStream.on("data", data => {
                chunks.push(data.toString());
            });
            readableStream.on("end", () => {
                resolve(chunks.join(""));
            });
            readableStream.on("error", reject);
        });
    }

}

exports.default = AzureHelper;