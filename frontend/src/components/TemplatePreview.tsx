// WhatsApp-style Template Preview (WATI-SIZED)
import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

interface TemplateData {
  header_text?: string;
  body_text?: string;
  footer_text?: string;
  buttons?: Array<{ type: string; text: string; value?: string }>;
}

const TemplatePreview: React.FC<{ template: TemplateData }> = ({ template }) => {
  const { header_text = "", body_text = "", footer_text = "", buttons = [] } = template;

  const renderButtons = () =>
    buttons.map((btn, i) => (
      <Button
        key={i}
        fullWidth
        variant="contained"
        sx={{
          mb: 0.8,
          py: 0.6,
          borderRadius: 2,
          backgroundColor: "#e9edef",
          color: "#008069",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "12px",
          boxShadow: "none",
        }}
      >
        {btn.text}
      </Button>
    ));

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle2" fontWeight="bold" mb={1}>
        Preview
      </Typography>

      {/* Phone Frame */}
      <Paper
        elevation={3}
        sx={{
          width: 290,          // << Smaller phone screen
          mx: "auto",
          borderRadius: "24px",
          overflow: "hidden",
          backgroundColor: "#e5ddd5",
          border: "1px solid #ccc",
        }}
      >
        {/* Top Bar */}
  {/* WhatsApp Top Bar (WATI Style) */}
<Box
  sx={{
    backgroundColor: "#075E54",
    px: 1.5,
    pt: 1,
    pb: 1.2,
    color: "white",
    position: "relative",
    borderTopLeftRadius: "22px",
    borderTopRightRadius: "22px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  }}
>

  {/* Status bar (time, signal, wifi, battery) */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "11px",
      opacity: 0.9,
      mb: 0.6,
      px: 0.5
    }}
  >
    <Typography sx={{ fontSize: "11px" }}>11:14</Typography>

    <Box sx={{ display: "flex", gap: 0.8 }}>
      <Typography sx={{ fontSize: "11px" }}>📶</Typography>
      <Typography sx={{ fontSize: "11px" }}>📡</Typography>
      <Typography sx={{ fontSize: "11px" }}>🔋</Typography>
    </Box>
  </Box>

  {/* Chat header row */}
  <Box sx={{ display: "flex", alignItems: "center" }}>
    
    {/* Back Arrow */}
    <Typography sx={{ fontSize: "18px", mr: 1 }}>←</Typography>

    {/* Profile Image */}
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        overflow: "hidden",
        bgcolor: "#ffffff33",
        mr: 1,
      }}
    >
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR081Rtn0dFPqv5Qd2mckopqXr0K-sN5870vA&s"
        alt="profile"
        style={{ width: "100%", height: "100%" }}
      />
    </Box>

    {/* Name & Verified */}
    <Box sx={{ flexGrow: 1, lineHeight: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
          TUV
        </Typography>

        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            bgcolor: "#11c784",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ml: 0.5,
          }}
        >
          <Typography sx={{ fontSize: "10px" }}>✓</Typography>
        </Box>
      </Box>
    </Box>

    {/* Right side icons */}
    <Box sx={{ display: "flex", gap: 1.2 }}>
      <Typography sx={{ fontSize: "14px" }}>📷</Typography>
      <Typography sx={{ fontSize: "14px" }}>📞</Typography>
      <Typography sx={{ fontSize: "14px" }}>⋮</Typography>
    </Box>
  </Box>
</Box>


        {/* Chat Background */}
        <Box
          sx={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/cubes.png')",
            backgroundSize: "cover",
            minHeight: 380, // smaller
            p: 1.5,
          }}
        >
          {/* Bubble */}
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "8px 8px 0 8px",
              p: 1.2,
              maxWidth: "82%",
              ml: "auto",
              fontSize: "12.5px",
              boxShadow: 1,
            }}
          >
            {/* Header */}
            {header_text && (
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#008069",
                  mb: 0.7,
                }}
              >
                {header_text}
              </Typography>
            )}

            {/* Body */}
            <Typography sx={{ fontSize: "12.5px", whiteSpace: "pre-wrap", mb: 0.5 }}>
              {body_text || "Your message here..."}
            </Typography>

            {/* Footer */}
            {footer_text && (
              <Typography sx={{ fontSize: "11px", color: "#667781" }}>
                {footer_text}
              </Typography>
            )}

            {/* Time */}
            <Typography
              sx={{
                fontSize: "9px",
                color: "#667781",
                textAlign: "right",
                mt: 0.3,
              }}
            >
              23:27
            </Typography>
          </Box>

          {/* Buttons */}
          {buttons.length > 0 && <Box sx={{ mt: 1.5 }}>{renderButtons()}</Box>}
        </Box>

        {/* Bottom Input */}
        <Box sx={{ bgcolor: "#f0f2f5", p: 1 }}>
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 16,
              px: 1.5,
              py: 0.6,
              border: "1px solid #ddd",
              color: "#999",
              fontSize: "11.5px",
            }}
          >
            Message...
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default TemplatePreview;
