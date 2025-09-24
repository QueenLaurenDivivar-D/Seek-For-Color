// app/FavoritesContext.js
import React, { createContext, useContext, useState } from "react"

const FavoritesContext = createContext()

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([])

  // ✅ Toggle favorite
  const toggleFavorite = (paletteId) => {
    if (favorites.includes(paletteId)) {
      setFavorites(favorites.filter((id) => id !== paletteId)) // remove
    } else {
      setFavorites([...favorites, paletteId]) // add
    }
  }

  // ✅ Remove favorite
  const removeFavorite = (paletteId) => {
    setFavorites(favorites.filter((id) => id !== paletteId))
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

// ✅ Custom hook
export function useFavorites() {
  return useContext(FavoritesContext)
}
