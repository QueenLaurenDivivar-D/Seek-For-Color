import { View, Text, Pressable } from "react-native"
import { useRouter } from "expo-router"

export default function Home() {
  const router = useRouter()

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Welcome Home 🎉</Text>

      <Pressable
        style={{ marginTop: 20 }}
        onPress={() => router.push("/signin")}
      >
        <Text style={{ color: "blue" }}>Log Out</Text>
      </Pressable>
    </View>
  )
}
