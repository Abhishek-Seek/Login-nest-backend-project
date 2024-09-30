import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginUserDto } from './dto/login.dto';
import { SignupUserDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  
  constructor(
    @InjectModel(User.name) private userModel:Model<User>,
    private jwtService: JwtService
  ) {}

  async signup(createUserDto: SignupUserDto) {
    await this.userModel.create(createUserDto);

    return {

      access_token: await this.jwtService.signAsync(createUserDto),
    };
  }

  async login(dto: LoginUserDto) {
    const user: any = await this.userModel.findOne({email: dto.email})
      
    if (!user) {
      throw new UnauthorizedException("wrong credentials")
    }

    if (user.password != dto.password) {
      throw new UnauthorizedException("wrong credentials")
    }


    return user

  }

  async findAll() {
    return await this.userModel.find();
  }

  async findOne(id: string) {
    return await this.userModel.findOne({id});
  }

 async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate(id, updateUserDto);
  }

async  remove(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }
}
