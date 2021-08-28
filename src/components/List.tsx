import { Button, buttonColor } from '../App'
import { Box, Item } from '../types'
import { getContrast } from '../utils'

type ListProps<CustomBoxProps, CustomItemProps> = {
  box?: Box<CustomBoxProps>
  listItems: Item<CustomItemProps>[]
  buttonLabel: string
  listTitle?: string | JSX.Element
  itemHeight?: number
  titleHeight?: number
  onItemClick: (item: Item<CustomItemProps>) => void
  additionalActions?: {
    buttonLabel: string
    onItemClick: (item: Item<CustomItemProps>) => void
  }[]
  //voids an item from the selected items list upon activation
}

export function List<CustomBoxProps, ItemType extends Item<{}>>({
  //calls outside items so they can function within this variable
  box,
  listItems,
  listTitle,
  buttonLabel,
  onItemClick,
  additionalActions,
  itemHeight = 50,
  titleHeight = 35,
}: ListProps<CustomBoxProps, ItemType>) {
  const itemConfigs = {
    buttonLabel,
    onItemClick,
    additionalActions,
  }
  return (
    <div
      style={{
        backgroundColor: '#fff',
        gridArea: box?.gridArea,
        display: 'grid',
        gridTemplateRows: `${titleHeight + 'px'} repeat(${listItems.length}, ${
          itemHeight + 'px'
        })`,
        gap: 10,
        padding: 10,
        borderRadius: 10,
        overflowY: 'scroll',
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontWeight: 'bold',
        }}
      >
        {listTitle}
      </div>
      {listItems.map((listItem) => (
        <ItemDisplay listItem={listItem} {...itemConfigs} />
      ))}
    </div>
  )
}

type ItemDisplayProps<ItemType extends Item<{}>> = {
  listItem: ItemType
  buttonLabel: string
  onItemClick: (item: ItemType) => void
  additionalActions?: {
    buttonLabel: string
    onItemClick: (item: ItemType) => void
  }[]
}

function ItemDisplay<ItemType extends Item<{}>>({
  listItem,
  buttonLabel,
  onItemClick,
  additionalActions,
}: ItemDisplayProps<ItemType>): JSX.Element {
  return (
    <div
      style={{
        //generates the style of the list items
        color: getContrast(listItem.backgroundColor),
        textAlign: 'center',
        backgroundColor: listItem.backgroundColor,
        ...(listItem.backgroundImage
          ? { backgroundImage: listItem.backgroundImage }
          : undefined),
        borderRadius: 10,
        display: 'grid',
        gridTemplateColumns: '4fr 1fr',
        gridTemplateAreas: `'title   buttons'
                            'control buttons`,
        alignItems: 'center',
        padding: '5px 10px',
      }}
    >
      <div style={{ gridArea: 'title' }}>{listItem.name}</div>
      <div
        style={{
          gridArea: 'buttons',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
        }}
      >
        {additionalActions?.map((action) => {
          return (
            <Button
              style={{
                display: 'flex',
                justifyContent: 'center',
                flex: 1,
                border: 'none',
                color: getContrast(buttonColor),
              }}
              onClick={() => action.onItemClick(listItem)}
            >
              {action.buttonLabel}
            </Button>
          )
        })}
        <Button
          style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            border: 'none',
            color: getContrast(buttonColor),
          }}
          onClick={() => onItemClick(listItem)}
        >
          {buttonLabel}
        </Button>
      </div>
      <div style={{ gridArea: 'control' }}></div>
    </div>
  )
}
