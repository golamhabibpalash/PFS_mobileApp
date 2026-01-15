import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'

const CafeTransferUsers = ({ user, transferRegistration }) => {
  return (
    <View style={styles.row}>
            <Text style={styles.cell}>{user.Name}</Text>
            <Text style={styles.cell}>{user.Email}</Text>
            <Text style={styles.cell}>{user.MobileNumber}</Text>
            <Text style={[styles.cell]}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button}>
                        <Icon name="exchange" size={20} color="orange"
                            onPress={() => transferRegistration(user.Id)} />
                    </TouchableOpacity>
                </View>
            </Text>
        </View>
  )
}

export default CafeTransferUsers

const styles = StyleSheet.create({
    container: {
        // paddingVertical: 30,
        // paddingHorizontal: 30,
    },
    headerToBar: {
        backgroundColor: 'lightgray',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 5,
        elevation: 2,
        alignItems: 'center',
    },
    headerToBarText: {
        color: 'black',
        fontSize: 14,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        elevation: 1,
        marginHorizontal: 2,
    },
    heading: {
        color: 'black',
        fontSize: 13,
        width: '25%',
        fontWeight: 'bold',
    },
    cell: {
        fontSize: 12,
        textAlign: 'left',
        width: '22%',
        color: '#000',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
        marginHorizontal: 2,
        elevation: 1,
        borderRadius: 3,
        borderColor: '#fff',
        padding: 10,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    button: {
        paddingHorizontal: 10,
        padding: 10,
    }
})