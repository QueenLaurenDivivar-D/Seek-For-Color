import { useState } from "react"
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native"
import { useRouter } from "expo-router"

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignIn = () => {
    // 🔑 Replace this with Firebase Auth later
    console.log("Signing in with:", email, password)
    router.push("/home") // redirect after sign in
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/signup")}>
        <Text style={styles.link}>Don’t have an account? Sign Up</Text>
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
  },
  subtitle: {
    fontSize: 16,
    color: "#777772", // medium gray
    marginBottom: 30,
  },
  input: {
    width: "90%",
    backgroundColor: "#D6D3C9", // light gray input box
    padding: 14,
    borderRadius: 8,
    marginVertical: 10,
    color: "#4E4C45", // input text dark
  },
  button: {
    backgroundColor: "#4E4C45", // dark charcoal button
    padding: 16,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#F9F6DC", // pale yellowish cream text
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    marginTop: 15,
    color: "#777772", // medium gray for link
  },
})
