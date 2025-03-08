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

  const { loading, error, token, role } = useSelector(
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
    console.log(role);
    if (token && role) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      navigate('/dashboard');
    }
  }, [token, navigate]);

  return (
    <Container maxWidth="xs">
      <Paper
        elevation={6}
        sx={{ padding: 4, mt: 10, textAlign: 'center', borderRadius: 3 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Đăng Nhập
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
          {/* Hiển thị lỗi nếu có */}
          {error && (
            <Typography color="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
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
