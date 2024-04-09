const adminSchema = require("../models/admin");

module.exports = {
  async saveData(data) {
    try {
      const newAdmin = new adminSchema(data);
      return await newAdmin.save();
    } catch (error) {
      throw new Error("Error saving user");
    }
  },

  async findByUsername(userName) {
    try {
      const admin = await adminSchema.findOne({ userName });
      return admin;
    } catch (error) {
      throw new Error("Error finding user by username");
    }
  },

  async addProgramToAdmin(adminId, programId) {
    console.log(adminId, programId)
    try {
      const admin = await adminSchema.findById(adminId);

      if (!admin) {
        throw new Error("Admin not found");
      }
      admin.programs.push(programId);
      return await admin.save();
    } catch (error) {
      throw error;
    }
  },
  async deleteProgram(adminId, programId) {
    try {
      const admin = await adminSchema.findById(adminId);

      if (!admin) {
        throw new Error("Admin not found");
      }

      const indexToRemove = admin.programs.indexOf(programId);
      if (indexToRemove === -1) {
        throw new Error("Program not found for this admin");
      }

      admin.programs.splice(indexToRemove, 1);
      return await admin.save();
    } catch (error) {
      throw error;
    }
  },
  async getAdminData(_id) {
    try {
      const admin = await adminSchema.findById(_id);
      if (!admin) {
        throw new Error("Admin not found");
      }
      return admin;
    } catch (error) {
      throw error;
    }
  },
};
