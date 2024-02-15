import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, RefreshControl, Button, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase/config';
import { getDocs, collection } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';

const SvrDraft = ({surveyData}) => {
  const navigation = useNavigation()
  const [retrievedSurveyData, setRetrievedSurveyData] = useState(null);
  const [retrievedImageUrls, setRetrievedImageUrls] = useState(null);
  const [displayedImages, setDisplayedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false)
  const [surveyId, setSurveyId] = useState(null);
  // const [images, setImages] = useState(null);
  const onRefresh = () => {
    setRefreshing(true);
    retrieveDataAndImages()
    setTimeout(() => {
      setRefreshing(false);
    }, 2000)
  }
  const retrieveDataAndImages = async () => {
    try {
      const storedDataAndImagesString = await AsyncStorage.getItem('dataAndImages');
      // console.log('Updated data in AsyncStorage:', storedDataAndImagesString);
      console.log('retrived data and images',retrievedSurveyData)
      if (storedDataAndImagesString !== null) {
        const storedDataAndImages = JSON.parse(storedDataAndImagesString);
        // console.log('Retrieved data and images:', storedDataAndImages);

        // Ensure the retrieved data has the expected structure
        if (Array.isArray(storedDataAndImages.surveys)) {
          setRetrievedSurveyData(storedDataAndImages.surveys);
          const images = storedDataAndImages.surveys.flatMap(survey => survey.images);
          console.log('images in svr data data', images)
          setDisplayedImages(images);
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
    retrieveDataAndImages()
  }, [])

  const findShopByLabel = (label) => {
    return shops.find(shop => shop.label === label);
  };
  const shops = [
    { label: 'ALIYAN GENERAL STORE', value: 'ALIYAN GENERAL STORE', lat: 25.36704703, long: 68.29930637 },
    { label: 'BABA G JUICE POINT', value: 'BABA G JUICE POINT', lat: 31.41370001, long: 73.11319018 },
    { label: 'QUETTA AL FAREED CAFE', value: 'QUETTA AL FAREED CAFE', lat: 33.59879203, long: 33.59879203 },
    { label: 'KARACHI BIRYANI', value: 'KARACHI BIRYANI', lat: 33.5956638, long: 73.1291651 },
    { label: 'ABBASI GENERAL STORE', value: 'ABBASI GENERAL STORE', lat: 33.7381412, long: 73.17715514 },
  ];
  const uploadDataSvr = async (surveyData, images) => {
    console.log('Debug: surveyData', surveyData);
    console.log('images in upload svr', images)
    try {
      const token = await AsyncStorage.getItem('token');
      setLoading(true);
      console.log('token in svr survey svr data', token)
      const formdata = new FormData();
      formdata.append('supervisor_name', surveyData?.supervisorName)
      formdata.append('supervisor_id', surveyData?.supervisorCDARID);
      formdata.append('auditor_name', surveyData?.auditorName);
      formdata.append('new_supervisor_name', surveyData?.newsupervisorName);
      formdata.append('auditor_id', surveyData?.auditorCDAR);
      formdata.append('new_supervisor_id', surveyData?.newSupervisorCDARID)
      formdata.append('new_auditor_name', surveyData?.newAuditorName)
      formdata.append('new_auditor_id', surveyData?.newAuditorCDAR)
      formdata.append('region', surveyData?.region);
      formdata.append('new_shop_sms', surveyData?.newSMSID);
      formdata.append('new_shoptype', surveyData?.newShopType);
      formdata.append('new_shopname', surveyData?.newShopName)
      formdata.append('city', surveyData?.cities);
      formdata.append('shop_sms', surveyData?.SMSId);
      formdata.append('shop_type', surveyData?.selectedShopType);
      formdata.append('shop_name', surveyData?.ShopName);
      formdata.append('previous_lat', `${findShopByLabel(surveyData?.ShopName)?.lat}`);
      formdata.append('previous_long', `${findShopByLabel(surveyData?.ShopName)?.long}`);
      formdata.append('current_lat', surveyData?.currentCoordinate.latitude);
      formdata.append('current_long', surveyData?.currentCoordinate.longitude);
      formdata.append('gps_location', surveyData?.ShopGPSLocation);
      formdata.append('mismatch_gps_reason', surveyData?.EnterShopGPSRecord)
      formdata.append('plan_compliance', surveyData?.PlanCompliance);
      formdata.append('reason_of_non_compliance', surveyData?.EnterPlanComplainceRecord);
      formdata.append('control_type', surveyData?.ControlType);
      formdata.append('reason_other_control_type', surveyData?.EnterControlledType);
      formdata.append('category_handling', surveyData?.CategoryHandling);
      formdata.append('mismatch_in_handling', surveyData?.EnterCategoryHandlingRecord);
      formdata.append('baby_formula', surveyData?.BabyFormula);
      formdata.append('baby_personal_hygiene', surveyData?.BabyHygeine);
      formdata.append('butter_marg', surveyData?.butterAmbidient);
      formdata.append('butter_marg_fresh', surveyData?.butterMarg);
      formdata.append('cakes_gateaux', surveyData?.CakeAmbident);
      formdata.append('cheese', surveyData?.CheseAmbdient);
      formdata.append('cheese_fresh', surveyData?.CheseFresh);
      formdata.append('cheese_frozen', surveyData?.cheseFrozen);
      formdata.append('chocolate', surveyData?.chocolateNovelTies);
      formdata.append('chocolate_fixed', surveyData?.chocolateSubsitues);
      formdata.append('cooking_oil', surveyData?.cookingAmbient);
      formdata.append('cosmetic', surveyData?.CosmeticRemoval);
      formdata.append('drinking_yogurt', surveyData?.DairyBaseDrinks);
      formdata.append('dairy_milk', surveyData?.DairyMilkAmbient);
      formdata.append('drinking_flavored', surveyData?.DrinksFlavouredRtd);
      formdata.append('stock_drinking_flavored', surveyData?.DrinksFlavouredRtdStockAvailibity);
      formdata.append('energy_drink', surveyData?.EnergyDrink);
      formdata.append('stock_energy_drink', surveyData?.EnergyDrinkStockAvailibity);
      formdata.append('facial_cleansing', surveyData?.facialToning);
      formdata.append('hair_care', surveyData?.HairCare);
      formdata.append('herbs_spices', surveyData?.Herbs);
      formdata.append('insect_control', surveyData?.InsectControl);
      formdata.append('juice', surveyData?.juices);
      formdata.append('stock_juice', surveyData?.juicesStockAvailibity);
      formdata.append('general_care', surveyData?.LaundharyGeneral);
      formdata.append('oral_hygiene', surveyData?.OralHygeine);
      formdata.append('personal_cleansing', surveyData?.PersonalCleaning);
      formdata.append('savoury_biscuits', surveyData?.SavouryBiscuits);
      formdata.append('shaving_male', surveyData?.ShavingDepilationMale);
      formdata.append('shaving_female', surveyData?.ShavingDepilationFemale);
      formdata.append('skin_conditioning', surveyData?.SkinConditioningMoisturing);
      formdata.append('skin_treatment', surveyData?.SkinTreatment);
      formdata.append('snacks', surveyData?.Snaks);
      formdata.append('sugar_candy', surveyData?.SugarCandy);
      formdata.append('sweet_biscuit', surveyData?.SweetBiscuit);
      formdata.append('tea', surveyData?.TeaInfusion);
      formdata.append('water', surveyData?.Water);
      formdata.append('stock_water', surveyData?.WaterStockAvailibity);
      formdata.append('comment', surveyData?.Comment);
      formdata.append("lines_checked_stock", surveyData?.lineCheckofStock);
      formdata.append("total_lines_done", surveyData?.totalNumberofLine);
      formdata.append("total_lines_checked", surveyData?.totalLinechecked);
      formdata.append("lines_counted_correctly", surveyData?.LinesCountedCorrectly);
      formdata.append("percentage_correct_lines", surveyData?.result1);
      formdata.append("lines_checked_Purchases", surveyData?.LineCheckedofPurchases);
      formdata.append("auditor_collected", surveyData?.auditorCollectLinePurchase);
      formdata.append("auditor_total_lines_checked", surveyData?.totalLinecheckedAuditor);
      formdata.append("lines_match_with_auditor_purchases", surveyData?.LinesPurchasesMatchwithAuditor);
      formdata.append("correct_purchases", surveyData?.result2);
      formdata.append("auditor_knowledge", surveyData?.supervisorAskQuestion);
      formdata.append("questions_asked", surveyData?.askquestionFromauditor);
      formdata.append("auditor_answers", surveyData?.auditorAnswerCorrectly);
      formdata.append("correct_answers", surveyData?.result3);
      formdata.append("supervisor_feedback", surveyData?.supervisorFeedback);
      formdata.append("auditor_comment", surveyData?.AuditorComment);
      formdata.append("actshop_name", surveyData?.EnterShopActualName);
      formdata.append("matchshop_name", surveyData?.ShopNameActual);
      formdata.append("name_mismatch_reason", surveyData?.EnterMismatchShopName)
      formdata.append("actshop_type", surveyData?.EnterShopActualType);
      formdata.append("matchshop_type", surveyData?.ShopTypeActual);
      formdata.append('type_mismatch_reason', surveyData?.EnterMismatchShopType);
      // console.log('form data insvr draft ', formdata);  
      console.log('shop gps location', surveyData?.ShopGPSLocation,);
      if (surveyData?.ShopNameActual === 'No' && !images?.ImgUrl) {
        Alert.alert('Please take the front image before submitting.');
        return;
      }
      
      if (surveyData?.ShopTypeActual === 'No' && !images?.insideImgUrl) {
        Alert.alert('Inside picture is mandatory when ShopProfile is "No". Please take a picture before submitting.');
        return;
      }
      
      if (surveyData?.ShopGPSLocation === 'No' && !images?.gpsLocationImage) {
        console.log('shopgps in if condition', surveyData?.ShopGPSLocation);
        console.log('image urls in if condition', images);
        Alert.alert('GPS Location picture is mandatory when GPS Location is "No". Please take a picture before submitting.');
        return;
      }
      const formData = new FormData();
      formData.append('survey_id', surveyId);

      if (images?.ImgUrl) {
        formData.append('front_image', {
          uri: images?.ImgUrl,
          type: 'image/jpeg',
          name: 'image.jpg',
        });
      }
      if (images?.insideImgUrl) {
        formData.append('inside_image', {
          uri: images?.insideImgUrl,
          type: 'image/jpeg',
          name: 'image.jpg',
        });
      }
      if (images?.gpsLocationImage) {
        formData.append('current_location_image', {
          uri: images?.gpsLocationImage,
          type: 'image/jpeg',
          name: 'image.jpg',
        });
      }
      const imageUrls = [images?.ImgUrl1, images?.ImgUrl2, images?.ImgUrl3, images?.ImgUrl4, images?.ImgUrl5];
      for (let i = 1; i <= imageUrls.length; i++) {
        const imageUrl = imageUrls[i - 1];
        if (imageUrl) {
          formData.append(`image_${i}`, {
            uri: imageUrl,
            type: 'image/jpeg',
            name: 'image.jpg',
          });
        }
      }
      // setImages(images);
      const response = await axios.post('https://coralr.com/api/svr-store', formdata, {
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      console.log(response.data);
      setSurveyId(response.data.survey_id);
      AsyncStorage.removeItem('dataAndImages');
      if (surveyId) {
        console.log('images in useEffect',);
       await uploadImage(surveyData,images,surveyData?.ShopGPSLocation);
      }
      setRetrievedSurveyData(prevData => prevData.filter(item => item.surveyData.SMSId !== surveyData.SMSId));
      console.log('form data in draft to upload', formdata);
      Alert.alert('Survey Data upload Successfully')
      console.log('form data ', formdata);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error.message);
      } else {
        console.error('Error:', error);
      }
    }
    finally {
      setLoading(false);
    }
  }
  const storeImageAPIURL = 'https://coralr.com/api/svr-imageUpload'
  const uploadImage = async (surveyData, images,ShopGPSLocation) => {
    console.log('ShopGPSLocation in upload value :',ShopGPSLocation);
    console.log('Images in upload image function:', images);

    try {
      const token = await AsyncStorage.getItem('token');
      console.log('token in upload image', token);
      setLoading(true);
      if (surveyData?.ShopNameActual === 'No' && !images?.ImgUrl) {
        Alert.alert('Please take the front image before submitting.');
        return;
      }
      
      if (surveyData?.ShopTypeActual === 'No' && !images?.insideImgUrl) {
        Alert.alert('Inside picture is mandatory when ShopProfile is "No". Please take a picture before submitting.');
        return;
      }
      
      if (surveyData?.ShopGPSLocation === 'No' && !images?.gpsLocationImage) {
        console.log('shopgps in if condition', surveyData?.ShopGPSLocation);
        console.log('image urls in if condition', images);
        Alert.alert('GPS Location picture is mandatory when GPS Location is "No". Please take a picture before submitting.');
        return;
      }
      const formData = new FormData();
      formData.append('survey_id', surveyId);

      if (images?.ImgUrl) {
        formData.append('front_image', {
          uri: images?.ImgUrl,
          type: 'image/jpeg',
          name: 'image.jpg',
        });
      }
      if (images?.insideImgUrl) {
        formData.append('inside_image', {
          uri: images?.insideImgUrl,
          type: 'image/jpeg',
          name: 'image.jpg',
        });
      }
      if (images?.gpsLocationImage) {
        formData.append('current_location_image', {
          uri: images?.gpsLocationImage,
          type: 'image/jpeg',
          name: 'image.jpg',
        });
      }
      const imageUrls = [images?.ImgUrl1, images?.ImgUrl2, images?.ImgUrl3, images?.ImgUrl4, images?.ImgUrl5];
      for (let i = 1; i <= imageUrls.length; i++) {
        const imageUrl = imageUrls[i - 1];
        if (imageUrl) {
          formData.append(`image_${i}`, {
            uri: imageUrl,
            type: 'image/jpeg',
            name: 'image.jpg',
          });
        }
      }


      const response = await axios.post(storeImageAPIURL, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);

      if (response) {
        console.log('Image upload was successful.');
        Alert.alert('Image upload was successful.');
      } else {
        console.log('Image upload response is undefined.');
      }
    } catch (error) {
      console.log('Error in API request:', error.message);
      console.log('API error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };
  
  
  // useEffect(() => {
  //   if (surveyId) {
  //     console.log('images in useEffect',);
  //     uploadImage();
  //   }
  // }, [surveyId]);
  // useEffect(() => {
  //   if (surveyId && retrievedSurveyData && displayedImages) {
  //     // Assuming retrievedSurveyData and displayedImages are arrays of objects containing survey data and images respectively
  //     retrievedSurveyData.forEach(surveyData => {
  //       // Find the corresponding images for this survey data
  //       const imagesForSurvey = displayedImages.find(img => img.SMSId === surveyData.SMSId);
  //       if (imagesForSurvey) {
  //         uploadImage(surveyData, imagesForSurvey); // Pass surveyData and corresponding images
  //       }
  //     });
  //   }
  // }, [surveyId, retrievedSurveyData, displayedImages]);
  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}
      style={{ flex: 1 }}
    />}>
      {/* <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '700', marginTop: 20 }}>Survey Draft Data:</Text> */}
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 200 }} />
      ) : (

        retrievedSurveyData && retrievedSurveyData.length > 0 ? (
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                {/* {displayedImages.map((imageUrl, index) => {
    console.log(imageUrl)
    // <Image key={index} style={{ width: 100, height: 100, margin: 5 }} source={{ uri: imageUrl }} />
   })} */}
              </View>
              <Text style={styles.headerText}>Supervisor Name</Text>
              <Text style={styles.headerText}>SMS ID</Text>
              <Text style={styles.headerText}>Shop Name</Text>
              <Text style={styles.headerText}>Actions</Text>
            </View>
            {retrievedSurveyData.map((survey, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCell}>{survey?.surveyData?.supervisorName === 'Not Availible' ? survey?.surveyData?.new_supervisor_name : survey?.surveyData?.supervisorName}</Text>
                <Text style={styles.tableCell}>{survey?.surveyData?.SMSId}</Text>
                <Text style={styles.tableCell}>{survey?.surveyData?.ShopName}</Text>
                {/* Add your actions here, e.g., upload button */}
                <TouchableOpacity onPress={() => uploadDataSvr(survey.surveyData, survey.images)}>
                  <AntDesign name='upload' size={25} />
                </TouchableOpacity>
              </View>
              //             <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              //   {displayedImages.map((imageUrl, index) => (
              //     <Image key={index} style={{ width: 100, height: 100, margin: 5 }} source={{ uri: imageUrl }} />
              //   ))}
              // </View>
            ))}
          </View>

        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 250 }}>
            <Text>No data and images found or data has unexpected structure</Text>
          </View>
        )
      )}
    </ScrollView>
  )
}

export default SvrDraft

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
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
    fontWeight: '500'
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
}) 