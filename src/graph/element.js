function createElement(id, x, y, radius){
    const name = "S"+id
    return {type: "element",
            name, 
            id, 
            x, 
            y, 
            radius, 
            draw(ctx, selectedId) {
                let {x, y, radius, name, id} = this
                const path = new Path2D()
                ctx.strokeStyle = "rgb(21,21,21)"
                if (id === selectedId) {
                ctx.strokeStyle = "blue"
                }
                path.arc(x, y, radius, 0, 2*Math.PI)
                ctx.lineWidth = 2;
                ctx.fillStyle = "white"
                ctx.fill(path)
                ctx.stroke(path)
                ctx.font = "20px Serif";
                ctx.textAlign = "center";
                ctx.fillStyle = "black"
                ctx.fillText(name, x, y); 
                ctx.strokeStyle = "rgb(21,21,21)"
            },
            isWithin(x, y) {
                const dx = this.x - x
                const dy = this.y - y
                const drs = dx**2 + dy**2
                return drs < this.radius**2 
            }
    }
}

export default createElement;