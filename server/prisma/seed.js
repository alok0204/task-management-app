import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding TaskFlow database...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  const demoUser = await prisma.user.upsert({
    where: { email: 'alokvishwas786@gmail.com' },
    update: {},
    create: {
      name: 'Alok Kumar Vishwas',
      email: 'alokvishwas786@gmail.com',
      passwordHash,
      theme: 'dark',
      tasks: {
        create: [
          {
            title: 'Complete Thiranex Task 2 Project Execution',
            description: 'Implement full-stack TaskFlow app with React, Node.js, Prisma, PostgreSQL, and Socket.IO.',
            status: 'In Progress',
            priority: 'High',
            category: 'Work',
            dueDate: new Date(Date.now() + 86400000), // tomorrow
          },
          {
            title: 'Design Kanban Board & Calendar Views',
            description: 'Provide intuitive drag-and-drop workflow and responsive month calendar view.',
            status: 'Completed',
            priority: 'Medium',
            category: 'Work',
            dueDate: new Date(),
          },
          {
            title: 'Review Operating Systems & DBMS Notes',
            description: 'Study B.Tech 2nd Year CSE semester exam concepts.',
            status: 'Pending',
            priority: 'Medium',
            category: 'Study',
            dueDate: new Date(Date.now() + 3 * 86400000),
          },
          {
            title: 'Gym Workout & Fitness Session',
            description: 'Evening strength training and cardio.',
            status: 'Pending',
            priority: 'Low',
            category: 'Personal',
            dueDate: new Date(Date.now() + 86400000),
          },
        ],
      },
    },
  });

  console.log(`Seeded user: ${demoUser.name} (${demoUser.email})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
