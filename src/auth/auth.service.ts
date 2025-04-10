import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userService: UserService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const [existingUser] = await this.userService.findByEmail(signUpDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }

    const [newUser] = await this.userService.create({
      email: signUpDto.email,
      password: await bcrypt.hash(signUpDto.password, 10),
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
    });

    const accessToken = this.jwtService.sign({
      user_id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });
    return { accessToken };
  }

  async signIn(signInDto: SignInDto) {
    const [user] = await this.userService.findByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({
      user_id: user.id,
      email: user.email,
      role: user.role,
    });
    return { accessToken };
  }
}
