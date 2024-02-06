import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Button, PermissionsAndroid, Alert, ActivityIndicator,Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import Dropdown from 'react-native-input-select';
import AttachmentIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import haversine from 'haversine';
import { useToast } from "react-native-toast-notifications";
import axios from 'axios';
import {request, PERMISSIONS} from 'react-native-permissions';
import { db, storage } from '../../../../firebase/config';
import { addDoc, collection, } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, uploadString } from "firebase/storage";

const requestLocationPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Geolocation Permission',
                message: 'Can we access your location?',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        console.log('granted', granted);
        if (granted === 'granted') {
            console.log('You can use Geolocation');
            return true;
        } else {
            console.log('You cannot use Geolocation');
            return false;
        }
    } catch (err) {
        return false;
    }
};
export default function HardCodedSurvey() {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [supervisorName, setSuperVisorName] = React.useState();
    const [newsupervisorName,setNewSupervisiorName] = React.useState()
    const [supervisorCDARID, setsupervisorCDARID] = React.useState();
    const [newSupervisorCDARID,setNewSupervisorCDARID] = React.useState()
    const [auditorName, setauditorName] = React.useState();
    const [newAuditorName,setNewAuditorName] = React.useState()
    const [auditorCDAR, setAuditorCDAR] = React.useState();
   const [newAuditorCDAR,setNewAuditorCDAR] = React.useState();
    const [region, setRegion] = React.useState();
    const [cities, setCities] = React.useState();
    const [SMSId, setSMSId] = React.useState();
    const [newSMSID,setNewSMSID] = React.useState();
    const [ShopName, setShopName] = React.useState();
    const [ImgUrl, setImgUrl] = useState(null);
    const [ImgUrl1, setImgUrl1] = useState(null);
    const [ImgUrl2, setImgUrl2] = useState(null);
    const [ImgUrl3, setImgUrl3] = useState(null);
    const [ImgUrl4, setImgUrl4] = useState(null);
    const [ImgUrl5, setImgUrl5] = useState(null);
    const [ShopGPSLocation, setShopGPSLocation] = React.useState('No');
    const [EnterShopGPSRecord, setEnterShopGPSRecord] = useState();
    const [ControlType, setControlType] = React.useState();
    const [EnterControlledType, setEnterControlledType] = useState();
    const [lineCheckofStock, setLineCheckofStock] = React.useState();
    const [totalNumberofLine, setTotalNumberofLines] = React.useState();
    const [totalLinechecked, setTotalLineChecked] = React.useState();
    const [LinesCountedCorrectly, setLinesCountedCorrectly] = React.useState();
    const [LineCheckedofPurchases, setLineCheckofPurchases] = React.useState();
    const [auditorCollectLinePurchase, setAuditorCollectedLinesPurchase] = React.useState();
    const [totalLinecheckedAuditor, setTotalLineCheckedAuditor] = React.useState();
    const [LinesPurchasesMatchwithAuditor, setLinesPurchasesMatchwithAuditor] = React.useState();
    const [supervisorAskQuestion, setSupervisorAskQuestion] = useState();
    const [askquestionFromauditor, setAskQuestionfromAuditor] = useState();
    const [auditorAnswerCorrectly, setAnswerAuditorCorrectly] = useState();
    const [supervisorFeedback, setSupervisorFeedback] = useState();
    const [BabyFormula, setBabyFormula] = useState();
    const [BabyHygeine, setBabyHygeine] = useState();
    const [butterAmbidient, setButterAmbdient] = useState();
    const [butterMarg, setButterMarg] = useState();
    const [CakeAmbident, setCakeAmbdient] = useState();
    const [CheseAmbdient, setCheseAmbdient] = useState();
    const [CheseFresh, setCheseFresh] = useState();
    const [cheseFrozen, setCheseFrozen] = useState();
    const [chocolateNovelTies, setChocolateNovelTIes] = useState();
    const [chocolateSubsitues, setChocolateSubsitues] = useState();
    const [cookingAmbient, setCookingAmbient] = useState();
    const [CosmeticRemoval, setCosmaticRemoval] = useState();
    const [DairyBaseDrinks, setDairyBaseDrinks] = useState();
    const [DairyMilkAmbient, setDairyMilkAmbient] = useState();
    const [DrinksFlavouredRtd, setDrinksFlavouredRtd] = useState();
    const [DrinksFlavouredRtdStockAvailibity, setDrinksFlavouredRtdStockAvailibity] = useState();
    const [EnergyDrink, setEnergyDrink] = useState();
    const [EnergyDrinkStockAvailibity, setEnergyDrinkStockAvailibity] = useState();
    const [facialToning, setFacialToning] = useState();
    const [HairCare, setHairCare] = useState();
    const [Herbs, setHerbs] = useState();
    const [InsectControl, setInsectControl] = useState();
    const [juices, setJuices] = useState();
    const [juicesStockAvailibity, setJuicesStockAvailibity] = useState();
    const [LaundharyGeneral, setLaundharyGeneral] = useState();
    const [OralHygeine, setOralHygeine] = useState();
    const [PersonalCleaning, setPersonalCleaning] = useState();
    const [SavouryBiscuits, setSavouryBiscuits] = useState();
    const [ShavingDepilationFemale, setShavingDepilationFemale] = useState();
    const [ShavingDepilationMale, setShavingDepilationMale] = useState();
    const [SkinConditioningMoisturing, setConditionMoisturing] = useState();
    const [SkinTreatment, setSkinTreatment] = useState();
    const [Snaks, setSnaks] = useState();
    const [SugarCandy, setSugarCandy] = useState();
    const [SweetBiscuit, setSweetBiscuit] = useState();
    const [TeaInfusion, setTeaInfusion] = useState();
    const [Water, setWater] = useState();
    const [insideImgUrl, setInsideImgUrl] = useState(null);
    const [PlanCompliance, setPlanCompliance] = useState();
    const [EnterPlanComplainceRecord, setEnterPlanComplianceRecord] = useState();
    const [CategoryHandling, setCategoryHandling] = useState();
    const [EnterCategoryHandlingRecord, setEnterCategoryHandlingRecord] = useState();
    const [WaterStockAvailibity, setWaterStockAvailibity] = useState();
    const [Comment, setComment] = useState();
    const [AuditorComment, setAuditorComment] = useState();
    const [gpsLocationImage, setGpsLocationImage] = useState(null);
    const [location, setLocation] = useState(null);
    const [surveyId, setSurveyId] = useState();
    const [selectedShopType, setSelectedShopType] = useState(null)
    const [ShopNameActual, setShopNameActual] = useState();
    const [ShopTypeActual, setShopTypeActual] = useState();
    const [EnterShopActualName, setEnterShopActualName] = useState();
    const [EnterMismatchShopName, setEnterMismatchShopName] = useState();
    const [EnterShopActualType, setEnterShopActualType] = useState();
    const [EnterMismatchShopType, setEnterMismatchShopType] = useState();
    const [newShopType,setNewShopType] = React.useState();
    const [newShopName,setNewShopName] = React.useState();
    const filterUndefinedValues = (obj) => {
        const newObj = {};
        for (const key in obj) {
            if (obj[key] !== undefined) {
                newObj[key] = obj[key];
            }
        }
        return newObj;
    };
   
     const storeDataAndImages = async () => {
        try {
           
            const previous_lat = findShopByLabel(ShopName)?.lat || '';
            const previous_long = findShopByLabel(ShopName)?.long || '';
    
            const filteredSurveyData = filterUndefinedValues({
                supervisorName,
                supervisorCDARID,
                auditorName,
                auditorCDAR,
                region,
                cities,
                SMSId,
                ShopName,
                ShopGPSLocation,
                EnterShopGPSRecord,
                ControlType,
                EnterControlledType,
                lineCheckofStock,
                totalNumberofLine,
                totalLinechecked,
                LinesCountedCorrectly,
                LineCheckedofPurchases,
                auditorCollectLinePurchase,
                totalLinecheckedAuditor,
                LinesPurchasesMatchwithAuditor,
                supervisorAskQuestion,
                askquestionFromauditor,
                auditorAnswerCorrectly,
                supervisorFeedback,
                BabyFormula,
                BabyHygeine,
                butterAmbidient,
                butterMarg,
                CakeAmbident,
                CheseAmbdient,
                cheseFrozen,
                chocolateNovelTies,
                chocolateSubsitues,
                cookingAmbient,
                CosmeticRemoval,
                DairyBaseDrinks,
                DrinksFlavouredRtd,
                DrinksFlavouredRtdStockAvailibity,
                EnergyDrink,
                EnergyDrinkStockAvailibity,
                facialToning,
                HairCare,
                Herbs,
                InsectControl,
                juices,
                juicesStockAvailibity,
                LaundharyGeneral,
                OralHygeine,
                PersonalCleaning,
                SavouryBiscuits,
                ShavingDepilationFemale,
                ShavingDepilationMale,
                SkinConditioningMoisturing,
                SkinTreatment,
                Snaks,
                SugarCandy,
                TeaInfusion,
                Water,
                PlanCompliance,
                EnterPlanComplainceRecord,
                CategoryHandling,
                EnterCategoryHandlingRecord,
                WaterStockAvailibity,
                Comment,
                selectedShopType,
                currentCoordinate,
                previous_lat,
                previous_long,
                EnterShopActualName,
                EnterMismatchShopName,
                EnterShopActualType,
                EnterMismatchShopType,
                ShopNameActual,
                ShopTypeActual,
                newAuditorCDAR,
                newAuditorName,
                newSMSID,
                newShopName,
                newShopType,
                newsupervisorName,
                newSupervisorCDARID
            });
            const imageUrls = [
                ImgUrl,
                insideImgUrl,
                gpsLocationImage,
                ImgUrl1,
                ImgUrl2,
                ImgUrl3,
                ImgUrl4,
                ImgUrl5
            ].filter(url => url);

            const existingDataString = await AsyncStorage.getItem('dataAndImages');
        let existingData = existingDataString ? JSON.parse(existingDataString) : { surveys: [] };
        console.log('filteredSurveyData:', filteredSurveyData);
        console.log('imageUrls:', imageUrls);
        setLoading(true);
        if (!existingData.surveys) {
            existingData.surveys = [];
        }

        const dataToStore = {
            surveyData: filteredSurveyData,
            images: imageUrls,
        };
        // Append the new survey data to the existing surveys
        existingData.surveys.push(dataToStore);
        // Store the updated data in AsyncStorage
        await AsyncStorage.setItem('dataAndImages', JSON.stringify(existingData));
        console.log('Data and images stored successfully', existingData);
        resetForm();
        Alert.alert('Survey Data upload Successfully');
       
    } catch (error) {
        console.error('Error storing data and images:', error);
    }
    finally {
        setLoading(false);
    }
    };
    useEffect(() => {
        const getLocation = () => {
            const result = requestLocationPermission();
            result.then(res => {
                console.log('res is:', res);
                if (res) {
                    Geolocation.getCurrentPosition(
                        position => {
                            console.log(position);
                            setLocation(position);
                        },
                        error => {
                            // See error code charts below.
                            console.log(error.code, error.message);
                            setLocation(false);
                        },
                        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                    );
                }
            });
            console.log(location);
        };
        getLocation()
    }, [])
    const shops = [
        { label: 'ALIYAN GENERAL STORE', value: 'ALIYAN GENERAL STORE', lat: 25.36704703, long: 68.29930637 },
        { label: 'BABA G JUICE POINT', value: 'BABA G JUICE POINT', lat: 31.41370001, long: 73.11319018 },
        { label: 'QUETTA AL FAREED CAFE', value: 'QUETTA AL FAREED CAFE', lat: 33.59879203, long: 33.59879203 },
        { label: 'KARACHI BIRYANI', value: 'KARACHI BIRYANI', lat: 33.5956638, long: 73.1291651 },
        { label: 'ABBASI GENERAL STORE', value: 'ABBASI GENERAL STORE', lat: 33.7381412, long: 73.17715514 },
    ];
  
    const currentCoordinate = {
        latitude: location ? location.coords.latitude : null,
        longitude: location ? location.coords.longitude : null
    }

    const findShopByLabel = (label) => {
        return shops.find(shop => shop.label === label);
    };
    const shop = findShopByLabel(ShopName);

    useEffect(() => {
        const currentcoordinate1 = { latitude: currentCoordinate.latitude, longitude: currentCoordinate.longitude };
        const selectedShop = findShopByLabel(ShopName);
        const isLocationMatched = (coord1, coord2, margin = 50) => {
            const distance = haversine(coord1, coord2, { unit: 'meter' });
            console.log('Distance:', distance);
            const isMatched = distance <= margin;
            console.log('isMatched:', isMatched);
            return isMatched;
        };

        if (selectedShop) {
            const shopCoordinate = { latitude: selectedShop.lat, longitude: selectedShop.long };
            const matched = isLocationMatched(currentcoordinate1, shopCoordinate);
            setShopGPSLocation(matched ? 'Yes' : 'No');
            console.log('location matched ', matched);
        }
    }, [ShopName, currentCoordinate]);
    console.log('survey id', surveyId);
    const resetForm = () => {
        setSuperVisorName('');
        setsupervisorCDARID('');
        setauditorName('');
        setAuditorCDAR('');
        setRegion('');
        setCities('');
        setSMSId('');
        setShopName('');
        setShopGPSLocation('No');
        setEnterShopGPSRecord('');
        setControlType('');
        setEnterControlledType('');
        setLineCheckofStock('');
        setTotalNumberofLines('');
        setTotalLineChecked('');
        setLinesCountedCorrectly('');
        setLineCheckofPurchases('');
        setAuditorCollectedLinesPurchase('');
        setTotalLineCheckedAuditor('');
        setLinesPurchasesMatchwithAuditor('');
        setSupervisorAskQuestion('');
        setAskQuestionfromAuditor('');
        setAnswerAuditorCorrectly('');
        setSupervisorFeedback('');
        setBabyFormula('');
        setBabyHygeine('');
        setButterAmbdient('');
        setButterMarg('');
        setCakeAmbdient('');
        setCheseAmbdient('');
        setCheseFresh('');
        setCheseFrozen('');
        setChocolateNovelTIes('');
        setChocolateSubsitues('');
        setCookingAmbient('');
        setCosmaticRemoval('');
        setDairyBaseDrinks('');
        setDairyMilkAmbient('');
        setDrinksFlavouredRtd('');
        setDrinksFlavouredRtdStockAvailibity('');
        setEnergyDrink('');
        setEnergyDrinkStockAvailibity('');
        setFacialToning('');
        setHairCare('');
        setHerbs('');
        setInsectControl('');
        setJuices('');
        setJuicesStockAvailibity('');
        setLaundharyGeneral('');
        setOralHygeine('');
        setPersonalCleaning('');
        setSavouryBiscuits('');
        setShavingDepilationFemale('');
        setShavingDepilationMale('');
        setConditionMoisturing('');
        setSkinTreatment('');
        setSnaks('');
        setSugarCandy('');
        setSweetBiscuit('');
        setTeaInfusion('');
        setWater('');
        setInsideImgUrl(null);
        setPlanCompliance('');
        setEnterPlanComplianceRecord('');
        setCategoryHandling('');
        setEnterCategoryHandlingRecord('');
        setWaterStockAvailibity('');
        setComment('');
        setAuditorComment('');
        setGpsLocationImage(null);
        setShopNameActual('');
        setShopTypeActual('');
        setEnterShopActualName('');
        setEnterMismatchShopName('');
        setEnterShopActualType('');
        setEnterMismatchShopType('');
        setNewSupervisiorName('');
        setNewSupervisorCDARID('');
        setNewAuditorName('')
    };
    const uploadDataSvr = async () => {
        try {
            const requiredFields = [
                supervisorName,
                auditorName,
                region,
                cities,
                currentCoordinate.latitude,
                currentCoordinate.longitude,
                ControlType,
                lineCheckofStock,
                LinesCountedCorrectly,
              ];
              const isAnyFieldEmpty = requiredFields.some(field => !field);

              if (isAnyFieldEmpty) {
                Alert.alert('Please fill in all required fields');
                return;
               
              }
            const token = await AsyncStorage.getItem('token');
            setLoading(false);
            console.log('token in svr survey', token)
            const formdata = new FormData();
            formdata.append('supervisor_name', supervisorName);
            formdata.append('new_supervisor_name',newsupervisorName);
            formdata.append('supervisor_id', supervisorCDARID);
            formdata.append('new_supervisor_id',newSupervisorCDARID)
            formdata.append('auditor_name', auditorName);
            formdata.append('new_auditor_name',newAuditorName)
            formdata.append('auditor_id', auditorCDAR);
            formdata.append('new_auditor_id',newAuditorCDAR)
            formdata.append('region', region);
            formdata.append('city', cities);
            formdata.append('shop_sms', SMSId);
            formdata.append('new_shop_sms',newSMSID);
            formdata.append('new_shoptype',newShopType);
            formdata.append('new_shopname',newShopName)
            formdata.append('shop_type', selectedShopType);
            formdata.append('shop_name', ShopName);
            if (shop) {
                // If shop is found, append lat and long to formdata
                if (typeof shop.lat !== 'undefined') {
                    formdata.append('previous_lat', `${shop.lat}`);
                }
                if (typeof shop.long !== 'undefined') {
                    formdata.append('previous_long', `${shop.long}`);
                }
            } else {
                // Handle the case when shop is not found or lat/long is not defined
                console.log('Shop not found or lat/long not defined');
                // You can choose to handle this case in any way appropriate for your application
            }
            formdata.append('current_lat', currentCoordinate.latitude);
            formdata.append('current_long', currentCoordinate.longitude);
            formdata.append('gps_location', ShopGPSLocation);
            formdata.append('mismatch_gps_reason', EnterShopGPSRecord)
            formdata.append('plan_compliance', PlanCompliance);
            formdata.append('reason_of_non_compliance', EnterPlanComplainceRecord);
            formdata.append('control_type', ControlType);
            formdata.append('reason_other_control_type', EnterControlledType);
            formdata.append('category_handling', CategoryHandling);
            formdata.append('mismatch_in_handling', EnterCategoryHandlingRecord);
            formdata.append('baby_formula', BabyFormula);
            formdata.append('baby_personal_hygiene', BabyHygeine);
            formdata.append('butter_marg', butterAmbidient);
            formdata.append('butter_marg_fresh', butterMarg);
            formdata.append('cakes_gateaux', CakeAmbident);
            formdata.append('cheese', CheseAmbdient);
            formdata.append('cheese_fresh', CheseFresh);
            formdata.append('cheese_frozen', cheseFrozen);
            formdata.append('chocolate', chocolateNovelTies);
            formdata.append('chocolate_fixed', chocolateSubsitues);
            formdata.append('cooking_oil', cookingAmbient);
            formdata.append('cosmetic', CosmeticRemoval);
            formdata.append('drinking_yogurt', DairyBaseDrinks);
            formdata.append('dairy_milk', DairyMilkAmbient);
            formdata.append('drinking_flavored', DrinksFlavouredRtd);
            formdata.append('stock_drinking_flavored', DrinksFlavouredRtdStockAvailibity);
            formdata.append('energy_drink', EnergyDrink);
            formdata.append('stock_energy_drink', EnergyDrinkStockAvailibity);
            formdata.append('facial_cleansing', facialToning);
            formdata.append('hair_care', HairCare);
            formdata.append('herbs_spices', Herbs);
            formdata.append('insect_control', InsectControl);
            formdata.append('juice', juices);
            formdata.append('stock_juice', juicesStockAvailibity);
            formdata.append('general_care', LaundharyGeneral);
            formdata.append('oral_hygiene', OralHygeine);
            formdata.append('personal_cleansing', PersonalCleaning);
            formdata.append('savoury_biscuits', SavouryBiscuits);
            formdata.append('shaving_male', ShavingDepilationMale);
            formdata.append('shaving_female', ShavingDepilationFemale);
            formdata.append('skin_conditioning', SkinConditioningMoisturing);
            formdata.append('skin_treatment', SkinTreatment);
            formdata.append('snacks', Snaks);
            formdata.append('sugar_candy', SugarCandy);
            formdata.append('sweet_biscuit', SweetBiscuit);
            formdata.append('tea', TeaInfusion);
            formdata.append('water', Water);
            formdata.append('stock_water', WaterStockAvailibity);
            formdata.append('comment', Comment);
            formdata.append("lines_checked_stock", lineCheckofStock);
            formdata.append("total_lines_done", totalNumberofLine);
            formdata.append("total_lines_checked", totalLinechecked);
            formdata.append("lines_counted_correctly", LinesCountedCorrectly);
            formdata.append("percentage_correct_lines", result1);
            formdata.append("lines_checked_Purchases", LineCheckedofPurchases);
            formdata.append("auditor_collected", auditorCollectLinePurchase);
            formdata.append("auditor_total_lines_checked", totalLinecheckedAuditor);
            formdata.append("lines_match_with_auditor_purchases", LinesPurchasesMatchwithAuditor);
            formdata.append("correct_purchases", result2);
            formdata.append("auditor_knowledge", supervisorAskQuestion);
            formdata.append("questions_asked", askquestionFromauditor);
            formdata.append("auditor_answers", auditorAnswerCorrectly);
            formdata.append("correct_answers", result3);
            formdata.append("supervisor_feedback", supervisorFeedback);
            formdata.append("auditor_comment", AuditorComment);
            formdata.append("actshop_name", EnterShopActualName);
            formdata.append("matchshop_name",ShopNameActual);
            formdata.append("name_mismatch_reason",EnterMismatchShopName)
           formdata.append("actshop_type", EnterShopActualType);
           formdata.append("matchshop_type", ShopTypeActual);
           formdata.append('type_mismatch_reason',EnterMismatchShopType);
           
           
            console.log('form data ', formdata);
            if (ShopNameActual === 'No' && !ImgUrl) {
                Alert.alert('Front image is mandatory. Please take a picture before submitting.');
                return;
            }
            if ( ShopTypeActual=== 'No' && !insideImgUrl) {
                Alert.alert('Inside picture and GPS Location picture are mandatory when ShopProfile and GPS Location are "No". Please take pictures before submitting.');
                return;
            }
            const response = await axios.post('https://coralr.com/api/svr-store', formdata, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
            console.log(response.data);
            setSurveyId(response.data.survey_id)
            resetForm();
            console.log('form data ', formdata)

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
    const uploadImage = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            setLoading(true);
            if (ShopNameActual === 'No' && !ImgUrl) {
                Alert.alert('Please take the front image before submitting.');
                return;
            }

            if (ShopTypeActual === 'No' && !insideImgUrl) {
                Alert.alert('Inside picture is mandatory when ShopProfile is "No". Please take a picture before submitting.');
                return;
            }
            const formData = new FormData();
            formData.append('survey_id', surveyId);
            if(ImgUrl) {
                formData.append('front_image', {
                    uri: ImgUrl,
                    type: 'image/jpeg',
                    name: 'image.jpg',
                });
            }
            if (insideImgUrl) {
                formData.append('inside_image', {
                    uri: insideImgUrl,
                    type: 'image/jpeg',
                    name: 'image.jpg',
                });
            }
            if (gpsLocationImage) {
                formData.append('current_location_image', {
                    uri: gpsLocationImage,
                    type: 'image/jpeg',
                    name: 'image.jpg',
                });
            }

            const imageUrls = [ImgUrl1, ImgUrl2, ImgUrl3, ImgUrl4, ImgUrl5];
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
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
                console.log(response.data)
            if (response) {
                console.log('Image upload was successful.');
                Alert.alert('Survey Data and Image Upload Successfuly');
            } else {
                console.log('Image upload response is undefined.');
            }

        } catch (error) {
            console.log('Error in API request:', error.message);
            console.log('API error details:', error.response?.data );
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (surveyId) {
            uploadImage();
        }
    }, [surveyId]);

    const result1 = (LinesCountedCorrectly / totalLinechecked * 100).toFixed(0);
    const result2 = (LinesPurchasesMatchwithAuditor / totalLinecheckedAuditor * 100).toFixed(0);
    const result3 = (auditorAnswerCorrectly / askquestionFromauditor * 100).toFixed(0);
    const supervisorCDARIDMap = {
        'Aziz Ahmed': '935301',
        'Muhammad Hassan': '761921',
        'Imran Khalil': '694423',
        'Tariq Mahmood': '694466',
        'Naveed Mehboob': '754481',
        'Khurram Raza': '199733',
        'Muhammad Noman': '750165',
        'Muhammad Hamid': '935281'
    };
    const auditorCDARMap = {
        "Farhan Syed": "746101",
        "Tayyab Akram": "257997",
        "MIRZA KHALID": "288356",
        "Yasir Nasir": "244191",
        "Ghulam Hassan": "925641",
        "Imran Muhammad": "761921",
        "Khalid Hussain": "923121",
        "Ali Raza": "695762",
        "Muhammad Noman": "750165",
        "Tanveer Ali": "920961",
        "Zunair Arshad": "750161",
        "Tagial Muhammad": "923081",
        "Farhan Latif": "694474",
        "Abid Hussain": "921641",
        "Qasir Nawaz": "918921",
        "Rozi Sjid": "918781",
        "Kazim Rabbani": "750162",
        "Muhammad Naeem": "939282",
        "Attique Ahmed": "939281",
        "Zahid Ali": "694431",
        "Nazeer Ahmed": "905861",
        "Azhar Umer": "746041",
        "Shoaib Muhammad": "694470",
        "Adnan Arif": "799161",
        "Zia ul Haq": "935302",
        "Ahsar Ali": "873821",
        "Muhammad Shoaib": "754502",
        "Muheeb Ullah": "741002",
        "Rizwan Ali": "899661",
        "Mohammed Yusaf Abid": "936681",
        "Shagufta Shahid": "694467",
        "Shafaqat Ali": "920741",
        "Zoshia Waqas": "754521",
        "Naveed Mahboob": "910401",
        "Javed Yousuf": "694436",
        "Eisha kanwal": "746061",
        "Irfan Abbas": "927501",
        "Khurram Shahzad": "918761",
    }


    const handleSupervisorNameAndID = (value) => {
        setSuperVisorName(value);
        setsupervisorCDARID(supervisorCDARIDMap[value])
    }
    const handleauditorNameAndID = (value) => {
        setauditorName(value);
        setAuditorCDAR(auditorCDARMap[value])
    }

   
const requestForPermissionCamera = () => {
    request(PERMISSIONS.ANDROID.CAMERA).then((result) => {
      console.log(result)
    });
  };

  
  const handleCameraLaunch = async() => {
    if (Platform.OS === 'android') {
       await requestForPermissionCamera();
      }
    const options = {
      title: 'Take a photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
        saveToPhotos: true,
      },
    };
  
    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera action');
      } else if (response.errorCode) {
        console.log('Camera Error:', response.errorMessage);
      } else {
        const pickedImage = response.assets[0];
        setImgUrl(pickedImage.uri);
        console.log('Image picked:', pickedImage);
      }
    });
  };
  
  
    const handleCameraLaunch1 = async () => {
        if (Platform.OS === 'android') {
            await requestForPermissionCamera();
           }
         const options = {
           title: 'Take a photo',
           storageOptions: {
             skipBackup: true,
             path: 'images',
             saveToPhotos: true,
           },
         };

         launchCamera(options, (response) => {
            if (response.didCancel) {
              console.log('User cancelled camera action');
            } else if (response.errorCode) {
              console.log('Camera Error:', response.errorMessage);
            } else {
              const pickedImage = response.assets[0];
              setInsideImgUrl(pickedImage.uri);
              console.log('Image picked:', pickedImage);
            }
          });
        };


    const handleCameraLaunch2 = async () => {
        if (Platform.OS === 'android') {
            await requestForPermissionCamera();
           }
         const options = {
           title: 'Take a photo',
           storageOptions: {
             skipBackup: true,
             path: 'images',
             saveToPhotos: true,
           },
         };
       
         launchCamera(options, (response) => {
            if (response.didCancel) {
              console.log('User cancelled camera action');
            } else if (response.errorCode) {
              console.log('Camera Error:', response.errorMessage);
            } else {
              const pickedImage = response.assets[0];
              setGpsLocationImage(pickedImage.uri);
              console.log('Image picked:', pickedImage);
            }
          });
        };
    const handleCameraLaunch3 = async () => {
        if (Platform.OS === 'android') {
            await requestForPermissionCamera();
           }
         const options = {
           title: 'Take a photo',
           storageOptions: {
             skipBackup: true,
             path: 'images',
             saveToPhotos: true,
           },
         };
         launchCamera(options, (response) => {
            if (response.didCancel) {
              console.log('User cancelled camera action');
            } else if (response.errorCode) {
              console.log('Camera Error:', response.errorMessage);
            } else {
              const pickedImage = response.assets[0];
              setImgUrl1(pickedImage.uri);
              console.log('Image picked:', pickedImage);
            }
          });
    };
    const handleCameraLaunch4 = async () => {
        if (Platform.OS === 'android') {
            await requestForPermissionCamera();
           }
         const options = {
           title: 'Take a photo',
           storageOptions: {
             skipBackup: true,
             path: 'images',
             saveToPhotos: true,
           },
         };
         launchCamera(options, (response) => {
            if (response.didCancel) {
              console.log('User cancelled camera action');
            } else if (response.errorCode) {
              console.log('Camera Error:', response.errorMessage);
            } else {
              const pickedImage = response.assets[0];
              setImgUrl2(pickedImage.uri);
              console.log('Image picked:', pickedImage);
            }
          });
    };
    const handleCameraLaunch5 = async () => {
        if (Platform.OS === 'android') {
            await requestForPermissionCamera();
           }
         const options = {
           title: 'Take a photo',
           storageOptions: {
             skipBackup: true,
             path: 'images',
             saveToPhotos: true,
           },
         };

         launchCamera(options, (response) => {
            if (response.didCancel) {
              console.log('User cancelled camera action');
            } else if (response.errorCode) {
              console.log('Camera Error:', response.errorMessage);
            } else {
              const pickedImage = response.assets[0];
              setImgUrl3(pickedImage.uri);
              console.log('Image picked:', pickedImage);
            }
          });
    };
    const handleCameraLaunch6 = async () => {
        if (Platform.OS === 'android') {
            await requestForPermissionCamera();
           }
         const options = {
           title: 'Take a photo',
           storageOptions: {
             skipBackup: true,
             path: 'images',
             saveToPhotos: true,
           },
         };

         launchCamera(options, (response) => {
            if (response.didCancel) {
              console.log('User cancelled camera action');
            } else if (response.errorCode) {
              console.log('Camera Error:', response.errorMessage);
            } else {
              const pickedImage = response.assets[0];
              setImgUrl4(pickedImage.uri);
              console.log('Image picked:', pickedImage);
            }
          });
    };
    const handleCameraLaunch7 = async () => {
        if (Platform.OS === 'android') {
            await requestForPermissionCamera();
           }
         const options = {
           title: 'Take a photo',
           storageOptions: {
             skipBackup: true,
             path: 'images',
             saveToPhotos: true,
           },
         };

         launchCamera(options, (response) => {
            if (response.didCancel) {
              console.log('User cancelled camera action');
            } else if (response.errorCode) {
              console.log('Camera Error:', response.errorMessage);
            } else {
              const pickedImage = response.assets[0];
              setImgUrl5(pickedImage.uri);
              console.log('Image picked:', pickedImage);
            }
          });
    };
    // const GpsLocationCapture = async () => {
    //     try {
    //         console.log('PRESS ====>')
    //         const result = await launchCamera({ saveToPhotos: true });
    //         setGpsLocationImage(result?.assets[0]?.uri);
    //         console.log('click the camera ', result)
    //     } catch (error) {
    //         console.log('Error in Launching camera', error)
    //     }
    // }
    const shopdetailMap = {
        'PK00100004': { type: 'OLA', name: 'ALIYAN GENERAL STORE', lat: 25.36704703, long: 68.29930637 },
        'PK00100005': { type: 'OSM', name: 'BABA G JUICE POINT', lat: 31.41370001, long: 73.11319018 },
        'PK00100007': { type: 'COR', name: 'QUETTA AL FAREED CAFE', lat: 33.59879203, long: 33.59879203 },
        'PK00100008': { type: 'OME', name: 'KARACHI BIRYANI', lat: 33.5956638, long: 73.1291651 },
        'PK00100010': { type: 'BAK', name: 'ABBASI GENERAL STORE', lat: 33.7381412, long: 73.17715514 },
    }
    useEffect(() => {

        if (SMSId) {
            const details = shopdetailMap[SMSId];
            if (details) {
                setSelectedShopType(details.type);
                setShopName(details.name);
            }
        }
    }, [SMSId]);
    return (
        <>
            <ScrollView>
                {
                    loading ? (
                        <View >
                            <ActivityIndicator size={'large'} color={'#1e76ba'} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 350 }} />
                        </View>
                    ) : (
                        <>
                            <View style={styles.container}>
                                <Text style={{ textAlign: 'center', fontSize: 25, fontWeight: '700' }}>Audit Survey Form</Text>
                            </View>
                            <View style={styles.questionContainer}>
                                <View>
                                    <Text style={styles.label}>Name of Supervisor</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Aziz Ahmed', value: 'Aziz Ahmed' },
                                            { label: 'Muhammad Hassan', value: 'Muhammad Hassan' },
                                            { label: 'Imran Khalil', value: 'Imran Khalil' },
                                            { label: 'Tariq Mahmood', value: 'Tariq Mahmood' },
                                            { label: 'Naveed Mehboob', value: 'Naveed Mehboob' },
                                            { label: 'Khurram Raza', value: 'Khurram Raza' },
                                            { label: 'Muhammad Noman', value: 'Muhammad Noman' },
                                            { label: 'Muhammad Hamid', value: 'Muhammad Hamid' },
                                            { label: 'Not Availible', value: 'Not Availible' },
                                        ]}
                                        selectedValue={supervisorName}
                                        onValueChange={handleSupervisorNameAndID}
                                        primaryColor={'green'}
                                    />
                                    {
                                        supervisorName === 'Not Availible' ? (
                                            <View>
                                                <Text>Supervisor Name</Text>
                                                <TextInput
                                                    placeholder='Enter Name'
                                                    style={styles.input}
                                                    value={newsupervisorName}
                                                    onChangeText={(text) => {
                                                        setNewSupervisiorName(text);
                                                      }}
                                                />
                                                </View>
                                            ) : null}
                        
                                </View>
                                <Text style={styles.label}>Supervisor CDAR ID</Text>
                                <Dropdown
                                    placeholder="Select an option..."
                                    options={[
                                        { label: '935301', value: '935301' },
                                        { label: '761921', value: '761921' },
                                        { label: '694423', value: '694423' },
                                        { label: '694466', value: '694466' },
                                        { label: '754481', value: '754481' },
                                        { label: '199733', value: '199733' },
                                        { label: '750165', value: '750165' },
                                        { label: '935281', value: '935281' },
                                        { label: 'Not Availible', value: 'Not Availible' },
                                    ]}
                                    selectedValue={supervisorCDARID}
                                    onValueChange={(value) => setsupervisorCDARID(value)}
                                    primaryColor={'green'}
                                />
                                {
                                    supervisorCDARID === 'Not Availible' ? (
                                        <View>
                                            <Text>Supervisor CDAR ID</Text>
                                            <TextInput
                                                placeholder='Enter Supervisor CDAR ID'
                                                style={styles.input}
                                                value={newSupervisorCDARID}
                                                onChangeText={(text) => setNewSupervisorCDARID(text)}
                                            />
                                        </View>
                                    ) : null
                                }
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Auditor Name</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: "Farhan Syed", value: "Farhan Syed" },
                                            { label: "Tayyab Akram", value: "Tayyab Akram" },
                                            { label: "MIRZA KHALID", value: "MIRZA KHALID" },
                                            { label: "Yasir Nasir", value: "Yasir Nasir" },
                                            { label: "Ghulam Hassan", value: "Ghulam Hassan" },
                                            { label: "Imran Muhammad", value: "Imran Muhammad" },
                                            { label: "Khalid Hussain", value: "Khalid Hussain" },
                                            { label: "Ali Raza", value: "Ali Raza" },
                                            { label: "Muhammad Noman", value: "Muhammad Noman" },
                                            { label: "Tanveer Ali", value: "Tanveer Ali" },
                                            { label: "Zunair Arshad", value: "Zunair Arshad" },
                                            { label: "Tagial Muhammad", value: "Tagial Muhammad" },
                                            { label: "Farhan Latif", value: "Farhan Latif" },
                                            { label: "Abid Hussain", value: "Abid Hussain" },
                                            { label: "Qasir Nawaz", value: "Qasir Nawaz" },
                                            { label: "Rozi Sjid", value: "Rozi Sjid" },
                                            { label: "Kazim Rabbani", value: "Kazim Rabbani" },
                                            { label: "Muhammad Naeem", value: "Muhammad Naeem" },
                                            { label: "Attique Ahmed", value: "Attique Ahmed" },
                                            { label: "Zahid Ali", value: "Zahid Ali" },
                                            { label: "Nazeer Ahmed", value: "Nazeer Ahmed" },
                                            { label: "Azhar Umer", value: "Azhar Umer" },
                                            { label: "Shoaib Muhammad", value: "Shoaib Muhammad" },
                                            { label: "Adnan Arif", value: "Adnan Arif" },
                                            { label: "Zia ul Haq", value: "Zia ul Haq" },
                                            { label: "Ahsar Ali", value: "Ahsar Ali" },
                                            { label: "Muhammad Shoaib", value: "Muhammad Shoaib" },
                                            { label: "Muheeb Ullah", value: "Muheeb Ullah" },
                                            { label: "Rizwan Ali", value: "Rizwan Ali" },
                                            { label: "Mohammed Yusaf Abid", value: "Mohammed Yusaf Abid" },
                                            { label: "Shagufta Shahid", value: "Shagufta Shahid" },
                                            { label: "Shafaqat Ali", value: "Shafaqat Ali" },
                                            { label: "Zoshia Waqas", value: "Zoshia Waqas" },
                                            { label: "Naveed Mahboob", value: "Naveed Mahboob" },
                                            { label: "Javed Yousuf", value: "Javed Yousuf" },
                                            { label: "Eisha kanwal", value: "Eisha kanwal" },
                                            { label: "Irfan Abbas", value: "Irfan Abbas" },
                                            { label: "Khurram Shahzad", value: "Khurram Shahzad" },
                                            { label: 'Not Availible', value: 'Not Availible' },
                                        ]}
                                        selectedValue={auditorName}
                                        onValueChange={handleauditorNameAndID}
                                        primaryColor={'green'}
                                    />
                                    {
                                        auditorName === 'Not Availible' ? (
                                            <View>
                                                <Text>Auditor Name</Text>
                                                <TextInput
                                                    placeholder='Enter Auditor Name'
                                                    style={styles.input}
                                                    value={newAuditorName}
                                                    onChangeText={(text) => setNewAuditorName(text)}
                                                />
                                            </View>
                                        ) : null
                                    }
                                </View>
                                <Text style={styles.label}>Auditor CDAR ID</Text>
                                <Dropdown
                                    placeholder="Select an option..."
                                    options={[
                                        { label: "746101", value: "746101" },
                                        { label: "257997", value: "257997" },
                                        { label: "288356", value: "288356" },
                                        { label: "244191", value: "244191" },
                                        { label: "925641", value: "925641" },
                                        { label: "761921", value: "761921" },
                                        { label: "923121", value: "923121" },
                                        { label: "695762", value: "695762" },
                                        { label: "750165", value: "750165" },
                                        { label: "920961", value: "920961" },
                                        { label: "750161", value: "750161" },
                                        { label: "923081", value: "923081" },
                                        { label: "694474", value: "694474" },
                                        { label: "921641", value: "921641" },
                                        { label: "918921", value: "918921" },
                                        { label: "918781", value: "918781" },
                                        { label: "750162", value: "750162" },
                                        { label: "939282", value: "939282" },
                                        { label: "939281", value: "939281" },
                                        { label: "694431", value: "694431" },
                                        { label: "905861", value: "905861" },
                                        { label: "746041", value: "746041" },
                                        { label: "694470", value: "694470" },
                                        { label: "799161", value: "799161" },
                                        { label: "935302", value: "935302" },
                                        { label: "873821", value: "873821" },
                                        { label: "754502", value: "754502" },
                                        { label: "741002", value: "741002" },
                                        { label: "899661", value: "899661" },
                                        { label: "936681", value: "936681" },
                                        { label: "694467", value: "694467" },
                                        { label: "920741", value: "920741" },
                                        { label: "754521", value: "754521" },
                                        { label: "910401", value: "910401" },
                                        { label: "694436", value: "694436" },
                                        { label: "746061", value: "746061" },
                                        { label: "927501", value: "927501" },
                                        { label: "918761", value: "918761" },
                                        { label: "909541", value: "909541" },
                                        { label: 'Not Availible', value: 'Not Availible' },
                                    ]}
                                    selectedValue={auditorCDAR}
                                    onValueChange={(value) => setAuditorCDAR(value)}
                                    primaryColor={'green'}
                                />
                                {
                                    auditorCDAR === 'Not Availible' ? (
                                        <View>
                                            <Text>Auditor CDAR ID</Text>
                                            <TextInput
                                                placeholder='Enter Auditor CDAR ID'
                                                style={styles.input}
                                                value={newAuditorCDAR}
                                                onChangeText={(text) => setNewAuditorCDAR(text)}
                                            />
                                        </View>
                                    ) : null
                                }
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Region</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: "Karachi", value: "Karachi" },
                                            { label: 'Hyderabad', value: 'Hyderabad' },
                                            { label: 'Sukkur', value: 'Sukkur' },
                                            { label: 'Multan', value: 'Multan' },
                                            { label: 'Lahore', value: 'Lahore' },
                                            { label: 'Rawalpindi', value: 'Rawalpindi' },
                                            { label: 'KPK', value: 'KPK' },
                                            { label: 'Balochistan', value: 'Balochistan' },
                                            { label: 'Faislabad', value: 'Faislabad' }
                                        ]}
                                        selectedValue={region}
                                        onValueChange={(value) => setRegion(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Cities</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'GUJRANWALA', value: 'GUJRANWALA' },
                                            { label: 'KARACHI', value: 'KARACHI' },
                                            { label: 'Mansehra Mc', value: 'Mansehra Mc' },
                                            { label: 'Quetta', value: 'Quetta' },
                                            { label: 'Faisalabad', value: 'Faisalabad' },
                                            { label: 'Rawalpindi', value: 'Rawalpindi' },
                                            { label: 'Lahore', value: 'Lahore' },
                                            { label: 'Multan', value: 'Multan' },
                                            { label: 'Dera Ghazi Khan Mc', value: 'Dera Ghazi Khan Mc' },
                                            { label: 'Mandi Bahuddin Mc', value: 'Mandi Bahuddin Mc' },
                                            { label: 'Sukkur', value: 'Sukkur' },
                                            { label: 'Larkana', value: 'Larkana' },
                                            { label: 'KOTRI MC', value: 'KOTRI MC' },
                                            { label: 'Mirpur Khas Mc', value: 'Mirpur Khas Mc' },
                                            { label: 'Islamabad', value: 'Islamabad' },
                                            { label: 'Mardan', value: 'Mardan' },
                                            { label: 'MIRPUR KHAS', value: 'MIRPUR KHAS' },
                                            { label: 'Gujar Khan Mc', value: 'Gujar Khan Mc' },
                                            { label: 'MANDI BAHAUDDIN', value: 'MANDI BAHAUDDIN' },
                                            { label: 'HYDERABAD', value: 'HYDERABAD'},
                                            { label: 'MULTAN CITY', value: 'MULTAN CITY'},
                                            { label: 'ZHOB', value: 'ZHOB' },
                                            { label: 'SANGHAR', value: 'SANGHAR' },
                                            { label: 'HAFIZABAD', value: 'HAFIZABAD' },
                                            { label: 'GUJAR KHAN', value: 'GUJAR KHAN' },
                                            { label: 'NAWABSHAH', value: 'NAWABSHAH' },
                                            { label: 'ABBOTTABAD', value: 'ABBOTTABAD' },
                                            { label: 'SURAB', value: 'SURAB' },
                                            { label: 'SIBI', value: 'SIBI' },
                                            { label: 'JACOBABAD', value: 'JACOBABAD' },
                                            { label: 'PESHAWAR', value: 'PESHAWAR' },
                                            { label: 'SARGODHA', value: 'SARGODHA' },
                                            { label: 'ZIARAT', value: 'ZIARAT' },
                                            { label: 'BAHAWALPUR', value: 'BAHAWALPUR' },
                                            { label: 'CHACHRO', value: 'CHACHRO' },
                                            { label: 'USTA MOHAMMAD', value: 'USTA MOHAMMAD' },
                                            { label: 'KARIO GHNWAR TC', value: 'KARIO GHNWAR TC' },
                                            { label: 'SIALKOT', value: 'SIALKOT' },
                                            { label: 'TALA GANG', value: 'TALA GANG' },
                                            { label: 'BAT KHELA MC', value: 'BAT KHELA MC' },
                                            { label: 'DERA ISMAIL KHAN', value: 'DERA ISMAIL KHAN' },
                                            { label: 'JHANG', value: 'JHANG'},
                                        ]}
                                        selectedValue={cities}
                                        onValueChange={(value) => setCities(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Shop SMS ID</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={
                                            [
                                                { label: 'PK00100004', value: 'PK00100004' },
                                                { label: 'PK00100005', value: 'PK00100005' },
                                                { label: 'PK00100007', value: 'PK00100007' },
                                                { label: 'PK00100008', value: 'PK00100008' },
                                                { label: 'PK00100010', value: 'PK00100010' },
                                                {label: 'Not Availible', value: 'Not Availible'}
                                            ]
                                        }
                                        selectedValue={SMSId}
                                        onValueChange={(value) => setSMSId(value)}
                                        primaryColor={'green'}
                                    />
                                    {
                                        SMSId === 'Not Availible' ? (
                                            <>
                                            <Text style={styles.label}>Shop SMS ID</Text>
                                            <TextInput
                                            placeholder='Shop SMS ID'
                                            style={styles.input}
                                            selectedValue={newSMSID}
                                            onValueChange={(value) => setNewSMSID(value)}
                                        />
                                          <Text style={styles.label}>Shop Type</Text>
                                          <TextInput
                                            placeholder='Shop Type'
                                            multiline={true}
                                            numberOfLines={10}
                                            style={styles.input}
                                            value={newShopType}
                                            onChangeText={(text) => setNewShopType(text)}
                                        />
                                         <Text style={styles.label}>Shop Name </Text>
                                         <TextInput
                                            placeholder='Shop Name'
                                            multiline={true}
                                            numberOfLines={10}
                                            style={styles.input}
                                            selectedValue={newShopType}
                                            onValueChange={(value) => setNewShopName(value)}
                                        />
                                        </>
                                        ):null
                                    }
                                </View>
                            </View>
                         {
                            SMSId === 'Not Availible' ? null : (
                                <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Shop Type (Office Record)</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'OLA', value: 'OLA' },
                                            { label: 'OSM', value: 'OSM' },
                                            { label: 'COR', value: 'COR' },
                                            { label: 'OME', value: 'OME' },
                                            { label: 'BAK', value: 'BAK' },
                                            { label: 'PAN', value: 'PAN' },
                                            { label: 'PHA', value: 'PHA' },
                                            { label: 'OMI', value: 'OMI' },
                                            { label: 'EPL', value: 'EPL' },
                                            { label: 'TKW', value: 'TKW' },
                                            { label: 'OSU', value: 'OSU' },
                                        ]}
                                        selectedValue={selectedShopType}
                                        onValueChange={(value) => setSelectedShopType(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                            </View>
                            )
                         }
                            {
                                SMSId === 'Not Availible' ? null :(
                                    <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Shop Name (Office Record)</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={shops}
                                        selectedValue={ShopName}
                                        onValueChange={(value) => setShopName(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                            </View>
                                )
                            }
                          {
                            SMSId === 'Not Availible' ? null :(
                                <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Shop type match with office record</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                        ]}
                                        selectedValue={ShopTypeActual}
                                        onValueChange={(value) => setShopTypeActual(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                {
                                    ShopTypeActual === 'No' ? (
                                        <>
                                            <View>
                                                <Text style={styles.label}>Shop Type (Actual)</Text>
                                                <TextInput
                                                    placeholder='Shop Type'
                                                    multiline={true}
                                                    numberOfLines={10}
                                                    style={styles.input}
                                                    value={EnterShopActualType}
                                                    onChangeText={(text) => setEnterShopActualType(text)}
                                                />
                                                <Text style={styles.label}>Reason of Mismatch Shop type</Text>
                                                <TextInput
                                                    placeholder='Comment'
                                                    multiline={true}
                                                    numberOfLines={10}
                                                    style={styles.input}
                                                    value={EnterMismatchShopType}
                                                    onChangeText={(text) => setEnterMismatchShopType(text)}
                                                />
                                            </View>
                                            <View>
                                                <Text style={styles.label}>In case of Mismatch in Types shop inside picture </Text>
                                                {/* <Button title='Take Picture' onPress={handleCameraLaunch1} /> */}
                                                <View>
                                                    <TouchableOpacity onPress={handleCameraLaunch1} style={{ backgroundColor: '#0000FF', width: '40%', borderRadius: 10 }}>
                                                    <View style={{ flexDirection: 'row', width: '100%', margin: 6, gap: 10 }}>
                                                    <AttachmentIcon name='camera' size={20} color='#fff' />
                                                    <Text style={{ color: 'white' }}>Take Picture</Text>
                                                </View>
                                                    </TouchableOpacity>
                                                </View>
                                                <Text>{insideImgUrl}</Text>
                                            </View>
                                        </>
                                    ) : null
                                }
                            </View>
                            )
                          }
                           {
                            SMSId === 'Not Availible' ? null :(
                                <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Shop Name match with office record</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                        ]}
                                        selectedValue={ShopNameActual}
                                        onValueChange={(value) => setShopNameActual(value)}
                                        primaryColor={'green'}
                                    />
                                    {ShopNameActual === 'No' ? (
                                        <>
                                            <View>
                                                <Text style={styles.label}>Shop Name (Actual)</Text>
                                                <TextInput
                                                    placeholder='Shop Name'
                                                    multiline={true}
                                                    numberOfLines={10}
                                                    style={styles.input}
                                                    value={EnterShopActualName}
                                                    onChangeText={(text) => setEnterShopActualName(text)}
                                                />
                                                <Text style={styles.label}>Reason of Mismatch Shop Name</Text>
                                                <TextInput
                                                    placeholder='Comment'
                                                    multiline={true}
                                                    numberOfLines={10}
                                                    style={styles.input}
                                                    value={EnterMismatchShopName}
                                                    onChangeText={(text) => setEnterMismatchShopName(text)}
                                                />
                                            </View>
                                            <Text style={styles.label}>Shop Front Picture with signboard</Text>
                                            {/* <Button title='Take Picture' onPress={handleCameraLaunch} color={'#0000FF'} /> */}
                                            <View style={styles.DocumentPickers}>
                                            <TouchableOpacity onPress={handleCameraLaunch} style={{ backgroundColor: '#0000FF', width: '40%', borderRadius: 5 }}>
                                                <View style={{ flexDirection: 'row', width: '100%', margin: 6, gap: 10 }}>
                                                    <AttachmentIcon name='camera' size={20} color='#fff' />
                                                    <Text style={{ color: 'white' }}>Take Picture</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                            <Text>{ImgUrl}</Text>
                                        </>
                                    ) : null
                                    }
                                </View>

                            </View>
                            )
                           }
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Previous Coordinate</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        {ShopName && (
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text>
                                                    {`Latitude: ${findShopByLabel(ShopName)?.lat || 'N/A'}, Longitude: ${findShopByLabel(ShopName)?.long || 'N/A'}`}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Current Coordinate</Text>
                                    <Text>
                                        {`Latitude: ${currentCoordinate.latitude}, Longitude: ${currentCoordinate.longitude}`}
                                    </Text>
                                </View>
                            </View>

                            {
                                SMSId === 'Not Availible' ? null : (
                                    <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Shop on GPS Location</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                        ]}
                                        selectedValue={ShopGPSLocation}
                                        onValueChange={(value) => setShopGPSLocation(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                {
                                    ShopGPSLocation === 'No' ? (
                                        <>
                                            <View>
                                                <Text style={styles.label}>Comment</Text>
                                                <TextInput
                                                    placeholder='Comment'
                                                    multiline={true}
                                                    numberOfLines={10}
                                                    style={styles.input}
                                                    value={EnterShopGPSRecord}
                                                    onChangeText={(text) => setEnterShopGPSRecord(text)}
                                                />
                                            </View>
                                            <View>
                                                <Text style={styles.label}>In case of Mismatch in GPS Location screenshot of current location </Text>
                                                {/* <Button title='Take Picture' onPress={handleCameraLaunch2} color={'#0000FF'} /> */}
                                                <View style={styles.DocumentPickers}>
                                                    <TouchableOpacity onPress={handleCameraLaunch2} style={{ backgroundColor: '#0000FF', width: '40%', borderRadius: 5 }}>
                                                        <View style={{ flexDirection: 'row', width: '100%', margin: 6, gap: 10, }}>
                                                            <AttachmentIcon name='camera' size={20} color='#fff' />
                                                            <Text style={{ color: 'white' }}>Take Picture</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                                <Text>{gpsLocationImage}</Text>
                                            </View>
                                        </>
                                    ) : null
                                }
                            </View>
                                )
                            }
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Plan Compliance(Is this shop is auditing on planned date?)</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                        ]}
                                        selectedValue={PlanCompliance}
                                        onValueChange={(value)=>setPlanCompliance(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                {
                                    PlanCompliance === 'No' ? (
                                        <View>
                                            <Text style={styles.label}>Comment</Text>
                                            <TextInput
                                                placeholder='Comment'
                                                multiline={true}
                                                numberOfLines={10}
                                                style={styles.input}
                                                value={EnterPlanComplainceRecord}
                                                onChangeText={(text) => setEnterPlanComplianceRecord(text)}
                                            />
                                        </View>
                                    ) : null
                                }
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Control Type</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Spot Check', value: 'Spot Check' },
                                            { label: 'Accompany', value: 'Accompany' },
                                            { label: 'Call Back', value: 'Call Back' },
                                            { label: 'other', value: 'other' },
                                        ]}
                                        selectedValue={ControlType}
                                        onValueChange={(value) => setControlType(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                {
                                    ControlType === 'other' ? (
                                        <View>
                                            <Text style={styles.label}>Comment</Text>
                                            <TextInput
                                                placeholder='Comment'
                                                multiline={true}
                                                numberOfLines={10}
                                                style={styles.input}
                                                value={EnterControlledType}
                                                onChangeText={(text) => setEnterControlledType(text)}
                                            />
                                        </View>
                                    ) : null
                                }
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Category Handling</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },

                                        ]}
                                        selectedValue={CategoryHandling}
                                        onValueChange={(value) => setCategoryHandling(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                {
                                    CategoryHandling === 'No' ? (
                                        <View>
                                            <Text style={styles.label}>Comment</Text>
                                            <TextInput
                                                placeholder='Comment'
                                                multiline={true}
                                                numberOfLines={10}
                                                style={styles.input}
                                                value={EnterCategoryHandlingRecord}
                                                onChangeText={(text) => setEnterCategoryHandlingRecord(text)}
                                            />
                                        </View>
                                    ) : null
                                }
                            </View>
                            <View style={styles.questionContainer2}>
                                <View>
                                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 16, fontWeight: 'bold' }}>Category Name</Text>
                                </View>
                            </View>
                            {/* question rendered */}
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>BABY FORMULA</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={BabyFormula}
                                        onValueChange={(value) => setBabyFormula(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>BABY PERSONAL HYGIENE</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes'},
                                            { label: 'No', value: 'No'},
                                            { label: 'NA', value: 'NA'},
                                        ]}
                                        selectedValue={BabyHygeine}
                                        onValueChange={(value) => setBabyHygeine(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>BUTTER/MARG/EDIBLE FATS - AMBIENT</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes'},
                                            { label: 'No', value: 'No'},
                                            { label: 'NA', value: 'NA'},
                                        ]}
                                        selectedValue={butterAmbidient}
                                        onValueChange={(value) => setButterAmbdient(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>BUTTER/MARG/EDIBLE FATS - FRESH FIXED WEIGHT</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={butterMarg}
                                        onValueChange={(value) => setButterMarg(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>CAKES/GATEAUX - AMBIENT</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={CakeAmbident}
                                        onValueChange={(value) => setCakeAmbdient(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>CHEESE - AMBIENT</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes'},
                                            { label: 'No', value: 'No'},
                                            { label: 'NA', value: 'NA'},
                                        ]}
                                        selectedValue={CheseAmbdient}
                                        onValueChange={(value) => setCheseAmbdient(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>CHEESE-FRESH FIXED WEIGHT</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={CheseFresh}
                                        onValueChange={(value) => setCheseFresh(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>CHEESE-FROZEN</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={cheseFrozen}
                                        onValueChange={(value) => setCheseFrozen(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>CHOCOLATE NOVELTIES</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={chocolateNovelTies}
                                        onValueChange={(value) => setChocolateNovelTIes(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>CHOCOLATE/CHOCOLATE SUBSTITUTES-FIXED WEIGHT</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={chocolateSubsitues}
                                        onValueChange={(value) => setChocolateSubsitues(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>COOKING/EDIBLE OILS-AMBIENT</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={cookingAmbient}
                                        onValueChange={(value) => setCookingAmbient(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>COSMETIC REMOVAL</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={CosmeticRemoval}
                                        onValueChange={(value) => setCosmaticRemoval(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>DAIRY BASED DRINKS & DRINKING YOGURT</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={DairyBaseDrinks}
                                        onValueChange={(value) => setDairyBaseDrinks(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>DAIRY/MILK/CREAM/MODIFIERS - AMBIENT</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={DairyMilkAmbient}
                                        onValueChange={(value) => setDairyMilkAmbient(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>DRINKS FLAVOURED RTD</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={DrinksFlavouredRtd}
                                        onValueChange={(value) => setDrinksFlavouredRtd(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                {
                                    DrinksFlavouredRtd === 'Yes' ? (
                                        <View>
                                            <Text style={styles.label}>Stock-3 Availability</Text>
                                            <Dropdown
                                                placeholder="Select an option..."
                                                options={[
                                                    { label: 'Yes', value: 'Yes' },
                                                    { label: 'No', value: 'No' }
                                                ]}
                                                selectedValue={DrinksFlavouredRtdStockAvailibity}
                                                onValueChange={(value) => setDrinksFlavouredRtdStockAvailibity(value)}
                                                primaryColor={'green'}
                                            />
                                        </View>
                                    ) : null
                                }
                                <View>
                                    <Text style={styles.label}>ENRGY DRINK</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={EnergyDrink}
                                        onValueChange={(value) => setEnergyDrink(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                {
                                    EnergyDrink === 'Yes' ? (
                                        <View>
                                            <Text style={styles.label}>Stock-3 Availability</Text>
                                            <Dropdown
                                                placeholder="Select an option..."
                                                options={[
                                                    { label: 'Yes', value: 'Yes' },
                                                    { label: 'No', value: 'No' }
                                                ]}
                                                selectedValue={EnergyDrinkStockAvailibity}
                                                onValueChange={(value) => setEnergyDrinkStockAvailibity(value)}
                                                primaryColor={'green'}
                                            />
                                        </View>
                                    ) : null
                                }
                                <View>
                                    <Text style={styles.label}>FACIAL CLEANSING & TONING</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={facialToning}
                                        onValueChange={(value) => setFacialToning(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>HAIR CARE</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={HairCare}
                                        onValueChange={(value) => setHairCare(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>HERBS/SPICES/SALT/RECIPE SEASONING - AMBIENT</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={Herbs}
                                        onValueChange={(value) => setHerbs(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>INSECT CONTROL</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={InsectControl}
                                        onValueChange={(value) => setInsectControl(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>JUICES (10%-100%)</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={juices}
                                        onValueChange={(value) => setJuices(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                {
                                    juices === 'Yes' ? (
                                        <View>
                                            <Text style={styles.label}>Stock-3 Availability</Text>
                                            <Dropdown
                                                placeholder="Select an option..."
                                                options={[
                                                    { label: 'Yes', value: 'Yes' },
                                                    { label: 'No', value: 'No' }
                                                ]}
                                                selectedValue={juicesStockAvailibity}
                                                onValueChange={(value) => setJuicesStockAvailibity(value)}
                                                primaryColor={'green'}
                                            />
                                        </View>
                                    ) : null
                                }
                                <View>
                                    <Text style={styles.label}>LAUNDRY GENERAL CARE</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={LaundharyGeneral}
                                        onValueChange={(value) => setLaundharyGeneral(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>ORAL HYGIENE</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={OralHygeine}
                                        onValueChange={(value) => setOralHygeine(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>PERSONAL CLEANING & WASHING - GENERAL</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={PersonalCleaning}
                                        onValueChange={(value) => setPersonalCleaning(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>SAVOURY BISCUITS/CRACKERS - AMBIENT FIXED WEIGHT</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={SavouryBiscuits}
                                        onValueChange={(value) => setSavouryBiscuits(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>SHAVING/DEPILATION FEMALE</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={ShavingDepilationFemale}
                                        onValueChange={(value) => setShavingDepilationFemale(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>SHAVING/DEPILATION MALE</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={ShavingDepilationMale}
                                        onValueChange={(value) => setShavingDepilationMale(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>SKIN CONDITIONING/MOISTURISING</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={SkinConditioningMoisturing}
                                        onValueChange={(value) => setConditionMoisturing(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>SKIN TREATMENTS/DERMATOLOGICS</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={SkinTreatment}
                                        onValueChange={(value) => setSkinTreatment(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>SNACKS - FIXED WEIGHT</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={Snaks}
                                        onValueChange={(value) => setSnaks(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>SUGAR/CANDY - FIXED WEIGHT</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={SugarCandy}
                                        onValueChange={(value) => setSugarCandy(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>SWEET BISCUITS - AMBIENT</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={SweetBiscuit}
                                        onValueChange={(value) => setSweetBiscuit(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>TEA & INFUSIONS</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={TeaInfusion}
                                        onValueChange={(value) => setTeaInfusion(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>WATER</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                            { label: 'NA', value: 'NA' },
                                        ]}
                                        selectedValue={Water}
                                        onValueChange={(value) => setWater(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                                {
                                    Water === 'Yes' ? (
                                        <View>
                                            <Text style={styles.label}>Stock-3 Availability</Text>
                                            <Dropdown
                                                placeholder="Select an option..."
                                                options={[
                                                    { label: 'Yes', value: 'Yes' },
                                                    { label: 'No', value: 'No' }
                                                ]}
                                                selectedValue={WaterStockAvailibity}
                                                onValueChange={(value) => setWaterStockAvailibity(value)}
                                                primaryColor={'green'}
                                            />
                                        </View>
                                    ) : null
                                }
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Comment</Text>
                                    <TextInput
                                        placeholder='Comment'
                                        multiline={true}
                                        numberOfLines={10}
                                        style={styles.input}
                                        value={Comment}
                                        onChangeText={(text) => setComment(text)}
                                    />
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Picture 1 </Text>
                                    {/* <Button title='Take Picture' onPress={handleCameraLaunch3} color={'#0000FF'} /> */}
                                    <View style={styles.DocumentPickers}>
                                        <TouchableOpacity onPress={handleCameraLaunch3} style={{ backgroundColor: '#0000FF', width: '40%', borderRadius: 5 }}>
                                            <View style={{ flexDirection: 'row', width: '100%', margin: 6, gap: 10, }}>
                                                <AttachmentIcon name='camera' size={20} color='#fff' />
                                                <Text style={{ color: 'white' }}>Take Picture</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <Text>{ImgUrl1}</Text>
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Picture 2 </Text>
                                    {/* <Button title='Take Picture' onPress={handleCameraLaunch4} color={'#0000FF'} /> */}
                                    <View style={styles.DocumentPickers}>
                                        <TouchableOpacity onPress={handleCameraLaunch4} style={{ backgroundColor: '#0000FF', width: '40%', borderRadius: 5 }}>
                                            <View style={{ flexDirection: 'row', width: '100%', margin: 6, gap: 10, }}>
                                                <AttachmentIcon name='camera' size={20} color='#fff' />
                                                <Text style={{ color: 'white' }}>Take Picture</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <Text>{ImgUrl2}</Text>
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Picture 3 </Text>
                                    {/* <Button title='Take Picture' onPress={handleCameraLaunch5} color={'#0000FF'} /> */}
                                    <View style={styles.DocumentPickers}>
                                        <TouchableOpacity onPress={handleCameraLaunch5} style={{ backgroundColor: '#0000FF', width: '40%', borderRadius: 5 }}>
                                            <View style={{ flexDirection: 'row', width: '100%', margin: 6, gap: 10, }}>
                                                <AttachmentIcon name='camera' size={20} color='#fff' />
                                                <Text style={{ color: 'white' }}>Take Picture</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <Text>{ImgUrl3}</Text>
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Picture 4 </Text>
                                    {/* <Button title='Take Picture' onPress={handleCameraLaunch6} color={'#0000FF'} /> */}
                                    <View style={styles.DocumentPickers}>
                                        <TouchableOpacity onPress={handleCameraLaunch6} style={{ backgroundColor: '#0000FF', width: '40%', borderRadius: 5 }}>
                                            <View style={{ flexDirection: 'row', width: '100%', margin: 6, gap: 10, }}>
                                                <AttachmentIcon name='camera' size={20} color='#fff' />
                                                <Text style={{ color: 'white' }}>Take Picture</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <Text>{ImgUrl4}</Text>
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Picture 5 </Text>
                                    {/* <Button title='Take Picture' onPress={handleCameraLaunch7} color={'#0000FF'} /> */}
                                    <View style={styles.DocumentPickers}>
                                        <TouchableOpacity onPress={handleCameraLaunch7} style={{ backgroundColor: '#0000FF', width: '40%', borderRadius: 5 }}>
                                            <View style={{ flexDirection: 'row', width: '100%', margin: 6, gap: 10, }}>
                                                <AttachmentIcon name='camera' size={20} color='#fff' />
                                                <Text style={{ color: 'white' }}>Take Picture</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <Text>{ImgUrl5}</Text>
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>15% Lines Checked of the Stock</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                        ]}
                                        selectedValue={lineCheckofStock}
                                        onValueChange={(value) => setLineCheckofStock(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Total Lines done till the time of Visit</Text>
                                    <TextInput
                                        placeholder='Enter'
                                        inputMode='numeric'
                                        keyboardType='number-pad'
                                        style={styles.input}
                                        value={totalNumberofLine}
                                        onChangeText={(text) => setTotalNumberofLines(text)}
                                    />
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Total Lines Checked</Text>
                                    <TextInput
                                        placeholder='Enter'
                                        inputMode='numeric'
                                        keyboardType='number-pad'
                                        style={styles.input}
                                        value={totalLinechecked}
                                        onChangeText={(text) => setTotalLineChecked(text)}
                                    />
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>#Of Lines Counted Correctly </Text>
                                    <TextInput
                                        placeholder='Enter'
                                        inputMode='numeric'
                                        keyboardType='number-pad'
                                        style={styles.input}
                                        value={LinesCountedCorrectly}
                                        onChangeText={(text) => setLinesCountedCorrectly(text)}
                                    />
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>%of Correct Lines </Text>
                                    <TextInput
                                        placeholder='Enter'
                                        style={styles.input}
                                        value={result1}
                                    />
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>15% Lines Checked of the Purchases</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                        ]}
                                        selectedValue={LineCheckedofPurchases}
                                        onValueChange={(value) => setLineCheckofPurchases(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Auditor Collected Purchase Lines</Text>
                                    <TextInput
                                        placeholder='Enter'
                                        inputMode='numeric'
                                        keyboardType='number-pad'
                                        style={styles.input}
                                        value={auditorCollectLinePurchase}
                                        onChangeText={(text) => setAuditorCollectedLinesPurchase(text)}
                                    />
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Total Lines Checked</Text>
                                    <TextInput
                                        placeholder='Enter'
                                        inputMode='numeric'
                                        keyboardType='number-pad'
                                        style={styles.input}
                                        value={totalLinecheckedAuditor}
                                        onChangeText={(text) => setTotalLineCheckedAuditor(text)}
                                    />
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>#Of Lines Purchases Match with Auditor  Purchases</Text>
                                    <TextInput
                                        placeholder='Enter'
                                        inputMode='numeric'
                                        keyboardType='number-pad'
                                        style={styles.input}
                                        value={LinesPurchasesMatchwithAuditor}
                                        onChangeText={(text) => setLinesPurchasesMatchwithAuditor(text)}
                                    />
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>%of Correct Purchases </Text>
                                    <TextInput
                                        placeholder='Enter'
                                        style={styles.input}
                                        value={result2}
                                    />
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Supervisor will ask minimum 8 Questions to gauge auditor knowledge on SOPs and etc.(#of questions ask from auditor)</Text>
                                    <Dropdown
                                        placeholder="Select an option..."
                                        options={[
                                            { label: 'Yes', value: 'Yes' },
                                            { label: 'No', value: 'No' },
                                        ]}
                                        selectedValue={supervisorAskQuestion}
                                        onValueChange={(value) => setSupervisorAskQuestion(value)}
                                        primaryColor={'green'}
                                    />
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>#of questions asked from auidtor</Text>
                                    <TextInput
                                        placeholder='Enter'
                                        inputMode='numeric'
                                        keyboardType='number-pad'
                                        style={styles.input}
                                        value={askquestionFromauditor}
                                        onChangeText={(text) => setAskQuestionfromAuditor(text)}
                                    />
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>(#of as which answers auditor delivered correctly)</Text>
                                    <TextInput
                                        placeholder='Enter'
                                        inputMode='numeric'
                                        keyboardType='number-pad'
                                        style={styles.input}
                                        value={auditorAnswerCorrectly}
                                        onChangeText={(text) => setAnswerAuditorCorrectly(text)}
                                    />
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>%of Correct Answers</Text>
                                    {/* <Text>{auditorAnswerCorrectly / askquestionFromauditor * 100}</Text> */}
                                    <TextInput
                                        placeholder='Enter'
                                        style={styles.input}
                                        value={result3}
                                    />
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Supervisor Feedback</Text>
                                    <TextInput
                                        placeholder='Enter'
                                        style={styles.input}
                                        value={supervisorFeedback}
                                        onChangeText={(text) => setSupervisorFeedback(text)}
                                    />
                                </View>
                            </View>
                            <View style={styles.questionContainer1}>
                                <View>
                                    <Text style={styles.label}>Auditor Comment</Text>
                                    <TextInput
                                        placeholder='Enter'
                                        style={styles.input}
                                        value={AuditorComment}
                                        onChangeText={(text) => setAuditorComment(text)}
                                    />
                                </View>
                            </View>
                            {/* <View style={{}}>
                            <Button
                                title='Submit Form'
                                color='#1e76ba'
                                onPress={uploadDataSvr}
                            />
                            <Button 
                             title='Save as Draft'
                             color='green'
                             onPress={uploadSurvey}
                            />
                            </View> */}


                        </>
                    )

                }
            </ScrollView >
            <View style={{ width: '100%', gap: 10 }}>
                <Button
                    title='Submit Form'
                    color='#1e76ba'
                    onPress={uploadDataSvr}
                />
                <View style={{ marginBottom: 5 }}>
                    <Button
                        title='Save as Draft'
                        color='green'
                        onPress={storeDataAndImages}
                    />
                </View>

            </View>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        paddingVertical: 20
    },
    questionContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        padding: 15,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 5,
    },
    questionContainer1: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        marginTop: 10,
        padding: 15,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 5,
    },
    questionContainer2: {
        backgroundColor: 'red',
        paddingHorizontal: 20,
        marginTop: 10,
        padding: 15,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 5,
    },
    input: {
        width: '100%',
        height: 40,
        color: 'black',
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 15,
        padding: 10,
        borderRadius: 5,

    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    errorText: {
        color: 'red',
        marginTop: 5,
      },
})
