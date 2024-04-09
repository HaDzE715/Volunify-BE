const Program = require("../models/program");

const Feedback = require("../repository/Feedback");

module.exports = {
  async getProgramByAddress(_id, address, type) {
    try {

      const programs = await Program.find({
        address,
        type,
        Acceptedvolunteers: { $ne: _id },
      });


      return programs;
    } catch (error) {
      throw new Error("Error finding programs by address: " + error.message);
    }
  },

  async getProgramById(programId) {
    try {
      const program = await Program.findById(programId);
      if (!program) {
        return false;
      }
      return program;
    } catch (error) {
      console.error("Error send request to join program:", error);
      throw error;
    }
  },

  async addProgram(reqData) {
    try {
      const program = new Program(reqData);
      await program.save();

      return program;
    } catch (error) {
      throw new Error("Error saving program: " + error.message);
    }
  },

  async updateProgram(data) {
    try {
      const { _id, ...updateData } = data;
      const updatedProgram = await Program.findByIdAndUpdate(
        { _id: _id },
        { $set: { ...updateData } },
        { new: true }
      );

      if (!updatedProgram) {
        throw new Error("Program not found");
      }
      return updatedProgram;
    } catch (error) {
      console.error("Error updating program:", error);
      throw error;
    }
  },
  async deleteProgram(_id) {
    try {
      const deletedProgram = await Program.findByIdAndDelete(_id);

      if (!deletedProgram) {
        throw new Error("Program not found");
      }
      return deletedProgram;
    } catch (error) {
      console.error("Error deleting program:", error);
      throw error;
    }
  },
  async sendToJoin(volunteer_id, program_id) {
    console.log(volunteer_id, program_id);
    try {
      const program = await Program.findById({ _id: program_id.program_id });
      if (!program) {
        throw new Error("program not found");
      }
      program.volunteers.push(volunteer_id);
      return await program.save();
    } catch (error) {
      console.error("Error send request to join program:", error);
      throw error;
    }
  },

  async acceptVolunteer(programId, volunteerId) {
    try {
      const program = await Program.findById({ _id: programId });
      if (!program) {
        throw new Error("program not found");
      }
      program.volunteers = program.volunteers.filter(
        (id) => id.toString() !== volunteerId
      );
      program.Acceptedvolunteers.push(volunteerId);
      return await program.save();
    } catch (error) {
      console.error("Error send request to join program:", error);
      throw error;
    }
  },
  async rejectVolunteer(programId, volunteerId) {
    try {
      const program = await Program.findById({ _id: programId });
      if (!program) {
        throw new Error("program not found");
      }
      program.volunteers = program.volunteers.filter(
        (id) => id.toString() !== volunteerId
      );
      return await program.save();
    } catch (error) {
      console.error("Error send request to join program:", error);
      throw error;
    }
  },

  async getProgress(_id) {
    try {
      const programs = await Program.find({ Acceptedvolunteers: _id });
      if (!programs) {
        throw new Error("program not found");
      }
      return programs;
    } catch (error) {
      console.error("Error send request to join program:", error);
      throw error;
    }
  },

  async finishProgram(volunteer_id, program_id, reviewText) {
    try {
      const program = await Program.findById({ _id: program_id });
      if (!program) throw new Error("program not found");

      const resFeedback = await Feedback.addFeedback(
        program_id,
        volunteer_id,
        reviewText
      );

      if (!resFeedback) throw new Error("error with adding feedback");
      program.Acceptedvolunteers = program.Acceptedvolunteers.filter(
        (id) => id.toString() !== volunteer_id
      );
      return await program.save();
    } catch (error) {
      console.error("Error send request to join program:", error);
      throw error;
    }
  },

  async getProgramsData(programs) {
    try {
      const programsData = [];
      for (const programId of programs) {
        const program = await Program.findById(programId);
        if (program) {
          programsData.push(program);
        }
      }
      const isEmpty = programsData.length === 0;
      return isEmpty ? false : programsData;
    } catch (error) {
      console.error("Error retrieving program data:", error);
      throw error;
    }
  }
  
};
