import { useEffect, useState } from 'react'

/**
 * A Custom hook used to manage a set of selected Item objects.
 * @param initialSelectedItems Item[];
 * @param singleSelect boolean; When `true` only a single item may
 * be selected at a time
 * @returns selected Items array and functions for updating it.
 */
export function useSelectedItems<IdentifiableItem extends { id: string }>(
  initialSelectedItems: IdentifiableItem[],
  singleSelect?: boolean,
) {
  //creates a constant variable for selected items
  // useState(initialState) is a react hook that will keep track of state for us
  // It returns an array containing the state data in the first position,
  // and a function in the second position for updating that state data.
  // this is usually written in this form:
  // const [state, setState] = useState<StateType>(initialState);
  const [selectedItems, setSelectedItems] = useState<IdentifiableItem[]>(
    initialSelectedItems,
  )

  //creates a variable that stores the selected colors
  // .map() is a powerful function, and is a method of all Arrays in JS/TS
  // like .filter(), .map() accepts a function (callback) to be called
  // on each element in the mapped array. The returned array is the result of calling
  // the callback function on every member of the array.
  const selectedIds = selectedItems.map((item) => item.id)

  /**
   * Adds an Item to the selectedItemsArray.
   * Will not add an Item with the same color as another selected Item.
   * @param item Item The Item to be added to the selectedItems
   * @returns void
   */
  const addSelectedItem = (item: IdentifiableItem) => {
    // Check if the item already exists in the selectedColors array.
    // if so, stop running this function and return undefined.
    if (selectedIds.includes(item.id)) return

    // Replaces (updates) the selected items.
    // if `singleSelect` is true, the new selectedItems array will
    // contain only the item to be added.  If false, the new selectedItems array
    // will contain all previously selectedItems, and the item to be added.
    setSelectedItems(singleSelect ? [item] : [...selectedItems, item])
  }

  /**
   * Removes an Item from the selectedItemsArray.
   * @param item Item The Item to be added to the selectedItems
   * @returns void
   */
  const removeSelectedItem = (item: IdentifiableItem) => {
    if (singleSelect) {
      // If singleSelect is true, set the selected items to an empty array.
      setSelectedItems([])
    } else {
      // otherwise, remove the item from the selectedItems array
      const newItems = selectedItems.filter((selectedItem) => {
        return selectedItem.id !== item.id
      })

      // Then, update (replace) the selectedItems.
      setSelectedItems(newItems)
    }
  }

  //returns selected items to the app at large
  return {
    selectedItems,
    addSelectedItem,
    removeSelectedItem,
    setSelectedItems,
  }
}

/**
 * A custom hook for managing local storage
 * @returns The object currently stored in local storage and functions for updating it
 */
export function useLocalStorage<StorageType extends {}>(
  storageKey: string,
  initialStorage?: StorageType,
) {
  // This is the string that represents the entry (if present) in local storage
  // with the key provided in the parameters. If it's not there, returns null.
  const rawLocalString = window.localStorage.getItem(storageKey)

  // See comment about useState() above in useSelectedItems()
  const [currentStorage, setCurrentStorage] = useState<StorageType | undefined>(
    // if the local storage string is not null or empty
    // Parse it into an object, if not use an empty object.
    rawLocalString ? JSON.parse(rawLocalString) : undefined,
  )

  /**
   * A function used to update local storage
   * @param newValue
   * @returns void
   */
  const updateStorage = (newValue: StorageType) => {
    window.localStorage.setItem(
      storageKey,
      newValue ? JSON.stringify(newValue) : '',
    )
    setCurrentStorage(newValue)
  }

  /**
   * A function used to clear the page's data from local storage.
   */
  const clearStorage = () => {
    window.localStorage.removeItem(storageKey)
    setCurrentStorage(undefined)
  }

  // This effect initializes local storage, if it does not already exist
  // to either the provided initialStorage or an empty object.
  useEffect(() => {
    if (!currentStorage) {
      window.localStorage.setItem(storageKey, JSON.stringify(initialStorage))

      setCurrentStorage(initialStorage ?? ({} as StorageType))
    }
  }, [currentStorage, initialStorage, storageKey])

  return {
    currentStorage, // The current state of local storage as a JSON object
    updateStorage, // Function for replacing (updating) the contents of local storage
    clearStorage, // Function fro removing the app's data from local storage.
  }
}
