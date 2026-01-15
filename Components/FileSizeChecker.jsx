import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const FileSizeChecker = ({ file }) => {

    const maxFileSize = 10 * 1024 * 1024;

    // Function to check file size
    const checkFileSize = () => {
        // Check if the file size exceeds the maximum size
        if (file && file.size > maxFileSize) {

            return (
                <View style={styles.container}>
                    <MaterialCommunityIcons name="alert-circle" size={20} color="red" />
                    <Text style={styles.errorText}>
                        File size exceeds the maximum limit (10MB).
                    </Text>
                </View>
            );

        }

        return null;
    };

    return checkFileSize();
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    errorText: {
        color: 'red',
        marginLeft: 5,
    },
});

export default FileSizeChecker;
