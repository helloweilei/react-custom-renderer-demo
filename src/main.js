import { createRoot } from "react-dom/client";
import React from 'react';
import App from "./App.jsx";

import CustomRenderer from './renderer/index.js'

// createRoot(document.getElementById('app')).render(<App />);
const container = { type: 'container' };
CustomRenderer.render(<App />, container);

console.log(container); // { type: 'container', children: [child], __rootContainer: fiberRootNode }