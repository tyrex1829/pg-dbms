import { PrismaClient } from "@prisma/client/";

const prisma = new PrismaClient();

async function insertUser(
  username: string,
  password: string,
  firstName: string,
  secondName: string
) {
  const res = await prisma.user.create({
    data: {
      username,
      password,
      firstName,
      secondName,
    },
  });
  console.log(res);
}

insertUser("user1", "user1_password", "user1name", "user1lastname");
