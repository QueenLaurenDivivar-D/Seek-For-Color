import { useState } from "react"
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { auth } from "../firebaseConfig"
import { signInWithEmailAndPassword } from "firebase/auth"

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password)
      console.log("✅ Signed in:", userCredential.user.email)
      Alert.alert("Success", "Signed in successfully!")
      router.push("/explore")
    } catch (error) {
      console.error("❌ Signin failed:", error.code, error.message)
      let message = "Unable to sign in."

      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
          message = "Incorrect email or password."
          break
        case "auth/user-not-found":
          message = "No account found with this email."
          break
        case "auth/invalid-email":
          message = "Please enter a valid email."
          break
      }

      Alert.alert("Signin Failed", message)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#777772"
        autoCapitalize="none"
        keyboardType="email-address"
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

      <Pressable style={styles.buttonPrimary} onPress={handleSignIn}>
        <Text style={styles.buttonPrimaryText}>Sign In</Text>
      </Pressable>

      <Text style={styles.orText}>or continue with</Text>

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
    backgroundColor: "#0f172a", // Dark navy background like landing page
    padding: 20 
  },
  title: { 
    fontSize: 32, 
    fontWeight: "900", // Bolder weight like landing page
    color: "#ffffff", // White text on dark background
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: { 
    fontSize: 18, 
    color: "#e2e8f0", // Light gray text
    marginBottom: 40,
    textAlign: "center",
    fontWeight: "400",
  },
  input: { 
    width: "90%", 
    backgroundColor: "#1e293b", // Dark background like landing page elements
    padding: 16, 
    borderRadius: 20, // More rounded like landing page
    marginVertical: 12, 
    fontSize: 16, 
    color: "#ffffff", // White text
    borderWidth: 1, 
    borderColor: "#475569", // Darker border
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonPrimary: { 
    backgroundColor: "#f59e0b", // Amber color like landing page explore button
    padding: 18, 
    borderRadius: 25, // More rounded like landing page
    width: "90%", 
    alignItems: "center", 
    marginTop: 24,
    shadowColor: "#f59e0b",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  buttonPrimaryText: { 
    color: "#fff", 
    fontWeight: "800", // Bolder like landing page
    fontSize: 18,
    letterSpacing: 0.3,
  },
  orText: { 
    marginVertical: 25, 
    color: "#94a3b8", // Lighter gray
    fontSize: 16,
    fontWeight: "500",
  },
  socialRow: { 
    flexDirection: "row", 
    justifyContent: "center", 
    gap: 20, // Slightly more spacing
    marginBottom: 30 
  },
  socialButton: { 
    backgroundColor: "#1e293b", // Dark background like other elements
    padding: 16, 
    borderRadius: 50, 
    borderWidth: 1, 
    borderColor: "#334155", // Darker border
    alignItems: "center", 
    justifyContent: "center", 
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    width: 56,
    height: 56,
  },
  link: { 
    marginTop: 20, 
    color: "#3b82f6", // Blue accent color like landing page
    fontWeight: "600",
    fontSize: 16,
  },
})
