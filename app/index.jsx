// app/index.js
import { View, Text, Pressable, StyleSheet, TextInput, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"

export default function LandingPage() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <View style={styles.logo}>
          <Ionicons name="color-palette" size={24} color="#2563EB" />
          <Text style={styles.logoText}>Seek For Color</Text>
        </View>
        <View style={styles.navRight}>
          <TouchableOpacity onPress={() => router.push("/signin")}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signUpBtn} onPress={() => router.push("/signup")}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Discover, Create, and Save Your Perfect Palettes</Text>

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
        <Pressable style={styles.exploreBtn} onPress={() => router.push("/explore")}>
          <Text style={styles.exploreBtnText}>Explore Palettes</Text>
        </Pressable>
      </View>

      {/* Palette Cards */}
      <View style={styles.palettes}>
        {[
          { name: "Soft Sunrise", colors: ["#FDE68A", "#FCA5A5", "#EF4444"] },
          { name: "Bold & Bright", colors: ["#FACC15", "#F97316", "#1E3A8A"] },
          { name: "Muted Garden", colors: ["#A7F3D0", "#FCA5A5", "#9CA3AF"] },
          { name: "Subdued Tones", colors: ["#60A5FA", "#FBBF24", "#E5E7EB"] },
        ].map((palette, index) => (
          <View key={index} style={styles.card}>
            {palette.colors.map((color, i) => (
              <View key={i} style={[styles.colorBlock, { backgroundColor: color }]} />
            ))}
            <Text style={styles.cardTitle}>{palette.name}</Text>
            <Ionicons name="heart-outline" size={16} color="#6B7280" style={styles.heartIcon} />
          </View>
        ))}
      </View>

      {/* Why Section */}
      <View style={styles.whySection}>
        <Text style={styles.whyTitle}>Why Use Seek For Color?</Text>
        <View style={styles.whyList}>
          <View style={styles.whyItem}>
            <Ionicons name="color-palette-outline" size={20} color="#2563EB" />
            <Text style={styles.whyText}>Unlimited Palettes</Text>
          </View>
          <View style={styles.whyItem}>
            <Ionicons name="star-outline" size={20} color="#2563EB" />
            <Text style={styles.whyText}>Save Favorites</Text>
          </View>
          <View style={styles.whyItem}>
            <Ionicons name="flash-outline" size={20} color="#2563EB" />
            <Text style={styles.whyText}>Easy to Copy</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  logo: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 6,
    color: "#111827",
  },
  navRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  signInText: {
    color: "#111827",
    fontSize: 15,
    marginRight: 12,
  },
  signUpBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  signUpText: {
    color: "#fff",
    fontWeight: "600",
  },
  hero: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 40, // increased spacing
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    width: "100%",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },
  exploreBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 10,
  },
  exploreBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  palettes: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 40,
  },
  card: {
    width: 100,
    height: 140,
    borderRadius: 8,
    backgroundColor: "#fff",
    margin: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 6,
    position: "relative",
  },
  colorBlock: {
    flex: 1,
    width: "100%",
    borderRadius: 4,
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
    textAlign: "center",
    color: "#111827",
  },
  heartIcon: {
    position: "absolute",
    bottom: 6,
    right: 6,
  },
  whySection: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  whyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
  },
  whyList: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  whyItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  whyText: {
    marginLeft: 6,
    color: "#111827",
    fontSize: 14,
    fontWeight: "500",
  },
})
