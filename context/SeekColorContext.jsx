import { createContext, useState } from "react"

export const SeekColorContext = createContext()

export function SeekColorProvider({ children }) {
  const [colors, setColors] = useState([])

  async function fetchColors() {
  }
 
  async function addColor(colordata) {
    console.log(goalData)
  }

  async function deleteColor() {
  }

  async function updateColor() {
  }

  return (
    <SeekColorContext.Provider
      value={{ colors, fetchColors, addColor, deleteColor, updateColor }}
    >
      {children}
    </SeekColorContext.Provider>
  )
}
