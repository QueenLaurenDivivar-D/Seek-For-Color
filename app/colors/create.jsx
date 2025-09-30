import { useState } from 'react'
import { StyleSheet, Text, TextInput, Pressable, Keyboard } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSeekColor } from '../../hooks/useSeekColor'
import { useRouter } from 'expo-router'

const Create = () => {
  const [color, setColor] = useState('')
  const { addColor } = useSeekColor()
  const router = useRouter()   // ✅ fix: must be called as a function

  const handleSubmit = async () => {
    if (!color.trim()) return

    await addColor({
      color,
      favorite: false,
      createdAt: new Date()
    })

    setColor('')
    Keyboard.dismiss()
    router.push('/colors')   // ✅ go back to your colors page
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Add a New Color</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a color hex, e.g. #FF5733"
        value={color}
        onChangeText={setColor}
      />

      <Pressable onPress={handleSubmit} style={styles.button}>
        <Text style={{ color: 'white' }}>Save Color</Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default Create

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  input: {
    width: 300,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  button: {
    padding: 16,
    backgroundColor: '#21cc8d',
    borderRadius: 8,
    alignItems: 'center',
  }
})
