import { StyleSheet, Text, View, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity,Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
const UploadPending = () => {
    const [uploadData, setUploadData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [surveyId, setSurveyId] = useState(null);
    useEffect(() => {
        retrieveUploadData();
    }, []);

    const retrieveUploadData = async () => {
        try {
            const storedData = await AsyncStorage.getItem('pendingFormData');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                // Check if parsedData has _parts property
                if (parsedData && Array.isArray(parsedData)) {
                    // Extract the array of parts and set it to uploadData state
                    setUploadData(parsedData);
                    console.log('parsed data',parsedData._parts)
                } else {
                    console.warn('Data retrieved from AsyncStorage has unexpected structure:', parsedData);
                }
            } else {
                console.warn('No data found in AsyncStorage.');
            }
        } catch (error) {
            console.error('Error retrieving upload data:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        retrieveUploadData();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };
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
      const uploadDataSvr = async (survey) => {
        try {
          const token = await AsyncStorage.getItem('token');
          setLoading(true);
          // console.log('token in svr survey', token)
          const formdata = new FormData();
          formdata.append('supervisor_name', survey?.supervisorName)
          formdata.append('supervisor_id', survey?.supervisorCDARID);
          formdata.append('auditor_name', survey?.auditorName);
          formdata.append('new_supervisor_name',survey?.newsupervisorName);
          formdata.append('auditor_id', survey?.auditorCDAR);
          formdata.append('new_supervisor_id',survey?.newSupervisorCDARID)
          formdata.append('new_auditor_name',survey?.newAuditorName)
          formdata.append('new_auditor_id',survey?.newAuditorCDAR)
          formdata.append('region', survey?.region);
          formdata.append('new_shop_sms',survey?.newSMSID);
          formdata.append('new_shoptype',survey?.newShopType);
          formdata.append('new_shopname',survey?.newShopName)
          formdata.append('city', survey?.cities);
          formdata.append('shop_sms', survey?.SMSId);
          formdata.append('shop_type', survey?.selectedShopType);
          formdata.append('shop_name', survey?.ShopName);
          formdata.append('previous_lat', `${findShopByLabel(survey?.ShopName)?.lat}`);
          formdata.append('previous_long', `${findShopByLabel(survey?.ShopName)?.long}`);
          formdata.append('current_lat', survey?.currentCoordinate?.latitude);
          formdata.append('current_long', survey?.currentCoordinate?.longitude);
          formdata.append('gps_location', survey?.ShopGPSLocation);
          formdata.append('mismatch_gps_reason', survey?.EnterShopGPSRecord)
          formdata.append('plan_compliance', survey?.PlanCompliance);
          formdata.append('reason_of_non_compliance', survey?.EnterPlanComplainceRecord);
          formdata.append('control_type', survey?.ControlType);
          formdata.append('reason_other_control_type', survey?.EnterControlledType);
          formdata.append('category_handling', survey?.CategoryHandling);
          formdata.append('mismatch_in_handling',survey?.EnterCategoryHandlingRecord);
          formdata.append('baby_formula', survey?.BabyFormula);
          formdata.append('baby_personal_hygiene', survey?.BabyHygeine);
          formdata.append('butter_marg', survey?.butterAmbidient);
          formdata.append('butter_marg_fresh', survey?.butterMarg);
          formdata.append('cakes_gateaux', survey?.CakeAmbident);
          formdata.append('cheese', survey?.CheseAmbdient);
          formdata.append('cheese_fresh', survey?.CheseFresh);
          formdata.append('cheese_frozen', survey?.cheseFrozen);
          formdata.append('chocolate', survey?.chocolateNovelTies);
          formdata.append('chocolate_fixed', survey?.chocolateSubsitues);
          formdata.append('cooking_oil', survey?.cookingAmbient);
          formdata.append('cosmetic', survey?.CosmeticRemoval);
          formdata.append('drinking_yogurt', survey?.DairyBaseDrinks);
          formdata.append('dairy_milk', survey?.DairyMilkAmbient);
          formdata.append('drinking_flavored', survey?.DrinksFlavouredRtd);
          formdata.append('stock_drinking_flavored', survey?.DrinksFlavouredRtdStockAvailibity);
          formdata.append('energy_drink', survey?.EnergyDrink);
          formdata.append('stock_energy_drink', survey?.EnergyDrinkStockAvailibity);
          formdata.append('facial_cleansing', survey?.facialToning);
          formdata.append('hair_care', survey?.HairCare);
          formdata.append('herbs_spices', survey?.Herbs);
          formdata.append('insect_control', survey?.InsectControl);
          formdata.append('juice', survey?.juices);
          formdata.append('stock_juice', survey?.juicesStockAvailibity);
          formdata.append('general_care', survey?.LaundharyGeneral);
          formdata.append('oral_hygiene', survey?.OralHygeine);
          formdata.append('personal_cleansing', survey?.PersonalCleaning);
          formdata.append('savoury_biscuits', survey?.SavouryBiscuits);
          formdata.append('shaving_male', survey?.ShavingDepilationMale);
          formdata.append('shaving_female', survey?.ShavingDepilationFemale);
          formdata.append('skin_conditioning', survey?.SkinConditioningMoisturing);
          formdata.append('skin_treatment', survey?.SkinTreatment);
          formdata.append('snacks', survey?.Snaks);
          formdata.append('sugar_candy', survey?.SugarCandy);
          formdata.append('sweet_biscuit', survey?.SweetBiscuit);
          formdata.append('tea', survey?.TeaInfusion);
          formdata.append('water', survey?.Water);
          formdata.append('stock_water', survey?.WaterStockAvailibity);
          formdata.append('comment', survey?.Comment);
          formdata.append("lines_checked_stock", survey?.lineCheckofStock);
          formdata.append("total_lines_done", survey?.totalNumberofLine);
          formdata.append("total_lines_checked", survey?.totalLinechecked);
          formdata.append("lines_counted_correctly", survey?.LinesCountedCorrectly);
          formdata.append("percentage_correct_lines", survey?.result1);
          formdata.append("lines_checked_Purchases", survey?.LineCheckedofPurchases);
          formdata.append("auditor_collected", survey?.auditorCollectLinePurchase);
          formdata.append("auditor_total_lines_checked", survey?.totalLinecheckedAuditor);
          formdata.append("lines_match_with_auditor_purchases", survey?.LinesPurchasesMatchwithAuditor);
          formdata.append("correct_purchases", survey?.result2);
          formdata.append("auditor_knowledge", survey?.supervisorAskQuestion);
          formdata.append("questions_asked", survey?.askquestionFromauditor);
          formdata.append("auditor_answers", survey?.auditorAnswerCorrectly);
          formdata.append("correct_answers", survey?.result3);
          formdata.append("supervisor_feedback", survey?.supervisorFeedback);
          formdata.append("auditor_comment", survey?.AuditorComment);
          formdata.append("actshop_name", survey?.EnterShopActualName);
          formdata.append("matchshop_name",survey?.ShopNameActual);
          formdata.append("name_mismatch_reason", survey?.EnterMismatchShopName)
          formdata.append("actshop_type", survey?.EnterShopActualType);
          formdata.append("matchshop_type",  survey?.ShopTypeActual);
          formdata.append('type_mismatch_reason', survey?.EnterMismatchShopType);
          // console.log('form data insvr draft ', formdata);  
          
        
          if (survey?.ShopNameActual === 'No' && !survey?.ImgUrl) {
            Alert.alert('Please take the front image before submitting.');
            return;
        }
  
        if (survey?.ShopTypeActual === 'No' && !survey?.insideImgUrl) {
            Alert.alert('Inside picture is mandatory when ShopProfile is "No". Please take a picture before submitting.');
            return;
        }
  
        if (survey?.ShopGPSLocation === 'No' && !survey?.gpsLocationImage) {
            Alert.alert('GPS Location picture is mandatory when GPS Location is "No". Please take a picture before submitting.');
            return;
        }
  
          const response = await axios.post('https://coralr.com/api/svr-store', formdata, {
            headers: {
              "Authorization": `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            }
          });
          console.log(response.data);
          setSurveyId(response.data.survey_id);
          console.log('form data in pending to upload', formdata);
          Alert.alert('Survey Data upload Successfully');
          AsyncStorage.removeItem('pendingFormData')
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
      const uploadImage = async (survey) => {
        console.log('surveys in image',survey)
        try {
            const token = await AsyncStorage.getItem('token');
            setLoading(true);
            console.log('token in image upload',token)
            // Check for mandatory images
          
            if (survey?.ShopNameActual === 'No' && !survey?.ImgUrl) {
                Alert.alert('Please take the front image before submitting.');
                return;
            }
      
            if (survey?.ShopTypeActual === 'No' && !survey?.insideImgUrl) {
                Alert.alert('Inside picture is mandatory when ShopProfile is "No". Please take a picture before submitting.');
                return;
            }
      
            if (survey?.ShopGPSLocation === 'No' && !survey?.gpsLocationImage) {
                Alert.alert('GPS Location picture is mandatory when GPS Location is "No". Please take a picture before submitting.');
                return;
            }
    
            const formData = new FormData();
            formData.append('survey_id', surveyId);
    
            // Append front image
            if (survey?.ImgUrl) {
                formData.append('front_image', {
                    uri: survey?.ImgUrl,
                    type: 'image/jpeg',
                    name: 'front_image.jpg',
                });
            }
    
            // Append inside image
            if (survey?.insideImgUrl) {
                formData.append('inside_image', {
                    uri: survey?.insideImgUrl,
                    type: 'image/jpeg',
                    name: 'inside_image.jpg',
                });
            }
    
            // Append GPS location image
            if (survey?.gpsLocationImage) {
                formData.append('current_location_image', {
                    uri: survey?.gpsLocationImage,
                    type: 'image/jpeg',
                    name: 'current_location_image.jpg',
                });
            }
    
            // Append other images
            const imageUrls = [survey?.ImgUrl1,survey?.ImgUrl2,survey?.ImgUrl3, survey?.ImgUrl4,survey?.ImgUrl5];
            for (let i = 0; i < imageUrls.length; i++) {
                const imageUrl = imageUrls[i];
                if (imageUrl) {
                    formData.append(`image_${i + 1}`, {
                        uri: imageUrl,
                        type: 'image/jpeg',
                        name: `image_${i + 1}.jpg`,
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
    useEffect((survey) => {
      if (surveyId) {
        uploadImage(survey);
      }
    }, [surveyId]);

    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            style={{ flex: 1 }}
        >
            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 200 }} />
            ) : uploadData?.length > 0 ? (
                <View style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.headerText}>Supervisor Name</Text>
                        <Text style={styles.headerText}>SMS ID</Text>
                        <Text style={styles.headerText}>Shop Name</Text>
                        <Text style={styles.headerText}>Actions</Text>
                    </View>
                    {uploadData.map((survey, index) => (
    <View style={styles.tableRow} key={index}>
        {survey.map((item, idx) => (
            <Text style={styles.tableCell} key={idx}>
                {item}
            </Text>
        ))}
        <TouchableOpacity onPress={() => uploadDataSvr(survey)}>
            <AntDesign name="upload" size={25} />
        </TouchableOpacity>
    </View>
))}
                </View>
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 250 }}>
                    <Text>No data found or data has unexpected structure</Text>
                </View>
            )}
        </ScrollView>
    );
};

export default UploadPending;

const styles = StyleSheet.create({
    tableContainer: {
        flex: 1,
        marginHorizontal: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 10,
    },
    headerText: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 10,
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
    },
});