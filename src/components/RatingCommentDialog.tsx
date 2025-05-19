import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Rating,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';

interface RatingCommentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  rating: number;
  setRating: (value: number) => void;
  comment: string;
  setComment: (value: string) => void;
  isUpdate?: boolean;
  maxRating?: number;
}

const RatingCommentDialog: React.FC<RatingCommentDialogProps> = ({
  open,
  onClose,
  onSubmit,
  rating,
  setRating,
  comment,
  setComment,
  isUpdate = false,
  maxRating = 5,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          width: { xs: '95vw', sm: 500, md: 600 },
          maxWidth: { xs: '95vw', sm: 500, md: 600 },
          borderRadius: 3,
        },
      }}
      fullScreen={fullScreen}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: 22, textAlign: 'center', pb: 1 }}>
        {isUpdate ? 'Update Your Rating' : 'Rate This Item'}
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2, sm: 4 }, pt: 1, pb: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 500, mb: 1 }}>Rating (out of {maxRating} stars):</Typography>
          <Rating
            value={rating}
            onChange={(_, value) => setRating(value || 0)}
            precision={0.5}
            max={maxRating}
            sx={{ color: 'warning.main', fontSize: 36 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {rating ? `Score: ${(rating * 2).toFixed(1)} / 10` : 'Select a rating'}
          </Typography>
        </Box>
        <TextField
          label="Comment"
          multiline
          rows={6}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          fullWidth
          sx={{ mt: 1 }}
          inputProps={{ maxLength: 1000 }}
          helperText={`${comment.length}/1000`}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="secondary" sx={{ minWidth: 100 }}>
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained" color="primary" sx={{ minWidth: 100 }}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RatingCommentDialog; 