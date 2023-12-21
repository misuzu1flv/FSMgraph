import DownloadJson from "./downloadJson";
import FileInput from "./importJSON";

const GenerateNavbar = ({objects, importElements, action1, action2}) => {
    return (
        <div className = "buttonPanel">
        <button onClick={action1}>
          Добавить состояние
        </button>
        <button onClick={action2}>
          Добавить переход
        </button>
        <DownloadJson data={objects} />
        {FileInput(objects, importElements)}
        </div>
        )
}

export default GenerateNavbar;