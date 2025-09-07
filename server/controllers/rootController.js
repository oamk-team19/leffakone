// controllers/rootController.js

import { checkDbConnection } from '../models/rootModel.js';

export const healthCheck = async (req, res) => {
  try {
    const result = await checkDbConnection();
    res.status(200).json(result);
  } catch (error) {
    // If checkDbConnection throws an error, catch it here
    console.error('Error in testDbConnection controller:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
