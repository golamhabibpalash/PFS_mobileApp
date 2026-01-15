import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, TextInput, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DataTable from './DispatchComponant/DataTable';
import axios from 'axios';
import {Button} from 'react-native-elements';

export default function OutBoundList() {
  const [senderName, setSenderName] = useState('');
  const [senderMobileNumber, setSenderMobileNumber] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverMobileNumber, setReceiverMobileNumber] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [dispatchType, setDispatchType] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [data, setData] = useState([]);



  return (
    <>
      <DataTable data={data} />
    </>
  );
}


