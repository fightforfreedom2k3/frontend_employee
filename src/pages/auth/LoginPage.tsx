import { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { login } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error, token, role, userId } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !password) {
      return;
    }
    dispatch(login({ userName, password }));
  };

  useEffect(() => {
    if (token && role && userId) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
      navigate('/dashboard');
    }
  }, [token, navigate]);

  return (
    <Container maxWidth="xs" className="login-container">
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          mt: 10,
          textAlign: 'center',
          borderRadius: 3,
          backgroundColor: '#ffffff', // White background similar to your image
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Light shadow
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          Đăng nhập HRM
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Xin chào! Một ngày mới tốt lành nhé
        </Typography>
        <Box component="form" onSubmit={handleLogin}>
          <TextField
            label="Email"
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
            <Typography color="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            sx={{
              mt: 2,
              padding: '10px',
              textTransform: 'none',
              fontSize: '16px',
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Đăng nhập'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;
