import { pool } from '../helpers/db.js';

// Create group
export const initializeGroup = async (groupName, iduser) => {
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
        [groupName, iduser]
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

export const groupMembers = async (idgroup) => {
  try {
    const membersQuery = await pool.query(
      'SELECT * FROM "user_group" WHERE "group_idgroup"=$1 AND "grouprequest"=$2',
      [idgroup, 'approved']
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

export const groupName = async (idgroup) => {
  try {
    const result = await pool.query(
      'SELECT groupname FROM groups WHERE idgroup=$1',
      [idgroup]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Group not found');
    }
    
    return result.rows[0].groupname
  } catch (error) {
    throw error;
  }
};
