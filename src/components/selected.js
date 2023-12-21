const GenerateSelectedPanel = ({selectedId, objects, changeInput, deleteSelected}) => {
    const ind = objects.findIndex( (o) => o.id === selectedId)
    return (
    <div className="sidePanel">
        <p>Selected: { selectedId !== -1 ? selectedId : "none"}</p>
        <div>
            { 
            selectedId !== -1 && 
            
            <div>
            <p>Name: <input type="text" 
            onChange={changeInput}
            value = {objects[ind].name}
            style={{width: 60}}/> 
            </p>
            </div>
            }
        </div>
        <div>
            {
            selectedId !== -1 && 
            <button onClick={deleteSelected}>Удалить</button>
            }
        </div>
    </div>
    )
}
export default GenerateSelectedPanel;