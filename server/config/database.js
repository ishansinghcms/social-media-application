import mongoose from "mongoose";

class Database {
  constructor(uri, options) {
    this.uri = uri;
    this.options = options;
  }

  async connect() {
    try {
      await mongoose.connect(this.uri, this.options);
      console.log(
        `Database: ${mongoose.connection.db.databaseName} connected successfully`
      );
    } catch (error) {
      throw error;
    }
  }

  async disconnect() {
    try {
      mongoose.disconnect();
      console.log(
        `Disconnected from atabase: ${mongoose.connection.db.databaseName}`
      );
    } catch (error) {
      throw error;
    }
  }
}
export default Database;
