import './App.css';
import React, {useLayoutEffect, useState} from 'react'
import GenerateTable from './components/table';
import GenerateSelectedPanel from './components/selected';
import GenerateNavbar from './components/navbar';
import createElement from './graph/element';
import createConnection from './graph/connection';

// Создает строки таблицы

function App() {
  const [globalId, setGlobalId] = useState(0)
  const [objects, setObjects] = useState([])
  const [action, setAction] = useState("selecting")
  const [selectedId, setSelected] = useState(-1)

  const importElements = (data) => {
    try {
    console.log("data: ", data)
    setObjects([])
    setGlobalId(0)
    let newObjects = []
    data.forEach((o) => {
      let obj = {}
      if (o.type === "element") {
        const {id, x, y, radius} = o
        obj = createElement(id, x, y, radius)
        setGlobalId(globalId+1)
      } else {
        const {id1, id2, id} = o
        obj = createConnection(id1, id2, newObjects, id)
        setGlobalId(globalId+1)
      }
      console.log(obj)
      newObjects = [...newObjects, obj]
      console.log("objects:", newObjects)
    })
    setObjects(newObjects)
    console.log("objects:", objects)
  } catch {}
  }

  const getObjectIndex = (objects, id) => {
    return objects.findIndex( (o) => o.id === id)
  }
  const getObjectAtPosition = (x, y) => {
    return objects.find((o) => o.isWithin(x, y, objects))
  }

  const changeInput = (e) => {
    changeObjectName(selectedId, e.target.value)
    refresh()
  }

  const updateObject = (object) => {
    const id = {object}
    const updated = { ...object } 
    const objectsCopy = [...objects]
    objectsCopy[getObjectIndex(objectsCopy, id)] = updated
    setObjects(objectsCopy)
  }

  const deleteSelected = () => {
    deleteObject(selectedId)
    setSelected(-1)
  }

  const deleteObject = (id) => {
    let index = getObjectIndex(objects, id)
    let objectsCopy = [...objects]
    if (objects[index].type === "element") {
      const connections = objects.filter((o) => o.type === "connection" && (o.id1 === id || o.id2 === id))
      for (let c of connections) {
        let index = getObjectIndex(objectsCopy, c.id)
        objectsCopy.splice(index, 1)
      }
    }
    objectsCopy.splice(index, 1)
    setObjects(objectsCopy)
  }

  const changeObjectName = (id, name) => {
    const index = getObjectIndex(objects, id)
    objects[index].name = name
    updateObject(objects[index])
  }

  const moveObject =(id, x, y) => {
    const index = getObjectIndex(objects, id)
    objects[index].x = x
    objects[index].y = y
    updateObject(objects[index])
  }

  const refresh = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    objects.forEach((e) => {e.draw(ctx, selectedId, objects)})
  }

  useLayoutEffect( () => {
    refresh()
  })


  const handleMouseDown = (event) => {
    const {clientX, clientY} = event
    if (action === "addingPoint"){
      const element = createElement(globalId, clientX, clientY, 40)
      setGlobalId((prevState) => prevState+1)
      setObjects( (prevState) => [...prevState, element])
      return
    }
    if (action === "connecting") {
      if (selectedId === -1) {
        console.log("selecting 1st element")
        const element = getObjectAtPosition(clientX, clientY, objects)
        if (element === undefined || element.type !== 'element') {
          return
        }
        setSelected(element.id)
        console.log("selected: ", selectedId)
        return
      }
      console.log("selecting 2nd element")
      const element = getObjectAtPosition(clientX, clientY, objects)
      if (element === undefined || element.type !== 'element') {
        return
      }
      const connection = createConnection(selectedId, element.id, objects, globalId)
      setGlobalId((prevState) => prevState + 1)
      setObjects( (prevState) => [...prevState, connection])
      setSelected(-1)
      setAction("selecting")
    }
    if (action === "selecting"){
      const element = getObjectAtPosition(clientX, clientY, objects)
      if (element === undefined) {
        setSelected(-1)
        return
      }
      console.log("clicked on: ", element)
      setSelected(element.id)
      setAction("moving")
    }

  }

  const handleMouseMove = (event) => {
    const {clientX, clientY} = event
    if (action === "moving") {
      console.log("atttempt move")
      console.log(selectedId)
      const ind = getObjectIndex(objects, selectedId)
      console.log("hell0:", objects[ind].name)
      moveObject(selectedId,clientX, clientY)
    }
  }
 
  const handleMouseUp = (event) => {
    if (action === "connecting") {
      return
    }
    setAction("selecting");
  }

  const handleKeyDown = (event) => {
    if (event.key === "Delete") {
      console.log("Attempt delete")
      if (selectedId !== -1) {
        deleteSelected()
      }
    }
  }

  return (
    <div>
          <GenerateNavbar
            objects={objects}
            importElements={importElements}
            action1 = {() => setAction("addingPoint")} 
            action2 = {() => {
              setAction("connecting")
              setSelected(-1)
            }} />
      <GenerateSelectedPanel selectedId={selectedId} objects={objects} changeInput={changeInput} deleteSelected={deleteSelected} />
      <GenerateTable objects={objects} />
      <canvas 
        tabIndex = '0'
        id="canvas" 
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onKeyDown={handleKeyDown}
      > 
        CAnvas
      </canvas>
    </div>
  );
}
export default App;
