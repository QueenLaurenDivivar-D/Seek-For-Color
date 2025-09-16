import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function AuthLanding() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* SIGN UP Card */}
      <View style={styles.card}>
        <Text style={styles.title}>SIGN UP</Text>
        <TextInput placeholder="Email" style={styles.input} placeholderTextColor="#666" />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#666"
        />
        <Pressable
          style={styles.button}
          onPress={() => router.push("/signup")} // ✅ Navigate to signup.jsx
        >
          <Text style={styles.buttonText}>SIGN UP</Text>
        </Pressable>
      </View>

      {/* LOGIN Card */}
      <View style={styles.card}>
        <Text style={styles.title}>LOGIN</Text>
        <TextInput placeholder="Email" style={styles.input} placeholderTextColor="#666" />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#666"
        />
        <Pressable
          style={styles.button}
          onPress={() => router.push("/signin")} // ✅ Navigate to signin.jsx
        >
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
