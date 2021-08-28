import { v4 } from 'uuid'
import { ColorItem } from './types'
const getRandomNumber = (scale: number) => {
  return Math.floor(Math.random() * scale)
}
/**
 * Gets a random color code.
 * @returns a random hexdecimal color code
 * ------------------------------------------
 * Generates a number between 0 and 1, multiplies it by 16,
 * rounds it to the nearest whole number,
 * and picks a number or letter based on that until a hex code is formed.
 */
export const getRandomColor = () => {
  // list all hex characters in a string
  const letters = '0123456789ABCDEF'

  // Set up a string with the leading '#'
  let color: string = '#'

  // Assign the letters one-by-one until all 6 are assigned
  for (let i = 0; i < 6; i++) {
    // Get 6 randomly-selected character from the letters string
    color += letters[getRandomNumber(16)]
  }

  return color
}

/**
 * Gets a contratsing text color for a color code.
 * @param hexcolor The background color.
 * @returns contrasting text color "black" | "white"
 */
export const getContrast = (hexcolor: string): 'black' | 'white' => {
  // If a leading # is provided, remove it
  if (hexcolor.slice(0, 1) === '#') {
    hexcolor = hexcolor.slice(1)
  }

  // If a three-character hexcode, make six-character (e.g. #000 => #000000)
  if (hexcolor.length === 3) {
    hexcolor = hexcolor
      .split('')
      .map(function (hex) {
        return hex + hex
      })
      .join('')
  }

  /*
   * Convert the hex code to RGB values
   * Parses the r, g, and b parts of the
   * hexcode into integer values,
   * each between 0 - 255
   */
  const r = parseInt(hexcolor.substr(0, 2), 16)
  const g = parseInt(hexcolor.substr(2, 2), 16)
  const b = parseInt(hexcolor.substr(4, 2), 16)

  // The YIQ equation converts the RGB color (0 to 255)
  // into a YIQ color space. YIQ is the standard formula
  // for calculating the perceived brightness of a color,
  // and is recommended by the World Wide Web Consortium(W3C).
  const yiqRatio = (r * 299 + g * 587 + b * 114) / 1000

  // Check contrast.
  // YIQ at or above 128 is bright, and contrasts with black
  // YIQ below 128 is dark, and contrasts with white
  return yiqRatio >= 128 ? 'black' : 'white'
}

export const getColorArray = (length: number) => {
  // newArray.fill(null) // Very Object-Oriented (imperative expression)
  const initialArray = new Array(length).fill(null)

  // generateing initial color arrays.
  return initialArray.map(() => {
    return getRandomColor()
  })
}

export const getNewId = () => {
  return v4()
}

export const getGradientString = ({
  colors,
  rotation,
}: {
  rotation: number
  colors: ColorItem[]
}) => {
  return `linear-gradient(${rotation}deg, ${colors
    .map((item) => item.color + (item.position > 0 ? ' %' + item.position : ''))
    .join(', ')})`
}
