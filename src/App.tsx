import {
  getContrast,
  getGradientString,
  getNewId,
  getRandomColor,
} from './utils'
import { ColorItem, ColorItemList } from './types'
import { Layout, List } from './components'

import { SketchPicker } from 'react-color'
import React, { useContext, useState } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { ColorContext } from './context'

// This assigns the color of all the buttons to a single random color.
export const buttonColor = getRandomColor()

const App = () => {
  //Creates the app from previous functions and variables

  const colorContext = useContext(ColorContext)

  if (!(colorContext && colorContext?.colorHelpers)) {
    return <div>Loading Context</div>
  }
  const {
    selectedColors,
    randomColors,
    savedListsItems,
    colorHelpers,
    colorPicker,
  } = colorContext

  // creates a piece of state for the color picker to update.
  const [colorPickerColor, setColorPickerColor] = colorPicker

  const {
    reset,
    removeColorList,
    saveColorList,
    loadColorList,
    refreshColors,
    addSelectedColor,
    removeSelectedColor,
    removeSelectedList,
    rotate,
    rotation,
  } = colorHelpers

  const gradientString = getGradientString({ rotation, colors: selectedColors })

  const RandomColorTitle = (
    <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
      <div style={{ cursor: 'pointer' }} onClick={refreshColors}>
        Refresh
      </div>
    </div>
  )

  const SelectedColorTitle = (
    <div
      style={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 15,
        padding: '0 10px',
        marginBottom: 10,
      }}
    >
      <ControlButton onClick={() => saveColorList(selectedColors, rotation)}>
        Save
      </ControlButton>
      <Slider value={rotation} onChange={rotate} max={360} min={0} />
    </div>
  )

  const SavedListsTitle = <ControlButton onClick={reset}>Reset</ControlButton>

  return (
    <Layout gradient={gradientString}>
      <div
        style={{
          display: 'grid',
          gap: 10,
          gridTemplateColumns: '1fr 3fr 2fr',
          gridTemplateRows: '3fr 3fr 1fr',
          // gridTemplateAreas names must coincide with the
          // `gridArea` properties in the boxes array
          gridTemplateAreas: `'colorPicker    selectedColors   localStorage' 
                              'randomColors   selectedColors   localStorage'
                              'gradientString gradientString   gradientString'`,
          height: '73vh',
          width: '120vh',
          backgroundColor: '#acacac',
          borderRadius: 10,
          padding: 10,
        }}
      >
        <div style={{ gridArea: 'colorPicker' }}>
          <div>
            <SketchPicker
              color={colorPickerColor}
              onChangeComplete={(color) => {
                setColorPickerColor(color.hex)
              }}
            />
          </div>
          <ControlButton
            onClick={() =>
              addSelectedColor({
                name: colorPickerColor,
                id: getNewId(),
                color: colorPickerColor,
                backgroundColor: colorPickerColor,
                position: 0,
              })
            }
            style={{ marginTop: 10 }}
          >
            Add Color
          </ControlButton>
        </div>
        <List<{}, ColorItem>
          box={{ gridArea: 'randomColors' }}
          listTitle={RandomColorTitle}
          listItems={randomColors}
          onItemClick={addSelectedColor}
          buttonLabel="add"
        />
        <List<{}, ColorItem>
          box={{ gridArea: 'selectedColors' }}
          listItems={selectedColors}
          listTitle={SelectedColorTitle}
          titleHeight={90}
          onItemClick={removeSelectedColor}
          buttonLabel="remove"
        />

        <div style={{ gridArea: 'gradientString' }}>
          background-color: {gradientString};
        </div>
        <List<{}, ColorItemList>
          box={{ gridArea: 'localStorage' }}
          listItems={savedListsItems}
          onItemClick={(item) => loadColorList(item.id)}
          buttonLabel="Load"
          listTitle={SavedListsTitle}
          titleHeight={90}
          additionalActions={[
            {
              buttonLabel: 'Delete',
              onItemClick: (item) => {
                removeSelectedList(item)
                removeColorList(item.id)
              },
            },
          ]}
        />
      </div>
    </Layout>
  )
}

const useSlider = (
  initialValue: number,
  min: number,
  max: number,
  step?: number,
): [JSX.Element, number, React.Dispatch<React.SetStateAction<number>>] => {
  const [value, setValue] = useState(initialValue)
  return [
    <Slider
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(val) => setValue(val)}
    />,
    value,
    setValue,
  ]
}

type CustomBaseButtonProps = {}

type BaseButtonProps = CustomBaseButtonProps &
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >

export const Button: React.FC<BaseButtonProps> = ({
  children,
  onClick,
  style,
  title,
}) => {
  const baseButtonStyles: React.CSSProperties = {
    borderRadius: 5,
    backgroundColor: buttonColor,
    borderStyle: 'none',
  }

  return (
    <button
      onClick={onClick}
      style={{ ...baseButtonStyles, ...style }}
      title={title}
    >
      {title ?? children}
    </button>
  )
}

const ControlButton: React.FC<BaseButtonProps> = ({ style, ...props }) => {
  const controlButtonStyles: React.CSSProperties = {
    backgroundColor: getContrast(buttonColor),
    color: buttonColor,
    fontWeight: 'bold',
    fontSize: '1.5rem',
    borderRadius: 10,
    padding: 15,
    borderStyle: 'solid',
    borderColor: buttonColor,
    borderWidth: 2,
  }

  return <Button style={{ ...controlButtonStyles, ...style }} {...props} />
}

export default App
