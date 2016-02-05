import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import DashApp from './components/DashApp';


render(<DashApp></DashApp>, document.getElementById('dash-app'));
