// app/_layout.js
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { FavoritesProvider } from "./FavoritesContext" // ✅ import

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="goals" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </FavoritesProvider>
  )
}
