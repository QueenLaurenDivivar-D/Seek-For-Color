import { View, Text, StyleSheet, FlatList, Pressable, TouchableOpacity, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { useRouter } from "expo-router"
import { auth, db } from "../firebaseConfig"
import { doc, setDoc, deleteDoc, onSnapshot, collection } from "firebase/firestore"

const palettes = [
  { id: "1", colors: ["#1B2A41", "#324A5F", "#51557E", "#D6D5A8"], likes: 45, time: "6h" },
  { id: "2", colors: ["#003F88", "#FF6B35", "#FFBA08", "#FFD60A"], likes: 106, time: "1d" },
  { id: "3", colors: ["#FAF3DD", "#FFC947", "#0F7173", "#0B3954"], likes: 163, time: "2d" },
  { id: "4", colors: ["#001845", "#023E7D", "#0353A4", "#0466C8"], likes: 224, time: "3d" },
  { id: "5", colors: ["#AF63B4", "#AB83A1", "#FF6F61", "#F7D6BF"], likes: 439, time: "4d" },
  { id: "6", colors: ["#FFEDD8", "#F9B9B7", "#E27396", "#5E0B15"], likes: 513, time: "5d" },
  { id: "7", colors: ["#FAD2E1", "#FDE2E4", "#C5DEDD", "#DFF3E3"], likes: 320, time: "1w" },
  { id: "8", colors: ["#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA"], likes: 278, time: "1w" },
  { id: "9", colors: ["#FFF1E6", "#FFD6E0", "#E7C6FF", "#C8B6FF"], likes: 402, time: "2w" },
  { id: "10", colors: ["#FFDEFA", "#D9F8C4", "#95E1D3", "#FFAAA7"], likes: 375, time: "2w" },
  { id: "11", colors: ["#FAF0CA", "#F4D35E", "#EE964B", "#F95738"], likes: 289, time: "3w" },
  { id: "12", colors: ["#FDFCDC", "#FFDFD3", "#FEC8D8", "#D291BC"], likes: 498, time: "3w" },
  { id: "13", colors: ["#D8E2DC", "#FFE5D9", "#FFCAD4", "#F4ACB7"], likes: 355, time: "1mo" },
  { id: "14", colors: ["#E0BBE4", "#957DAD", "#D291BC", "#FEC8D8"], likes: 412, time: "1mo" },
  { id: "15", colors: ["#F6DFEB", "#E4C1F9", "#B5EAD7", "#C7CEEA"], likes: 276, time: "1mo" },
  { id: "16", colors: ["#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF"], likes: 530, time: "1mo" },
  { id: "17", colors: ["#B5EAEA", "#EDF6E5", "#FFBCBC", "#F38BA0"], likes: 492, time: "1mo" },
  { id: "18", colors: ["#E4C1F9", "#FCF6BD", "#A9DEF9", "#FF99C8"], likes: 334, time: "2mo" },
  { id: "19", colors: ["#FFB5A7", "#FCD5CE", "#F8EDEB", "#F9DCC4"], likes: 610, time: "2mo" },
  { id: "20", colors: ["#C9E4DE", "#DDE7C7", "#F7D9D9", "#FAD2E1"], likes: 450, time: "2mo" },
  { id: "21", colors: ["#F6F6F6", "#E4E4E4", "#D1D1D1", "#A3A3A3"], likes: 220, time: "2mo" },
  { id: "22", colors: ["#FFE5EC", "#FFC2D1", "#FFB3C6", "#FF8FAB"], likes: 582, time: "3mo" },
  { id: "23", colors: ["#D6EADF", "#ADC2A9", "#FFEEDB", "#FFC4C4"], likes: 389, time: "3mo" },
  { id: "24", colors: ["#C5BAAF", "#B6E2D3", "#FAF3DD", "#FFC8DD"], likes: 440, time: "3mo" },
  { id: "25", colors: ["#F0EFEB", "#D6CFC7", "#B9B7BD", "#868B8E"], likes: 310, time: "3mo" },
];

export default function ExplorePage() {
  const [favorites, setFavorites] = useState([])
  const [localLikes, setLocalLikes] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // 🔐 Redirect guest users to explore2
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace("/explore2")
      }
    })
    return () => unsubscribe()
  }, [])

  // Load favorites from Firestore
  useEffect(() => {
    const user = auth.currentUser
    if (!user) return
    
    console.log("Loading favorites for user:", user.uid)
    
    const favRef = collection(db, "users", user.uid, "favorites")

    const unsubscribe = onSnapshot(favRef, 
      (snapshot) => {
        console.log("Favorites snapshot received, docs:", snapshot.docs.length)
        const favs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        setFavorites(favs)
        
        // Initialize local likes state based on favorites
        const likesState = {}
        favs.forEach(fav => {
          likesState[fav.id] = true
        })
        setLocalLikes(likesState)
      },
      (error) => {
        console.error("Error loading favorites:", error)
        Alert.alert("Error", "Failed to load favorites. Please check your connection.")
      }
    )

    return () => unsubscribe()
  }, [])

  const toggleFavorite = async (palette) => {
    if (isLoading) return // Prevent multiple clicks
    
    const user = auth.currentUser
    if (!user) {
      alert("Please sign in to save favorites")
      router.replace("/explore2")
      return
    }

    setIsLoading(true)
    
    // Immediate UI update
    const isCurrentlyFavorite = !!localLikes[palette.id]
    setLocalLikes(prev => ({
      ...prev,
      [palette.id]: !isCurrentlyFavorite
    }))

    const favRef = doc(db, "users", user.uid, "favorites", palette.id)

    try {
      console.log("Toggling favorite for palette:", palette.id, "Current state:", isCurrentlyFavorite)
      
      if (isCurrentlyFavorite) {
        await deleteDoc(favRef)
        console.log("Successfully removed favorite")
      } else {
        // Ensure the palette object has all required fields
        const paletteToSave = {
          id: palette.id,
          colors: palette.colors,
          likes: palette.likes || 0,
          time: palette.time || "now",
          savedAt: new Date().toISOString()
        }
        await setDoc(favRef, paletteToSave)
        console.log("Successfully added favorite")
      }
    } catch (err) {
      // Revert UI update if there's an error
      setLocalLikes(prev => ({
        ...prev,
        [palette.id]: isCurrentlyFavorite
      }))
      console.error("Error updating favorites:", err)
      
      let errorMessage = "Failed to update favorite. Please try again."
      if (err.code === 'permission-denied') {
        errorMessage = "Permission denied. Please check your Firestore rules."
      } else if (err.code === 'unavailable') {
        errorMessage = "Network error. Please check your connection."
      }
      
      Alert.alert("Error", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await auth.signOut()
      router.replace("/")
    } catch (error) {
      console.error("Error signing out:", error)
      Alert.alert("Error", "Failed to sign out. Please try again.")
    }
  }

  // Helper function to determine if a palette is favorite
  const isFavorite = (paletteId) => {
    return localLikes[paletteId] || favorites.some((fav) => fav.id === paletteId)
  }

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        {/* ❤️ Favorites */}
        <Pressable style={styles.sidebarItem} onPress={() => router.push("/favorite")}>
          <Ionicons name="heart-outline" size={18} color="#f59e0b" />
          <Text style={styles.sidebarText}>Favorites</Text>
        </Pressable>

        {/* 🎨 Manage Palette */}
        <Pressable style={styles.sidebarItem} onPress={() => router.push("/managePallete")}>
          <Ionicons name="color-palette-outline" size={18} color="#22c55e" />
          <Text style={[styles.sidebarText, { color: "#22c55e" }]}>Manage</Text>
        </Pressable>

        {/* 🚪 Log Out */}
        <Pressable style={styles.sidebarItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          <Text style={[styles.sidebarText, { color: "#ef4444" }]}>Log Out</Text>
        </Pressable>
      </View>

      {/* Main content */}
      <FlatList
        data={palettes}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => {
          const isFav = isFavorite(item.id)
          return (
            <View style={styles.card}>
              <View style={styles.colorRow}>
                {item.colors.map((color, index) => (
                  <View key={index} style={[styles.colorBox, { backgroundColor: color }]} />
                ))}
              </View>
              <View style={styles.cardFooter}>
                <TouchableOpacity
                  onPress={() => toggleFavorite(item)}
                  style={{ flexDirection: "row", alignItems: "center" }}
                  disabled={isLoading}
                >
                  <Ionicons
                    name={isFav ? "heart" : "heart-outline"}
                    size={16}
                    color={isFav ? "#EF4444" : "#4E4C45"}
                  />
                  <Text style={styles.likes}>{item.likes}</Text>
                </TouchableOpacity>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", backgroundColor: "#0f172a" },
  sidebar: {
    width: 110,
    backgroundColor: "#1e293b",
    borderRightWidth: 1,
    borderColor: "#334155",
    paddingVertical: 30,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 2, height: 0 },
    elevation: 4,
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  sidebarText: {
    fontSize: 13,
    marginLeft: 8,
    color: "#e2e8f0",
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    flexBasis: "47%",
    height: 160,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },
  colorRow: { flex: 1, flexDirection: "column" },
  colorBox: { flex: 1, width: "100%" },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#1e293b",
    borderTopWidth: 1,
    borderTopColor: "#475569",
  },
  likes: { marginLeft: 6, fontSize: 13, color: "#f59e0b", fontWeight: "700" },
  time: { fontSize: 12, color: "#94a3b8", fontWeight: "500" },
})