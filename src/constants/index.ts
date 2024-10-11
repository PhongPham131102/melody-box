export const roleDefault = [
  {
    _id: '659ba7c62b611171a5347a97',
    name: 'Admin',
  },
  {
    _id: '659ba7c62b611171a5347a96',
    name: 'Người dùng',
  },
];
export const permisstionDefault = [
  {
    _id: '65a0a995aa7ea10ac4d16961',
    role: '659ba7c62b611171a5347a97',
    action: ['manage'],
    subject: 'all',
  },
  {
    _id: '65a0a995aa7ea10ac4d16931',
    role: '659ba7c62b611171a5347a96',
    action: ['read'],
    subject: 'user',
  },
];
export const usersDefault = [
  {
    _id: '6604de8ae5068069a1bbb592',
    username: 'admin',
    password: '$2b$10$40vlq7LOwZxDVaJzgSOIEuvbW4Idso1qC7q1EH1bE3m8pVoQa6B5i',
    name: 'Admin',
    email: 'admin@gmail.com',
    role: '659ba7c62b611171a5347a97',
    isDelete: false,
  },
];
export const adminRole = '659ba7c62b611171a5347a97';
export const adminId = '6604de8ae5068069a1bbb592';
