import React, { useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FetchRequestCreateData, CreateBusinessCardData } from '../../Services/BusinessCard/BusinessCardSlice';
import SubmitButton from '../../Components/SubmitButton';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

const BusinessCardInsertUpdate = ({ route }) => {


    const dispatch = useDispatch();

    const navigation = useNavigation();
    useEffect(() => {
        dispatch(FetchRequestCreateData());
    }, [dispatch]);
    const loaddata = useSelector(state => state.BusinessCardCreateLoad.createLoadData);
    const isSubmitting = useSelector(state => state.BusinessCardCreateLoad.isSubmitting);

    const handleSubmit = async () => {
        try {
            const model = {
                RequesterName: loaddata.RequesterName,
                Designation: loaddata.Designation,
                ContactNumber: loaddata.ContactNumber,
                Address: loaddata.Address,
                LastRequestDate: loaddata.LastRequestDate,
                Email: loaddata.Email,
                RequesterId: loaddata.RequesterId,
                NeedApproval: loaddata.NeedApproval,
                LmId: loaddata.LmId,
            };

            // Dispatch the action to create the business card
            const response = await dispatch(CreateBusinessCardData(model));

            // Check if response indicates success
            if (response.payload.status === '200') {
                // Show success Toast message
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: response.payload.message,
                });
                navigation.navigate('BusinessCardList', { route: true });

            } else {

                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: response.error.message,
                });
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            // Show error Toast message
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to submit data',
            });
        }
    };
    return (
        <View style={styles.container}>

            <Text style={styles.label}>Employee Name</Text>
            <TextInput
                style={styles.input}
                value={loaddata.RequesterName}
                editable={false}
            />
            <Text style={styles.label}>Designation</Text>
            <TextInput
                style={styles.input}
                value={loaddata.Designation}
                editable={false}
            />
            <Text style={styles.label}>Contact Number</Text>
            <TextInput
                style={styles.input}
                value={loaddata.ContactNumber}
                editable={false}
            />
            <Text style={styles.label}>Office Address</Text>
            <TextInput
                style={styles.input}
                value={loaddata.Address}
                editable={false}
            />
            <Text style={styles.label}>Last Request</Text>
            <TextInput
                style={styles.input}
                value={loaddata.LastRequestDate}
                editable={false}
            />
            {loaddata.NeedApproval &&
                <TextInput style={styles.inputText} editable={false} defaultValue={'second time within 30 days line manager approval is mandatory'} />
            }
            <Text style={styles.label}>Email Address</Text>
            <TextInput
                style={styles.input}
                value={loaddata.Email}
                editable={false}
            />
            <View style={styles.verticalSpace}></View>
            <SubmitButton title="Submit" onPress={handleSubmit} disabled={false} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingBottom: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        paddingTop: 20,
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
        color: '#808285',
    },
    verticalSpace: {
        height: 20,
    },
    inputText: {

        paddingVertical: 2,
        paddingHorizontal: 10,
        color: '#ff0000',


    },
});

export default BusinessCardInsertUpdate;
