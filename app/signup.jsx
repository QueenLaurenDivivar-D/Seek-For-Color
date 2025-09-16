import { useState } from "react"
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native"
import { useRouter } from "expo-router"

export default function SignUp() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }
    // 🔑 Replace this with Firebase Auth later
    console.log("Signing up with:", email, password)
    router.push("/home") // redirect after sign up
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Pressable style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/signin")}>
        <Text style={styles.link}>Already have an account? Sign In</Text>
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
