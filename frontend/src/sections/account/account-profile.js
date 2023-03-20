import { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';
import httpService from 'src/services/http-service';
import { toast } from 'react-toastify';

export const AccountProfile = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    avatar: '/assets/avatars/avatar-anika-visser.png',
    city: '',
    country: '',
    name: '',
    timezone: '',
    initialized: false
  });
  useEffect(() => {
    if (!(!user.initialized && loading === false)) return;
    if (loading === true) return;
    setLoading(true);
    const fetchUser = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('access_token');
        console.log('Token:', token);
        const profile =( await httpService.get(`/user/${user.username}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })).data.data;
        profile.avatar = '/assets/avatars/avatar-anika-visser.png';
        profile.initialized = true;
        setUser(profile);
      } catch(error) {
        toast.error(error?.response?.data?.error?.message || error.message)
      }
      setLoading(false);
    }
    fetchUser();
  }, [user])

  console.log('User is:', user)

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            src={user.avatar}
            sx={{
              height: 80,
              mb: 2,
              width: 80
            }}
          />
          <Typography
            gutterBottom
            variant="h5"
          >
            {user.name}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {user.city} {user.country}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {user.timezone}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          fullWidth
          variant="text"
        >
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
}
