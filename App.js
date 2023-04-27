import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, Button } from "react-native"
import {
  requestForegroundPermissionsAsync,
  watchPositionAsync,
} from "expo-location"
import io from "socket.io-client"

const SOCKET_URL = "http://211.228.42.81:4000" // WebSocket URL

export default function App() {
  const [socket, setSocket] = useState(null)
  const [location, setLocation] = useState(null)

  useEffect(() => {
    ;(async () => {
      const { status } = await requestForegroundPermissionsAsync()
      if (status !== "granted") {
        console.log("Permission to access location was denied")
        return
      }
      const location = await watchPositionAsync({}, (location) => {
        setLocation(location)
      })
    })()
  }, [location])

  useEffect(() => {
    // Connect to WebSocket server
    const newSocket = io(SOCKET_URL)
    setSocket(newSocket)

    return () => {
      // Disconnect from WebSocket server
      newSocket.disconnect()
    }
  }, [])

  useEffect(() => {
    // Send location data to server when location is updated
    if (socket && location) {
      socket.emit("location", {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })
    }
  }, [socket, location])

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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})


// ! 디바이스 백그라운드 상태일때 고려

// import React, { useState, useEffect } from "react"
// import { StyleSheet, Text, View } from "react-native"
// import * as Location from "expo-location"
// import * as TaskManager from "expo-task-manager"
// const LOCATION_TASK_NAME = "background-location-task"

// TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
//   if (error) {
//     console.log(error)
//     return
//   }
//   if (data) {
//     const { locations } = data
//     console.log(locations)
//     // 업데이트된 위치 정보를 저장하거나 다른 작업 수행
//   }
// })

// export default function App() {
//   const [location, setLocation] = useState(null)
//   useEffect(() => {
//     ;(async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync()
//       if (status !== "granted") {
//         console.log("Permission to access location was denied")
//         return
//       }

//       await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
//         accuracy: Location.Accuracy.Highest,
//         timeInterval: 1000, // 1 seconds
//         distanceInterval: 1, // 1 meters
//         deferredUpdatesInterval: 1000, // 1 seconds
//         foregroundService: {
//           notificationTitle: "Location Update",
//           notificationBody: "Your location is being tracked",
//           notificationColor: "#ff5a5f",
//         },
//       })
//     })()
//   }, [])

//   return (
//     <View style={styles.container}>
//       {location ? (
//         <>
//           <Text>위도: {location.coords.latitude}</Text>
//           <Text>경도: {location.coords.longitude}</Text>
//         </>
//       ) : (
//         <Text>Waiting for location...</Text>
//       )}
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// })
