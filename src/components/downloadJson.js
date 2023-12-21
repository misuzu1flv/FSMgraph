const DownloadJson = ({ data, fileName = 'data.json' }) => {
    const downloadFile = (data, fileName) => {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    };
  
    return (
      <button onClick={() => downloadFile(data, fileName)}>
        Экспорт JSON
      </button>
    );
  };
  
  export default DownloadJson;
  