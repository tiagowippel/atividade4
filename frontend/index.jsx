'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import 'antd/dist/antd.css';

import App from './App';

const root = document.getElementById('app');

import { ConfigProvider } from 'antd';
import pt_BR from 'antd/lib/locale-provider/pt_BR';

const render = () => {
    ReactDOM.render(
        <ConfigProvider locale={pt_BR}>
            <App />
        </ConfigProvider>,
        root
    );
};

render();

if (module.hot) {
    module.hot.accept('./App.jsx', () => {
        render();
    });
}
