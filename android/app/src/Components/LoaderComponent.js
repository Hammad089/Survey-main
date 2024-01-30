import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const LoaderComponent = () => {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#3498db" />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoaderComponent;