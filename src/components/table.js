function generateRows(elements, connections, headerList) {
    return elements.map(({id, name}) => {
  
      return <tr>
        <td>{name}</td>
        {
        headerList.map((h) => {
        const connection = connections.find((con) => (con.id1 === id && con.name === h))
        if (connection === undefined) {
          return <td></td>
        }
        return <td> {elements.find((e) => e.id ===connection.id2).name} </td>
        })
        }
      </tr>
    })
  }
  function generateHeader(connections) {
    let t = {}
    return connections.map(({name}) => {return name}).filter( e => !(t[e]=e in t))
  }
  //Создает таблицу
  const GenerateTable = ({objects}) => {
    console.log(objects)
    const connections = objects.filter((o) => {return o.type === "connection"})
    const elements = objects.filter((o) => {return o.type === "element"})
    const headerList = generateHeader(connections)
    return (
    <div className="tablePanel">
      <table>
        <tr>
        <td>State</td>
          {
            headerList.map((h) => {return <td>{h}</td>})
          }
        </tr>
        {
          generateRows(elements, connections, headerList)
        }
      </table>
    </div>
    )
  }

export default GenerateTable;