import { View, Text, Pressable, StyleSheet } from "react-native"
import { useRouter } from "expo-router"

export default function AuthHome() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seek For Color</Text>
      <Text style={styles.subtitle}>Welcome! Please sign in or sign up</Text>

      <Pressable style={styles.button} onPress={() => router.push("/signin")}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push("/signup")}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F2D5", // soft off-white background
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4E4C45", // dark charcoal
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#777772", // medium gray
    marginBottom: 30,
  },
  button: {
    borderWidth: 1,             // thinner border
    borderColor: "#4E4C45",     // dark charcoal border
    padding: 14,
    borderRadius: 8,
    marginVertical: 10,
    width: 200,
    alignItems: "center",
    backgroundColor: "transparent", // transparent inside
  },
  buttonText: {
    color: "#4E4C45", // text matches border
    fontSize: 16,
    fontWeight: "400", // normal, not bold
  },
})
