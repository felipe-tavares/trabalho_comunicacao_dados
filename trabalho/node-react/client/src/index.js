import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ReactDOM from 'react-dom';
import './index.css';
import Screen1 from './Screen1';
import Screen2 from './Screen2';
import App from './Apontador';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
        <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();