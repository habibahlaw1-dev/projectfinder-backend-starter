import { PrismaClient, Difficulty, Role, ProjectStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const industries = ["Healthcare", "FinTech", "EdTech", "E-commerce", "Real Estate", "Technology"];

  for (const name of industries) {
    await prisma.industry.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const password = await bcrypt.hash("AdminPassword123!", 12);
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { role: Role.ADMIN },
    create: {
      email: "admin@example.com",
      name: "ProjectFinder Admin",
      password,
      role: Role.ADMIN,
    },
  });

  const healthcare = await prisma.industry.findUniqueOrThrow({ where: { name: "Healthcare" } });

  const project = await prisma.project.upsert({
    where: { id: "11111111-1111-4111-8111-111111111111" },
    update: {},
    create: {
      id: "11111111-1111-4111-8111-111111111111",
      title: "Healthcare Appointment Improvement",
      description: "A realistic healthcare project simulation focused on appointment process inefficiencies.",
      companyName: "Example Healthcare",
      scenario: "The company is experiencing long patient waiting times due to inefficiencies in its existing appointment process.",
      businessProblem: "Patients experience excessive waiting times and the current appointment process creates operational inefficiencies.",
      objective: "Develop a project approach for improving the appointment management process.",
      context: "MVP seed project for development and testing.",
      userRole: "Project Manager",
      difficulty: Difficulty.INTERMEDIATE,
      status: ProjectStatus.PUBLISHED,
      publishedAt: new Date(),
      industryId: healthcare.id,
    },
  });

  await prisma.task.createMany({
    data: [
      { projectId: project.id, title: "Identify key stakeholders", description: "Identify stakeholders relevant to the project.", order: 1 },
      { projectId: project.id, title: "Develop a risk register", description: "Document key project risks and responses.", order: 2 },
    ],
    skipDuplicates: true,
  });

  const existing = await prisma.deliverable.count({ where: { projectId: project.id } });
  if (existing === 0) {
    await prisma.deliverable.create({
      data: {
        projectId: project.id,
        title: "Risk Register",
        description: "Upload the completed risk register.",
        required: true,
        submissionType: "FILE",
      },
    });
  }

  console.log("Seed completed.");
  console.log("Admin: admin@example.com");
  console.log("Password: AdminPassword123! (change this outside local development)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());