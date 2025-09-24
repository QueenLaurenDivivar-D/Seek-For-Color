// app/managePalette.jsx
import { useState, useEffect } from "react"
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Modal,
  Dimensions,
  Platform 
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { auth, db } from "../firebaseConfig"
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore"
import { useRouter } from "expo-router"

const { width: screenWidth } = Dimensions.get('window')

export default function ManagePalette() {
  const [palettes, setPalettes] = useState([])
  const [paletteName, setPaletteName] = useState("")
  const [colors, setColors] = useState(["#ff6b6b"])
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedColor, setSelectedColor] = useState("#ff6b6b")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const router = useRouter()

  // Predefined color palette for easy selection
  const quickColors = [
    "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7",
    "#dda0dd", "#98d8c8", "#f7dc6f", "#bb8fce", "#85c1e9",
    "#f8c471", "#82e0aa", "#f1948a", "#85c1e9", "#d7bde2"
  ]

  // FIXED: Improved auth state handling
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setAuthChecked(true)
      if (currentUser) {
        setUser(currentUser)
      } else {
        setUser(null)
      }
    })
    
    return () => unsubscribe()
  }, [])

  // FIXED: Use push instead of replace to maintain history
  useEffect(() => {
    if (authChecked && !user) {
      console.log("No user found, redirecting to explore2")
      router.push("/explore2") // Changed from replace to push
    }
  }, [authChecked, user])

  // Load palettes from Firestore (READ)
  useEffect(() => {
    if (!user) {
      setPalettes([])
      return
    }

    try {
      const palettesRef = collection(db, "users", user.uid, "palettes")
      const unsubscribe = onSnapshot(
        palettesRef, 
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ 
            id: doc.id, 
            ...doc.data() 
          }))
          
          const sortedData = data.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt.toDate()) : new Date(0)
            const dateB = b.createdAt ? new Date(b.createdAt.toDate()) : new Date(0)
            return dateB - dateA
          })
          
          setPalettes(sortedData)
        },
        (error) => {
          console.error("Error loading palettes:", error)
          Alert.alert("Error", "Failed to load palettes: " + error.message)
        }
      )

      return () => unsubscribe()
    } catch (error) {
      console.error("Error setting up palette listener:", error)
    }
  }, [user])

  // FIXED: Improved back navigation
  const handleBackPress = () => {
    // Check if we can go back, otherwise navigate to explore2
    if (router.canGoBack()) {
      router.back()
    } else {
      router.push("/explore2") // Fallback navigation
    }
  }

  // Add new color input
  const addColor = () => {
    if (colors.length < 10) {
      setColors([...colors, "#000000"])
    } else {
      Alert.alert("Limit Reached", "Maximum 10 colors per palette")
    }
  }

  // Remove color
  const removeColor = (index) => {
    if (colors.length > 1) {
      const newColors = colors.filter((_, i) => i !== index)
      setColors(newColors)
    } else {
      Alert.alert("Minimum Required", "At least one color is required")
    }
  }

  // Update a specific color
  const updateColor = (index, value) => {
    const newColors = [...colors]
    newColors[index] = value
    setColors(newColors)
  }

  // Open color picker modal
  const openColorPicker = (index) => {
    setSelectedIndex(index)
    setSelectedColor(colors[index])
    setModalVisible(true)
  }

  // Apply selected color
  const applyColor = () => {
    updateColor(selectedIndex, selectedColor)
    setModalVisible(false)
  }

  // CREATE/UPDATE palette
  const savePalette = async () => {
    if (!user) {
      Alert.alert("Error", "Please sign in to save palettes")
      return
    }

    if (!paletteName.trim()) {
      Alert.alert("Missing Name", "Please enter a palette name")
      return
    }

    if (colors.length === 0) {
      Alert.alert("Missing Colors", "Please add at least one color")
      return
    }

    const invalidColors = colors.filter(color => !/^#[0-9A-Fa-f]{6}$/.test(color))
    if (invalidColors.length > 0) {
      Alert.alert("Invalid Colors", "Please check color format (should be #RRGGBB)")
      return
    }

    setLoading(true)

    try {
      const paletteData = {
        name: paletteName.trim(),
        colors: [...colors],
        updatedAt: new Date(),
      }

      if (isEditing && editingId) {
        const docRef = doc(db, "users", user.uid, "palettes", editingId)
        await updateDoc(docRef, paletteData)
        Alert.alert("Success", "Palette updated successfully!")
      } else {
        const collectionRef = collection(db, "users", user.uid, "palettes")
        await addDoc(collectionRef, {
          ...paletteData,
          createdAt: new Date(),
        })
        Alert.alert("Success", "Palette created successfully!")
      }

      resetForm()
    } catch (err) {
      console.error("Error saving palette:", err)
      Alert.alert("Error", `Failed to save palette: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setPaletteName("")
    setColors(["#ff6b6b"])
    setIsEditing(false)
    setEditingId(null)
  }

  // Edit existing palette
  const editPalette = (palette) => {
    setPaletteName(palette.name)
    setColors([...palette.colors])
    setIsEditing(true)
    setEditingId(palette.id)
  }

  // Delete palette function
  const deletePalette = async (id, name) => {
    console.log("Delete button clicked for:", id, name);

    if (!user) {
      Alert.alert("Error", "You must be signed in to delete a palette");
      return;
    }

    try {
      const paletteRef = doc(db, "users", user.uid, "palettes", id);
      console.log("Deleting document at path:", paletteRef.path);

      await deleteDoc(paletteRef);

      Alert.alert("Deleted", `"${name}" has been deleted successfully!`);
    } catch (err) {
      console.error("Error deleting palette:", err);
      Alert.alert("Error", `Failed to delete palette: ${err.message}`);
    }
  };

  // Generate random color
  const generateRandomColor = () => {
    return `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
  }

  // Add random color
  const addRandomColor = () => {
    if (colors.length < 10) {
      setColors([...colors, generateRandomColor()])
    }
  }

  // Show loading state while checking authentication
  if (!authChecked) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  // Only render content if user is authenticated
  if (authChecked && !user) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Redirecting...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header with FIXED back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleBackPress} // Use the fixed handler
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? "Edit Palette" : "Create Palette"}
        </Text>
        {isEditing && (
          <TouchableOpacity onPress={resetForm} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Rest of your component remains the same */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Palette Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Palette Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter palette name..."
              placeholderTextColor="#94a3b8"
              value={paletteName}
              onChangeText={setPaletteName}
              maxLength={30}
            />
          </View>

          <View style={styles.colorsSection}>
            <View style={styles.colorsSectionHeader}>
              <Text style={styles.inputLabel}>Colors ({colors.length}/10)</Text>
              <View style={styles.colorActions}>
                <TouchableOpacity onPress={addRandomColor} style={styles.actionButton}>
                  <Ionicons name="shuffle" size={16} color="#f59e0b" />
                  <Text style={styles.actionText}>Random</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={addColor} style={styles.actionButton}>
                  <Ionicons name="add" size={16} color="#10b981" />
                  <Text style={styles.actionText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.colorGrid}>
              {colors.map((color, index) => (
                <View key={index} style={styles.colorItem}>
                  <TouchableOpacity
                    style={[styles.colorSquare, { backgroundColor: color }]}
                    onPress={() => openColorPicker(index)}
                  >
                    <Ionicons name="color-palette-outline" size={16} color="#ffffff" style={styles.colorIcon} />
                  </TouchableOpacity>
                  <Text style={styles.colorHex}>{color}</Text>
                  <TouchableOpacity
                    onPress={() => removeColor(index)}
                    style={styles.removeColorButton}
                  >
                    <Ionicons name="close-circle" size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
              onPress={savePalette}
              disabled={loading}
            >
              <Ionicons 
                name={loading ? "hourglass" : (isEditing ? "checkmark" : "save")} 
                size={20} 
                color="#ffffff" 
              />
              <Text style={styles.saveButtonText}>
                {loading ? "Saving..." : (isEditing ? "Update Palette" : "Save Palette")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.palettesSection}>
          <Text style={styles.sectionTitle}>Your Palettes ({palettes.length})</Text>
          
          {palettes.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="color-palette-outline" size={48} color="#94a3b8" />
              <Text style={styles.emptyTitle}>No Palettes Yet</Text>
              <Text style={styles.emptySubtitle}>Create your first color palette above</Text>
            </View>
          ) : (
            palettes.map((palette) => (
              <View key={palette.id} style={styles.paletteCard}>
                <View style={styles.paletteHeader}>
                  <Text style={styles.paletteName}>{palette.name}</Text>
                  <View style={styles.paletteActions}>
                    <TouchableOpacity
                      onPress={() => editPalette(palette)}
                      style={[styles.actionBtn, styles.editBtn]}
                    >
                      <Ionicons name="pencil" size={16} color="#3b82f6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deletePalette(palette.id, palette.name)}
                      style={[styles.actionBtn, styles.deleteBtn]}
                    >
                      <Ionicons name="trash" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.paletteColors}>
                  {palette.colors.map((color, idx) => (
                    <View key={idx} style={styles.paletteColorItem}>
                      <View style={[styles.paletteColorSquare, { backgroundColor: color }]} />
                      <Text style={styles.paletteColorHex}>{color}</Text>
                    </View>
                  ))}
                </View>
                
                <Text style={styles.paletteDate}>
                  {palette.createdAt 
                    ? new Date(palette.createdAt.toDate()).toLocaleDateString() 
                    : 'Recently created'
                  }
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Color Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pick a Color</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.colorPreview}>
              <View style={[styles.previewColor, { backgroundColor: selectedColor }]} />
              <Text style={styles.previewText}>{selectedColor}</Text>
            </View>
            
            <Text style={styles.quickColorsTitle}>Quick Colors</Text>
            <View style={styles.quickColorsGrid}>
              {quickColors.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.quickColorItem,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedQuickColor
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
            
            <TextInput
              style={styles.hexInput}
              value={selectedColor}
              onChangeText={setSelectedColor}
              placeholder="#ffffff"
              placeholderTextColor="#94a3b8"
              maxLength={7}
            />
            
            <TouchableOpacity style={styles.applyButton} onPress={applyColor}>
              <Text style={styles.applyButtonText}>Apply Color</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffffff",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 20,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#374151",
    borderRadius: 20,
  },
  cancelText: {
    color: "#f59e0b",
    fontWeight: "600",
  },
  // ... keep all your existing styles exactly as they were ...

  content: {
    flex: 1,
  },
  formSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e2e8f0",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#475569",
  },
  colorsSection: {
    marginBottom: 20,
  },
  colorsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  colorActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#1e293b",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#475569",
  },
  actionText: {
    color: "#e2e8f0",
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginBottom: 25,
  },
  colorItem: {
    alignItems: "center",
    width: (screenWidth - 80) / 4,
  },
  colorSquare: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#475569",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  colorIcon: {
    opacity: 0.7,
  },
  colorHex: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 4,
    fontWeight: "500",
  },
  removeColorButton: {
    position: "absolute",
    top: -5,
    right: 5,
  },
  saveButton: {
    backgroundColor: "#f59e0b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: "#f59e0b",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  saveButtonDisabled: {
    backgroundColor: "#64748b",
    opacity: 0.7,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    marginLeft: 8,
  },
  palettesSection: {
    padding: 20,
    paddingTop: 0,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#94a3b8",
    marginTop: 8,
  },
  paletteCard: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  paletteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  paletteName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    flex: 1,
  },
  paletteActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#374151",
  },
  editBtn: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
  },
  deleteBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
  },
  paletteColors: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  paletteColorItem: {
    alignItems: "center",
  },
  paletteColorSquare: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#475569",
  },
  paletteColorHex: {
    fontSize: 9,
    color: "#94a3b8",
    marginTop: 2,
  },
  paletteDate: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 20,
    width: screenWidth * 0.9,
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "#334155",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
  },
  colorPreview: {
    alignItems: "center",
    marginBottom: 20,
  },
  previewColor: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#475569",
    marginBottom: 8,
  },
  previewText: {
    fontSize: 16,
    color: "#e2e8f0",
    fontWeight: "600",
  },
  quickColorsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e2e8f0",
    marginBottom: 12,
  },
  quickColorsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  quickColorItem: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedQuickColor: {
    borderColor: "#f59e0b",
    borderWidth: 3,
  },
  hexInput: {
    backgroundColor: "#374151",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  applyButton: {
    backgroundColor: "#f59e0b",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
})