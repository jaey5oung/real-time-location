import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Location from 'expo-location';
import io from 'socket.io-client';

const SOCKET_URL = 'http://211.228.42.81:4000'; // WebSocket URL
const LocationAccuracy = Location.Accuracy; // Define LocationAccuracy

export default function App() {
  const [socket, setSocket] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const isStarted = await Location.hasStartedLocationUpdatesAsync('background');
      if (!isStarted) {
        await Location.startLocationUpdatesAsync('background', {
          accuracy: LocationAccuracy.Balanced,
        });
      }

      const location = await Location.watchPositionAsync({
        accuracy: LocationAccuracy.Balanced,
        timeInterval: 5000,
      }, (location) => {
        setLocation(location);
      });
    })();
  }, [location]);

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


// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// import * as Location from 'expo-location';
// import io from 'socket.io-client';

// const SOCKET_URL = 'http://211.228.42.81:4000'; // WebSocket URL

// export default function App() {
//   const [socket, setSocket] = useState(null);
//   const [location, setLocation] = useState(null);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         console.log('Permission to access location was denied');
//         return;
//       }

//       const hasStarted = await Location.hasStartedLocationUpdatesAsync('background');
//       if (!hasStarted) {
//         await Location.startLocationUpdatesAsync('background', {
//           accuracy: Location.Accuracy.Balanced,
//           distanceInterval: 10,
//           deferredUpdatesInterval: 1000 * 60 * 5, // 5 minutes
//           foregroundService: {
//             notificationTitle: 'Location Tracking',
//             notificationBody: 'Location tracking is running.',
//             notificationColor: '#FFFFFF',
//           },
//         });
//       }

//       const location = await Location.getLastKnownPositionAsync();
//       setLocation(location);

//       const subscriber = await Location.watchPositionAsync(
//         {
//           accuracy: Location.Accuracy.Balanced,
//           timeInterval: 1000,
//           distanceInterval: 10,
//         },
//         (location) => {
//           setLocation(location);
//         },
//       );

//       return () => subscriber.remove();
//     })();
//   }, []);

//   useEffect(() => {
//     // Connect to WebSocket server
//     const newSocket = io(SOCKET_URL);
//     setSocket(newSocket);

//     return () => {
//       // Disconnect from WebSocket server
//       newSocket.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     // Send location data to server when location is updated
//     if (socket && location) {
//       socket.emit('location', {
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });
//     }
//   }, [socket, location]);

//   return (
//     <View style={styles.container}>
//       {location ? (
//         <>
//           <Text>Latitude: {location.coords.latitude}</Text>
//           <Text>Longitude: {location.coords.longitude}</Text>
//         </>
//       ) : (
//         <Text>Waiting for location...</Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });