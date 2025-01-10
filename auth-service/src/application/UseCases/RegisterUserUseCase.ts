import { UserRepository } from "../../domain/interfaces/UserRepository";
import { HashService } from "../../infrastructure/services/HashService";
import { User } from "../../domain/entities/User";

export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashService: HashService
  ) {}

  async execute(userData: Omit<User, "id" | "createdAt">): Promise<User> {
    const { email, password } = userData;

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    console.log(existingUser,"existing")
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await this.hashService.hashPassword(password);

    // Save user to database
    const newUser: User = {
      ...userData,
      password: hashedPassword,
      
    };

    return this.userRepository.createUser(newUser);
  }


}
