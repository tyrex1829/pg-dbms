import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createProfile(
  id: number,
  email: string,
  password: string,
  firstName: string,
  secondName: string
) {
  const response = await prisma.profile.create({
    data: {
      id,
      email,
      password,
      firstName,
      secondName,
    },
  });
  console.log(response);
}

async function createTodo(userId: number, title: string, description: string) {
  const response = await prisma.post.create({
    data: {
      title,
      description,
      profileId: userId,
    },
  });
  console.log(response);
}

async function getTodo(userId: number) {
  const response = await prisma.profile.findMany({
    where: {
      id: userId,
    },
  });
  console.log(response);
}

async function getTodosAndUserDetails(userId: number) {
  const response = await prisma.post.findMany({
    where: {
      profileId: userId,
    },
    select: {
      profile: true,
      title: true,
      description: true,
    },
  });
  console.log(response);
}

createProfile(
  1,
  "user1@example.com",
  "user1password",
  "user1firstname",
  "user1secondname"
);
createTodo(1, "Go to Gym", "Go to gym and do 10 pushups");
getTodo(1);
getTodosAndUserDetails(1);
