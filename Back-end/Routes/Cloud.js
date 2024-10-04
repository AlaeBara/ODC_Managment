const express = require('express');
const {  getFoldersFromDrive , getFilesFromFolder , deleteFileFromDrive , deleteFolderFromDrive } = require('../Controllers/Cloud');
const authenticated = require('../Middlewares/Authmiddleware');
const router = express.Router();


router.get('/folders', authenticated, getFoldersFromDrive);

router.get('/folders/:folderId/files',authenticated, getFilesFromFolder);

router.delete('/files/:fileId', authenticated, deleteFileFromDrive);

router.delete('/folders/:folderId', authenticated, deleteFolderFromDrive);


module.exports = router;