import {
  initializeGroup,
  dropGroup,
  createGroupRequest,
  approveGroupRequest,
  rejectGroupRequest,
  groupMembers,
  searchPending,
} from '../models/groupModel.js';

export const createGroup = async (req, res) => {
  try {
    const { groupName, idUser } = req.body;

    const newGroup = await initializeGroup(groupName, idUser);

    if (newGroup.error) {
      return res.status(409).json({ error: newGroup.error });
    }
    res.status(201).json(newGroup);
  } catch (error) {
    console.error('Group creation failed: ', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteGroup = async (req, res) => {
  const { groupName, idUser } = req.body;

  const deletedGroup = await dropGroup(groupName, idUser);

  if (deletedGroup.error) {
    return res.status(404).json({ error: deletedGroup.error });
  }
  res.status(200).json({ message: 'Group deleted' });
};

export const groupRequest = async (req, res) => {
  try {
    const { groupName, idUser } = req.body;

    const newRequest = await createGroupRequest(idUser, groupName);

    if (newRequest.error) {
      return res.status(409).json({ error: newRequest.error });
    }
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Request failed: ', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const approveRequest = async (req, res) => {
  try {
    const { groupName, idUser } = req.body;

    const newRequest = await approveGroupRequest(idUser, groupName);

    if (newRequest.error) {
      return res.status(409).json({ error: newRequest.error });
    }
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Request approval failed: ', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { groupName, idUser } = req.body;

    const newRequest = await rejectGroupRequest(idUser, groupName);

    if (newRequest.error) {
      return res.status(409).json({ error: newRequest.error });
    }
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Request rejection failed: ', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getGroupMembers = async (req, res) => {
  try {
    const { idgroup } = req.params;

    const newRequest = await groupMembers(idgroup);

    if (newRequest.error) {
      return res.status(409).json({ error: newRequest.error });
    }
    res.status(200).json(newRequest);
  } catch (error) {
    console.error('Error getting group members: ', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getSearchPending = async (req, res) => {
  try {
    const pendingRequests = await searchPending();

    if (pendingRequests.error) {
      return res.status(409).json({ error: pendingRequests.error });
    }
    res.status(200).json(pendingRequests);
  } catch (error) {
    console.error('Error getting pending requests: ', error.message);
    res.status(500).json({ error: error.message });
  }
};