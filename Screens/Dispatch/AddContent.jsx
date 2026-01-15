import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import FileUploadComponent from './DispatchComponant/FileUploadComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import appConfig from '../../app.json';
import axios from 'axios';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from 'react-native-table-component';
import Toast from 'react-native-toast-message';
import SubmitButton from '../../Components/SubmitButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import { color } from 'react-native-reanimated';
const windowWidth = Dimensions.get('window').width;

const AddContent = ({ route }) => {
  const {
    id,
    senderId,
    senderName,
    senderMobileNumber,
    receiverName,
    receiverMobileNumber,
    receiverEmail,
    receiverAddress,
    designatedCourier,
    receiverZone,
    designatedCourierText,
    // receiverZoneText,
    outboundContentListParam,
    status,
  } = route.params;

  useEffect(() => {
    if (route.params.mode === 'editAdd') {
      seteditAdd(true);
      featchOutboundContentList(route.params.editid);
    }
  }, []);

  const [contentType, setContentType] = useState('');
  const [Name, setName] = useState('');
  const [Quantity, setQuantity] = useState('1');
  const [UnitPrice, setUnitPrice] = useState('');
  const [subTotal, setSubTotal] = useState('');
  const [attachment, setAttachment] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // State to hold the uploaded file
  const [tableData, setTableData] = useState([]); // State to hold table data
  const [contentTypeList, setContentTypeList] = useState([]);
  const [selectedContentType, setSelectedContentType] = useState('');
  const [selectedUnitPrice, setSelectedUnitPrice] = useState('');
  const [selectedSubTotal, setSelectedSubTotal] = useState('');
  const [editAdd, seteditAdd] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [outboundContentList, setoutboundContentList] = useState([]);
  const [editingFromTable, setEditingFromTable] = useState(false);
  const [outBoundId, setoutBoundId] = useState('');
  const [masterid, setmasterid] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const baseUrl = appConfig.apiBaseURL;
  const courierPairapiUrl = 'PFS/ZoneCourier/GetCostListByZoneCourier';
  const SubmitapiUrl = 'pfs/api/OutboundApi/InsertOutbound';

  const navigation = useNavigation();
  const isNotReverted = status !== 'Reverted';
  useEffect(() => {
    fetchContentTypes();
  }, []);

  useEffect(() => {
    // Find the selected content type object from the list
    const selectedType = contentTypeList.find(
      item => item.Type === selectedContentType,
    );

    // Calculate unit price and sub total based on the selected content type
    const newUnitPrice = selectedType ? selectedType.Cost : 0;
    const newSubTotal = Quantity * newUnitPrice;

    // Update unit price and sub total in state
    setUnitPrice(newUnitPrice.toFixed(2));
    setSubTotal(newSubTotal.toFixed(2));
  }, [selectedContentType, Quantity]);

  useEffect(() => {
    if (outboundContentList.length !== 0) {
      setTableData(outboundContentList);
    }
  }, [outboundContentList]);

  const featchOutboundContentList = async editid => {
    const OutboundContentList = 'pfs/api/OutboundApi/GetOutboundContentList';
    try {
      const response = await axios.get(
        `${baseUrl}${OutboundContentList}?id=${editid}`,
      );
      const data = await response.data.data;
      setoutBoundId(data.find(item => item.OutboundId));

      setmasterid(data.find(item => item.Id));
      setoutboundContentList(data);
    } catch (error) {
      console.error('Error Outbound Content List:', error);
    }
  };

  const fetchContentTypes = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}${courierPairapiUrl}?zoneId=${receiverZone}&courierId=${designatedCourier}&ledgerId=${0}`,
      );
      const data = await response.data;

      setContentTypeList(data);
    } catch (error) {
      console.error('Error fetching content types:', error);
    }
  };

  const handleAddItem = () => {
    const emptyFields = [];
    if (!selectedContentType) {
      emptyFields.push('Content Type');
    }
    if (!Name) {
      emptyFields.push('Name');
    }
    if (emptyFields.length > 0) {
      Toast.show({
        type: 'warning',
        text1: 'Warning',
        text2: `Please fill in the following fields:\n${emptyFields.join(
          '\n',
        )}`,
      });
    } else {
      const newItem = {
        contentType,
        Name,
        Quantity,
        UnitPrice,
        subTotal,
        file: selectedFile ? selectedFile.name : '',
        selectedContentType,
        selectedFile,
        index: tableData.length + 1,
      };
      setTableData([...tableData, newItem]);
      // Clear form fields
      setContentType('');
      setName('');
      setQuantity('1');
      setUnitPrice('');
      setSubTotal('');
      setSelectedFile(null);
      setSelectedContentType('');
    }
  };

  const handleDeleteItem = index => {
    const newData = [...tableData];
    newData.splice(index, 1);
    setTableData(newData);
  };
  const handleExitsDeleteItem = async id => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const deleteApi = 'pfs/api/OutboundApi/DeleteContent';
              const response = await axios.post(
                `${baseUrl}${deleteApi}?id=${id}`,
              );
              if (response.status === 200) {
                Toast.show({
                  type: 'success',
                  text1: 'Success',
                  text2: 'The outbound item has been deleted successfully.',
                });
                featchOutboundContentList(route.params.editid);
              } else {
                // If deletion was not successful, show an error message
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2:
                    'Failed to delete the outbound item. Please try again.',
                });
              }
            } catch (error) {
              // If an error occurs during the deletion process, log the error and show an error message
              console.error('Error deleting outbound item:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2:
                  'An error occurred while deleting the outbound item. Please try again.',
              });
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true },
    );
  };

  const handleQuantityChange = text => {
    if (!isNaN(text)) {
      setQuantity(text);
    }
  };

  const handleFileSelect = async isCamera => {
    const options = {
      mediaType: isCamera ? 'photo' : 'video',
      quality: 1,
      saveToPhotos: true,
    };

    if (!isCamera) {
      try {
        const response = await DocumentPicker.pickSingle({
          type: [DocumentPicker.types.allFiles],
        });
        if (response.didCancel) {
          console.log('User cancelled document picker');
        } else if (response.error) {
          console.error('Error:', response.error);
        } else {
          setSelectedFile(response);

          // Optional: Handle the document (e.g., upload, display details)
          // You can access document information like name, uri, type, etc. from response
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {

    }
  };

  const handleEditItem = (rowData, index) => {
    const selectedItem = outboundContentList.find(
      item => item.Id === rowData.Id,
    );
    if (selectedItem) {
      setEditName(selectedItem.Name.toString());
      setEditQuantity(selectedItem.Quantity.toString());
      setEditingIndex(rowData.Id);
      toggleModal();
    } else {
      setEditName(rowData.Name.toString());
      setEditQuantity(rowData.Quantity);

      setEditingIndex(index);
      toggleModal();
    }
  };

  const handleSaveEdit = editingIndex => {
    const emptyFields = [];
    if (!editName) {
      emptyFields.push('Name');
    }
    if (!editQuantity) {
      emptyFields.push('Quantity');
    }
    if (emptyFields.length > 0) {
      Toast.show({
        type: 'warning',
        text1: 'Warning',
        text2: `Please fill in the following fields:\n${emptyFields.join(
          '\n',
        )}`,
      });
    }
    if (!isNaN(editingIndex)) {
      const updatedList = [...tableData];
      const selectedItems = updatedList.filter(item =>
        item.hasOwnProperty('index'),
      );
      const indexToUpdate = selectedItems.find(
        item => item.index === editingIndex + 1,
      );

      if (indexToUpdate) {
        selectedItems.Name = editName;
        selectedItems.Quantity = editQuantity;
        setTableData(selectedItems);
      } else {
        const updatedOutboundList = [...outboundContentList];
        const outboundItemIndex = updatedOutboundList.findIndex(
          item => item.Id === editingIndex,
        );

        if (outboundItemIndex !== -1) {
          updatedOutboundList[outboundItemIndex] = {
            ...updatedOutboundList[outboundItemIndex],
            Name: editName,
            Quantity: editQuantity,
          };
          setoutboundContentList(updatedOutboundList);
        }
      }
    }
    setEditingIndex(null);
    setIsModalVisible(false);
  };
  const handleSubmit = async () => {
    try {
      const model = {
        Outbound: {
          SenderId: senderId,
          Id: outBoundId.OutboundId,
          SenderName: senderName,
          SenderMobileNumber: senderMobileNumber,
          RecieverName: receiverName,
          RecieverPhoneNo: receiverMobileNumber,
          RecieverEmail: receiverEmail,
          RecieverAddress: receiverAddress,
          ZoneId: receiverZone,
          CourierId: designatedCourier,
          Status: status,
        },
        OutboundContents: tableData.map(item => ({
          Name: item.Name,
          Type: item.selectedContentType || item.Type,
          Quantity: parseInt(item.Quantity),
          UnitPrice: parseFloat(item.UnitPrice),
          CourierCost: parseInt(item.Quantity) * parseFloat(item.UnitPrice),
          Id: item.Id,
          OutboundId: outBoundId.OutboundId,
        })),
      };

      const response = await axios.post(`${baseUrl}${SubmitapiUrl}`, model);
      Toast.show({
        type: 'success',
        text1: 'success',
        text2: 'Data submitted successfully',
      });
      navigation.navigate('DataTable', { route: true });
    } catch (error) {
      console.error('Error submitting data:', error);
      Toast.show({
        type: 'error',
        text1: 'error',
        text2: 'Error submitting data',
      });
    }
  };
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>Content Type:</Text>
          <Picker
            style={styles.input}
            selectedValue={selectedContentType}
            onValueChange={value => setSelectedContentType(value)}>
            <Picker.Item label="Select Content Type" value="" />
            {contentTypeList.map((item, index) => (
              <Picker.Item key={index} label={item.Type} value={item.Type} />
            ))}
          </Picker>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            value={Name}
            onChangeText={setName}
            placeholder="Enter Name"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Quantity:</Text>
          <TextInput
            style={styles.input}
            value={Quantity}
            onChangeText={handleQuantityChange}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Unit Price:</Text>
          <Text style={styles.input}>{UnitPrice}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Sub Total:</Text>
          <Text style={styles.input}>{subTotal}</Text>
        </View>
        <View style={styles.buttonContainer}>
          {/* <Button
              title="Attachment"
              onPress={async () => handleFileSelect(false)}
            /> add-to-list */}

          <TouchableOpacity onPress={handleAddItem}>
            <Entypo name="add-to-list" color="#54875d" size={50} />
          </TouchableOpacity>
          {/* <Text style={styles.buttonAdd}>Add Item</Text> */}
        </View>
        {/* Table component */}
        <View style={styles.verticalSpace} />
        <Table
          borderStyle={{
            borderWidth: 1,
            borderColor: '#000000',
          }}>
          <Row
            data={['Type', 'Name', 'Qty', 'Price', 'Total', 'Action']}
            // textStyle={[styles.tableHeader]}
            style={styles.headStyle}
            textStyle={styles.tableText}
          />
          {tableData.map((rowData, index) => (
            <Row
              key={index}
              data={[
                rowData.selectedContentType || rowData.Type,
                rowData.Name,
                rowData.Quantity,
                rowData.UnitPrice,
                rowData.subTotal ||
                (
                  parseFloat(rowData.Quantity) * parseFloat(rowData.UnitPrice)
                ).toFixed(1),
                // rowData.file,

                <View style={[styles.editColumn]}>
                  {!rowData.index ? (
                    <TouchableOpacity
                      onPress={() => handleEditItem(rowData, index)}>
                      <MaterialCommunityIcons
                        name="pencil"
                        color="blue"
                        size={30}
                      />
                    </TouchableOpacity>
                  ) : null}
                  <View style={{ width: 30, alignItems: 'center' }} />
                  {rowData.selectedContentType ? (
                    <TouchableOpacity onPress={() => handleDeleteItem(index)}>
                      <MaterialCommunityIcons
                        name="archive-remove-outline"
                        color="red"
                        size={30}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleExitsDeleteItem(rowData.Id)}>
                      <MaterialCommunityIcons
                        name="delete"
                        color="red"
                        size={30}
                        style={styles.deleteButton}
                      />
                    </TouchableOpacity>
                  )}
                </View>,
              ]}
              textStyle={styles.tableData}
            />
          ))}
        </Table>
        {/* Modal for editing */}
        <Modal
          visible={isModalVisible}
          onRequestClose={handleCloseModal}
          transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Item</Text>
              </View>
              <Text style={styles.label}>Name:</Text>
              <TextInput
                style={styles.modalinput}
                value={editName}
                onChangeText={text => setEditName(text)}
              />
              <Text style={styles.label}>Quantity:</Text>
              <TextInput
                style={styles.modalinput}
                value={editQuantity.toString()}
                onChangeText={text => setEditQuantity(text)}
              />
              <View style={styles.verticalSpace} />
              <View style={styles.verticalSpace} />
              <View style={styles.verticalSpace} />
              <View style={styles.modelbuttonsContainer}>
                <TouchableOpacity
                  onPress={() => handleSaveEdit(editingIndex)}
                  style={[styles.button, { marginRight: 50 }]}>
                  <MaterialCommunityIcons
                    name="content-save"
                    color="#8bc63e"
                    size={30}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleCloseModal}>
                  <FontAwesome name="times" color="red" size={30} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <View style={styles.verticalSpace}></View>
        <SubmitButton title="Submit" onPress={handleSubmit} disabled={false} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  cell: {
    fontSize: 12,
    color: '#000',
    flexWrap: 'wrap',
  },
  buttonContainer: {
    alignItems: 'center',
    color: '#f58220',
  },
  buttonAdd: {
    color: '#f58220',
    fontWeight: 'bold',
    alignItems: 'center',
    flex: 1,
  },
  verticalSpace: {
    height: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
    width: '30%',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    color: '#000000',
  },
  modelbuttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
  },
  tableHeader: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
    borderRightWidth: 1,
    borderRightColor: '#fff',
  },
  tableData: {
    textAlign: 'center',
    color: '#000000',
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
    alignItems: 'center',
  },
  verticalSpace: {
    height: 10,
  },
  editColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignSelf: 'center',
    justifyContent: 'center', // Center content vertically
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: '#F2641C',
    fontSize: 100,
    height: '15%',
    width: '100%',
  },
  backButton: {
    marginRight: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    flex: 1,
  },
  modalinput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },

  headStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#ffa500',
  },
  tableText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
    borderRightWidth: 1,
  },
});

export default AddContent;
