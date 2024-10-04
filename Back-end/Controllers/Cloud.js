const path = require('path');
const {google} = require("googleapis");
const KEYFILEPATH = path.join(__dirname, "..", "cred.json");



const getFoldersFromDrive = async (req, res) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: KEYFILEPATH,
        scopes: ["https://www.googleapis.com/auth/drive"],
    });
  
    const drive = google.drive({ version: "v3", auth });
  
    try {
        const response = await drive.files.list({
            q: "mimeType='application/vnd.google-apps.folder'",
            fields: 'files(id, name)',
        });
        res.json({ folders: response.data.files });
    } catch (error) {
        console.error('Error fetching folders from Drive:', error.message);
        res.status(500).json({ message: 'Failed to fetch folders from Google Drive' });
    }
};
  
  
const getFilesFromFolder = async (req, res) => {
    const folderId = req.params.folderId; 
  
    const auth = new google.auth.GoogleAuth({
        keyFile: KEYFILEPATH,
        scopes: ["https://www.googleapis.com/auth/drive"],
    });
  
    const drive = google.drive({ version: "v3", auth });
  
    try {
        const response = await drive.files.list({
            q: `'${folderId}' in parents`, 
            fields: 'files(id, name, webViewLink)',
        });
        res.json({ files: response.data.files });
    } catch (error) {
        console.error('Error fetching files from folder:', error.message);
        res.status(500).json({ message: 'Failed to fetch files from folder' });
    }
};
  
const deleteFileFromDrive = async (req, res) => {
    const fileId = req.params.fileId; 
  
    const auth = new google.auth.GoogleAuth({
        keyFile: KEYFILEPATH,
        scopes: ["https://www.googleapis.com/auth/drive"],
    });
  
    const drive = google.drive({ version: "v3", auth });
  
    try {
        await drive.files.delete({ fileId });
        res.status(204).send(); 
    } catch (error) {
        console.error('Error deleting file:', error.message);
        res.status(500).json({ message: 'Failed to delete file' });
    }
};
  
  
const deleteFolderFromDrive = async (req, res) => {
    const folderId = req.params.folderId;
  
    const auth = new google.auth.GoogleAuth({
        keyFile: KEYFILEPATH,
        scopes: ["https://www.googleapis.com/auth/drive"],
    });
  
    const drive = google.drive({ version: "v3", auth });
  
    try {
        await drive.files.delete({ fileId: folderId });
        res.status(204).send(); 
    } catch (error) {
        console.error('Error deleting folder:', error.message);
        res.status(500).json({ message: 'Failed to delete folder' });
    }
};
  
  
  
module.exports = {getFoldersFromDrive , getFilesFromFolder , deleteFileFromDrive , deleteFolderFromDrive}