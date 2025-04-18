// app/item/creating/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  Typography,
  Box,
  Container,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Rating,
  Stack,
  Grid,
  Alert
} from '@mui/material';

import StarIcon from '@mui/icons-material/Star';
import { createItem, getTemplate, getTemplates } from '@/api/item/create';

// Types
interface Template {
  id: number;
  name: string;
  displayName: string;
  description: string;
  fullMarks: number;
  isPublished: boolean;
  fields: TemplateField[];
}

interface TemplateField {
  id: number;
  templateId: number;
  name: string;
  displayName: string;
  description: string;
  fieldType: string;
  isRequired: boolean;
  isSearchable: boolean;
  isFilterable: boolean;
  displayOrder: number;
  dataSourceId: number | null;
  validationRules: any;
  dataSource: DataSource | null;
}

interface DataSource {
  id: number;
  name: string;
  sourceType: string;
  configuration: any;
  options: DataSourceOption[];
}

interface DataSourceOption {
  id: number;
  dataSourceId: number;
  value: string;
  displayText: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Template Selection Component
const TemplateSelection = ({ 
  templates, 
  selectedTemplate, 
  onSelectTemplate 
}: { 
  templates: Template[]; 
  selectedTemplate: Template | null; 
  onSelectTemplate: (template: Template) => void;
}) => {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Choose Rating Type
      </Typography>
      <Grid container spacing={2}>
        {templates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Paper
              elevation={selectedTemplate?.id === template.id ? 6 : 1}
              sx={{
                p: 3,
                cursor: 'pointer',
                border: selectedTemplate?.id === template.id ? '2px solid' : '1px solid',
                borderColor: selectedTemplate?.id === template.id ? 'primary.main' : 'grey.300',
                transition: 'all 0.2s',
                '&:hover': {
                  elevation: 3,
                  borderColor: 'primary.light',
                },
              }}
              onClick={() => onSelectTemplate(template)}
            >
              <Typography variant="h6" component="h3" gutterBottom>
                {template.displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {template.description}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <StarIcon color="primary" />
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {`Max Rating: ${template.fullMarks}`}
                </Typography>
              </Box>
              <Chip 
                label={selectedTemplate?.id === template.id ? "Selected" : "Select"} 
                color={selectedTemplate?.id === template.id ? "primary" : "default"}
                size="small"
                sx={{ mt: 2 }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Template Form Component
const TemplateForm = ({ 
  template, 
  formValues, 
  setFormValues, 
  formErrors, 
  setFormErrors,
  userRating,
  setUserRating,
}: { 
  template: Template;
  formValues: any;
  setFormValues: (values: any) => void;
  formErrors: any;
  setFormErrors: (errors: any) => void;
  userRating: number;
  setUserRating: (rating: number) => void;
}) => {
  const handleInputChange = (field: TemplateField, value: any) => {
    setFormValues({ ...formValues, [field.name]: value });
    
    // Clear error if value is provided
    if (field.isRequired && value) {
      const newErrors = { ...formErrors };
      delete newErrors[field.name];
      setFormErrors(newErrors);
    }
  };
  const sortedFields = (template.fields ?? []).sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {template.displayName} Details
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {template.description}
      </Typography>

      <Box sx={{ my: 4 }}>
        <Typography variant="h6" gutterBottom>
          Your Rating
        </Typography>
        <Rating
          name="user-rating"
          value={userRating}
          onChange={(event, newValue) => {
            setUserRating(newValue || 0);
          }}
          precision={0.5}
          max={template.fullMarks}
          size="large"
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {userRating > 0 ? `${userRating} out of ${template.fullMarks}` : "Select your rating"}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {sortedFields.map((field) => (
          <Grid item xs={12} sm={field.fieldType === 'textarea' ? 12 : 6} key={field.id}>
            {field.fieldType === 'text' && (
              <TextField
                fullWidth
                label={field.displayName}
                value={formValues[field.name] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                required={field.isRequired}
                error={Boolean(formErrors[field.name])}
                helperText={formErrors[field.name] || field.description}
                inputProps={{
                  maxLength: field.validationRules?.max_length,
                  minLength: field.validationRules?.min_length,
                }}
              />
            )}
            {field.fieldType === 'textarea' && (
              <TextField
                fullWidth
                label={field.displayName}
                value={formValues[field.name] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                required={field.isRequired}
                error={Boolean(formErrors[field.name])}
                helperText={formErrors[field.name] || field.description}
                multiline
                rows={4}
                inputProps={{
                  maxLength: field.validationRules?.max_length,
                }}
              />
            )}
            {field.fieldType === 'number' && (
              <TextField
                fullWidth
                label={field.displayName}
                type="number"
                value={formValues[field.name] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                required={field.isRequired}
                error={Boolean(formErrors[field.name])}
                helperText={formErrors[field.name] || field.description}
                inputProps={{
                  min: field.validationRules?.min,
                  max: field.validationRules?.max,
                }}
              />
            )}
            {field.fieldType === 'select' && field.dataSource && (
              <FormControl fullWidth required={field.isRequired} error={Boolean(formErrors[field.name])}>
                <InputLabel id={`select-label-${field.id}`}>{field.displayName}</InputLabel>
                <Select
                  labelId={`select-label-${field.id}`}
                  value={formValues[field.name] || ''}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  label={field.displayName}
                >
                  {field.dataSource.options.map((option) => (
                    <MenuItem key={option.id} value={option.value}>
                      {option.displayText}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{formErrors[field.name] || field.description}</FormHelperText>
              </FormControl>
            )}
            {field.fieldType === 'multiselect' && field.dataSource && (
              <FormControl fullWidth required={field.isRequired} error={Boolean(formErrors[field.name])}>
                <InputLabel id={`multiselect-label-${field.id}`}>{field.displayName}</InputLabel>
                <Select
                  labelId={`multiselect-label-${field.id}`}
                  multiple
                  value={formValues[field.name] || []}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  input={<OutlinedInput label={field.displayName} />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value: string) => {
                        const option = field.dataSource?.options.find(o => o.value === value);
                        return <Chip key={value} label={option?.displayText || value} size="small" />;
                      })}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {field.dataSource.options.map((option) => (
                    <MenuItem key={option.id} value={option.value}>
                      <Checkbox checked={(formValues[field.name] || []).indexOf(option.value) > -1} />
                      <ListItemText primary={option.displayText} />
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{formErrors[field.name] || field.description}</FormHelperText>
              </FormControl>
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Main Component
const CreateItemPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [step, setStep] = useState(0);
  const [formValues, setFormValues] = useState<any>({});
  const [formErrors, setFormErrors] = useState<any>({});
  const [userRating, setUserRating] = useState<number>(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'reset' | 'submit' | null>(null);
  const [alertMessage, setAlertMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  useEffect(() => {
    // Fetch templates
    const fetchTemplates = async () => {
      try {
        const data = await getTemplates();
        
        setTemplates(data);
      } catch (error) {
        console.error('Error fetching templates:', error);
        setAlertMessage({
          type: 'error',
          message: 'Error loading templates. Please try again later.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();

    // For demo purposes, let's add mock data
    if (process.env.NODE_ENV === 'development') {
      // This is just for development/preview - would be removed in production
      const mockTemplates = [
        {
          id: 1,
          name: 'movie',
          displayName: 'Movies',
          description: 'Template for movie ratings including feature films, documentaries, and shorts',
          fullMarks: 10,
          isPublished: true,
          fields: [] // Would be populated by the actual API
        },
        {
          id: 2,
          name: 'book',
          displayName: 'Books',
          description: 'Template for rating books, novels, and publications',
          fullMarks: 5,
          isPublished: true,
          fields: []
        },
        {
          id: 3,
          name: 'music',
          displayName: 'Music',
          description: 'Template for rating songs, albums, and musical performances',
          fullMarks: 10,
          isPublished: true,
          fields: []
        }
      ];
      setTemplates(mockTemplates);
      setIsLoading(false);
    }
  }, []);

  const handleSelectTemplate = async (template: Template) => {
    setIsLoading(true);
    setAlertMessage(null);
    
    try {
      const data = await getTemplate(template.id);
      
      setSelectedTemplate(data);
        setStep(1);
    } catch (error) {
      console.error('Error fetching template details:', error);
      setAlertMessage({
        type: 'error',
        message: 'Error loading template details. Please try again later.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOpen = (action: 'reset' | 'submit') => {
    setConfirmAction(action);
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setConfirmAction(null);
  };

  const validateForm = () => {
    const errors: any = {};
    let isValid = true;

    if (!selectedTemplate) return false;

    if (userRating <= 0) {
      setAlertMessage({
        type: 'error',
        message: 'Please provide your rating before submitting.'
      });
      return false;
    }

    selectedTemplate.fields.forEach(field => {
      if (field.isRequired) {
        const value = formValues[field.name];
        
        if (!value || 
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === 'string' && value.trim() === '')) {
          errors[field.name] = `${field.displayName} is required`;
          isValid = false;
        }
      }
    });

    setFormErrors(errors);
    
    if (!isValid) {
      setAlertMessage({
        type: 'error',
        message: 'Please fill in all required fields.'
      });
    }
    
    return isValid;
  };

  const handleReset = () => {
    setFormValues({});
    setFormErrors({});
    setUserRating(0);
    handleConfirmClose();
    
    setAlertMessage({
      type: 'success',
      message: 'Form has been reset.'
    });
    
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      handleConfirmClose();
      return;
    }

    setIsLoading(true);
    setAlertMessage(null);

    try {
      // API call to submit the form
      const response = await createItem({
        templateId: selectedTemplate?.id,
        formValues
      });

      await response.json();
      setAlertMessage({
        type: 'success',
        message: 'Rating created successfully!'
      });
      setTimeout(() => {
        router.push('/user/ratings');
      }, 1000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setAlertMessage({
        type: 'error',
        message: error?.message || 'Failed to create rating. Please try again later.'
      });
    } finally {
      setIsLoading(false);
      handleConfirmClose();
    }

    // For demo purposes
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        setAlertMessage({
          type: 'success',
          message: 'Rating created successfully! (Demo mode)'
        });
        handleConfirmClose();
        setIsLoading(false);
        
        setTimeout(() => {
          setAlertMessage(null);
        }, 3000);
      }, 1000);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container maxWidth="lg" component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {alertMessage && (
          <Alert 
            severity={alertMessage.type} 
            sx={{ mb: 2 }}
            onClose={() => setAlertMessage(null)}
          >
            {alertMessage.message}
          </Alert>
        )}
        
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Create Rating Item
          </Typography>
          
          <Stepper activeStep={step} sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Select Template</StepLabel>
            </Step>
            <Step>
              <StepLabel>Fill Details</StepLabel>
            </Step>
          </Stepper>
          
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <Typography>Loading...</Typography>
            </Box>
          ) : (
            <>
              {step === 0 && (
                <TemplateSelection 
                  templates={templates}
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={handleSelectTemplate}
                />
              )}
              
              {step === 1 && selectedTemplate && (
                <>
                  <TemplateForm 
                    template={selectedTemplate}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    formErrors={formErrors}
                    setFormErrors={setFormErrors}
                    userRating={userRating}
                    setUserRating={setUserRating}
                  />
                  
                  <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                    <Button 
                      variant="outlined" 
                      color="secondary"
                      onClick={() => handleConfirmOpen('reset')}
                    >
                      Reset
                    </Button>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => handleConfirmOpen('submit')}
                    >
                      Submit
                    </Button>
                  </Stack>
                </>
              )}
            </>
          )}
        </Paper>
      </Container>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {confirmAction === 'reset' ? 'Reset Form?' : 'Submit Rating?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {confirmAction === 'reset' 
              ? 'Are you sure you want to reset all form fields? This action cannot be undone.'
              : 'Are you sure you want to submit this rating?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>Cancel</Button>
          <Button 
            onClick={confirmAction === 'reset' ? handleReset : handleSubmit} 
            autoFocus
            color={confirmAction === 'reset' ? 'error' : 'primary'}
          >
            {confirmAction === 'reset' ? 'Reset' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateItemPage;