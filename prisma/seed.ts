import { PrismaClient, Gender, EmployeeStatus, EmploymentType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Clean existing data ──────────────────────────────────
  await prisma.employee.deleteMany();
  await prisma.department.deleteMany();

  // ── Departments ──────────────────────────────────────────
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        name: "Engineering",
        description: "Software development and technical infrastructure",
        color: "#6366f1",
      },
    }),
    prisma.department.create({
      data: {
        name: "Human Resources",
        description: "People operations, hiring, and culture",
        color: "#ec4899",
      },
    }),
    prisma.department.create({
      data: {
        name: "Marketing",
        description: "Brand, growth, and customer acquisition",
        color: "#f59e0b",
      },
    }),
    prisma.department.create({
      data: {
        name: "Finance",
        description: "Accounting, budgeting, and financial planning",
        color: "#10b981",
      },
    }),
    prisma.department.create({
      data: {
        name: "Sales",
        description: "Revenue generation and client relationships",
        color: "#3b82f6",
      },
    }),
    prisma.department.create({
      data: {
        name: "Operations",
        description: "Process, logistics, and business efficiency",
        color: "#8b5cf6",
      },
    }),
    prisma.department.create({
      data: {
        name: "Design",
        description: "Product design, UX, and brand identity",
        color: "#f43f5e",
      },
    }),
  ]);

  const [eng, hr, marketing, finance, sales, ops, design] = departments;

  console.log(`✅ Created ${departments.length} departments`);

  // ── Seed employees ────────────────────────────────────────
  const employeeData = [
    // Engineering
    {
      employeeId: "EMP-0001",
      firstName: "Arjun",
      lastName: "Sharma",
      email: "arjun.sharma@company.com",
      phone: "+91 98765 43210",
      dob: new Date("1990-03-15"),
      gender: Gender.MALE,
      departmentId: eng.id,
      designation: "Senior Software Engineer",
      joiningDate: new Date("2020-06-01"),
      salary: 1800000,
      employmentType: EmploymentType.FULL_TIME,
      status: EmployeeStatus.ACTIVE,
      address: "42, MG Road, Bengaluru, Karnataka 560001",
      emergencyContact: { name: "Priya Sharma", phone: "+91 98765 11111", relation: "Spouse" },
    },
    {
      employeeId: "EMP-0002",
      firstName: "Priya",
      lastName: "Mehta",
      email: "priya.mehta@company.com",
      phone: "+91 87654 32109",
      dob: new Date("1993-07-22"),
      gender: Gender.FEMALE,
      departmentId: eng.id,
      designation: "Frontend Developer",
      joiningDate: new Date("2021-03-15"),
      salary: 1400000,
      employmentType: EmploymentType.FULL_TIME,
      status: EmployeeStatus.ACTIVE,
      address: "15, Koramangala, Bengaluru, Karnataka 560034",
      emergencyContact: { name: "Ravi Mehta", phone: "+91 87654 22222", relation: "Father" },
    },
    {
      employeeId: "EMP-0003",
      firstName: "Rohan",
      lastName: "Gupta",
      email: "rohan.gupta@company.com",
      phone: "+91 76543 21098",
      dob: new Date("1995-11-08"),
      gender: Gender.MALE,
      departmentId: eng.id,
      designation: "Backend Developer",
      joiningDate: new Date("2022-01-10"),
      salary: 1200000,
      employmentType: EmploymentType.FULL_TIME,
      status: EmployeeStatus.ACTIVE,
      address: "78, Indiranagar, Bengaluru, Karnataka 560038",
      emergencyContact: { name: "Sunita Gupta", phone: "+91 76543 33333", relation: "Mother" },
    },
    {
      employeeId: "EMP-0004",
      firstName: "Sneha",
      lastName: "Patel",
      email: "sneha.patel@company.com",
      phone: "+91 65432 10987",
      dob: new Date("1997-04-30"),
      gender: Gender.FEMALE,
      departmentId: eng.id,
      designation: "DevOps Engineer",
      joiningDate: new Date("2022-08-20"),
      salary: 1600000,
      employmentType: EmploymentType.FULL_TIME,
      status: EmployeeStatus.ON_LEAVE,
      address: "23, HSR Layout, Bengaluru, Karnataka 560102",
      emergencyContact: { name: "Ketan Patel", phone: "+91 65432 44444", relation: "Brother" },
    },
    {
      employeeId: "EMP-0005",
      firstName: "Vikram",
      lastName: "Singh",
      email: "vikram.singh@company.com",
      phone: "+91 54321 09876",
      dob: new Date("1992-09-14"),
      gender: Gender.MALE,
      departmentId: eng.id,
      designation: "Tech Lead",
      joiningDate: new Date("2019-04-01"),
      salary: 2200000,
      employmentType: EmploymentType.FULL_TIME,
      status: EmployeeStatus.ACTIVE,
      address: "56, Whitefield, Bengaluru, Karnataka 560066",
      emergencyContact: { name: "Anita Singh", phone: "+91 54321 55555", relation: "Wife" },
    },
    // HR
    {
      employeeId: "EMP-0006",
      firstName: "Divya",
      lastName: "Nair",
      email: "divya.nair@company.com",
      phone: "+91 43210 98765",
      dob: new Date("1991-12-05"),
      gender: Gender.FEMALE,
      departmentId: hr.id,
      designation: "HR Manager",
      joiningDate: new Date("2018-09-01"),
      salary: 1500000,
      employmentType: EmploymentType.FULL_TIME,
      status: EmployeeStatus.ACTIVE,
      address: "10, Jayanagar, Bengaluru, Karnataka 560041",
      emergencyContact: { name: "Suresh Nair", phone: "+91 43210 66666", relation: "Husband" },
    },
    {
      employeeId: "EMP-0007",
      firstName: "Amit",
      lastName: "Joshi",
      email: "amit.joshi@company.com",
      phone: "+91 32109 87654",
      dob: new Date("1994-06-18"),
      gender: Gender.MALE,
      departmentId: hr.id,
      designation: "HR Executive",
      joiningDate: new Date("2021-11-15"),
      salary: 850000,
      employmentType: EmploymentType.FULL_TIME,
      status: EmployeeStatus.ACTIVE,
      address: "33, BTM Layout, Bengaluru, Karnataka 560076",
      emergencyContact: { name: "Meena Joshi", phone: "+91 32109 77777", relation: "Mother" },
    },
    // Marketing
    {
      employeeId: "EMP-0008",
      firstName: "Kavya",
      lastName: "Reddy",
      email: "kavya.reddy@company.com",
      phone: "+91 21098 76543",
      dob: new Date("1996-02-28"),
      gender: Gender.FEMALE,
      departmentId: marketing.id,
      designation: "Marketing Manager",
      joiningDate: new Date("2020-02-14"),
      salary: 1300000,
      employmentType: EmploymentType.FULL_TIME,
      status: EmployeeStatus.ACTIVE,
      address: "67, Marathahalli, Bengaluru, Karnataka 560037",
      emergencyContact: { name: "Raj Reddy", phone: "+91 21098 88888", relation: "Father" },
    },
    {
      employeeId: "EMP-0009",
      firstName: "Rahul",
      lastName: "Verma",
      email: "rahul.verma@company.com",
      phone: "+91 10987 65432",
      dob: new Date("1998-08-11"),
      gender: Gender.MALE,
      departmentId: marketing.id,
      designation: "Content Strategist",
      joiningDate: new Date("2023-03-01"),
      salary: 750000,
      employmentType: EmploymentType.FULL_TIME,
      status: EmployeeStatus.ACTIVE,
      address: "89, Yelahanka, Bengaluru, Karnataka 560064",
      emergencyContact: { name: "Sita Verma", phone: "+91 10987 99999", relation: "Mother" },
    },
    // Finance
    {
      employeeId: "EMP-0010",
      firstName: "Pooja",
      lastName: "Agarwal",
      email: "pooja.agarwal@company.com",
      phone: "+91 99876 54321",
      dob: new Date("1989-05-20"),
      gender: Gender.FEMALE,
      departmentId: finance.id,
      designation: "Finance Manager",
      joiningDate: new Date("2017-07-01"),
      salary: 1700000,
      employmentType: EmploymentType.FULL_TIME,
      status: EmployeeStatus.ACTIVE,
      address: "12, Sadashivanagar, Bengaluru, Karnataka 560080",
      emergencyContact: { name: "Mohan Agarwal", phone: "+91 99876 10101", relation: "Father" },
    },
    {
      employeeId: "EMP-0011",
      firstName: "Nikhil",
      lastName: "Kapoor",
      email: "nikhil.kapoor@company.com",
      phone: "+91 88765 43210",
      dob: new Date("1993-10-25"),
      gender: Gender.MALE,
      departmentId: finance.id,
      designation: "Senior Accountant",
      joiningDate: new Date("2019-10-15"),
      salary: 1100000,
      employmentType: EmploymentType.FULL_TIME,
      status: EmployeeStatus.ACTIVE,
      address: "45, Rajajinagar, Bengaluru, Karnataka 560010",
      emergencyContact: { name: "Rekha Kapoor", phone: "+91 88765 20202", relation: "Wife" },
    },
    // Sales
    {
      employeeId: "EMP-0012",
      firstName: "Anjali",
      lastName: "Mishra",
      email: "anjali.mishra@company.com",
      phone: "+91 77654 32109",
      dob: new Date("1995-01-17"),
      gender: Gender.FEMALE,
      departmentId: sales.id,
      designation: "Sales Manager",
      joiningDate: new Date("2020-11-01"),
      salary: 1450000,
      employmentType: EmploymentType.FULL_TIME,
      status: EmployeeStatus.ACTIVE,
      address: "28, JP Nagar, Bengaluru, Karnataka 560078",
      emergencyContact: { name: "Raju Mishra", phone: "+91 77654 30303", relation: "Brother" },
    },
    {
      employeeId: "EMP-0013",
      firstName: "Karan",
      lastName: "Malhotra",
      email: "karan.malhotra@company.com",
      phone: "+91 66543 21098",
      dob: new Date("1997-07-03"),
      gender: Gender.MALE,
      departmentId: sales.id,
      designation: "Sales Executive",
      joiningDate: new Date("2022-05-16"),
      salary: 720000,
      employmentType: EmploymentType.FULL_TIME,
      status: EmployeeStatus.ACTIVE,
      address: "91, Electronic City, Bengaluru, Karnataka 560100",
      emergencyContact: { name: "Sunita Malhotra", phone: "+91 66543 40404", relation: "Mother" },
    },
    // Operations
    {
      employeeId: "EMP-0014",
      firstName: "Meera",
      lastName: "Krishnan",
      email: "meera.krishnan@company.com",
      phone: "+91 55432 10987",
      dob: new Date("1988-03-29"),
      gender: Gender.FEMALE,
      departmentId: ops.id,
      designation: "Operations Director",
      joiningDate: new Date("2016-01-15"),
      salary: 2500000,
      employmentType: EmploymentType.FULL_TIME,
      status: EmployeeStatus.ACTIVE,
      address: "3, Richmond Road, Bengaluru, Karnataka 560025",
      emergencyContact: { name: "Raj Krishnan", phone: "+91 55432 50505", relation: "Husband" },
    },
    {
      employeeId: "EMP-0015",
      firstName: "Sanjay",
      lastName: "Iyer",
      email: "sanjay.iyer@company.com",
      phone: "+91 44321 09876",
      dob: new Date("1991-08-12"),
      gender: Gender.MALE,
      departmentId: ops.id,
      designation: "Operations Analyst",
      joiningDate: new Date("2021-06-01"),
      salary: 980000,
      employmentType: EmploymentType.FULL_TIME,
      status: EmployeeStatus.ACTIVE,
      address: "55, Cunningham Road, Bengaluru, Karnataka 560052",
      emergencyContact: { name: "Lakshmi Iyer", phone: "+91 44321 60606", relation: "Mother" },
    },
    // Design
    {
      employeeId: "EMP-0016",
      firstName: "Tanvi",
      lastName: "Shah",
      email: "tanvi.shah@company.com",
      phone: "+91 33210 98765",
      dob: new Date("1996-05-07"),
      gender: Gender.FEMALE,
      departmentId: design.id,
      designation: "UI/UX Designer",
      joiningDate: new Date("2021-09-01"),
      salary: 1150000,
      employmentType: EmploymentType.FULL_TIME,
      status: EmployeeStatus.ACTIVE,
      address: "77, Vasanth Nagar, Bengaluru, Karnataka 560052",
      emergencyContact: { name: "Nilesh Shah", phone: "+91 33210 70707", relation: "Father" },
    },
    {
      employeeId: "EMP-0017",
      firstName: "Dev",
      lastName: "Khanna",
      email: "dev.khanna@company.com",
      phone: "+91 22109 87654",
      dob: new Date("1999-12-19"),
      gender: Gender.MALE,
      departmentId: design.id,
      designation: "Junior Designer",
      joiningDate: new Date("2023-07-03"),
      salary: 600000,
      employmentType: EmploymentType.INTERN,
      status: EmployeeStatus.ACTIVE,
      address: "18, Malleshwaram, Bengaluru, Karnataka 560003",
      emergencyContact: { name: "Anita Khanna", phone: "+91 22109 80808", relation: "Mother" },
    },
    {
      employeeId: "EMP-0018",
      firstName: "Ishaan",
      lastName: "Bose",
      email: "ishaan.bose@company.com",
      phone: "+91 11098 76543",
      dob: new Date("1990-06-23"),
      gender: Gender.MALE,
      departmentId: eng.id,
      designation: "QA Engineer",
      joiningDate: new Date("2020-09-14"),
      salary: 1050000,
      employmentType: EmploymentType.FULL_TIME,
      status: EmployeeStatus.TERMINATED,
      address: "62, Vijayanagar, Bengaluru, Karnataka 560040",
      emergencyContact: { name: "Puja Bose", phone: "+91 11098 90909", relation: "Sister" },
      notes: "Resigned to pursue higher education.",
    },
    {
      employeeId: "EMP-0019",
      firstName: "Nisha",
      lastName: "Choudhary",
      email: "nisha.choudhary@company.com",
      phone: "+91 90987 65432",
      dob: new Date("1994-02-14"),
      gender: Gender.FEMALE,
      departmentId: marketing.id,
      designation: "Digital Marketing Specialist",
      joiningDate: new Date("2022-12-01"),
      salary: 900000,
      employmentType: EmploymentType.CONTRACT,
      status: EmployeeStatus.ACTIVE,
      address: "44, Banashankari, Bengaluru, Karnataka 560070",
      emergencyContact: { name: "Deepak Choudhary", phone: "+91 90987 01010", relation: "Brother" },
    },
    {
      employeeId: "EMP-0020",
      firstName: "Aditya",
      lastName: "Rao",
      email: "aditya.rao@company.com",
      phone: "+91 80876 54321",
      dob: new Date("1987-11-30"),
      gender: Gender.MALE,
      departmentId: finance.id,
      designation: "CFO",
      joiningDate: new Date("2015-03-01"),
      salary: 4500000,
      employmentType: EmploymentType.FULL_TIME,
      status: EmployeeStatus.ACTIVE,
      address: "1, Palace Road, Bengaluru, Karnataka 560052",
      emergencyContact: { name: "Deepa Rao", phone: "+91 80876 11111", relation: "Wife" },
    },
  ];

  // Create all employees
  for (const data of employeeData) {
    await prisma.employee.create({ data });
  }

  // Set some managers
  await prisma.employee.update({
    where: { employeeId: "EMP-0002" },
    data: { managerId: (await prisma.employee.findUnique({ where: { employeeId: "EMP-0005" } }))?.id },
  });
  await prisma.employee.update({
    where: { employeeId: "EMP-0003" },
    data: { managerId: (await prisma.employee.findUnique({ where: { employeeId: "EMP-0005" } }))?.id },
  });
  await prisma.employee.update({
    where: { employeeId: "EMP-0004" },
    data: { managerId: (await prisma.employee.findUnique({ where: { employeeId: "EMP-0001" } }))?.id },
  });
  await prisma.employee.update({
    where: { employeeId: "EMP-0007" },
    data: { managerId: (await prisma.employee.findUnique({ where: { employeeId: "EMP-0006" } }))?.id },
  });
  await prisma.employee.update({
    where: { employeeId: "EMP-0013" },
    data: { managerId: (await prisma.employee.findUnique({ where: { employeeId: "EMP-0012" } }))?.id },
  });
  await prisma.employee.update({
    where: { employeeId: "EMP-0017" },
    data: { managerId: (await prisma.employee.findUnique({ where: { employeeId: "EMP-0016" } }))?.id },
  });

  console.log(`✅ Created ${employeeData.length} employees`);
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });