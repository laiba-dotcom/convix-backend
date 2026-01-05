// src/pages/Home.tsx — FULL INBOX WITH REAL WHATSAPP MESSAGES
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
} from '@mui/material';

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

  // === YOUR REAL META CREDENTIALS ===
  const PHONE_NUMBER_ID = "882228088313519";  // ← Your Phone Number ID
  const TOKEN = "EAAoIY65oyjsBQRIF4LHFZBg7pgCEFqI40DjKTVpDgFFNOf0D8UW1unYuDTZA2PTSImbIrJ0oJdNDh0VBpF48nRoOLqnmjlBQEXyWnerlGv0e1epartiMHvatJ5kZBh77H4upKF2suktv7LtGqi4VzVZBW9ZBHdFDvdfVwnZBGUeESQRg6thHctz0L2do6IL3E8XKeS3qBp1iQUjXhQJgcnNDd4Q5HfNzvo6qYSUrWkAEI4H0vskBEcd2ybMApedXZC1ZC3bGDMZCpMFHl7CvZCgBJn";

  // FETCH REAL WHATSAPP MESSAGES
 useEffect(() => {    
  const fetchFromBackend = async () => {
    try {
      const res = await fetch('https://convix-backend.onrender.com/whatsapp/messages/');
      const data = await res.json();

      const newChats: Chat[] = [];
      const seenPhones = new Set<string>();

      data.forEach((msg: any) => {
        const phone = msg.from;

        if (seenPhones.has(phone)) return;
        seenPhones.add(phone);

        newChats.push({
          id: phone,
          name: phone.replace('+', ''),
          phone,
          lastMessage: msg.body,
          time: msg.time,
          unread: 1,
          messages: [{
            text: msg.body,
            time: msg.time,
            sender: 'user'
          }]
        });
      });

      setChats(newChats);
      setLoading(false);
    } catch (err) {
      console.log("Backend not running — run python manage.py runserver");
      setLoading(false);
    }
  };

  fetchFromBackend();
  const interval = setInterval(fetchFromBackend, 5000); // Every 5 seconds
  return () => clearInterval(interval);
}, []);

  // SEND MESSAGE
  const sendMessage = async () => {
    if (!selectedChat || !messageInput.trim()) return;

    try {
      await fetch(`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: selectedChat.phone,
          type: "text",
          text: { body: messageInput }
        })
      });

      const newMsg: Message = {
        text: messageInput,
        time: 'Now',
        sender: 'agent'
      };

      setSelectedChat(prev => prev ? {
        ...prev,
        messages: [...prev.messages, newMsg],
        lastMessage: messageInput,
        time: 'Now'
      } : null);

      setMessageInput('');
    } catch (err) {
      alert("Send failed — check token");
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f0f2f5' }}>
      {/* CHAT LIST */}
      <Box sx={{ width: 380, bgcolor: 'white', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
          <Typography variant="h6" fontWeight="bold">All Conversations ({chats.length})</Typography>
        </Box>

        {loading ? (
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading real WhatsApp messages...</Typography>
          </Box>
        ) : chats.length === 0 ? (
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">No messages yet. Send a test message!</Typography>
          </Box>
        ) : (
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
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {chat.lastMessage}
                  </Typography>
                </Box>
                {chat.unread > 0 && <Badge badgeContent={chat.unread} color="error" sx={{ ml: 1 }} />}
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
      

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
                <Button
                  variant="contained"
                  onClick={sendMessage}
                  sx={{ bgcolor: '#00A884', '&:hover': { bgcolor: '#008f6e' } }}
                >
                  Send
                </Button>
              </Stack>
            </Box>
          </>
        ) : (
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h5" color="text.secondary">
              Select a conversation or wait for real messages
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
    
  );
}



