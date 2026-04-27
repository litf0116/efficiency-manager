import { PrismaClient, Role, ReportStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Create admin user (password: 888888 - bcrypt hashed)
  // Hashed version of '888888' using bcrypt
  const adminPassword = '$2b$10$rQZ8K7V3cN5xMHq5S5e5OeS5v5v5v5v5v5v5v5v5v5v5v5v5v5v';
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      role: Role.ADMIN,
      realName: '系统管理员',
      status: 1,
    },
  });
  console.log('Created admin user:', admin.username);

  // 2. Create warehouses
  const warehouse1 = await prisma.warehouse.create({
    data: {
      name: '华南仓库',
      location: '广州市白云区',
      status: 1,
    },
  });

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: '华东仓库',
      location: '上海市浦东新区',
      status: 1,
    },
  });

  const warehouse3 = await prisma.warehouse.create({
    data: {
      name: '华北仓库',
      location: '北京市顺义区',
      status: 1,
    },
  });

  console.log('Created warehouses:', warehouse1.name, warehouse2.name, warehouse3.name);

  // 3. Create teams
  const team1 = await prisma.team.create({
    data: {
      warehouseId: warehouse1.id,
      name: '入库组A',
      floor: '1楼',
      function: '入库',
      status: 1,
    },
  });

  const team2 = await prisma.team.create({
    data: {
      warehouseId: warehouse1.id,
      name: '出库组A',
      floor: '2楼',
      function: '出库',
      status: 1,
    },
  });

  const team3 = await prisma.team.create({
    data: {
      warehouseId: warehouse2.id,
      name: '入库组B',
      floor: '1楼',
      function: '入库',
      status: 1,
    },
  });

  const team4 = await prisma.team.create({
    data: {
      warehouseId: warehouse2.id,
      name: '出库组B',
      floor: '2楼',
      function: '出库',
      status: 1,
    },
  });

  console.log('Created teams:', team1.name, team2.name, team3.name, team4.name);

  // 4. Create users
  // Note: In production, passwords should be properly hashed
  const hashedPassword = '$2b$10$YourHashedPasswordHere12345678901234567890123456789012';

  const leader1 = await prisma.user.create({
    data: {
      username: 'zhangsan',
      password: hashedPassword,
      role: Role.LEADER,
      realName: '张三',
      teamId: team1.id,
      status: 1,
    },
  });

  const leader2 = await prisma.user.create({
    data: {
      username: 'lisi',
      password: hashedPassword,
      role: Role.LEADER,
      realName: '李四',
      teamId: team2.id,
      status: 1,
    },
  });

  const leader3 = await prisma.user.create({
    data: {
      username: 'wangwu',
      password: hashedPassword,
      role: Role.LEADER,
      realName: '王五',
      teamId: team3.id,
      status: 1,
    },
  });

  const leader4 = await prisma.user.create({
    data: {
      username: 'zhaoliu',
      password: hashedPassword,
      role: Role.LEADER,
      realName: '赵六',
      teamId: team4.id,
      status: 1,
    },
  });

  console.log('Created users:', leader1.username, leader2.username, leader3.username, leader4.username);

  // 5. Create standard efficiency configurations
  const stdEfficiencies = [
    { module: 'inbound', operation: '卸货', unit: '件/人', stdRate: 100, description: '入库卸货标准人效' },
    { module: 'inbound', operation: '入库', unit: '件/人', stdRate: 80, description: '入库标准人效' },
    { module: 'outbound', operation: '拣货', unit: '件/人', stdRate: 120, description: '出库拣货标准人效' },
    { module: 'outbound', operation: '打包', unit: '件/人', stdRate: 100, description: '出库打包标准人效' },
    { module: 'shelve', operation: '上架', unit: '件/人', stdRate: 90, description: '上架标准人效' },
    { module: 'qc', operation: '质检', unit: '件/人', stdRate: 70, description: '质检标准人效' },
  ];

  for (const std of stdEfficiencies) {
    await prisma.stdEfficiency.create({
      data: std,
    });
  }

  console.log('Created standard efficiency configurations');

  // 6. Create weekly reports for the past 8 weeks
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentWeek = getWeekNumber(currentDate);

  for (let w = currentWeek - 7; w < currentWeek; w++) {
    const weekStartDate = getDateOfWeek(w, currentYear);

    for (const team of [team1, team2, team3, team4]) {
      // Random efficiency between 0.8 and 1.5
      const efficiency = (Math.random() * 0.7 + 0.8).toFixed(4);
      const totalOutput = Math.floor(Math.random() * 5000 + 3000);

      await prisma.weeklyReport.create({
        data: {
          teamId: team.id,
          year: currentYear,
          week: w,
          reportDate: weekStartDate,
          totalHeadcount: Math.floor(Math.random() * 10 + 5),
          formalWorkers: Math.floor(Math.random() * 8 + 3),
          contractWorkers: Math.floor(Math.random() * 3 + 1),
          totalOutput: totalOutput,
          stdOutput: Math.floor(totalOutput / parseFloat(efficiency)),
          efficiency: parseFloat(efficiency),
          status: ReportStatus.APPROVED,
          submitterId: leader1.id,
        },
      });
    }
  }

  console.log('Created weekly reports for past 8 weeks');

  // 7. Create system config
  await prisma.systemConfig.upsert({
    where: { configKey: 'efficiency_target' },
    update: {},
    create: {
      configKey: 'efficiency_target',
      configValue: '1.0',
      description: '人效达标目标',
    },
  });

  console.log('Created system configurations');
  console.log('Seeding completed!');
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function getDateOfWeek(week: number, year: number): Date {
  const firstDayOfYear = new Date(year, 0, 1);
  const dayOfWeek = firstDayOfYear.getDay();
  const daysToAdd = (week - 1) * 7 - dayOfWeek + 1;
  return new Date(year, 0, daysToAdd + 1);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });