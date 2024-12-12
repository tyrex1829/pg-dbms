import { PrismaClient } from "@prisma/client";

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

interface UpdateParams {
  firstName: string;
  secondName: string;
}

async function updateUser(
  username: string,
  { firstName, secondName }: UpdateParams
) {
  const res = await prisma.user.update({
    where: {
      username: username,
    },
    data: {
      firstName,
      secondName,
    },
  });
  console.log(res);
}

async function findUser(username: string) {
  const res = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });
  console.log(res);
}

insertUser("user1", "user1_password", "user1name", "user1lastname");

updateUser("user1", {
  firstName: "user1nameee",
  secondName: "user1lastnameee",
});

findUser("user1");
