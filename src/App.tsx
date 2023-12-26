import { useState } from "react"

function App() {
  const gridInit = [
    [' ','#',' '],
    [' ','#',' '],
    [' ','#',' '],
  ] 
  const [grid, setGrid] = useState(gridInit)

  return (
    <div className="text-3xl text-blue-600 m-8 p-4 ">
      {grid.map((row, i) => (
        <div key={i} className="flex">
          {row.map((col, j) => (
            <button 
              key={j} 
              className="w-8 h-8 bg-gray-400 flex justify-center items-center border border-gray-500"
              onClick={() => {
                const newGrid = [...grid]
                newGrid[i][j] = newGrid[i][j] === '#' ? ' ' : '#'
                setGrid(newGrid)
              }}
              >
                {col}
            </button>
          ))}
        </div>
      )
      )}
    </div>
  )
}

export default App
