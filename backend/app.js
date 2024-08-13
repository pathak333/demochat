const express = require('express');
const mongoose = require('mongoose');
const app = express();
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const groupRoutes = require('./routes/group');
const cors = require('cors')
mongoose.connect('mongodb://localhost:27017/group-chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.json());
app.use(cors())
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
