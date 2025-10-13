import { pool } from '../helpers/db.js';

// Create group
export const initializeGroup = async (groupName, idUser) => {
  try {
    const groupNameCheck = await pool.query(
      'SELECT groupname FROM groups WHERE groupname=$1',
      [groupName]
    );
    if (groupNameCheck.rows.length !== 0) {
      return { error: 'Group name is already in use' };
    } else {
      const result = await pool.query(
        'INSERT INTO groups (groupname, idcreator) VALUES ($1,$2) RETURNING *;',
        [groupName, idUser]
      );

      const idGroupResult = await pool.query(
        'SELECT idgroup FROM groups WHERE groupname=$1',
        [groupName]
      );
      const idGroup = idGroupResult.rows[0].idgroup;

      await pool.query(
        'INSERT INTO user_group (user_iduser, group_idgroup) VALUES ($1,$2)',
        [idUser, idGroup]
      );

      await pool.query(
        'UPDATE user_group SET groupRequest = $1 WHERE user_iduser = $2 AND group_idgroup = $3',
        ['approved', idUser, idGroup]
      );

      return result.rows[0];
    }
  } catch (error) {
    throw error;
  }
};

// Delete group
export const dropGroup = async (idGroup, idUser) => {
  try {
    const result = await pool.query(
      'DELETE FROM groups WHERE idgroup = $1 AND idcreator = $2 RETURNING *',
      [idGroup, idUser]
    );
    if (result.rows.length === 0) {
      return { error: 'Group not found or creator does not match' };
    }
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const createGroupRequest = async (idUser, groupName) => {
  try {
    const idGroupResult = await pool.query(
      'SELECT idgroup FROM groups WHERE groupname=$1',
      [groupName]
    );

    if (idGroupResult.rows.length === 0) {
      throw new Error('Group not found');
    }

    const idGroup = idGroupResult.rows[0].idgroup;
    const result = await pool.query(
      'INSERT INTO user_group (user_iduser, group_idgroup) VALUES ($1,$2) RETURNING *',
      [idUser, idGroup]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const approveGroupRequest = async (idUser, groupName) => {
  try {
    const idGroupResult = await pool.query(
      'SELECT idgroup FROM groups WHERE groupname=$1',
      [groupName]
    );

    if (idGroupResult.rows.length === 0) {
      throw new Error('Group not found');
    }

    const idGroup = idGroupResult.rows[0].idgroup;

    const result = await pool.query(
      'UPDATE user_group SET groupRequest = $1 WHERE user_iduser = $2 AND group_idgroup = $3',
      ['approved', idUser, idGroup]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const rejectGroupRequest = async (idUser, groupName) => {
  try {
    const idGroupResult = await pool.query(
      'SELECT idgroup FROM groups WHERE groupname=$1',
      [groupName]
    );

    if (idGroupResult.rows.length === 0) {
      throw new Error('Group not found');
    }

    const idGroup = idGroupResult.rows[0].idgroup;

    const result = await pool.query(
      'UPDATE user_group SET groupRequest = $1 WHERE user_iduser = $2 AND group_idgroup = $3',
      ['rejected', idUser, idGroup]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const groupMembers = async (idGroup) => {
  try {
    const membersQuery = await pool.query(
      'SELECT * FROM "user_group" WHERE "group_idgroup"=$1 AND "grouprequest"=$2',
      [idGroup, 'approved']
    );

    if (membersQuery.rows.length === 0) {
      throw new Error('No members found');
    }

    const userIds = membersQuery.rows.map((row) => row.user_iduser);

    const result = await pool.query(
      'SELECT username FROM users WHERE iduser=ANY($1)',
      [userIds]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const groupName = async (idGroup) => {
  try {
    const result = await pool.query(
      'SELECT groupname FROM groups WHERE idgroup=$1',
      [idGroup]
    );

    if (result.rows.length === 0) {
      throw new Error('Group not found');
    }

    return result.rows[0].groupname;
  } catch (error) {
    throw error;
  }
};

export const groups = async () => {
  try {
    const result = await pool.query(
      'SELECT groupname, idgroup FROM groups',
      []
    );

    if (result.rows.length === 0) {
      throw new Error('Groups not found');
    }

    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const myGroups = async (idUser) => {
  try {
    const groupIdsResult = await pool.query(
      'SELECT group_idgroup FROM user_group WHERE user_iduser=$1 AND grouprequest=$2',
      [idUser, 'approved']
    );

    if (groupIdsResult.rows.length === 0) {
      throw new Error('Groups not found');
    }

    const groupIds = groupIdsResult.rows.map((row) => row.group_idgroup);

    const result = await pool.query(
      'SELECT groupname, idgroup FROM groups WHERE idgroup=ANY($1)',
      [groupIds]
    );

    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const leaveGroupQuery = async (idGroup, idUser) => {
  try {
    const result = await pool.query(
      'DELETE FROM user_group WHERE user_iduser=$1 AND group_idgroup=$2 RETURNING *',
      [idUser, idGroup]
    );
    if (result.rows.length === 0) {
      return { error: 'User_group not found' };
    }
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const groupCreator = async (idGroup) => {
  try {
    const result = await pool.query(
      'SELECT idcreator FROM groups WHERE idgroup=$1',
      [idGroup]
    );

    if (result.rows.length === 0) {
      throw new Error('Group not found');
    }

    console.log(result.rows[0].idcreator);
    return result.rows[0].idcreator;
  } catch (error) {
    throw error;
  }
};

export const searchPending = async (idUser) => {
  try {
    //Get pendings and return them with username and groups name
    const pendings = await pool.query(
      'SELECT user_group.*, users.username, groups.groupname, groups.idcreator FROM user_group JOIN users ON users.iduser = user_group.user_iduser JOIN groups ON groups.idgroup = user_group.group_idgroup WHERE user_group.grouprequest = $1 AND groups.idcreator=$2',
      ['pending', idUser]
    );

    //console.log(pendings.rows)

    if (pendings.rows.length === 0) {
      return { message: 'No pending requests' };
    }

    return pendings.rows;
  } catch (error) {
    throw error;
  }
};

//Search favorites
export const searchFavoriteList = async (idGroup) => {
  try {
    const searched = await pool.query(
      'select * from group_movie WHERE group_idgroup=$1',
      [idGroup]
    );

    if (searched.rows.length === 0) {
      return { error: 'Not find user by id from users' };
    }

    return searched.rows;
  } catch (error) {
    throw error;
  }
};

// Search user's approved and rejected group requests
export const getSearchAllRequests = async (usersid) => {
  try {
    const userResult = await pool.query(
      'SELECT user_group.*, groups.groupname, users.username FROM "user_group" JOIN groups ON groups.idgroup = user_group.group_idgroup JOIN users ON users.iduser = user_group.user_iduser WHERE "user_iduser"=$1 AND user_group.seenrequest=false AND user_group.grouprequest!=$2;',
      [usersid, 'pending']
    );

    return userResult.rows;
      } catch (error) {
    throw error;
      }
  };

export const myPendingRequests = async (idUser) => {
  try {
    const result = await pool.query(
      `SELECT group_idgroup FROM user_group WHERE user_iduser=$1 AND grouprequest=$2`,
      [idUser, 'pending']
    );

    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const updateSeenRequestDb = async (idUser, groupName) => {
  try {
    const result = await pool.query(
      'UPDATE user_group SET seenrequest = true FROM users WHERE users.iduser = user_group.user_iduser AND users.iduser = $1 AND group_idgroup=$2',
      [idUser, groupName]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};
export const dropRequest = async (idUser, idGroup) => {
  try {
    const result = await pool.query(
      `DELETE FROM user_group WHERE user_iduser=$1 AND group_idgroup=$2`,
      [idUser, idGroup]
    );

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
