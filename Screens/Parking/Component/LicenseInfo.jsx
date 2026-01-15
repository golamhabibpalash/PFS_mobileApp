import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const formatDate = (date) => {
    if (!date) return '';
    const dateObj = (date instanceof Date) ? date : new Date(date);
    return isNaN(dateObj.getTime()) ? '' : dateObj.toLocaleDateString();
};

const LicenseInfo = ({ licenseInfo, formData, setFormData }) => {
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState(licenseInfo.ValidityStartDate ? new Date(licenseInfo.ValidityStartDate) : null);
    const [selectedEndDate, setSelectedEndDate] = useState(licenseInfo.ValidityEndDate ? new Date(licenseInfo.ValidityEndDate) : null);
    const [licenseNumber, setLicenseNumber] = useState(licenseInfo.LicenseNumber || '');

    // Determine if the fields should be editable
    const editable = !licenseInfo.IsUpdate;

    useEffect(() => {
        updateFormData();
    }, [licenseNumber, selectedStartDate, selectedEndDate]);

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


    const updateFormData = () => {
        setFormData(prevData => ({
            ...prevData,
            LicenseNumber: licenseNumber,
            ValidityLicenseStartDate: selectedStartDate,
            ValidityLicenseEndDate: selectedEndDate
        }));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Driving License Number</Text>
            <TextInput
                style={[styles.input, !editable && styles.disabledInput]}
                value={licenseNumber}
                onChangeText={setLicenseNumber}
                editable={editable} // Control editability based on IsUpdate
            />
            <Text style={styles.label}>Validity License Start Date</Text>
            <View style={{ flexDirection: 'row', alignItems:'center' }}>
                <TextInput
                    style={[styles.input, !editable && styles.disabledInput, { flex: 1 }]}
                    value={formatDate(selectedStartDate)}
                    editable={false} // Dates are displayed only
                />
                {editable && (
                    <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowStartDatePicker(true)}>
                        <MaterialCommunityIcons name="calendar-month" size={20} color="white" />
                    </TouchableOpacity>
                )}
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
            <Text style={styles.label}>Validity License End Date</Text>
            <View style={{ flexDirection: 'row' }}>
                <TextInput
                    style={[styles.input, !editable && styles.disabledInput, { flex: 1 }]}
                    value={formatDate(selectedEndDate)}
                    editable={false} // Dates are displayed only
                />
                {editable && (
                    <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowEndDatePicker(true)}>
                        <MaterialCommunityIcons name="calendar-month" size={20} color="white" />
                    </TouchableOpacity>
                )}
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
    datePickerButton: {
        backgroundColor: '#ffa500',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 5,
        // marginTop: 5,
        alignSelf: 'flex-start',
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

export default LicenseInfo;
