export const getRandomColor = () => {
    // list all hex characters in a string
    const letters = '0123456789ABCDEF'
  
    // Set up a string with the leading '#'
    let color = '#'
  
    // Assign the letters one-by-one until all 6 are assigned
    for (let i = 0; i < 6; i++) {
      // Get 6 randomly-selected character from the letters string
      color += letters[Math.floor(Math.random() * 16)]
    }
  
    return color
  }

const NUMBER_OF_COLORS = 4

const templateArray = new Array(NUMBER_OF_COLORS).fill(null)

// newArray.fill(null) // Very Object-Oriented (imperative expression)

const colorArray1 = templateArray.map((_item, _itemIndex, _origialArray) => {
  return( getRandomColor() )
})

const colorArray2 = templateArray.map(getRandomColor)
console.log(colorArray1)
console.log(colorArray2)
