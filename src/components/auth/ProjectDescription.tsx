import { Box, Typography, Divider } from '@mui/material';

const description = [
  {
    title: 'Personalized Recommendations',
    text: "Discover shows you'll love."
  },
  {
    title: 'Your Ratings',
    text: "Rate and remember everything you've seen."
  },
  {
    title: 'Contribute to Rating everything',
    text: "Add data that will be seen by many people."
  }
];

const ProjectDescription = () => (
  <>
    <Divider orientation="vertical" flexItem className="hidden md:block" />
    <Box
      className="hidden md:flex flex-col justify-center bg-white p-8 min-w-[320px] max-w-xs"
    >
      <Typography variant="h5" fontWeight={700} className="mb-4">
        Benefits of your free Rating account
      </Typography>
      {description.map((item, idx) => (
        <Box key={item.title} className={idx !== 0 ? 'mt-4' : ''}>
          <Typography variant="subtitle1" fontWeight={700}>
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.text}
          </Typography>
        </Box>
      ))}
    </Box>
  </>
);

export default ProjectDescription;
