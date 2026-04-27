// src/pages/Home.tsx — START BUTTON ALWAYS VISIBLE AT BOTTOM OF LEFT SIDEBAR
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  Avatar,
  Badge,
  Button,
  TextField,
  Paper,
  CircularProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions, 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';

interface Message {
  text: string;
  time: string;
  sender: 'user' | 'agent';
}

interface Chat {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[]; 
}

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal for new conversation
  const [openModal, setOpenModal] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [newMessage, setNewMessage] = useState('');

  // WHATSAPP CLOUD API CREDENTIALS
  const PHONE_NUMBER_ID = "979251638611436";
  const ACCESS_TOKEN = "EAAoIY65oyjsBQZCdeKLCKHtRYBUODuSMCpdC1YvrH1vLoZCGRXfay22YLGS1zJAf7UIo48AfFqSS0loV4W39qcIcA5xXUNDXVMdTIGaMZAaSfFSjC3Xvb1iRjbQyw5RjZBaUc5axDgBWZA94hZAWPM4oNIisPgTpSqFeFA5mVHjAbwdEmoXTjeAN1seF49zwZDZD";

  // FETCH MESSAGES FROM BACKEND
useEffect(() => {
  const fetchFromBackend = async () => {
    try {
      const res = await fetch('https://convix-backend.onrender.com/whatsapp/messages/');
      const data = await res.json();

      const chatMap = new Map<string, Chat>();

      data.forEach((msg: any) => {
        const phone = msg.from;

        const newMessage: Message = {
          text: msg.body,
          time: msg.time,
          sender: 'user'
        };

        if (!chatMap.has(phone)) {
          chatMap.set(phone, {
            id: phone,
            name: phone.replace('+', ''),
            phone,
            lastMessage: msg.body,
            time: msg.time,
            unread: 1,
            messages: [newMessage]
          });
        } else {
          const chat = chatMap.get(phone)!;
          chat.messages.push(newMessage);
          chat.lastMessage = msg.body;
          chat.time = msg.time;
        }
      });

      const newChats = Array.from(chatMap.values());

      setChats(newChats);

      setSelectedChat(prev => {
        if (!prev) return null;
        return newChats.find(chat => chat.id === prev.id) || prev;
      });

      setLoading(false);
    } catch (err) {
      console.log("Fetch failed", err);
      setLoading(false);
    }
  };

  fetchFromBackend();
  const interval = setInterval(fetchFromBackend, 15000);
  return () => clearInterval(interval);
}, []);

  // SEND MESSAGE VIA WHATSAPP CLOUD API
 const sendWhatsAppMessage = async (toPhone: string, text: string) => {
  try {
    const response = await fetch('https://convix-backend.onrender.com/whatsapp/send-message/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: toPhone,
        text: text
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Backend error:", result);
      alert("Send failed");
      return false;
    }

    console.log("Sent via backend:", result);
    return true;

  } catch (err) {
    console.error("Network error:", err);
    alert("Send error — check console");
    return false;
  }
};

  // SEND FROM EXISTING CHAT
  const sendMessage = async () => {
    if (!selectedChat || !messageInput.trim()) return;

    const success = await sendWhatsAppMessage(selectedChat.phone, messageInput);

    if (success) {
      const newMsg: Message = {
        text: messageInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'agent'
      };

      setSelectedChat(prev => prev ? {
        ...prev,
        messages: [...prev.messages, newMsg],
        lastMessage: messageInput,
        time: newMsg.time
      } : null);
      setChats(prev =>
  prev.map(chat =>
    chat.id === selectedChat.id
      ? {
          ...chat,
          messages: [...chat.messages, newMsg],
          lastMessage: messageInput,
          time: newMsg.time
        }
      : chat
  )
);

      setMessageInput('');
    }
    
  };

  // START NEW CONVERSATION FROM MODAL
  const startNewConversation = async () => {
    if (!newPhone.trim() || !newMessage.trim()) {
      alert("Enter phone and message");
      return;
    }

    const cleanedPhone = newPhone.startsWith('+') ? newPhone : '+' + newPhone;

    const success = await sendWhatsAppMessage(cleanedPhone, newMessage);

    if (success) {
      const newChat: Chat = {
        id: cleanedPhone,
        name: cleanedPhone.replace('+', ''),
        phone: cleanedPhone,
        lastMessage: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: 0,
        messages: [{
          text: newMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: 'agent'
        }]
      };

      setChats(prev => [...prev, newChat]);
      setSelectedChat(newChat);
      setOpenModal(false);
      setNewPhone('');
      setNewMessage('');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f0f2f5' }}>
      {/* LEFT — CHAT LIST */}
      <Box sx={{ width: 380, bgcolor: 'white', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
          <Typography variant="h6" fontWeight="bold">All Conversations ({chats.length})</Typography>
        </Box>

        {loading ? (
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading...</Typography>
          </Box>
        ) : (
          <>
            <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {chats.map(chat => (
                <ListItemButton
                  key={chat.id}
                  selected={selectedChat?.id === chat.id}
                  onClick={() => setSelectedChat(chat)}
                  sx={{ py: 1.5 }}
                >
                  <Avatar sx={{ bgcolor: '#00A884', mr: 2 }}>{chat.name[0]}</Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography fontWeight="bold">{chat.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{chat.time}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" noWrap>{chat.lastMessage}</Typography>
                  </Box>
                  {chat.unread > 0 && <Badge badgeContent={chat.unread} color="error" sx={{ ml: 1 }} />}
                </ListItemButton>
              ))}
            </List>

            {/* ALWAYS VISIBLE START BUTTON AT BOTTOM */}
            <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<SendIcon />}
                onClick={() => setOpenModal(true)}
                sx={{ bgcolor: '#00A884', '&:hover': { bgcolor: '#008f6e' }, py: 1.5 }}
              >
                Start New Conversation
              </Button>
            </Box>
          </>
        )}
      </Box>

      {/* RIGHT — CONVERSATION AREA */}
      <Box sx={{ flexGrow: 1, bgcolor: '#efeae2', display: 'flex', flexDirection: 'column' }}>
        {selectedChat ? (
          <>
            <Box sx={{ p: 2, bgcolor: 'white', borderBottom: '1px solid #eee' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: '#00A884' }}>{selectedChat.name[0]}</Avatar>
                <Box>
                  <Typography fontWeight="bold">{selectedChat.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{selectedChat.phone}</Typography>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {selectedChat.messages.map((msg, i) => (
                <Paper
                  key={i}
                  sx={{
                    alignSelf: msg.sender === 'agent' ? 'flex-end' : 'flex-start',
                    bgcolor: msg.sender === 'agent' ? '#00A884' : 'white',
                    color: msg.sender === 'agent' ? 'white' : 'black',
                    p: 2,
                    borderRadius: 3,
                    maxWidth: '70%',
                    boxShadow: 1
                  }}
                >
                  <Typography>{msg.text}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8, mt: 1 }}>{msg.time}</Typography>
                </Paper>
              ))}
            </Box>

            <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #eee' }}>
              <Stack direction="row" spacing={1}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <IconButton color="primary" onClick={sendMessage}>
                  <SendIcon />
                </IconButton>
              </Stack>
            </Box>
          </>
        ) : (
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Stack alignItems="center" spacing={3}>
              <Typography variant="h5" color="text.secondary">
                Select a chat or start a new one
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<SendIcon />}
                onClick={() => setOpenModal(true)}
                sx={{ bgcolor: '#00A884', px: 5, py: 2 }}
              >
                Start Conversation
              </Button>
            </Stack>
          </Box>
        )}
      </Box>

      {/* MODAL — START NEW CONVERSATION */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Start New Conversation</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Phone Number (with country code, e.g. +966501234567)"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message"
            placeholder="Hello, how can I help?"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            sx={{ mt: 3 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={startNewConversation}
            disabled={!newPhone.trim() || !newMessage.trim()}
            sx={{ bgcolor: '#00A884' }}
          >
            Send & Start
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}