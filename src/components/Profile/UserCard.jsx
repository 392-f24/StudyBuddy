import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { lighten } from '@mui/system';

export default function StudentCard({ studentUserProfile, actions }) {
  const theme = useTheme();
  return (
    <Card
      sx={{
        backgroundColor: lighten(theme.palette.primary.light, 0.8),
        borderRadius: '16px', //  to make the card rounder
      }}
    >
      <CardHeader
        sx={{
          pb: 0,
          display: 'flex',
          alignItems: 'flex-start',
        }}
        avatar={
          <Avatar
            sx={{ marginTop: '-4px', bgcolor: '#4E2A84', width: 56, height: 56 }}
            src={studentUserProfile?.profilePic || ''} // Use Google profile picture if available
            alt={studentUserProfile?.name}
          >
            {!studentUserProfile?.photoURL && (studentUserProfile?.name?.[0] || '')}{' '}
            {/* Display student's initial if for some reason the Google photo URL was not stored */}
          </Avatar>
        }
        title={
          <Typography
            variant="h5"
            component="h2"
            sx={{
              color: 'rgba(0, 0, 0, 0.85)',
              fontWeight: '540',
              fontSize: '1.6rem',
              lineHeight: 1.2,
            }}
          >
            {studentUserProfile.name}
          </Typography>
        }
        subheader={
          <>
            <Typography color="textSecondary" component="h6">
              {studentUserProfile.major} ({studentUserProfile.year})
            </Typography>
          </>
        }
      />
      <CardContent>
        {studentUserProfile.listOfCourses.length > 0 &&
        studentUserProfile.listOfCourses[0] !== '' ? (
          <Typography color="textSecondary" component="h6">
            Courses: {studentUserProfile.listOfCourses.join(',')}
          </Typography>
        ) : null}
        <Typography color="textSecondary">{studentUserProfile.description}</Typography>
      </CardContent>
      {actions ? (
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {actions.map((action, index) => (
            <Button
              key={index}
              size="small"
              variant={action.variant || 'contained'}
              color={action.color || 'primary'}
              onClick={action.onClick}
              sx={{
                borderRadius: '12px',
                margin: 2,
              }} // This makes the button rounder
            >
              {action.label}
            </Button>
          ))}
        </CardActions>
      ) : (
        <></>
      )}
    </Card>
  );
}
