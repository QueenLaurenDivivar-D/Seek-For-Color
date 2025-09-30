// app/index.js
import { View, Text, Pressable, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"

const { width: screenWidth } = Dimensions.get('window')

export default function LandingPage() {
  const router = useRouter()

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <View style={styles.logo}>
          <Ionicons name="color-palette" size={24} color="#2563EB" />
          <Text style={styles.logoText}>Seek For Color</Text>
        </View>

        <View style={styles.navRight}>
          
          <TouchableOpacity style={styles.signUpBtn} onPress={() => router.push("/signup")}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Browse, explore, and save your favorite shades—all in one place</Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#6B7280" style={{ marginHorizontal: 6 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search colors, palettes, or keywords..."
            placeholderTextColor="#6B7280"
          />
        </View>

        {/* CTA Button */}
        <Pressable style={styles.exploreBtn} onPress={() => router.push("/explore2")}>
          <Text style={styles.exploreBtnText}>Explore Palettes</Text>
        </Pressable>
      </View>

      {/* Decorative Palettes Showcase */}
      <View style={styles.showcaseWrapper}>
        <View style={styles.showcaseCard}>
          <View style={styles.colorContainer}>
            <View style={[styles.showcaseColor, { backgroundColor: "#8dafdbff" }]} />
            <View style={[styles.showcaseColor, { backgroundColor: "#6689e9ff" }]} />
            <View style={[styles.showcaseColor, { backgroundColor: "#284a7cff" }]} />
          </View>
          <Text style={styles.showcaseTitle}>Soft Sunrise</Text>
        </View>

        <View style={styles.showcaseCard}>
          <View style={styles.colorContainer}>
            <View style={[styles.showcaseColor, { backgroundColor: "#5696caff" }]} />
            <View style={[styles.showcaseColor, { backgroundColor: "#d9e4eeff" }]} />
            <View style={[styles.showcaseColor, { backgroundColor: "#183c55ff" }]} />
          </View>
          <Text style={styles.showcaseTitle}>Ocean Breeze</Text>
        </View>

        <View style={styles.showcaseCard}>
          <View style={styles.colorContainer}>
            <View style={[styles.showcaseColor, { backgroundColor: "#237b91ff" }]} />
            <View style={[styles.showcaseColor, { backgroundColor: "#3b6f79ff" }]} />
            <View style={[styles.showcaseColor, { backgroundColor: "#97eaf0ff" }]} />
          </View>
          <Text style={styles.showcaseTitle}>Mint Breeze</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#0f172a" // Dark navy background for modern look
  },
  contentContainer: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 40,
    backgroundColor: "#1e293b", // Solid color instead of rgba for mobile compatibility
    borderRadius: 20,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#334155",
    // Mobile-compatible shadows
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  logo: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  logoText: { 
    fontSize: 20, 
    fontWeight: "800", 
    marginLeft: 8, 
    color: "#ffffff",
  },
  navRight: { 
    flexDirection: "row", 
    alignItems: "center" 
  },

  signInText: { 
    color: "#e2e8f0", 
    fontSize: 15, 
    marginRight: 16,
    fontWeight: "500",
  },
  signUpBtn: {
    backgroundColor: "#3b82f6", // Solid color instead of gradient for mobile
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: "#3b82f6",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  signUpText: { 
    color: "#fff", 
    fontWeight: "700",
    fontSize: 14,
  },

  hero: { 
    alignItems: "center", 
    paddingHorizontal: 24, 
    marginBottom: 50,
    paddingTop: 20,
  },
  heroTitle: {
    fontSize: screenWidth > 600 ? 36 : 28,
    fontWeight: "900",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: screenWidth > 600 ? 44 : 34,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b", // Solid color for better mobile compatibility
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 14,
    width: Math.min(screenWidth * 0.85, 450),
    alignSelf: "center",
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#475569",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  searchInput: { 
    flex: 1, 
    fontSize: 16, 
    color: "#ffffff",
    paddingVertical: 4,
    marginLeft: 8,
    fontWeight: "400",
  },

  exploreBtn: {
    backgroundColor: "#f59e0b",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginBottom: 20,
    shadowColor: "#f59e0b",
    shadowOpacity: 0.4,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  exploreBtnText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "800",
  },

  showcaseWrapper: {
    flexDirection: screenWidth > 600 ? "row" : "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 20,
  },
  showcaseCard: {
    width: screenWidth > 600 ? 160 : Math.min(screenWidth * 0.85, 320),
    height: 200,
    borderRadius: 20,
    backgroundColor: "#1e293b", // Solid background for mobile compatibility
    margin: screenWidth > 600 ? 12 : 8,
    marginBottom: screenWidth > 600 ? 12 : 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  colorContainer: {
    width: "100%",
    height: 120, // Fixed height instead of flex for mobile compatibility
    justifyContent: "space-between",
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  showcaseColor: {
    height: 36, // Fixed height for consistent display
    width: "100%",
    marginBottom: 2,
  },
  showcaseTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },
})