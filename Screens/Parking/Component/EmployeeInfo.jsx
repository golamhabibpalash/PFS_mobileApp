import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';



const EmployeeInfo = ({ employeeInfo, registrationModel, formData, setFormData }) => {

    useEffect(() => {
        updateFormData();
    }, []);

    const updateFormData = () => {
        setFormData(prevData => ({
            ...prevData,
            EmployeeId: employeeInfo.EmployeeId,
            EmployeeName: employeeInfo.EmployeeName,
            Mobile: employeeInfo.Mobile,
            Designation: employeeInfo.Designation
        }));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Employee ID</Text>
            <TextInput
                style={styles.input}
                value={employeeInfo.EmployeeId}
                editable={false}
            />
            <Text style={styles.label}>Employee Name</Text>
            <TextInput
                style={styles.input}
                value={employeeInfo.EmployeeName}
                editable={false}
            />
            <Text style={styles.label}>Mobile</Text>
            <TextInput
                style={styles.input}
                value={employeeInfo.Mobile}
                editable={false}
            />
            <Text style={styles.label}>Designation</Text>
            <TextInput
                style={styles.input}
                value={employeeInfo.Designation}
                editable={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 5,
        paddingBottom: 20,
        backgroundColor: '#f0f0f0', // Added background color for the entire container
        borderRadius: 10, // Added borderRadius for rounded corners
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
        marginBottom: 10, // Added marginBottom for spacing between fields
        color: '#808285',
    },
});

export default EmployeeInfo;
