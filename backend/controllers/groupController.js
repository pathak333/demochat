const Group = require('../models/group');

exports.createGroup = async (req, res) => {
  const { name, members } = req.body;
  const group = new Group({ name, members });
  await group.save();
  res.status(201).json(group);
};

exports.deleteGroup = async (req, res) => {
  const { id } = req.params;
  await Group.findByIdAndDelete(id);
  res.json({ message: 'Group deleted' });
};

exports.addMember = async (req, res) => {
  const { groupId, userId } = req.body;
  const group = await Group.findById(groupId);
  if (!group) return res.status(404).json({ message: 'Group not found' });
  group.members.push(userId);
  await group.save();
  res.json(group);
};

exports.sendMessage = async (req, res) => {
  const { groupId, content } = req.body;
  const group = await Group.findById(groupId);
  if (!group) return res.status(404).json({ message: 'Group not found' });
  group.messages.push({ sender: req.user.id, content });
  await group.save();
  res.json(group);
};

exports.likeMessage = async (req, res) => {
  const { groupId, messageId } = req.body;
  const group = await Group.findById(groupId);
  if (!group) return res.status(404).json({ message: 'Group not found' });
  const message = group.messages.id(messageId);
  message.likes.push(req.user.id);
  await group.save();
  res.json(group);
};


exports.groups = async (req, res) => {
  try {
    // Fetch all groups from the database
    const groups = await Group.find().populate('members', 'username');
    res.status(200).json(groups);
  } catch (err) {
    console.error('Error fetching groups:', err);
    res.status(500).json({ message: 'Error fetching groups' });
  }
}


exports.getmessage = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    // Find the group and populate the messages with sender and likes details
    const group = await Group.findById(groupId)
      .populate({
        path: 'messages.sender',
        select: 'username'
      })
      .populate({
        path: 'messages.likes',
        select: 'username'
      });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Send the messages array from the group
    res.status(200).json(group.messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Error fetching messages' });
  }
}