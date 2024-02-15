import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SvrPublished = () => {
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false)
    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
        setTimeout(() => {
          setRefreshing(false);
        }, 2000)
      }
      const publishDataApiURl = `https://coralr.com/api/get-svr-data`
      const fetchData = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (token) {
            const response = await axios.get(publishDataApiURl, {
              headers: {
                "Authorization": `Bearer ${token}`
              }
            })
            
            setData(response?.data?.["Upload Survey"] || []);
          }
        } catch (error) {
          console.log('Api Response Error', error.message);
        }
      }
      useEffect(() => {
        fetchData();
      }, []);    
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
                      <Text style={{ fontWeight: '900', fontSize: 20, }}>Supervisor Name:{item.supervisor_name === 'Not Availible' ? item.new_supervisor_name:item.supervisor_name }</Text>
                      <Text style={{ fontWeight: '500', fontSize: 15, marginTop: 10 }}>Supervisor ID:{item.supervisor_id === 'Not Availible' ? item.new_supervisor_id : item.supervisor_id}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, borderBottomWidth: 0.5, borderColor: 'lightgrey', marginBottom: 10 }}>
                  <View>
                    <View>
                      <Text style={{ fontSize: 14, fontWeight: '700', marginBottom: 10 }}>Region:{item.region}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, borderBottomWidth: 0.5 }}>
                  <View style={{ marginBottom: 10 }}>
                    <Text style={{ fontWeight: '700'}}>Shop SMS ID:{item.shop_sms}</Text>
                  </View>
                  <View>
                    <Text style={{ fontWeight: '700'}}>Shop Type:{item.shop_type === 'null' ? item.new_shoptype : item.shop_type}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, borderColor: 'lightgrey', marginBottom: 10 }}>
                  <View>
                    <Text style={{ fontWeight: '700'}}>Shop Name:<Text style={{ marginBottom: 15, fontSize: 14, fontWeight: '700' }}>{item.shop_name}</Text></Text>
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
    </>
  )
}

export default SvrPublished

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
})