function createConnection(id1, id2, objects, id){
    const connections = objects.filter((object) => object.type === "connection")
    const digits = connections.filter((c) => c.id1 === id1 ).map((c) => {return parseInt(c.name[1]) + 1})
    digits.push(0)
    let digit = Math.max(...digits)
    console.log(digit)
    if (isNaN(digit)) {
      digit = 0
      console.log(digit)

    }
    console.log(digit)
    const name = "a" + digit
    let exists, reverse = false
    connections.forEach((con) => {
      if (con.id1 === id1 && con.id2 === id2) {
        exists = true
        console.log("exists")
      }
      if (con.id1 === id2 && con.id2 === id1) {
        con.reverse = true
        reverse = true
        console.log("reverse")
      }
    })
    if (exists) {
      return
    }
    const connection = {
        type: "connection", 
        id, 
        id1, 
        id2, 
        name, 
        reverse,
        draw(ctx, selectedId, elements) {
            const {id1, id2, id, name, reverse} = this
            const ind1 = getObjectIndex(objects, id1)
            const ind2 = getObjectIndex(objects, id2)
            if (id === selectedId) {
                ctx.strokeStyle = "blue"
            } else {
                ctx.strokeStyle = "black"
            }
            const rad1 = elements[ind1].radius
            const rad2 = elements[ind2].radius
            const headlen = 20
            const x1 = elements[ind1].x
            const y1 = elements[ind1].y
            if (id1 === id2) {
              const path = new Path2D()
              path.arc(x1-rad1*1.5, y1, rad1, 0, 2*Math.PI)
              ctx.fillText(name, x1-rad1*3, y1); 
              ctx.stroke(path)
              return
            }
            const x2 = elements[ind2].x 
            const y2 = elements[ind2].y 
            const dx = x1-x2
            const dy = y1-y2
            const angle = Math.atan2(dy, dx)
        
            const path = new Path2D()
            const fromx = x1-rad1*Math.cos(angle)
            const fromy = y1-rad1*Math.sin(angle)
            const tox = x2+rad2*Math.cos(angle)
            const toy = y2+rad2*Math.sin(angle)
            path.moveTo(fromx, fromy)
            let midx = (fromx+tox)/2
            let midy = (fromy+toy)/2
            const dist = Math.sqrt((toy - fromy)**2 + (tox-fromx)**2)
            if (reverse) {
              midx +=0.5*dist*Math.cos(Math.PI/2 + angle)
              midy +=0.5*dist*Math.sin(Math.PI/2 + angle)
            } 
            const angle2 = Math.atan2(midy-toy, midx-tox)
            path.quadraticCurveTo(midx, midy, tox, toy);
            path.lineTo(tox + headlen * Math.cos(angle2 + Math.PI/10), toy+ headlen * Math.sin(angle2 + Math.PI/7))
            path.moveTo(tox, toy)
            path.lineTo(tox + headlen * Math.cos(angle2 - Math.PI/10), toy+ headlen * Math.sin(angle2 - Math.PI/7))
            ctx.stroke(path)
            ctx.font = "20px Serif";
            if (reverse){
              ctx.fillText(name, midx - 0.25*dist*Math.cos(Math.PI/2 + angle), midy - 0.25*dist*Math.sin(Math.PI/2 + angle) - 10); 
            } else {
              ctx.fillText(name, midx, midy- 10); 
            }
        },
        isWithin(x, y, elements) {
            const ind1 = getObjectIndex(objects, id1)
            const ind2 = getObjectIndex(objects, id2)
            const x1 = elements[ind1].x
            const y1 = elements[ind1].y
            const x2 = elements[ind2].x
            const y2 = elements[ind2].y
            const dist = Math.sqrt((x1 - x2)**2 + (y1-y2)**2)
            const ab = Math.sqrt((x1 - x)**2 + (y1-y)**2)
            const bc = Math.sqrt((x2 - x)**2 + (y2-y)**2)
            console.log(dist, ab, bc)
            return ab + bc - dist < 0.3
        }}
    return connection
}

const getObjectIndex = (objects, id) => {
    return objects.findIndex( (o) => o.id === id)
  }
export default createConnection;