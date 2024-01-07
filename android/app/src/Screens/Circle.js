import { View, Text, StyleSheet, TouchableOpacity, Button, ScrollView, Image, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import LocationIcon from 'react-native-vector-icons/Ionicons'
import { Box, Heading, Menu, AspectRatio, Center, HStack, Stack, NativeBaseProvider, Pressable } from "native-base";
import FeatherIcon from 'react-native-vector-icons/Feather';
import ProjectIcon from 'react-native-vector-icons/Octicons'
import MessageIcon from 'react-native-vector-icons/AntDesign'
import PerformanceIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import ProfileIcon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
export default function Circle({ navigation }) {
  const [assignmentCircle, setAssignmentCircle] = useState([]);
  const [assignment_moodifiedID, setAssignmentMoodifiedID] = useState(null);
  const [data, setData] = useState({})
  const route = useRoute();
  const apiURL = 'https://coralr.com/api/profile';
  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await axios.post(apiURL, {}, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        console.log('API Response', response.data)
        setData(response.data.data);
        console.log(response.data.data.name)

      }
    } catch (error) {
      console.log('API Response Error', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  const asignmentID = route.params?.AssignmentsID;
  console.log('assignmentID in circle', asignmentID);
  const itemId = route.params?.ItemId;
  const assignment_modified_id = route.params?.AssignmentModifiedID;
  console.log('assignment modified', assignment_modified_id)
  console.log('task id in circle', itemId);
  ////
  const assignment_circleApiURL = `https://coralr.com/api/assignment-circles?assignment_id=${asignmentID}&task_id=${itemId}`;

  const fetchAssignmentCircle = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log('token in assignment circle', token)
    if (token) {
      try {
        const response = await axios.get(assignment_circleApiURL, {
          headers: {
            "Authorization": `Bearer ${token}`
          },
          params: {
            assignment_id: asignmentID,
            task_id: itemId
          }
        })
        console.log(response.data)
        setAssignmentCircle(response.data?.multi_circles);
        setAssignmentMoodifiedID(response.data?.assignment_modified_id);
      } catch (error) {
        console.log('ERROR in cicle Assignment API', error.message)
      }

    }
  }

  useEffect(() => {
    fetchAssignmentCircle();
  }, [])

  ////logout api
  const LogoutapiURL = 'https://coralr.com/api/logout';
  const LogoutHandling = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token received in Dashboard logout functionality', token);

      if (token) {
        const response = await axios.post(
          LogoutapiURL,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        console.log(response.data);

        if (response.data.status === 'success') {
          await AsyncStorage.removeItem('token');
          console.log('Logout successful');
          navigation.navigate('Login');
        } else {
          console.log('Logout failed');
        }
      } else {
        console.log('Token not found, cannot logout');
      }
    } catch (error) {
      console.log('Error during logout:', error.message);
    }
  };
  return (
    <>
      <View style={styles.subContainer}>
        <NativeBaseProvider>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
            <View>
              <Box>
                <Menu trigger={triggerProps => {
                  return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                    <FeatherIcon name='menu' size={33} color='white' style={styles.MenuIcon} />
                  </Pressable>;
                }}>
                  <Menu.Item onPress={() => navigation.navigate('DashboardScreen')} style={{ width: '100%', height: '30%', borderRadius: 5, marginBottom: 10 }}>
                    <ProjectIcon name='project' size={20} />
                    <Text style={{ fontSize: 15, fontWeight: '500' }}> Project</Text>
                  </Menu.Item>
                  <Menu.Item onPress={() => navigation.navigate('Performance')} style={{ width: '100%', height: '25%', borderRadius: 5, marginBottom: 10, }}>
                    <PerformanceIcon name='presentation' size={20} />
                    <Text style={{ fontSize: 15, fontWeight: '500' }}>Performance</Text>
                  </Menu.Item>
                  <Menu.Item onPress={() => navigation.navigate('Message')} style={{ width: '100%', height: '25%', borderRadius: 5, marginBottom: 10 }}>
                    <MessageIcon name='message1' size={20} />
                    <Text style={{ fontSize: 15, fontWeight: '500' }}> Message</Text>
                  </Menu.Item>
                </Menu>
              </Box>
            </View>
            <View>
              <Text style={{ fontSize: 18, color: 'white', fontWeight: '700' }}>{assignment_moodifiedID}</Text>
            </View>
            <View>
              <Box>
                <Menu trigger={triggerProps => {
                  return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                    <Image source={{ uri: `https://coralr.com/${data.image}` }} style={{ width: 35, height: 35, borderRadius: 50, backgroundColor: '#1e76ba' }} />
                  </Pressable>;
                }}>
                  <Menu.Item onPress={() => navigation.navigate('Profile')}>
                    <ProfileIcon name='user' size={20} />
                    <Text style={{ alignItems: 'center' }}>Profile</Text>
                    {/* <Text style={{ fontSize:15, fontWeight:'500'}}> Profile</Text> */}
                  </Menu.Item>
                  <Menu.Item>
                    <FeatherIcon name='power' size={20} />
                    <TouchableOpacity onPress={LogoutHandling}>
                      <Text style={{ alignItems: 'center' }}>Logout</Text>
                    </TouchableOpacity>
                  </Menu.Item>
                </Menu>
              </Box>
            </View>
          </View>
        </NativeBaseProvider>
      </View>
      {
        assignmentCircle && assignmentCircle.length > 0 ? (assignmentCircle.map((item, index) => {
          const locationType = item.location_type.charAt(0).toUpperCase() + item.location_type.slice(1);
          return (
            <>
              <View style={styles.Cards} key={item.id}>
                <TouchableOpacity onPress={() => navigation.navigate('Circle-104', { itemID: itemId, asignmentID: asignmentID, assignment_moodifiedID: assignment_moodifiedID })}>
                  <Text style={{ fontSize: 25, color: '#87CEEB', fontWeight: '600' }}>{locationType}</Text>
                  <View>
                    <Text style={{ fontSize: 18, fontWeight: '500', marginTop: 10, borderBottomWidth: 0.5, borderColor: 'lightgrey' }}>{item.Location_path}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                    <View>
                      <Text>Total Outlet:{item.total_outlets}</Text>
                    </View>
                    <View>
                        <View style={{ flexDirection: 'row', columnGap: 10 }}>
                          {/* <View>
                            <Button title='Get Direction' color='green' onPress={ handleDirection} />
                            {
                              showmap && (
                                <View style={styles.containers}>
                                <MapView
                                  style={styles.mapStyle}
                                  initialRegion={{
                                    latitude: 37.78825,
                                    longitude: -122.4324,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                  }}
                                  customMapStyle={mapStyle}>
                                  <Marker
                                    draggable
                                    coordinate={{
                                      latitude: 37.78825,
                                      longitude: -122.4324,
                                    }}
                                    onDragEnd={
                                      (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
                                    }
                                    title={'Test Marker'}
                                    description={'This is a description of the marker'}
                                  />
                                </MapView>
                              </View>
                              )
                            }
                          </View> */}
                        </View>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                    <View>
                      <Text>Outlets Completed:{item.completed_outlets}</Text>
                    </View>
                    <View>
                      <Text>Outlets Terminated:{item.noncooperative_outlets}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                    <View>
                      <Text>Outlets Draft:<Text style={{ color: 'red', marginBottom: 15, fontWeight: '500', fontSize: 14 }}>0</Text></Text>
                    </View>
                    <View>
                      <Text>Outlets Re-Assigned:<Text style={{ color: 'green', marginBottom: 15, fontWeight: '500', fontSize: 14 }}>{item.reassigned_outlets}</Text></Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )
        })
        ) : (
          <>
            <ActivityIndicator size="large" style={{ marginTop: 200, alignSelf: 'center' }} />
          </>
        )
      }

    </>
  );
}
const mapStyle = [
  {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{color: '#263c3f'}],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{color: '#6b9a76'}],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{color: '#38414e'}],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{color: '#212a37'}],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{color: '#9ca5b3'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{color: '#746855'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{color: '#1f2835'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{color: '#f3d19c'}],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{color: '#2f3948'}],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{color: '#17263c'}],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{color: '#515c6d'}],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{color: '#17263c'}],
  },
];
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e76ba',
    alignItems: 'center',
    width: '100%',
    height: '6%',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  Cards: {
    backgroundColor: 'white',
    marginTop: 15,
    padding: 25,
    borderRadius: 10,
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
    backgroundColor: 'darkred',
  },
  subContainer: {
    backgroundColor: '#1e76ba',
    height: 60,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  containers: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});