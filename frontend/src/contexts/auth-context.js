import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import httpService from 'src/services/http-service';

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let accessToken = null;
    let localUser = null;

    try {
      accessToken = localStorage.getItem('access_token');
      localUser = JSON.parse(localStorage.getItem('user'));
    } catch (err) {
      console.error(err);
    }

    if (accessToken) {
      try {
        const { data } = await httpService.get(`/user/${localUser?.username}/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const user = {
          id: data.data.id,
          avatar: '/assets/avatars/avatar-anika-visser.png',
          name: `${data.data.firstName} ${data.data.lastName}`,
          username: data.data.username,
          email: data.data.email
        };
  
        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: user
        });
      } catch(error) {
        console.error(error);
        dispatch({
          type: HANDLERS.INITIALIZE
        });
      }
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const signIn = async (username, password) => {
    const response = await httpService.post('/auth/login', { username, password });
    const data = response?.data?.data;
    try {
      localStorage.setItem('access_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err) {
      console.error(err);
    }

    const user = {
      id: data?.user?._id,
      email: data?.user?.email,
      username: data?.user?.username,
      avatar: '/assets/avatars/avatar-anika-visser.png',
    }

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user
    });
  };

  const signUp = async (email, username, password, inviteCode) => {
    await httpService.post('/auth/register', { email, username, password, inviteCode });
    dispatch({
      type: HANDLERS.INITIALIZE,
    });
  };

  const signOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
