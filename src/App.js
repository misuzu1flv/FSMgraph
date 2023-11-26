import { act } from 'react-dom/test-utils';
import './App.css';
import React, {useLayoutEffect, useState} from 'react'

function generateRows(elements, connections) {
  return elements.map(({id, name}) => {
    const con = connections.find((c) => {
      return c.id1 === id
    })
    let to = {name: ""}
    if (con !== undefined){
      to = elements.find((e) => {
        return e.id === con.id2
      })
    }
    return <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{to.name}</td>
    </tr>
  })
}

function generateTable(elements, connections){
  return (
    <table>
      <tr>
        <td>id</td>
        <td>name</td>
        <td>next</td>
      </tr>
      {
        generateRows(elements, connections)
      }
    </table>
  )
}

function createConnection(idcon, id1, id2, input){
  return{idcon, id1, id2, input}
}

function createElement(name, id, x, y, radius){
  return {name, id, x, y, radius}
}

function getElementAtPosition(x, y, elements) {
  return elements.find((element) => isWithinElement(x, y, element))
}

function isWithinElement(x, y, element) {
  const dx = element.x - x
  const dy = element.y - y
  const drs = dx**2 + dy**2
  return drs < element.radius**2 
}

function App() {
  const [connections, setConnections] = useState([])
  const [elements, setElements] = useState([])
  const [action, setAction] = useState("selecting")
  const [selected, setSelected] = useState()

  const updateElement = (name, id, x, y, radius) => {
    const updated = createElement(name, id, x, y, radius)
    const elementsCopy = [...elements]
    elementsCopy[id] = updated
    setElements(elementsCopy)
  }

  function drawElement(ctx, element) {
    const {x, y, radius, name} = element
    const path = new Path2D()
    ctx.strokeStyle = "rgb(21,21,21)"
    if (selected !== undefined && element.id === selected.id) {
      ctx.strokeStyle = "blue"
    }
    path.arc(x, y, radius, 0, 2*Math.PI)
    ctx.lineWidth = 2;
    ctx.stroke(path)
    ctx.font = "20px Serif";
    ctx.textAlign = "center";
    ctx.fillText(name, x, y); 
    ctx.strokeStyle = "rgb(21,21,21)"

  }

  const drawConnection = (ctx, connection) => {
    const {id1, id2, input} = connection
    const rad1 = elements[id1].radius
    const rad2 = elements[id2].radius
    const headlen = 20

    const x1 = elements[id1].x
    const y1 = elements[id1].y
    const x2 = elements[id2].x
    const y2 = elements[id2].y
    const dx = x1-x2
    const dy = y1-y2
    const angle = Math.atan2(dy, dx)
    const path = new Path2D()
    const fromx = x1-rad1*Math.cos(angle)
    const fromy = y1-rad1*Math.sin(angle)
    const tox = x2+rad2*Math.cos(angle)
    const toy = y2+rad2*Math.sin(angle)
    path.moveTo(fromx, fromy)
    path.lineTo(tox, toy)
    path.lineTo(tox + headlen * Math.cos(angle + Math.PI/10), toy+ headlen * Math.sin(angle + Math.PI/7))
    path.moveTo(tox, toy)
    path.lineTo(tox + headlen * Math.cos(angle - Math.PI/10), toy+ headlen * Math.sin(angle - Math.PI/7))
    ctx.stroke(path)
    ctx.fillText(input, (x1+x2)/2, (y1+y2)/2 - 10); 
  }

  const refresh = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    /*
    const edit = document.getElementById("editme")
    const nameInput = document.getElementById("nameInput")
    const selectMe = document.getElementById("selectName")

    if (selected !== undefined) {
      edit.innerText = selected.name
      nameInput.value = selected.name
      selectMe.hidden = false
    } else {
      edit.innerText = "none"
      selectMe.hidden = true
    }
    */

    connections.forEach((con) => drawConnection(ctx, con), [connections])
    elements.forEach((element) => drawElement(ctx, element), [elements])
  }

  useLayoutEffect( () => {
    refresh()
  })

  const handleMouseDown = (event) => {
    const {clientX, clientY} = event
    if (action === "addingPoint"){

      const element = createElement("hi", elements.length, clientX, clientY, 40)
      setElements( (prevState) => [...prevState, element])
      return
    }
    if (action === "connecting") {
      if (selected === undefined) {
        console.log("selecting 1st element")
        const element = getElementAtPosition(clientX, clientY, elements)
        if (element === undefined) {
          return
        }
        setSelected(element)
        console.log("selected: ", selected)
        return
      }
      console.log("selecting 2nd element")
      const element = getElementAtPosition(clientX, clientY, elements)
      if (element === undefined) {
        return
      }
      const connection = createConnection(connections.length, selected.id, element.id, "default")
      setConnections( (prevState) => [...prevState, connection])
      setSelected()
      setAction("selecting")
    }
    if (action === "selecting"){
      const element = getElementAtPosition(clientX, clientY, elements)
      console.log(element)
      if (element === undefined) {
        setSelected()
        return
      }
      setSelected(element)
      setAction("moving")
    }

  }

  const handleMouseMove = (event) => {
    const {clientX, clientY} = event
    if (action === "moving") {
      console.log("atttempt move")
      console.log(selected.id)
      const {name, id, radius} = selected
      updateElement(name, id, clientX, clientY, radius)
    }
  }
 
  const handleMouseUp = (event) => {
    if (action === "connecting") {
      return
    }
    setAction("selecting");
  }


  const [inputName, setInputName] = useState("")

  return (
    <div>
      <div className="buttonPanel">
        <button onClick={() => setAction("addingPoint")}>
          Create
        </button>
        <button onClick={() => {
          setAction("connecting")
          setSelected()
        }}>
          Connect
        </button>
      </div>
      <div className = "sidePanel">
        <p>Selected: { selected !== undefined ? selected.id : "none"}</p>
        { 
          selected !== undefined &&
          <p>Name: <input type="text" 
          onChange={(e) => {
            setInputName(e.target.value)
            console.log(e.target.value)
            console.log(elements[selected.id])
            elements[selected.id].name = e.target.value
            refresh()
          }} 
          value = {selected.name}
          style={{width: 60}}/> 
          </p>
        }
      
      </div>
      <div className="tablePanel">
        {generateTable(elements, connections)}
      </div>
      <canvas 
        id="canvas" 
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      > 
        CAnvas
      </canvas>
      </div>
  );
}
export default App;
