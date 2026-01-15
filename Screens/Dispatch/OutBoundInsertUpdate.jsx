import React, {useState, useEffect} from 'react';
import {
  View,
  Button,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import appConfig from '../../app.json';
import axios from 'axios';
import {Table, Row} from 'react-native-table-component';
import Toast from 'react-native-toast-message';
import SubmitButton from '../../Components/SubmitButton';
import CustomPicker from '../../Components/CustomPicker';
import CustomPickerItem from '../../Components/CustomPickerItem';

export default function OutBoundInsertUpdate({route}) {
  const [editid, setEditid] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderMobileNumber, setSenderMobileNumber] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverMobileNumber, setReceiverMobileNumber] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [designatedCourierOptions, setDesignatedCourierOptions] = useState([]);
  const [designatedCourier, setDesignatedCourier] = useState('');
  const [receiverZoneOption, setReceiverZoneOption] = useState([]);
  const [receiverZone, setreceiverZone] = useState('');
  const [createLoad, setCreateLoad] = useState([]);
  const [editLoad, seteditLoad] = useState([]);
  const [isEdit, setisEdit] = useState(false);
  const [outboundStatusWorkflow, setOutboundStatusWorkflow] = useState([]);
  const [outboundContentList, setoutboundContentList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [senderId, setsenderId] = useState('');
  const [status, setStatus] = useState('');
  const [total, setTotal] = useState('');

  const navigation = useNavigation();
  var isNotReverted = status !== 'Reverted';

  useEffect(() => {
    if (route.name === OutBoundInsertUpdate) {
      setreceiverZone('');
      setSenderName('');
      setSenderMobileNumber('');
      setReceiverName('');
      setReceiverMobileNumber('');
      setReceiverEmail('');
      setReceiverAddress('');
      setDesignatedCourier('');
    } else {
      if (route?.params?.mode === 'edit') {
        setisEdit(true);
        const id = route.params.item.Id;
        fetchEditdata(id)
          .then(data => {
            if (data) {
              setEditid(data.Id);
              setsenderId(data.SenderId);
              setSenderName(data.SenderName);
              setSenderMobileNumber(data.SenderMobileNumber);
              setReceiverName(data.RecieverName);
              setReceiverMobileNumber(data.RecieverPhoneNo);
              setReceiverEmail(data.RecieverEmail);
              setReceiverAddress(data.RecieverAddress);
              setDesignatedCourier(data.CourierId);
              setreceiverZone(data.ZoneId);
              setDesignatedCourierOptions(data.CourierId);
              setReceiverZoneOption(data.ZoneId);
              setStatus(data.Status);
            } else {
              console.error('Error: No data fetched.');
            }
          })
          .catch(error => {
            console.error('Error fetching edit data:', error);
          });
        featchOutboundStatusWorkflow(id);
        featchOutboundContentList(id);
        setisEdit(true);
        isNotReverted = false;
      }
    }
  }, [route, editLoad]);

  useEffect(() => {
    if (designatedCourierOptions.length > 0 && isEdit) {
      setDesignatedCourier(designatedCourierOptions[0].Value);
    }
  }, [designatedCourierOptions, isEdit]);

  useEffect(() => {
    if (receiverZoneOption.length > 0 && isEdit) {
      setreceiverZone(receiverZoneOption[0].Value);
    }
  }, [receiverZoneOption, isEdit]);

  useEffect(() => {
    featchCreateLoad();
  }, []);

  useEffect(() => {
    fetchGetZonePair();
  }, []);

  useEffect(() => {
    fetchGetCourierPair();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      if (
        typeof route.params !== 'undefined' &&
        typeof route.params.item !== 'undefined'
      ) {
        // console.log('Route Params: ', route.params);
        featchOutboundContentList(route.params.item?.Id);
        featchOutboundStatusWorkflow(route.params.item?.Id);
      }
    }, []),
  );

  const baseUrl = appConfig.apiBaseURL;
  const courierPairapiUrl = 'pfs/api/OutboundApi/GetCourierPair';
  const zoneapiUrl = 'pfs/api/OutboundApi/GetZonePair';
  const createapiUrl = 'pfs/api/OutboundApi/Create';
  const editApi = 'pfs/api/OutboundApi/Edit';
  const OutboundStatusWorkflowApi =
    'pfs/api/OutboundApi/GetOutboundStatusWorkflow';
  const OutboundContentList = 'pfs/api/OutboundApi/GetOutboundContentList';

  const fetchGetCourierPair = async () => {
    try {
      const response = await axios.get(`${baseUrl}${courierPairapiUrl}`);
      const data = await response.data;
      setDesignatedCourierOptions(data);
    } catch (error) {
      console.error('Error fetching content types:', error);
    }
  };
  const fetchGetZonePair = async () => {
    try {
      const response = await axios.get(`${baseUrl}${zoneapiUrl}`);
      const data = await response.data;
      setReceiverZoneOption(data);
    } catch (error) {
      console.error('Error fetching Zone Pair:', error);
    }
  };
  const fetchEditdata = async id => {
    try {
      const response = await axios.get(`${baseUrl}${editApi}?id=${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching edit data:', error);
      throw error;
    }
  };
  const featchCreateLoad = async () => {
    try {
      const response = await axios.get(`${baseUrl}${createapiUrl}`);
      const data = await response.data;
      setCreateLoad(data);
      setSenderName(data.SenderName);
      setSenderMobileNumber(data.SenderMobileNumber);
      setsenderId(data.SenderId);
    } catch (error) {
      console.error('Error fetching Create Load:', error);
    }
  };
  const featchOutboundStatusWorkflow = async id => {
    //if (id == undefined) id = 0
    try {
      const response = await axios.get(
        `${baseUrl}${OutboundStatusWorkflowApi}?id=${id}`,
      );
      const data = await response.data;
      setOutboundStatusWorkflow(data);
    } catch (error) {
      console.error('Error Outbound Status Workflow:', error);
    }
  };
  const featchOutboundContentList = async id => {
    // if (id == undefined) id = 0
    try {
      const response = await axios.get(
        `${baseUrl}${OutboundContentList}?id=${id}`,
      );
      const data = await response.data.data;
      setoutboundContentList(data);
      setTotal(total);
      setTableData(outboundContentList);
    } catch (error) {
      console.error('Error Outbound Content List:', JSON.stringify(error));
    }
  };
  const validateAndNavigate = parameter => {
    const emptyFields = [];

    if (receiverName.trim() === '') {
      emptyFields.push('Receiver Name');
    }
    if (receiverMobileNumber.trim() === '') {
      emptyFields.push('Receiver Mobile Number');
    }
    if (receiverAddress.trim() === '') {
      emptyFields.push('Receiver Address');
    }
    if (parameter === 'save') {
      if (designatedCourier.trim() === '') {
        emptyFields.push('Designated Courier');
      }
    }
    if (designatedCourier === '') {
      emptyFields.push('Designated Courier');
    }
    if (parameter === 'save') {
      if (receiverZone.trim() === '') {
        emptyFields.push('Receiver Zone');
      }
    }
    if (receiverZone === '') {
      emptyFields.push('Receiver Zone');
    }

    if (emptyFields.length > 0) {
      // Show error message for required fields
      Toast.show({
        type: 'warning',
        text1: 'warning',
        text2: `Please fill in the following fields:\n${emptyFields.join(
          '\n',
        )}`,
      });
    } else if (parameter === 'save') {
      // Navigate to the 'AddContent' screen
      navigation.navigate('AddContent', {
        senderName,
        senderMobileNumber,
        receiverName,
        receiverMobileNumber,
        receiverEmail,
        receiverAddress,
        designatedCourier,
        designatedCourierText: designatedCourierOptions.find(
          option => option.Value === designatedCourier,
        )?.Text,
        receiverZone,
        // receiverZoneText: receiverZoneOption.find(
        //   option => option.Value === receiverZone,
        // )?.Text,
        outboundContentListParam: outboundContentList,
        senderId: senderId,
      });
    } else {
      navigation.navigate('AddContent', {
        senderName,
        senderMobileNumber,
        receiverName,
        receiverMobileNumber,
        receiverEmail,
        receiverAddress,
        designatedCourier,
        designatedCourierText: designatedCourierOptions.find(
          option => option.Value === designatedCourier,
        )?.Text,
        receiverZone,
        // receiverZoneText: receiverZoneOption.find(
        //   option => option.Value === receiverZone,
        // )?.Text,
        outboundContentListParam: outboundContentList,
        mode: 'editAdd',
        editid: editid,
        status: status,
        senderId: senderId,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Sender Name:</Text>
      <TextInput
        style={styles.input}
        value={senderName}
        onChangeText={setSenderName}
      />
      <Text style={styles.label}>Sender Mobile Number:</Text>
      <TextInput
        style={styles.input}
        value={senderMobileNumber}
        onChangeText={setSenderMobileNumber}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Receiver Name:</Text>
      <TextInput
        style={styles.input}
        value={receiverName}
        onChangeText={setReceiverName}
      />
      <Text style={styles.label}>Receiver Mobile Number:</Text>
      <TextInput
        style={styles.input}
        value={receiverMobileNumber}
        onChangeText={setReceiverMobileNumber}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Receiver Email:</Text>
      <TextInput
        style={styles.input}
        value={receiverEmail}
        onChangeText={setReceiverEmail}
        keyboardType="email-address"
      />
      <Text style={styles.label}>Receiver Address:</Text>
      <TextInput
        style={styles.input}
        value={receiverAddress}
        onChangeText={setReceiverAddress}
        multiline
      />
      <Text style={styles.label}>Designated Courier:</Text>
      {designatedCourierOptions.length > 0 && (
        // <Picker
        //   selectedValue={designatedCourier}
        //   onValueChange={(itemValue, itemIndex) =>
        //     setDesignatedCourier(itemValue)
        //   }>
        //   <Picker.Item label="Select Designated Courier" value="" />
        //   {designatedCourierOptions.map((option, index) => (
        //     <Picker.Item key={index} label={option.Text} value={option.Value} />
        //   ))}
        // </Picker>
        <CustomPicker 
          selectedValue={designatedCourierOptions?.find(ele => ele.Value == designatedCourier)?.Text}
        >
            <CustomPickerItem label="Select Designated Courier" value="" onPress={setDesignatedCourier} />
          {designatedCourierOptions.map((option, index) => (
            <CustomPickerItem key={index} label={option.Text} value={option.Value} onPress={setDesignatedCourier} />
          ))}
        </CustomPicker>
      )}
      <Text style={styles.label}>Receiver Zone:</Text>
      {receiverZoneOption.length > 0 && (
        // <Picker
        //   selectedValue={receiverZone}
        //   onValueChange={(itemValue, itemIndex) => setreceiverZone(itemValue)}>
        //   <Picker.Item label="Select Zone" value="" />
        //   {receiverZoneOption.map((option, index) => (
        //     <Picker.Item key={index} label={option.Text} value={option.Value} />
        //   ))}
        // </Picker>
        <CustomPicker 
          selectedValue={receiverZoneOption?.find(ele => ele.Value == receiverZone)?.Text}
        >
          <CustomPickerItem label="Select Zone" value="" onPress={setreceiverZone} />
          {receiverZoneOption.map((option, index) => (
            <CustomPickerItem key={index} label={option.Text} value={option.Value} onPress={setreceiverZone} />
          ))}
        </CustomPicker>
      )}
      {isEdit ? null : (
        <>
          <SubmitButton
            title="Add Content"
            onPress={() => validateAndNavigate('save')}
          />
        </>
      )}

      {/* Table component outbound Content List*/}
      {outboundContentList.length > 0 && (
        <Table
          borderStyle={{
            borderWidth: 1,
            borderColor: 'black',
            backgroundColor: '#ffa500',
          }}>
          <Row
            data={['Type', 'Name', 'Qty', 'U.Price', 'S.Total']}
            style={styles.headStyle}
            textStyle={styles.tableText}
          />
          {outboundContentList.map((rowData, index) => (
            <Row
              key={index}
              data={[
                rowData.Type,
                rowData.Name,
                rowData.Quantity,
                rowData.UnitPrice,
                (
                  parseFloat(rowData.Quantity) * parseFloat(rowData.UnitPrice)
                ).toFixed(1),
              ]}
              textStyle={styles.tableData}
            />
          ))}
        </Table>
      )}
      {outboundContentList.length > 0 && (
        <Text style={styles.total}>
          Total:{' '}
          {outboundContentList.reduce(
            (total, item) =>
              total + parseFloat(item.Quantity) * parseFloat(item.UnitPrice),
            0,
          )}
        </Text>
      )}
      <View style={styles.verticalSpace}></View>

      {!isNotReverted && isEdit && (
        <Button
          title="Edit Content"
          color="#54875d"
          onPress={() => validateAndNavigate('edit')}
        />
      )}
      {/* Table component outbound Status Workflow */}
      <View style={styles.verticalSpace} />
      {outboundStatusWorkflow.length > 0 && (
        <Table
          borderStyle={{
            borderWidth: 1,
            borderColor: 'black',
            backgroundColor: '#ffa500',
          }}>
          <Row
            data={['Status', 'U.By', 'U.Date', 'Comments']}
            style={styles.headStyle}
            textStyle={styles.tableText}
          />
          {outboundStatusWorkflow.map((rowData, index) => (
            <Row
              key={index}
              data={[
                rowData.Status,
                rowData.UserName,
                rowData.LastUpdateDate,
                rowData.Comments,
              ]}
              textStyle={styles.tableData}
            />
          ))}
        </Table>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 7,
    padding: 10,
    color: '#000000',
    marginBottom: 10,
  },
  verticalSpace: {
    height: 20,
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
    color: '#231f20',
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editColumn: {
    flex: 1,
    textAlign: 'center',
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
  total: {
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'right',
  },
});
