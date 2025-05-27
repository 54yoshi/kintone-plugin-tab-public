import React from 'react';
import { createRoot } from 'react-dom/client';
import Config from './Config'; 

const container = document.getElementById('kintonePlugin');
if (container) {
  const kintonePlugin = createRoot(container);
  kintonePlugin.render(
    <React.StrictMode>
      <Config />
    </React.StrictMode>
  );
}
