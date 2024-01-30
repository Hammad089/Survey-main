import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
export default function Published({ navigation, route }) {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000)
  }

  const { itemID, province, city, tehsil, district, districtCode, locationName, tehsilCode, chargeCode, assignment_moodifiedID, AssignID, latitude, longitude, geomapId } = route.params;
  console.log('data from  circle 104', province, city, tehsil, district, districtCode, locationName, chargeCode, assignment_moodifiedID, AssignID, latitude, longitude, geomapId);
  const publishDataApiURl = `https://coralr.com/api/recent-outlets?task_id=${itemID}&assignment_id=${AssignID}&geomap_id=${geomapId}`
  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await axios.get(publishDataApiURl, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        console.log(response.data?.data);
        setData(response.data?.data)
      }
    } catch (error) {
      console.log('Api Response Error', error.message);
    }
  }
  useEffect(() => {
    fetchData();
  }, [itemID, AssignID, geomapId]);
  return (
    <>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}
        style={{ flex: 1 }}
      />}>
        {
          data.length > 0 ? (data.map((item, index) => {
            return (

              <View style={styles.CardsContainer} key={item.id}>
                <TouchableOpacity onPress={() => { }}>
                  <View style={{ flexDirection: 'row', columnGap: 10, borderColor: 'lightgrey' }}>
                    <View style={styles.circle}></View>
                    <View>
                      <Text style={{ color: 'blue', fontSize: 18, fontWeight: '700', marginBottom: 10 }}>{item.outlet_code}</Text>
                      <Text style={{ fontWeight: '900', fontSize: 20, }}>{item.outlet_name}</Text>
                      <Text style={{ fontWeight: '500', fontSize: 15, marginTop: 10 }}>{item.full_address}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, borderBottomWidth: 0.5, borderColor: 'lightgrey', marginBottom: 10 }}>
                  <View>
                    <View>
                      <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 10 }}>Date:{item.updated_date}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, borderBottomWidth: 0.5 }}>
                  <View style={{ marginBottom: 10 }}>
                    <Text>Start Time:{item.start_time}</Text>
                  </View>
                  <View>
                    <Text>End Time:{item.end_time}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, borderColor: 'lightgrey', marginBottom: 10 }}>
                  <View>
                    <Text>Time Spend:<Text style={{ marginBottom: 15, fontSize: 14, fontWeight: '500' }}>{item.duration}</Text></Text>
                  </View>
                </View>
              </View>

            )
          })
          ) : (
            <ActivityIndicator size="large" style={{ marginTop: 150, alignSelf: 'center' }} />
          )
        }
      </ScrollView>
      <View>
        <Button title="Start New Survey" color='#39b24a' onPress={() => navigation.navigate('Survey', { itemId: itemID, Province: province, City: city, District: district, Tehsil: tehsil, DistrictCode: districtCode, LocationName: locationName, TehsilCode: tehsilCode, Chargecode: chargeCode, assignment_moodifiedID: assignment_moodifiedID, latitude: latitude, longitude: longitude, AssignID: AssignID })} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  CardsContainer: {
    marginTop: 10,
    backgroundColor: 'white',
    padding: 15,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 100 / 2,
    backgroundColor: 'green',
  },
});
