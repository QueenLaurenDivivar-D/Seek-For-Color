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
  const [isLoading, setIsLoading] = useState(false)

  const validateInputs = () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter an email address")
      return false
    }
    
    if (!password) {
      Alert.alert("Error", "Please enter a password")
      return false
    }
    
    if (!confirmPassword) {
      Alert.alert("Error", "Please confirm your password")
      return false
    }
    
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return false
    }
    
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long")
      return false
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Error", "Please enter a valid email address")
      return false
    }
    
    return true
  }

  const handleSignUp = async () => {
    if (!validateInputs()) {
      return
    }

    setIsLoading(true)

    try {
      console.log("🔄 Attempting to create user with email:", email.trim())
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      )
      
      console.log("✅ User created successfully:", userCredential.user.email)
      console.log("✅ User UID:", userCredential.user.uid)

      Alert.alert(
        "Success!", 
        "Account created successfully. Please sign in.",
        router.push("/explore")
        [
          {
            text: "OK",
            onPress: () => router.replace("/signin")
          }
        ]
      )

    } catch (error) {
      console.error("❌ Signup failed:", error.code, error.message)
      console.error("❌ Full error:", error)
      
      let message = "Something went wrong. Please try again."

      switch (error.code) {
        case "auth/email-already-in-use":
          message = "This email is already registered. Please sign in instead."
          break
        case "auth/invalid-email":
          message = "The email address is not valid."
          break
        case "auth/weak-password":
          message = "Password should be at least 6 characters."
          break
        case "auth/network-request-failed":
          message = "Network error. Please check your internet connection."
          break
        case "auth/too-many-requests":
          message = "Too many failed attempts. Please try again later."
          break
        default:
          message = `Error: ${error.message}`
      }

      Alert.alert("Signup Failed", message)
    } finally {
      setIsLoading(false)
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
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password (min 6 characters)"
        placeholderTextColor="#777772"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#777772"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        editable={!isLoading}
      />

      <Pressable 
        style={[
          styles.buttonPrimary, 
          isLoading && styles.buttonDisabled
        ]} 
        onPress={handleSignUp}
        disabled={isLoading}
      >
        <Text style={styles.buttonPrimaryText}>
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Text>
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

      <Pressable onPress={() => router.push("/signin")} disabled={isLoading}>
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
    backgroundColor: "#0f172a",
    padding: 20 
  },
  title: { 
    fontSize: 32, 
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: { 
    fontSize: 18, 
    color: "#e2e8f0",
    marginBottom: 40,
    textAlign: "center",
    fontWeight: "400",
  },
  input: { 
    width: "90%", 
    backgroundColor: "#1e293b",
    padding: 16, 
    borderRadius: 20,
    marginVertical: 12, 
    fontSize: 16, 
    color: "#ffffff",
    borderWidth: 1, 
    borderColor: "#475569",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonPrimary: { 
    backgroundColor: "#f59e0b",
    padding: 18, 
    borderRadius: 25,
    width: "90%", 
    alignItems: "center", 
    marginTop: 24,
    shadowColor: "#f59e0b",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: "#92400e",
    opacity: 0.7,
  },
  buttonPrimaryText: { 
    color: "#fff", 
    fontWeight: "800",
    fontSize: 18,
  },
  orText: { 
    marginVertical: 25, 
    color: "#94a3b8",
    fontSize: 16,
    fontWeight: "500",
  },
  socialRow: { 
    flexDirection: "row", 
    justifyContent: "center", 
    gap: 20,
    marginBottom: 30 
  },
  socialButton: { 
    backgroundColor: "#1e293b",
    padding: 16, 
    borderRadius: 50, 
    borderWidth: 1, 
    borderColor: "#334155",
    alignItems: "center", 
    justifyContent: "center", 
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    width: 56,
    height: 56,
    marginHorizontal: 10,
  },
  link: { 
    marginTop: 20, 
    color: "#3b82f6",
    fontWeight: "600",
    fontSize: 16,
  },
})