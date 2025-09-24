import { useState } from "react"
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { auth } from "../firebaseConfig"
import { createUserWithEmailAndPassword } from "firebase/auth"

export default function SignUp() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

const handleSignUp = async () => {
  if (password !== confirmPassword) {
    Alert.alert("Error", "Passwords do not match")
    return
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    )
    console.log("✅ User created:", userCredential.user.email)

    // ✅ Go straight to Explore page
    router.replace("/signin")

  } catch (error) {
    console.error("❌ Signup failed:", error.code, error.message)
    let message = "Something went wrong."

    switch (error.code) {
      case "auth/email-already-in-use":
        message = "This email is already registered. Please sign in."
        break
      case "auth/invalid-email":
        message = "The email address is not valid."
        break
      case "auth/weak-password":
        message = "Password should be at least 6 characters."
        break
    }

    Alert.alert("Signup Failed", message)
  }
}

 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#777772"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Pressable style={styles.buttonPrimary} onPress={handleSignUp}>
        <Text style={styles.buttonPrimaryText}>Sign Up</Text>
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
    gap: 20, // Slightly more spacing (mobile-safe spacing)
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
    marginHorizontal: 10, // Alternative to gap for mobile compatibility
  },
  link: { 
    marginTop: 20, 
    color: "#3b82f6", // Blue accent color like landing page
    fontWeight: "600",
    fontSize: 16,
  },
})
