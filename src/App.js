import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Route,
  Switch,
  Redirect,
  withRouter,
  Link
} from "react-router-dom";

import './App.css';
import CustomDataList from './Components/CustomDataList';
import DataListFromSource from './Components/DataListFromSource';
import LoginForm from './Components/LoginForm';
import userLogin from './store/actionCreators/userLogin';
import updateUsers from './store/actionCreators/updateUsers';
import api from './api';

function App({ history, userName, loginUser, updateUsers, users }) {

  const tryLoginUser = (user) => {
    let userExists = false;
    users.forEach(existingUser => {
      if(existingUser.login.localeCompare(user.login) === 0 && existingUser.password.localeCompare(user.password) === 0) userExists = true;
    });
    return userExists;
  }

  const fetchUsers = async () => {
    let {status, data} = await api.getAllUsers();
    if(status === 200) updateUsers(data);
  }

  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      {
        userName === "" && history.location.pathname !== "/login" && history.location.pathname !== "/register" &&
        <Redirect to="/login" />
      }
        { history.location.pathname !== "/login" && history.location.pathname !== "/register" &&
          <nav className="col-10 row navbar navbar-expand-lg navbar-light bg-light">
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/customDataList"><h5>Table</h5></Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/dataListFromSource"><h5>API</h5></Link>
                </li>
              </ul>
              <span className="navbar-text"><h5>Hello {userName}!</h5></span>
            </div>
          </nav>
        }
          <Switch>
            <Route path='/login' >
              <LoginForm loginUser={tryLoginUser} setUserName={(userName) => loginUser(userName)}/>
            </Route>
            <Route path='/customDataList' component={CustomDataList} />
            <Route path='/dataListFromSource' component={DataListFromSource} />
            <Redirect form='/' to='/login' />
          </Switch>
    </div>
  );
}

const mapStateToProps = state => {
  return{
    userName: state.userName,
    users: state.users
  }
}

const mapDispatchToProps = dispatch => {
  return{
    loginUser: (userName) => dispatch(userLogin(userName)),
    updateUsers: (users) => dispatch(updateUsers(users))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
  )(withRouter(App));
