import { useState, SyntheticEvent, useCallback, useContext } from 'react';
import { instance } from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserErrors } from '../../models/errors';
import { setCookie } from '../../utils/cookies';
import { useMutation } from 'react-query';
import { IShopContext, SignInData } from '../../models/types';
import { Context as ShopContext } from '../../context/ShopContext';

import './styles.css';

type Variant = 'LOGIN' | 'REGISTER';

const AuthPage = () => {

  const { state, setIsAuthenticated } = useContext<IShopContext>(ShopContext);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [variant]);

  const { mutate: register } = useMutation(
    async (data: SignInData) => {
      return await instance.post('users/register', data);
    },
    {
      onSuccess: () => {
        toast.success('Registration Completed! Now Login!');
        setLoading(false);
      },
      onError: (error: any) => {
        if (error.type === UserErrors.EMAIL_ALREADY_EXISTS) {
          toast.error('Email already in use!');
        } else {
          toast.error('Something went wrong!');
        }
        setLoading(false);
      },
    }
  );

  const { mutate: login } = useMutation(
    async (data: SignInData) => {
      return await instance.post('users/login', data);
    },
    {
      onSuccess: (data) => {
        toast.success('Login successful', {
          position: toast.POSITION.TOP_CENTER,
        });
        setCookie('access_token', data?.data?.token, data?.data?.expiresIn);
        localStorage.setItem('userID', data.data.data.user._id);
        setIsAuthenticated(true);
        setLoading(false);
        navigate('/');
        // console.log(data.data.data.user._id, 'login data');
      },
      onError: (error: any) => {
        let errorMsg: string = '';
        switch (error.type) {
          case UserErrors.WRONG_CREDENTIALS:
            errorMsg = 'Wrong email or password combination';
            break;
          case UserErrors.NO_USER_FOUND:
            errorMsg = "User doesn't exist";
            break;
          default:
            errorMsg = 'Something went wrong';
        }

        toast.error(errorMsg);

        setLoading(false);
      },
    }
  );

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    setLoading(true);

    const data = {
      email,
      password,
    };

    if (variant === 'REGISTER') {
      register(data);
    }

    if (variant === 'LOGIN') {
      login(data);
    }
  };

  return (
    <div className='auth'>
      <div className='auth-container'>
        {/* <ToastContainer /> */}
        <form onSubmit={handleSubmit}>
          <h2> {variant} </h2>
          <div className='form-group'>
            <label htmlFor='email'> Email: </label>
            <input
              className={loading ? 'click_disabled' : ''}
              type='text'
              id='email'
              value={email}
              disabled={loading}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='password'> Password: </label>
            <input
              className={loading ? 'click_disabled' : ''}
              type='password'
              id='password'
              value={password}
              disabled={loading}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button
            disabled={loading}
            className={
              loading ? 'click_disabled submit_button' : 'submit_button'
            }
            type='submit'
          >
            {variant}
          </button>

          <div className='variant flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500'>
            <div>
              {variant === 'LOGIN'
                ? 'New to Our Shop?'
                : 'Already have an account?'}
            </div>
            <div onClick={toggleVariant} className='variant_toggle'>
              {variant === 'LOGIN' ? 'Create an account' : 'Log in'}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
