import { useState } from "react"
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignIn = () => {
    console.log("Signing in with:", email, password)
    router.push("/home") // redirect after sign in
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#777772"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#777772"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Sign In Button */}
      <Pressable style={styles.buttonPrimary} onPress={handleSignIn}>
        <Text style={styles.buttonPrimaryText}>Sign In</Text>
      </Pressable>

      {/* Divider */}
      <Text style={styles.orText}>or continue with</Text>

      {/* Social Buttons */}
      <View style={styles.socialRow}>
        <Pressable style={styles.socialButton}>
          <Ionicons name="logo-google" size={22} color="#DB4437" />
        </Pressable>
        <Pressable style={styles.socialButton}>
          <Ionicons name="logo-facebook" size={22} color="#1877F2" />
        </Pressable>
        <Pressable style={styles.socialButton}>
          <Ionicons name="logo-apple" size={22} color="#000" />
        </Pressable>
      </View>

      {/* Link to Sign Up */}
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
    backgroundColor: "#FFFFFF", // clean white like landing page
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E293B", // dark navy/black for headings
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#475569", // softer gray-blue for subtext
    marginBottom: 30,
  },
  input: {
    width: "90%",
    backgroundColor: "#F1F5F9", // light gray input background
    padding: 14,
    borderRadius: 8,
    marginVertical: 10,
    fontSize: 15,
    color: "#1E293B",
    borderWidth: 1,
    borderColor: "#CBD5E1", // subtle border like search bar
  },
  buttonPrimary: {
    backgroundColor: "#2563EB", // bright blue like Explore Palettes button
    padding: 16,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonPrimaryText: {
    color: "#FFFFFF", // white text
    fontWeight: "700",
    fontSize: 16,
  },
  orText: {
    marginVertical: 20,
    color: "#64748B", // muted gray-blue
    fontSize: 14,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginBottom: 25,
  },
  socialButton: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#CBD5E1", // light gray border
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  link: {
    marginTop: 15,
    color: "#2563EB", // link blue
    fontWeight: "500",
  },
});
