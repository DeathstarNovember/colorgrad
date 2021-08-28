import React from 'react'
//do not edit, if I need to edit this I'm on the wrong track
export const Layout: React.FC<{ gradient?: string }> = ({
  children,
  gradient,
}) => {
  //Sets the layout container of the app
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        ...(gradient
          ? { backgroundImage: gradient }
          : { backgroundColor: '#fff' }),
        display: 'grid',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </div>
  )
}
