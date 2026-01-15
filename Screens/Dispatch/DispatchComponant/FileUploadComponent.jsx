import React, {useState} from 'react';
import {View, Button, Alert, Text, StyleSheet} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

const allowedMimeTypes = ['application/pdf', 'image/jpeg'];

const FileUploadComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      if (!result || !result.uri) {
        console.warn('No file selected or invalid file');
        return;
      }

      // Check file size
      const fileSize = await RNFS.stat(result.uri);
      const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
      if (fileSize.size > maxSize) {
        Alert.alert(
          'File Size Limit Exceeded',
          'Please select a file up to 5 MB.',
        );
      } else {
        // Check file type
        const fileType = result.type;
        if (!allowedMimeTypes.includes(fileType)) {
          Alert.alert(
            'Invalid File Type',
            'Please select a file with a valid type.',
          );
          return;
        }
        setSelectedFile(result);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the document picker
      } else {
        console.error('Error picking document:', err.message); // Improved error handling
        Alert.alert('Error', 'An error occurred while picking a file.');
      }
    }
  };

  const uploadFile = async () => {
    if (selectedFile) {
      // Implement your actual upload logic here
      // You can use libraries like axios or Fetch API to send the file data to a server
      const fileUri = selectedFile.uri;
      // ... send file data using fileUri ...

      Alert.alert(
        'File Uploaded',
        `File ${selectedFile.name} has been uploaded successfully.`,
      );
    } else {
      Alert.alert('No File Selected', 'Please select a file to upload.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Pick Document" onPress={pickDocument} />
      </View>
      {selectedFile && (
        <View style={styles.fileContainer}>
          <Text style={styles.fileText}>
            Selected File: {selectedFile.name}
          </Text>
          <Text style={styles.fileText}>Size: {selectedFile.size} bytes</Text>
          <Text style={styles.fileText}>Type: {selectedFile.type}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Upload File" onPress={uploadFile} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  buttonContainer: {
    marginBottom: 10,
  },
  fileContainer: {
    marginTop: 10,
  },
  fileText: {
    marginBottom: 5,
  },
});

export default FileUploadComponent;
