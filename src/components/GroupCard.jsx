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
export default function GroupCard({ name, subtext, profilePic, bodyText, actions }) {
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
        {actions.map((action, index) => (
          <Button
            key={index}
            size="small"
            variant={index === actions.length - 1 ? 'contained' : 'text'}
            onClick={action.onClick}
            sx={{
              bgcolor: index === actions.length - 1 ? 'primary.main' : 'transparent',
              color: index === actions.length - 1 ? 'white' : 'primary.main',
            }}
          >
            {action.label}
          </Button>
        ))}
      </CardActions>
    </Card>
  );
}
