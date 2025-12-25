// src/pages/Broadcast/NewTemplatePage.tsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem,
  Button, RadioGroup, FormControlLabel, Radio, Paper, Divider,
  List, ListItemButton, ListItemIcon, ListItemText, Stack, Switch
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MessageIcon from '@mui/icons-material/Message';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ScheduleIcon from '@mui/icons-material/Schedule';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useNavigate, useLocation } from 'react-router-dom';
import TemplatePreview from '../../components/TemplatePreview';

const SIDEBAR_WIDTH = 280;

const NewTemplatePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // GET DATA FROM EDIT MODE
  const editData = location.state as { editMode: boolean; template: any } | null;
  const isEditMode = editData?.editMode && editData?.template;

  const [templateName, setTemplateName] = useState('');
  const [category, setCategory] = useState('MARKETING');
  const [language, setLanguage] = useState('en');
  const [headerType, setHeaderType] = useState('none');
  const [headerText, setHeaderText] = useState('');
  const [headerFile, setHeaderFile] = useState<File | null>(null);
  const [headerFileName, setHeaderFileName] = useState('');
  const [footerText, setFooterText] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [enableButtons, setEnableButtons] = useState(true);
  const [buttons, setButtons] = useState([
    { type: 'url', text: 'Visit us', value: 'https://www.wati.io' },
    { type: 'phone', text: 'Call us', value: '+966501234567' }
  ]);

  // AUTO-FILL WHEN IN EDIT MODE
  useEffect(() => {
    if (isEditMode && editData?.template) {
      const t = editData.template;
      setTemplateName(t.name || '');
      setCategory(t.category || 'MARKETING');
      setLanguage(t.language || 'en');
      setHeaderType(t.header_type === 'text' ? 'text' : t.header_type === 'image' ? 'image' : 'none');
      setHeaderText(t.header_text || '');
      setBodyText(t.body_text || '');
      setFooterText(t.footer_text || '');
      
      // Buttons
      if (t.buttons && t.buttons.length > 0) {
        setButtons(t.buttons);
        setEnableButtons(true);
      } else {
        setEnableButtons(false);
      }
    }
  }, [isEditMode, editData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setHeaderFile(e.target.files[0]);
      setHeaderFileName(e.target.files[0].name);
    }
  };

  const handleSave = async () => {
    const templateData = {
      id: isEditMode ? editData.template.id : undefined,
      name: templateName || "Untitled Template",
      category,
      language,
      header_type: headerType,
      header_text: headerText || "",
      body_text: bodyText,
      footer_text: footerText || "",
      buttons: enableButtons ? buttons : [],
      status: "draft"
    };

    try {
      const method = isEditMode ? 'PUT' : 'POST';
      const url = isEditMode 
        ? `http://127.0.0.1:8000/api/templates/${editData.template.id}/`
        : 'http://127.0.0.1:8000/api/templates/';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData)
      });

      if (res.ok) {
        alert(isEditMode ? "Template updated!" : "Template saved as draft!");
        navigate('/broadcast');
      } else {
        alert("Save failed");
      }
    } catch (err) {
      alert("Django not running?");
    }
  };

  return (
    <Box display="flex">
      {/* SIDEBAR */}
      <Paper sx={{ width: SIDEBAR_WIDTH, height: '100vh', position: 'fixed', bgcolor: '#fafafa' }}>
        <Box p={3}>
          <Typography variant="h6" fontWeight="bold" color="#00A859">Broadcasts</Typography>
        </Box>
        <Divider />
        <List>
          <ListItemButton onClick={() => navigate('/broadcast')}>
            <ListItemIcon sx={{ color: '#666' }}><MessageIcon /></ListItemIcon>
            <ListItemText primary="Your Templates" />
          </ListItemButton>
          <ListItemButton selected sx={{ bgcolor: '#ecfdf5' }}>
            <ListItemIcon sx={{ color: '#00A859' }}><AddIcon /></ListItemIcon>
            <ListItemText primary={isEditMode ? "Edit Template" : "New Template Message"} />
          </ListItemButton>
          <ListItemButton onClick={() => navigate('/broadcast/analytics')}>
            <ListItemIcon sx={{ color: '#666' }}><AnalyticsIcon /></ListItemIcon>
            <ListItemText primary="Broadcast Analytics" />
          </ListItemButton>
          <ListItemButton onClick={() => navigate('/broadcast/schedule')}>
            <ListItemIcon sx={{ color: '#666' }}><ScheduleIcon /></ListItemIcon>
            <ListItemText primary="Scheduled Broadcasts" />
          </ListItemButton>
        </List>
      </Paper>

      {/* MAIN CONTENT */}
      <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, p: 4, width: `calc(100% - ${SIDEBAR_WIDTH}px)` }}>
        <Box display="grid"   gridTemplateColumns="1fr 330px" gap={4} alignItems="flex-start" >
          {/* LEFT: FORM */}
            <Box flex="1 1 auto" sx={{ maxWidth: "900px" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h5" fontWeight="bold">
                {isEditMode ? `Edit Template: ${templateName || 'Loading...'}` : 'New Template'}
              </Typography>
              <Box>
                <Button variant="outlined" sx={{ mr: 2 }} onClick={handleSave}>
                  {isEditMode ? 'Update Draft' : 'Save as Draft'}
                </Button>
                <Button variant="contained" color="success">
                  {isEditMode ? 'Update & Submit' : 'Save and Submit'}
                </Button>
              </Box>
            </Box>

            {/* Rest of your form — SAME AS BEFORE */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Box display="flex" gap={2} mb={3}>
                <TextField fullWidth label="Template Name" value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <MenuItem value="MARKETING">Marketing</MenuItem>
                    <MenuItem value="UTILITY">Utility</MenuItem>
                    <MenuItem value="AUTHENTICATION">Authentication</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="ar">العربية (Arabic)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Paper>

            {/* Header, Body, Footer, Buttons — KEEP SAME AS YOUR ORIGINAL */}
            {/* ... your existing code ... */}
            {/* Just keep everything below unchanged */}
             

            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" mb={2}>Body</Typography>
              <TextField fullWidth multiline rows={6} placeholder="Template Message..." value={bodyText} onChange={(e) => setBodyText(e.target.value)} />
              <Box textAlign="right" mt={1}><Typography variant="caption" color="text.secondary">{bodyText.length}/550</Typography></Box>
            </Paper>

            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>Footer (Optional)</Typography>
              <TextField fullWidth placeholder="Enter Text" value={footerText} onChange={(e) => setFooterText(e.target.value)} />
              <Box textAlign="right" mt={1}><Typography variant="caption" color="text.secondary">{footerText.length}/60</Typography></Box>
            </Paper>

            <Paper sx={{ p: 3, mb: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Buttons (Recommended)</Typography>
                <Switch checked={enableButtons} onChange={(e) => setEnableButtons(e.target.checked)} color="success" />
              </Box>
              {enableButtons && buttons.map((btn, idx) => (
                <Box key={idx} mb={2}>
                  <TextField size="small" placeholder="Button text" value={btn.text} sx={{ mr: 2 }} onChange={(e) => {
                    const newBtns = [...buttons];
                    newBtns[idx].text = e.target.value;
                    setButtons(newBtns);
                  }} />
                  <TextField size="small" placeholder={btn.type === 'url' ? 'https://...' : '+123...'} value={btn.value} onChange={(e) => {
                    const newBtns = [...buttons];
                    newBtns[idx].value = e.target.value;
                    setButtons(newBtns);
                  }} sx={{ width: 250 }} />
                </Box>
              ))}
            </Paper>
          </Box>

          {/* RIGHT: PREVIEW */}
          <Box flex="0 0 330px" sx={{ position: 'sticky', top: 24, maxWidth:330, marginLeft: "auto" }}>
            <TemplatePreview 
              template={{
                header_text: headerText,
                body_text: bodyText,
                footer_text: footerText,
                buttons: enableButtons ? buttons : []
              }} 
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NewTemplatePage;