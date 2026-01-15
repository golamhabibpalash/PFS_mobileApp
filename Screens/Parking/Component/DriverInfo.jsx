import React, { useState, useEffect } from 'react';
import { Image, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import FileSizeChecker from '../../../Components/FileSizeChecker';

const formatDate = (date) => {
    if (!date) return '';
    const dateObj = (date instanceof Date) ? date : new Date(date);
    return isNaN(dateObj.getTime()) ? '' : dateObj.toLocaleDateString();
};

const DriverInfo = ({ driverInfo, formData, setFormData }) => {
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState(driverInfo.ValidityStartDateDriver ? new Date(driverInfo.ValidityStartDateDriver) : null);
    const [selectedEndDate, setSelectedEndDate] = useState(driverInfo.ValidityEndDateDriver ? new Date(driverInfo.ValidityEndDateDriver) : null);
    const [selectedDriverFile, setselectedDriverFile] = useState(null);
    const [selectedDriverFileName, setselectedDriverFileName] = useState('No file selected');
    const [selectedDriverName, setSelectedDriverName] = useState(driverInfo.DriverName || '');
    const [selectedDriverMobile, setSelectedDriverMobile] = useState(driverInfo.DriverMobile || '');
    const [selectedDriverLicenseNumber, setSelectedDriverLicenseNumber] = useState(driverInfo.DriverLicenseNumber || '');

    useEffect(() => {
        updateFormData();
    }, [selectedDriverFile,
        selectedDriverName, selectedDriverMobile,
        selectedDriverLicenseNumber, selectedStartDate, selectedEndDate]);

    const onChangeStartDate = (event, selectedDate) => {
        setShowStartDatePicker(false);
        if (event.type === 'set') {
            setSelectedStartDate(selectedDate || null);
        } else {
            setSelectedStartDate(null);
        }
    };

    const onChangeEndDate = (event, selectedDate) => {
        setShowEndDatePicker(false);
        if (event.type === 'set') {
            setSelectedEndDate(selectedDate || null);
        } else {
            setSelectedEndDate(null);
        }
    };

    const handleFileSelect = async () => {
        try {
            const response = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.allFiles],
            });
            setselectedDriverFile(response);
            setselectedDriverFileName(response.name);
        } catch (error) {
            if (DocumentPicker.isCancel(error)) {

            } else {
                console.error('Error:', error);
            }
        }
    };

    const updateFormData = () => {
        setFormData(prevData => ({
            ...prevData,
            DriverName: selectedDriverName,
            DriverMobile: selectedDriverMobile,
            DriverLicenseNumber: selectedDriverLicenseNumber,
            ValidityStartDateDriver: selectedStartDate,
            ValidityEndDateDriver: selectedEndDate,
            DriverFile: selectedDriverFile,
            DriverFileName: selectedDriverFileName,
        }));
    };


    return (
        <View style={styles.container}>
            <Text style={styles.label}>Driver Name</Text>
            <TextInput
                style={styles.input}
                value={selectedDriverName}
                onChangeText={setSelectedDriverName}
            />
            <Text style={styles.label}>Driver Mobile</Text>
            <TextInput
                style={styles.input}
                value={selectedDriverMobile}
                onChangeText={setSelectedDriverMobile}
            />
            <Text style={styles.label}>Driver License Number</Text>
            <TextInput
                style={styles.input}
                value={selectedDriverLicenseNumber}
                onChangeText={setSelectedDriverLicenseNumber}
            />
            <Text style={styles.label}>Validity Driver Start Date</Text>
            <View style={{ flexDirection: 'row', alignItems:'center' }}>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={formatDate(selectedStartDate)}
                    editable={false}
                />
                <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowStartDatePicker(true)}>
                    <MaterialCommunityIcons name="calendar-month" size={20} color="white" />
                </TouchableOpacity>
            </View>
            {showStartDatePicker && (
                <DateTimePicker
                    testID="startDatePicker"
                    value={selectedStartDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={onChangeStartDate}
                />
            )}
            <Text style={styles.label}>Validity Driver End Date</Text>
            <View style={{ flexDirection: 'row' }}>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={formatDate(selectedEndDate)}
                    editable={false}
                />
                <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowEndDatePicker(true)}>
                    <MaterialCommunityIcons name="calendar-month" size={20} color="white" />
                </TouchableOpacity>
            </View>
            {showEndDatePicker && (
                <DateTimePicker
                    testID="endDatePicker"
                    value={selectedEndDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={onChangeEndDate}
                />
            )}
            <Text style={styles.label}>Driver Attachment</Text>
            <View style={styles.buttoncontainer}>
                <TouchableOpacity onPress={handleFileSelect}>
                    <MaterialCommunityIcons name="attachment" size={30} color="#ffa500" />
                </TouchableOpacity>
                <FileSizeChecker file={selectedDriverFile} />

                <Text style={styles.fileNameText}>{selectedDriverFileName}</Text>
            </View>
            {driverInfo.DriverImageByteString && (
                <Image
                    style={styles.image}
                    resizeMode="stretch"
                    source={{ uri: driverInfo.DriverImageByteString }}
                />
            )}


        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 5,
        paddingBottom: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 7,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
        color: '#000000',
    },
    datePickerButton: {
        backgroundColor: '#ffa500',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 5,
        // marginTop: 5,
        alignSelf: 'flex-start',
    },
    buttoncontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    fileNameText: {
        marginLeft: 10,
    },
    image: {
        width: '60%',
        height: undefined,
        aspectRatio: 1,
        borderRadius: 10,
        marginVertical: 10,
        alignSelf: 'center',

    },
});

export default DriverInfo;
