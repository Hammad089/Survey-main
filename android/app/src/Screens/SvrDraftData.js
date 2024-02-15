import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, RefreshControl, Button, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase/config';
import { getDocs, collection } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native'
import SvrDraft from './SvrDraft';
import SvrPublished from './SvrPublished';
import UploadPending from './UploadPending';
const Tab = createMaterialTopTabNavigator();
const DisplayDataAndImages = ({navigation}) => {
 
  return (
    <>
      <Tab.Navigator
      >
        <Tab.Screen
          name='Draft'
          component={SvrDraft}
          options={{
            tabBarLabelStyle: { fontSize: 14, fontWeight: '500', color: 'red' }
          }}
        />
        <Tab.Screen
          name='Published'
          component={SvrPublished}
          options={{
            tabBarLabelStyle: { fontSize: 14, fontWeight: '500', color: 'green' }
          }}
        />
        <Tab.Screen
          name='pending'
          component={UploadPending}
          options={{
            tabBarLabelStyle: { fontSize: 14, fontWeight: '500', color: 'green' }
          }}
        />
      </Tab.Navigator>
      <TouchableOpacity onPress={() => navigation.navigate('hard-coded')} style={{ width: '100%', height: 50, backgroundColor: '#39b24a', borderRadius: 10, position: 'absolute', bottom: 0 }}>
        <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '700', color: '#fff', marginTop: 10 }}>Start New Survey</Text>
      </TouchableOpacity>
    </>
  );
};

export default DisplayDataAndImages;

const styles = StyleSheet.create({

});


{/*  */}