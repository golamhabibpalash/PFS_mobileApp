import React, {useEffect} from 'react';
import {View, Button} from 'react-native';
import RNFS from 'react-native-fs';

const FileDownloadScreen = route => {
  const baseUrl = appConfig.apiBaseURL;
  const DataTablePairapiUrl = 'pfs/api/OutboundApi/List';
  const pdfApi = 'pfs/api/OutboundApi/DownloadOutboundWithContentPDF';

  useEffect(() => {
    // Optional: Delete the file if it exists before downloading
    const filePath = RNFS.DocumentDirectoryPath + `${route.code}`;
    RNFS.unlink(filePath)
      .then(() => {
        console.log('Previous file deleted');
      })
      .catch(err => {
        console.log(err.message);
      });
  }, []);

  const downloadFile = () => {
    const url = `${baseUrl}${pdfApi}?id=${item.Id}`;
    const filePath = RNFS.DocumentDirectoryPath + `${route.code}`;

    RNFS.downloadFile({
      fromUrl: url,
      toFile: filePath,
      background: true, // Enable downloading in the background (iOS only)
      discretionary: true, // Allow the OS to control the timing and speed (iOS only)
      progress: res => {
        // Handle download progress updates if needed
        const progress = (res.bytesWritten / res.contentLength) * 100;
        console.log(`Progress: ${progress.toFixed(2)}%`);
      },
    })
      .promise.then(response => {
        console.log('File downloaded!', response);
      })
      .catch(err => {
        console.log('Download error:', err);
      });
  };
};

export default FileDownloadScreen;
