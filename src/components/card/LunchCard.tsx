import {
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { Meal } from '../../types/meal';

export default function LunchCard(data: Meal) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" color={'primary'}>
          {data.day}
        </Typography>
        <Typography variant="h5">Bữa trưa</Typography>
        <Typography color="textSecondary">Date: {data.date}</Typography>
        <Typography color="textSecondary">
          Price: {data.menu.price} VNĐ
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
          Menu:
        </Typography>
        <List>
          {data.menu.items.map((item: string, index: number) => (
            <ListItem key={index}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
        <Button variant="contained" fullWidth sx={{ mt: 2 }}>
          View menu
        </Button>
      </CardContent>
    </Card>
  );
}
