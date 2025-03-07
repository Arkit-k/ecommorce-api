import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {RegisterUserInput , LoginUserInput } from '../types';

const prisma = new PrismaClient();

type User = PrismaClient['User'];


export const registerUser = async (input:RegisterUserInput): Promise<Omit<User, 'password'>> => {
	  const { name , email , password } = input;

        const ExistingUser = await prisma.user.findUnique({
              where:{email}
        });
        if (ExistingUser) {
              throw new Error('User already exists');
        }


        const hasedPassword = await bcrypt.hash(password, 10);


        const user = await prisma.user.create({
            data:{
                  name,
                  email,
                  password:hasedPassword,
                  cart:{
                        create:{}
                  }
            }
        });

        const { password:_, ...userWithoutPassword} = user;
        return userWithoutPassword;
      }

export const loginUser = async (input:LoginUserInput): Promise<{token:string, user: Omit<User , 'password'>}> => {
     const { email , password } = input;

     const user = await prisma.user.findUnique({
             where:{email}
      });
             if (!user) {
                   throw new Error('Invalid credentials');
             }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                  throw new Error('Invalid credentials');
            }

      const secret = process.env.JWT_SECRET;
      const token = jwt.sign({id:user.id, role:user.role}, secret as string, {expiresIn:'1d'});

      const { password:_, ...userWithoutPassword} = user;
      return {token, user:userWithoutPassword};
}
          
