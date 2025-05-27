import { useState } from 'react';
import axios from 'axios';

function CatalogExport({ vendorId }) {
  const [includeStock, setIncludeStock] = useState(false);
  const [style, setStyle] = useState('style1');
  const [logo, setLogo] = useState(null);

  const handleExport = async () => {
    const formData = new FormData();
    formData.append('includeStock', includeStock);
    formData.append('style', style);
    if (logo) formData.append('logo', logo);

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}catalog/export/${vendorId}`,
      formData,
      { responseType: 'blob' }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'catalog.pdf');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="p-4 space-y-4">
      <label className="block">
        <input
          type="checkbox"
          checked={includeStock}
          onChange={e => setIncludeStock(e.target.checked)}
        /> Include Stock
      </label>

      <label className="block">
        PDF Style:
        <select
          value={style}
          onChange={e => setStyle(e.target.value)}
          className="ml-2 border rounded"
        >
          <option value="style1">Style 1</option>
          <option value="style2">Style 2</option>
        </select>
      </label>

      <label className="block">
        Upload Logo:
        <input
          type="file"
          onChange={e => setLogo(e.target.files[0])}
          className="ml-2"
        />
      </label>

      <button
        onClick={handleExport}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Download PDF
      </button>
    </div>
  );
}

export default CatalogExport;
