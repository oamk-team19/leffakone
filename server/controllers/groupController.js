import {
  initializeGroup,
  dropGroup,
  createGroupRequest,
  approveGroupRequest,
  rejectGroupRequest,
  groupMembers,
  groupName,
  groups,
  myGroups,
  groupCreator,
  leaveGroupQuery,
  searchPending,
  searchFavoriteList,
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
  const { idGroup, idUser } = req.body;

  const deletedGroup = await dropGroup(idGroup, idUser);

  if (deletedGroup.error) {
    return res.status(404).json({ error: deletedGroup.error });
  }
  res.status(200).json({ message: 'Group deleted' });
};

export const leaveGroup = async (req, res) => {
  const { idGroup, idUser } = req.body;

  const newRequest = await leaveGroupQuery(idGroup, idUser);

  if (newRequest.error) {
    return res.status(404).json({ error: newRequest.error });
  }
  res.status(200).json({ message: 'Left the group!' });
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

export const getGroupName = async (req, res) => {
  try {
    const { idgroup } = req.params;

    const newRequest = await groupName(idgroup);

    if (newRequest.error) {
      return res.status(409).json({ error: newRequest.error });
    }
    res.status(200).json(newRequest);
  } catch (error) {
    console.error('Error getting group name: ', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getGroups = async (req, res) => {
  try {
    const newRequest = await groups();

    if (newRequest.error) {
      return res.status(409).json({ error: newRequest.error });
    }
    res.status(200).json(newRequest);
  } catch (error) {
    console.error('Error getting groups: ', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getMyGroups = async (req, res) => {
  try {
    const { idUser } = req.params;

    const newRequest = await myGroups(idUser);

    if (newRequest.error) {
      return res.status(409).json({ error: newRequest.error });
    }
    res.status(200).json(newRequest);
  } catch (error) {
    console.error('Error getting my groups: ', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getGroupCreator = async (req, res) => {
  try {
    const { idgroup } = req.params;

    const newRequest = await groupCreator(idgroup);

    if (newRequest.error) {
      return res.status(409).json({ error: newRequest.error });
    }
    res.status(200).json(newRequest);
  } catch (error) {
    console.error('Error getting group creator: ', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getSearchPending = async (req, res) => {
  try {
    const { idUser } = req.query;
    const pendingRequests = await searchPending(idUser);

    if (pendingRequests.error) {
      return res.status(409).json({ error: pendingRequests.error });
    }
    res.status(200).json(pendingRequests);
  } catch (error) {
    console.error('Error getting pending requests: ', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getSearchfavorite = async (req, res) => {
  try {
    const { idgroup } = req.params;
    const result = await searchFavoriteList(idgroup);
    res.status(200).json(result);
  } catch (error) {
    console.error('Favorite list failed in authcontroller', error.message);
    res.status(500).json({ error: error.message });
  }
};
