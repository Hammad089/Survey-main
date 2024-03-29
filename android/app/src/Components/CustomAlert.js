import {  View,
    StyleSheet,
    Button,
    Modal,
    Image,
    Text,
    TouchableOpacity,
    Animated, } from 'react-native'
import React, { useState } from 'react'
const ModalPoup = ({visible,children}) => {
    const [showModal,setShowModal] = useState(false);
    const scaleValue = React.useRef(new Animated(0)).current
    React.useEffect(()=>{
        toggleModal()
    },[visible])

    const toggleModal = () => {
        if(visible) {
            setShowModal(true)
            Animated.spring(scaleValue,{
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start()
        }
        else {
            setTimeout(() => setShowModal(false), 200);
            Animated.timing(scaleValue, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start();
        }
    }
    return (
        <Modal transparent visible={showModal}>
            <View style={StyleSheet.mainBackGround}>
            <Animated.View
          style={[styles.modalContainer, {transform: [{scale: scaleValue}]}]}>
          {children}
        </Animated.View>
            </View>
        </Modal>
    )
}
const CustomAlert = () => {
    const [visible, setVisible] = React.useState(false);
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ModalPoup visible={visible}>
        <View style={{alignItems: 'center'}}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Image
                source={require('../Assests/x.png')}
                style={{height: 30, width: 30}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../Assests/success.png')}
            style={{height: 150, width: 150, marginVertical: 10}}
          />
        </View>

        <Text style={{marginVertical: 30, fontSize: 20, textAlign: 'center'}}>
          Congratulations registration was successful
        </Text>
      </ModalPoup>
      <Button title="Open Modal" onPress={() => setVisible(true)} />
    </View>
  )
}
const styles =  StyleSheet.create({
    mainBackGround:{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer:{
        width: '80%',
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 30,
        borderRadius: 20,
        elevation: 20,
    },
    header:{
        width: '100%',
        height: 40,
        alignItems: 'flex-end',
        justifyContent: 'center',
    }
})
export default CustomAlert