import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"
import { SeekColorProvider } from '../../context/SeekColorContext';

export default function SeekColorLayout() {
  
  return (
  <SeekColorProvider>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'grey',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore Colors',
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              size={24} 
              name={focused ? 'color-palette' : 'color-palette-outline'} 
              color="black"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              size={24} 
              name={focused ? 'heart' : 'heart-outline'} 
              color="black"
            />
          ),
        }}
      />
    </Tabs>
    </SeekColorProvider>
  )
}
