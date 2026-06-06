import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
// scroll bar
import 'simplebar-react/dist/simplebar.min.css';

// apex-chart
import 'assets/third-party/react-table.css';

import '@fontsource/public-sans/400.css';
import '@fontsource/public-sans/500.css';
import '@fontsource/public-sans/600.css';
import '@fontsource/public-sans/700.css';
import { Provider as ReduxProvider } from 'react-redux';
// project imports
import App from './App';

import reportWebVitals from './reportWebVitals';
import { store } from './store/Store';

const container = document.getElementById('root');
const root = createRoot(container);

// ==============================|| MAIN - REACT DOM RENDER ||============================== //

//root.render(
//  <ConfigProvider>
//    <App />
//  </ConfigProvider>
//);

root.render(
    <StrictMode>
        <ReduxProvider store={store}>
            <App />
        </ReduxProvider>
    </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
