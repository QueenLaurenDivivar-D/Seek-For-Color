import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../firebaseConfig"; // ✅ make sure path is correct
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function AuthLanding() {
  const router = useRouter();

  // States for email & password (both signup and login)
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // 🔹 Handle Sign Up
  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      Alert.alert("Success", "Account created successfully!");
      router.push("/home"); // go to home after signup
    } catch (error) {
      Alert.alert("Sign Up Failed", error.message);
    }
  };

  // 🔹 Handle Login
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      Alert.alert("Welcome back!", "You are logged in.");
      router.push("/home"); // go to home after login
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* SIGN UP Card */}
      <View style={styles.card}>
        <Text style={styles.title}>SIGN UP</Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          placeholderTextColor="#666"
          value={signupEmail}
          onChangeText={setSignupEmail}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#666"
          value={signupPassword}
          onChangeText={setSignupPassword}
        />
        <Pressable style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </Pressable>
      </View>

      {/* LOGIN Card */}
      <View style={styles.card}>
        <Text style={styles.title}>LOGIN</Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          placeholderTextColor="#666"
          value={loginEmail}
          onChangeText={setLoginEmail}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#666"
          value={loginPassword}
          onChangeText={setLoginPassword}
        />
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </Pressable>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e3a5f", // navy blue
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 10,
    width: "45%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1e3a5f",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#1e3a5f",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  forgot: {
    marginTop: 10,
    fontSize: 12,
    textAlign: "right",
    color: "#1e3a5f",
  },
});
