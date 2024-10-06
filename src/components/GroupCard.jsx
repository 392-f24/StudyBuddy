import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Button,
} from '@mui/material';

// eslint-disable-next-line max-len
export default function GroupCard({ id, name, subtext, profilePic, bodyText, requested, onJoin }) {
  return (
    <Card sx={{ width: '100%', borderRadius: 4 }}>
      <CardHeader
        avatar={
          <Avatar src={profilePic} sx={{ bgcolor: 'primary.main' }}>
            {!profilePic && name.charAt(0)}
          </Avatar>
        }
        title={
          <Typography variant="h6" component="div">
            {name}
          </Typography>
        }
        subheader={
          <Typography variant="subtitle2" color="text.secondary">
            {subtext}
          </Typography>
        }
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {bodyText}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          size="small"
          variant={requested ? 'outlined' : 'contained'}
          color={requested ? 'default' : 'primary'}
          onClick={onJoin}
          disabled={requested}
        >
          {requested ? 'Requested' : 'Join'}
        </Button>
      </CardActions>
    </Card>
  );
}
