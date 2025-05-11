import { Card, CardContent, Typography } from '@mui/material';

interface MeetingCardProps {
  title: string;
  description: string;
  time: string;
}

export default function MeetingCard({
  title,
  description,
  time,
}: MeetingCardProps) {
  return (
    <Card sx={{ mb: 2, cursor: 'pointer' }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          {time}
        </Typography>
      </CardContent>
    </Card>
  );
}
