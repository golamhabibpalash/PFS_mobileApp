import React, { useState, useEffect } from 'react';
import { Image, View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import { Picker } from '@react-native-picker/picker';
import FileSizeChecker from '../../../Components/FileSizeChecker';
import CustomPicker from '../../../Components/CustomPicker';
import CustomPickerItem from '../../../Components/CustomPickerItem';

const VehicleInfo = ({ vehicleInfo, formData, setFormData }) => {
    const [selectedVehicleFile, setselectedVehicleFile] = useState(null);
    const [selectedVehicleFileName, setselectedVehicleFileName] = useState('no file selected');
    const [selectedVehicleType, setSelectedVehicleType] = useState(vehicleInfo.VehicleType || '');
    const [selectedVehicleNumber, setSelectedVehicleNumber] = useState(vehicleInfo.VehicleNumber || '');

    const isUpdate = vehicleInfo.IsUpdate;

    useEffect(() => {
        updateFormData();
    }, [selectedVehicleFile, selectedVehicleType, selectedVehicleNumber]);

    useEffect(() => {

        if (vehicleInfo.VehicleType) {
            setSelectedVehicleType(vehicleInfo.VehicleType);
        }
    }, []);


    const handleFileSelect = async () => {
        if (!isUpdate) {
            try {
                const response = await DocumentPicker.pickSingle({
                    type: [DocumentPicker.types.allFiles],
                });
                setselectedVehicleFile(response);
                setselectedVehicleFileName(response.name);
            } catch (error) {
                if (DocumentPicker.isCancel(error)) {

                } else {
                    console.error('Error:', error);
                }
            }
        }
    };

    const updateFormData = () => {
        setFormData(prevData => ({
            ...prevData,
            VehicleType: selectedVehicleType,
            VehicleNumber: selectedVehicleNumber,
            VehicleFile: selectedVehicleFile,
        }));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Vehicle Type</Text>
            {/* <Picker
                selectedValue={selectedVehicleType.toString()}
                onValueChange={isUpdate ? undefined : (itemValue) => setSelectedVehicleType(itemValue)}
                enabled={!isUpdate}
            >

                {vehicleInfo.VehicleTypes.map((type, index) => (
                    <Picker.Item key={index} label={type.Text} value={type.Value} />
                ))}
            </Picker> */}
            <CustomPicker
                selectedValue={vehicleInfo.VehicleTypes?.find(ele => ele.Value === selectedVehicleType.toString())?.Text}
            >
                {vehicleInfo.VehicleTypes.map((type, index) => (
                    <CustomPickerItem 
                        key={index} 
                        label={type.Text} 
                        value={type.Value} 
                        onPress={isUpdate ? undefined : (itemValue) => setSelectedVehicleType(itemValue)}
                    />
                ))}
            </CustomPicker>
            <Text style={styles.label}>Vehicle Number</Text>
            {!isUpdate && (
                <Text style={styles.note}>Note: Please use the following format: Dhaka-Metro-GA 14-3993</Text>
            )}
            <TextInput
                style={[styles.input, isUpdate && styles.disabledInput]}
                value={selectedVehicleNumber}
                onChangeText={isUpdate ? undefined : (text) => setSelectedVehicleNumber(text)}
                editable={!isUpdate}
            />
            <Text style={styles.label}>Vehicle Attachment</Text>
            <View style={styles.buttoncontainer}>
                {isUpdate ? null : (
                    <TouchableOpacity onPress={handleFileSelect}>
                        <MaterialCommunityIcons name="attachment" size={30} color="#ffa500" />
                    </TouchableOpacity>
                )}
                <FileSizeChecker file={selectedVehicleFile} />
                <Text style={styles.fileNameText}>{selectedVehicleFileName}</Text>

            </View>
            {vehicleInfo.VehicleImageByteString && (
                <Image
                    style={styles.image}
                    resizeMode="stretch"
                    source={{ uri: vehicleInfo.VehicleImageByteString }}
                />
            )}
        </View>
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
    buttoncontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    fileNameText: {
        marginLeft: 20,
    },
    note: {
        color: 'gray',
        marginBottom: 10,
    },
    image: {
        width: '60%',
        height: undefined,
        aspectRatio: 1,
        borderRadius: 10,
        marginVertical: 5,
        alignSelf: 'center',

    },
    disabledInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 7,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
        color: '#808285',
    },
});

export default VehicleInfo;
