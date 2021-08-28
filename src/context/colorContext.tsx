import React, { useState } from 'react'

import { NUMBER_OF_COLORS } from '../constants'
import { useLocalStorage, useSelectedItems } from '../hooks'
import {
  ColorContextType,
  ColorItem,
  ColorItemList,
  ColorListStorage,
} from '../types'
import { getColorArray, getGradientString, getNewId } from '../utils'

export const ColorContext = React.createContext<ColorContextType | undefined>(
  undefined,
)

export const ColorContextProvider: React.FC = ({ children }) => {
  const generateColors = () => {
    const freshColors = getColorArray(NUMBER_OF_COLORS)
    return freshColors.map((color) => {
      return {
        name: color,
        color,
        id: getNewId(),
        backgroundColor: color,
        position: 0,
      } as ColorItem
    })
  }
  // create a piece of state to track the generated colors
  const [generatedColors, setGeneratedColors] = useState(generateColors())

  const refreshColors = () => {
    setGeneratedColors(generateColors())
  }

  // initializes local storage for saved lists
  // Local storage is under the key 'griddemo'.
  // If local storage in 'griddemo' doesn't yet exist, create
  // it with { itemLists: []}
  const { currentStorage, updateStorage, clearStorage } = useLocalStorage<
    ColorListStorage // this is the type of the object we are keeping in storage
  >('griddemo', { itemLists: [] })

  // destructures the current local storage object.
  const { itemLists } = currentStorage ?? { itemLists: [] }
  // sets up Item objects for each color list in local storage (for display)
  const savedListsItems: ColorItemList[] = itemLists.map((list, listIndex) => {
    return {
      name: 'list ' + (listIndex + 1).toString(),
      color: list.list[0].color,
      id: list.id,
      position: 0,
      backgroundColor: list.list[0].backgroundColor ?? '#ffffff',
      backgroundImage: list.backgroundImage,
      list: list.list,
      rotation: list.rotation,
    }
  })

  // sets up selected items for the main color list
  const {
    selectedItems: selectedColors,
    addSelectedItem: addSelectedColor,
    removeSelectedItem: removeSelectedColor,
    setSelectedItems: setSelectedColors,
  } = useSelectedItems<ColorItem>([])

  // sets up selectedItems for the saved color lists
  // these are renamed so they don't conflict with the ones above
  // Will probably refactor to pull these into separate components.
  const {
    removeSelectedItem: removeSelectedList,
    setSelectedItems: setSelectedLists,
  } = useSelectedItems<ColorItemList>([], true)

  // function for saving a new color list
  const saveColorList = (list: ColorItem[], rotation: number) => {
    if (currentStorage) {
      updateStorage({
        itemLists: [
          ...currentStorage.itemLists,
          {
            id: getNewId(),
            list,
            backgroundColor: list[0].backgroundColor,
            backgroundImage: getGradientString({ rotation, colors: list }),
            name: '',
            rotation,
          },
        ],
      })
    }
  }

  // create a piece of state to track the generated colors
  const [rotation, setRotation] = useState(0)

  // creates a piece of state for the color picker to update.
  const colorPicker = useState('#acacac')

  // function for retrieving a color list from currentStorage
  const getColorList = (listId: string): ColorItemList | undefined => {
    if (currentStorage) {
      return currentStorage.itemLists.find((list) => {
        return list.id === listId
      })
    }
  }

  // function for removing a color list from local storage.
  const removeColorList = (listId: string) => {
    if (currentStorage) {
      updateStorage({
        itemLists: currentStorage.itemLists.filter((list) => {
          return list.id !== listId
        }),
      })
    }
  }

  // function for getting a list from local storage and setting it to the main list.
  const loadColorList = (listId: string) => {
    const list = getColorList(listId)
    if (list) {
      setSelectedLists([list])
      setSelectedColors(list.list)
      setRotation(list.rotation)
    }
  }

  // function for resetting the state of the app and localstorage back to empty
  const reset = () => {
    clearStorage()
    setSelectedColors([])
    setSelectedLists([])
  }

  const rotate = (to: number) => {
    setRotation(to)
  }

  const colorContext: ColorContextType = {
    selectedColors,
    randomColors: generatedColors,
    savedListsItems,
    colorPicker,
    colorHelpers: {
      reset,
      getColorList,
      removeColorList,
      saveColorList,
      loadColorList,
      refreshColors,
      addSelectedColor,
      removeSelectedColor,
      removeSelectedList,
      rotate,
      rotation,
    },
  }
  return (
    <ColorContext.Provider value={colorContext}>
      {children}
    </ColorContext.Provider>
  )
}
