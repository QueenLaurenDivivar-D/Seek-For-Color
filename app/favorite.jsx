// app/favorite.jsx
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Alert, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { auth, db } from "../firebaseConfig"
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore"
import { useEffect, useState } from "react"

const { width: screenWidth } = Dimensions.get('window')

export default function FavoritesPage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState([])

  // Calculate responsive values
  const isTablet = screenWidth > 768
  const sidebarWidth = isTablet ? 120 : 80
  const availableWidth = screenWidth - sidebarWidth - 40 // subtract sidebar and padding
  const numColumns = Math.floor(availableWidth / 160) // 160 = card width + margin
  const cardWidth = Math.max(140, (availableWidth / numColumns) - 20)

  // Load favorites from Firestore
  useEffect(() => {
    const user = auth.currentUser
    if (!user) return

    const favRef = collection(db, "users", user.uid, "favorites")
    
   // In favorite.jsx, update the onSnapshot part:
const unsubscribe = onSnapshot(favRef, 
  (snapshot) => {
    const favs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
    console.log("Loaded favorites:", favs.length)
    setFavorites(favs)
  },
  (error) => {
    console.error("Error loading favorites:", error)
    Alert.alert("Error", "Failed to load favorites. Please check your connection.")
  }
)

    return () => unsubscribe()
  }, [])

  const removeFavorite = async (id) => {
    const user = auth.currentUser
    if (!user) return

    try {
      await deleteDoc(doc(db, "users", user.uid, "favorites", id))
    } catch (err) {
      console.error("Error removing favorite:", err)
      Alert.alert("Error", "Failed to remove favorite. Please try again.")
    }
  }

  const copyToClipboard = async (color) => {
    try {
      if (Platform.OS === 'web') {
        // Web platform
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(color)
          alert(`Copied: ${color}`)
        } else {
          // Fallback for non-secure contexts
          const textArea = document.createElement("textarea")
          textArea.value = color
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand('copy')
          document.body.removeChild(textArea)
          alert(`Copied: ${color}`)
        }
      } else {
        // Mobile platforms - show the color code for manual copying
        Alert.alert(
          "Color Code", 
          color,
          [
            {
              text: "Close",
              style: "cancel"
            },
            {
              text: "Copy",
              onPress: () => {
                // For Expo Go, we'll show instructions
                Alert.alert(
                  "Copy Instructions",
                  `Please manually copy this color code:\n\n${color}`,
                  [{ text: "OK" }]
                )
              }
            }
          ]
        )
      }
    } catch (err) {
      console.error("Failed to copy:", err)
      // Fallback: just show the color code
      if (Platform.OS === 'web') {
        alert(`Color code: ${color}`)
      } else {
        Alert.alert("Color Code", color)
      }
    }
  }

  const renderPalette = ({ item }) => {
    if (!item.colors || !Array.isArray(item.colors)) {
      return null // Skip invalid items
    }

    const colorHeight = (cardWidth - 40) / item.colors.length // Distribute height evenly

    return (
      <View style={[styles.paletteBox, { width: cardWidth, height: cardWidth }]}>
        <View style={styles.colorsContainer}>
          {item.colors.map((color, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.colorSquare, 
                { 
                  backgroundColor: color,
                  height: colorHeight,
                }
              ]}
              onPress={() => copyToClipboard(color)}
              activeOpacity={0.8}
            >
              <Text style={styles.hexText}>{color}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.heartIcon} 
          onPress={() => removeFavorite(item.id)}
          activeOpacity={0.7}
        >
          <Ionicons name="heart" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    )
  }

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={64} color="#9CA3AF" />
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start exploring palettes and save your favorites here
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => router.push("/explore")}
      >
        <Text style={styles.exploreButtonText}>Explore Palettes</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={[styles.sidebar, { width: sidebarWidth }]}>
        <TouchableOpacity 
          onPress={() => router.push("/explore")} 
          style={styles.sidebarItem}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={18} color="#374151" />
          {isTablet && <Text style={styles.sidebarText}>Back</Text>}
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.push("/favorite")} 
          style={[styles.sidebarItem, styles.activeItem]}
          activeOpacity={0.7}
        >
          <Ionicons name="heart" size={18} color="#ef4444" />
          {isTablet && <Text style={[styles.sidebarText, styles.activeText]}>Favorites</Text>}
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View style={styles.contentArea}>
        {favorites.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            <Text style={styles.headerTitle}>
              My Favorites ({favorites.length})
            </Text>
            <FlatList
              data={favorites}
              renderItem={renderPalette}
              keyExtractor={(item, index) => item.id || index.toString()}
              numColumns={numColumns}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              key={numColumns} // Force re-render when columns change
            />
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    flexDirection: "row", 
    backgroundColor: "#0f172a" // Dark navy background like landing page
  },
  sidebar: { 
    backgroundColor: "#1e293b", // Dark slate background
    paddingTop: 20,
    borderRightWidth: 1,
    borderRightColor: "#334155", // Darker border
  },
  sidebarItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 12,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 12, // More rounded
  },
  activeItem: {
    backgroundColor: "#451a03", // Dark amber background for active state
  },
  sidebarText: { 
    marginLeft: 8, 
    fontSize: 14,
    color: "#e2e8f0", // Light text color
    fontWeight: "500",
  },
  activeText: {
    color: "#f59e0b", // Amber color for active text
    fontWeight: "700",
  },
  contentArea: {
    flex: 1,
    backgroundColor: "#0f172a", // Match main background
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900", // Bolder weight
    color: "#ffffff", // White text
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#334155", // Darker border
  },
  listContainer: { 
    padding: 20,
    paddingTop: 20,
  },
  paletteBox: {
    backgroundColor: "#1e293b", // Dark background
    borderRadius: 20, // More rounded like landing page
    margin: 8,
    overflow: "hidden",
    position: "relative",
    // Enhanced shadows
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    borderWidth: 1,
    borderColor: "#334155", // Darker border
  },
  colorsContainer: {
    flex: 1,
    width: "100%",
  },
  colorSquare: { 
    width: "100%",
    justifyContent: "center", 
    alignItems: "center",
    minHeight: 30,
  },
  hexText: { 
    fontSize: 11, 
    color: "#fff", 
    backgroundColor: "rgba(0,0,0,0.7)", // Darker background for better contrast
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontWeight: "700", // Bolder text
    textTransform: "uppercase",
  },
  heartIcon: { 
    position: "absolute", 
    top: 12, 
    right: 12, 
    backgroundColor: "rgba(30, 41, 59, 0.95)", // Dark background
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#475569",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: "900", // Bolder weight
    color: "#ffffff", // White text
    marginTop: 20,
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 18,
    color: "#94a3b8", // Light gray text
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: "#f59e0b", // Amber color like landing page
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25, // More rounded
    shadowColor: "#f59e0b",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800", // Bolder weight
  },
})