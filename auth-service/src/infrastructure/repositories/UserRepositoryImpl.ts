import { UserRepository } from "../../domain/interfaces/UserRepository";
import { User } from "../../domain/entities/User";
import { UserModel, IUser } from "../databse/Models/UserModel";

export class UserRepositoryImpl implements UserRepository {
  async createUser(user: User): Promise<User> {
    const createdUser = new UserModel(user);
    const savedUser = await createdUser.save();
    return new User(savedUser.name, savedUser.email, savedUser.password, savedUser.id);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    if (!user) return null;
    return new User(user.name, user.email, user.password, user.id);
  }
}
