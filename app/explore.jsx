// app/explore.js
import { View, Text, TextInput, StyleSheet, FlatList, Pressable } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"

const palettes = [
  { id: "1", colors: ["#F9E0A1", "#F7B267", "#F79D65", "#F4845F"], likes: 34, time: "8h" },
  { id: "2", colors: ["#240046", "#7B2CBF", "#C77DFF", "#E0AAFF"], likes: 139, time: "1d" },
  { id: "3", colors: ["#70E000", "#38B000", "#CCFF33", "#F5FF90"], likes: 262, time: "2d" },
  { id: "4", colors: ["#6D6875", "#B5838D", "#E5989B", "#FFB4A2"], likes: 451, time: "3d" },
]

export default function PaletteScreen() {
  const [search, setSearch] = useState("")

  return (
    <View style={styles.container}>
      {/* Navbar - matches landing page style */}
      <View style={styles.navbar}>
        <Ionicons name="color-palette" size={28} color="#4E4C45" />
        <TextInput
          style={styles.search}
          placeholder="Search palettes..."
          placeholderTextColor="#777772"
          value={search}
          onChangeText={setSearch}
        />
        <Pressable>
          <Text style={styles.explore}>Explore</Text>
        </Pressable>
        <Ionicons name="heart-outline" size={24} color="#4E4C45" style={styles.icon} />
        <Ionicons name="person-circle-outline" size={26} color="#4E4C45" style={styles.icon} />
      </View>

      {/* Filters */}
      <FlatList
        data={["New", "Popular", "Retro", "Neon", "Warm", "Cold"]}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
        renderItem={({ item }) => (
          <Pressable style={styles.filterButton}>
            <Text style={styles.filterText}>{item}</Text>
          </Pressable>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* Palettes Grid */}
      <FlatList
        data={palettes}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.colors.map((color, index) => (
              <View key={index} style={[styles.colorBox, { backgroundColor: color }]} />
            ))}
            <View style={styles.cardFooter}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="heart-outline" size={16} color="#4E4C45" />
                <Text style={styles.likes}>{item.likes}</Text>
              </View>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F2D5",
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#F6F2D5",
    borderBottomWidth: 1,
    borderBottomColor: "#D6D3C9",
  },
  search: {
    flex: 1,
    backgroundColor: "#D6D3C9",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 8,
    color: "#4E4C45",
  },
  explore: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#4E4C45",
    marginRight: 8,
  },
  icon: {
    marginLeft: 6,
  },
  filterBar: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  filterButton: {
    backgroundColor: "#EDEADE",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    color: "#4E4C45",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
    flex: 0.48,
    elevation: 3,
  },
  colorBox: {
    height: 40,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    backgroundColor: "#fff",
  },
  likes: {
    marginLeft: 4,
    fontSize: 12,
    color: "#4E4C45",
  },
  time: {
    fontSize: 12,
    color: "#777772",
  },
})
