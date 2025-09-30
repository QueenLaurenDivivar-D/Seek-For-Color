import { View, Text, StyleSheet, FlatList, TouchableOpacity, Pressable } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"

const palettes = [
  { id: "1", colors: ["#1B2A41", "#324A5F", "#51557E", "#D6D5A8"], likes: 45, time: "6h" },
  { id: "2", colors: ["#003F88", "#FF6B35", "#FFBA08", "#FFD60A"], likes: 106, time: "1d" },
  { id: "3", colors: ["#FAF3DD", "#FFC947", "#0F7173", "#0B3954"], likes: 163, time: "2d" },
  { id: "4", colors: ["#001845", "#023E7D", "#0353A4", "#0466C8"], likes: 224, time: "3d" },
  { id: "5", colors: ["#6A0572", "#AB83A1", "#FF6F61", "#F7D6BF"], likes: 439, time: "4d" },
  { id: "6", colors: ["#FFEDD8", "#F9B9B7", "#E27396", "#5E0B15"], likes: 513, time: "5d" },
]

export default function Explore2Page() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        {/* 🔑 Sign In */}
        <Pressable style={styles.sidebarItem} onPress={() => router.push("/signin")}>
          <Ionicons name="log-in-outline" size={18} color="#2563eb" />
          <Text style={[styles.sidebarText, { color: "#2563eb" }]}>Sign In</Text>
        </Pressable>

        {/* 🎨 Manage Palette (guest restriction) */}
        <Pressable
          style={styles.sidebarItem}
          onPress={() => alert("⚠️ Please sign in to manage palettes")}
        >
          <Ionicons name="color-palette-outline" size={18} color="#22c55e" />
          <Text style={[styles.sidebarText, { color: "#22c55e" }]}>Manage</Text>
        </Pressable>
      </View>

      {/* Main content */}
      <FlatList
        data={palettes}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.colorRow}>
              {item.colors.map((color, index) => (
                <View key={index} style={[styles.colorBox, { backgroundColor: color }]} />
              ))}
            </View>
            <View style={styles.cardFooter}>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => alert("⚠️ Please sign in to save favorites")}
              >
                <Ionicons name="heart-outline" size={16} color="#9ca3af" />
                <Text style={styles.likes}>{item.likes}</Text>
              </TouchableOpacity>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        )}
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
