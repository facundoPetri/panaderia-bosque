import React from 'react'
interface RecetasProps {
  title: string
}
const Recetas:React.FC<RecetasProps> = ({ title }) => {
  return (
    <div>{title}</div>
  )
}

export default Recetas