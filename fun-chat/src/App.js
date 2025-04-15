import './App.css';
import Login from './components/Login';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import ChatRoom from './components/ChatRoom';
import AuthProvider from './Context/AuthProvider';
import AppProvider from './Context/AppProvider';
import AddRoomModal from './components/Modals/AddRoomModal';
import InviteMemberModal from './components/Modals/InviteMemberModal';
import Register from './components/Login/register';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Switch>
            <Route component={Login} path='/login' />
            <Route component={Register} path='/register' />
            <Route component={ChatRoom} path='/' exact />
            <Route path='*'>
              <Redirect to='/' />
            </Route>
          </Switch>
          <AddRoomModal />
          <InviteMemberModal />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
