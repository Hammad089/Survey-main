import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Button, SafeAreaView, ScrollView ,Image} from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase/config';
import { getDocs, collection } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
const DisplayDataAndImages = () => {
    const navigation = useNavigation()
    const [retrievedSurveyData, setRetrievedSurveyData] = useState(null);
    const [retrievedImageUrls, setRetrievedImageUrls] = useState(null);
    const [loading, setLoading] = useState(true);
  
    const retrieveDataAndImages = async () => {
      try {
        const storedDataAndImagesString = await AsyncStorage.getItem('dataAndImages');
  
        if (storedDataAndImagesString !== null) {
          const storedDataAndImages = JSON.parse(storedDataAndImagesString);
          console.log('Retrieved data and images:', storedDataAndImages);
  
          // Ensure the retrieved data has the expected structure
          if (Array.isArray(storedDataAndImages.images)) {
            setRetrievedSurveyData(storedDataAndImages.surveyData);
            setRetrievedImageUrls(storedDataAndImages.images);
          } else {
            console.log('Retrieved data has unexpected structure');
          }
        } else {
          console.log('No data and images found in local storage');
        }
  
        setLoading(false);
      } catch (error) {
        console.error('Error retrieving data and images:', error);
      }
    };
  
    useEffect(() => {
      retrieveDataAndImages();
    }, []);
  
    return (
        <>
     <ScrollView>
  <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '700', marginTop: 20 }}>Survey Draft Data:</Text>
  {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 200 }} />
        ) : (
          retrievedSurveyData && retrievedImageUrls ? (
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={styles.headerText}>Supervisor Name</Text>
                <Text style={styles.headerText}>SMS ID</Text>
                <Text style={styles.headerText}>Shop Name</Text>
                <Text style={styles.headerText}>Actions</Text>
              </View>
              <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{JSON.stringify(retrievedSurveyData.supervisorName)}</Text>
              <Text style={styles.tableCell}>{JSON.stringify(retrievedSurveyData.SMSId)}</Text>
              <Text style={styles.tableCell}>{JSON.stringify(retrievedSurveyData.ShopName)}</Text>
              <Button title='Upload data'/>
            </View>
            </View>
          ) : (
            <Text>No data and images found or data has unexpected structure</Text>
          )
        )}
</ScrollView>
<TouchableOpacity onPress={() => navigation.navigate('hard-coded')} style={{ width: '100%', height: 50, backgroundColor: '#39b24a', borderRadius: 10, position: 'absolute', bottom: 0 }}>
  <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '700', color: '#fff', marginTop: 10 }}>Start New Survey</Text>
</TouchableOpacity>
</>
);
};

export default DisplayDataAndImages;

const styles = StyleSheet.create({
    container: {
        marginTop:15,
        alignSelf: 'center',
        backgroundColor: 'white',
        width: '100%',
        height: '70%',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowColor: 'black',
        shadowOpacity: 0.24,
        shadowRadius: 10,
        elevation: 5,
        borderRadius: 10
    },
    headerText: {
      textAlign: 'center',
      fontSize: 13,
      fontWeight: '700',
      marginTop: 15,
    },
    tableContainer: {
      margin: 10,
    },
    tableHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      paddingBottom: 3,
    },
    tableRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      paddingBottom: 5,
      paddingTop: 5,
    },
    tableCell: {
      flex: 1,
      fontSize: 13,
      color: 'black',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight:'500'
    },
    uploadButton: {
      backgroundColor: '#39b24a',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 15,
    },
    uploadButtonText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#fff',
    },
});
