import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.log(error);
    return;
  }
  if (data) {
    const { locations } = data;
    console.log(locations);
    // 업데이트된 위치 정보를 저장하거나 다른 작업 수행
  }
});

export default function App() {
  const [location, setLocation] = useState(null);
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('위치 액서스 권한이 거부되었습니다');
        return;
      }
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 1000, // 1 seconds
        distanceInterval: 1, // 1 meters
        deferredUpdatesInterval: 1000, // 1 seconds
        foregroundService: {
          notificationTitle: 'Location Update',
          notificationBody: 'Your location is being tracked',
          notificationColor: '#ff5a5f',
        },
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      {location ? (
        <>
          <Text>위도: {location.coords.latitude}</Text>
          <Text>경도: {location.coords.longitude}</Text>
        </>
      ) : (
        <Text>Waiting for location...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});