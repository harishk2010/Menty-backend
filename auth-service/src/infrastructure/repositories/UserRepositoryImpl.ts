import { UserRepository } from "../../domain/interfaces/UserRepository";
import { User } from "../../domain/entities/User";
import { UserModel, IUser } from "../databse/Models/UserModel";

export class UserRepositoryImpl implements UserRepository {

  async createUser(user: User): Promise<User> {
    console.log("inside repo",user)

    const createdUser = new UserModel(user);
    console.log(createdUser)
    const savedUser = await createdUser.save();
    console.log(savedUser,"saved")

    return new User( savedUser.email, savedUser.password);
  }

  async findByEmail(email: string): Promise<User | null> {

    const user = await UserModel.findOne({ email });
    if (!user) return null;

    return new User( user.email, user.password);
  }
}
