import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { login } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';

import backgroundImage from '../../assets/img1.jpg'; // Đường dẫn ảnh nền

function LoginPage() {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error, token, role, userId, fullName } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !password) return;
    dispatch(login({ userName, password }));
  };

  useEffect(() => {
    if (token && role && userId) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
      localStorage.setItem('fullName', fullName);
      navigate('/dashboard');
    }
  }, [token, navigate]);

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '95vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 360,
          p: 4,
          borderRadius: 2,
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          textAlign="center"
        >
          ĐĂNG NHẬP
        </Typography>
        <Typography variant="body2" textAlign="center" sx={{ mb: 2 }}>
          Nhập email và mật khẩu để đăng ký tài khoản
        </Typography>
        <Box component="form" onSubmit={handleLogin}>
          <TextField
            label="Tên đăng nhập"
            variant="outlined"
            fullWidth
            margin="normal"
            value={userName}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Mật khẩu"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              py: 1.2,
              fontSize: 16,
              textTransform: 'none',
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Đăng nhập'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default LoginPage;
