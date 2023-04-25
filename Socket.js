import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { requestForegroundPermissionsAsync, watchPositionAsync } from 'expo-location';
import io from 'socket.io-client';

const SOCKET_URL = 'https://example.com'; // WebSocket URL

export default function Socket() {
  const [socket, setSocket] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      const location = await watchPositionAsync({}, (location) => {
        setLocation(location);
      });
    })();
  }, []);

  useEffect(() => {
    // Connect to WebSocket server
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    return () => {
      // Disconnect from WebSocket server
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Send location data to server when location is updated
    if (socket && location) {
      socket.emit('location', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  }, [socket, location]);

  return (
    <View style={styles.container}>
      {location ? (
        <>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
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