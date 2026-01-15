import { StyleSheet, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Home from '../Home/HomeComponent/Home';

const BusinessCardHome = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Home homeTitle="Business Card" />
        </SafeAreaView>
    );
};

export default BusinessCardHome;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
