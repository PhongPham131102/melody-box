export enum ActionEnum {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}
export enum SubjectEnum {
  ALL = 'all',
  USER = 'user',
  ROLE = 'role',
  LOG = 'log',
}
export const subjectMapping = {
  all: 'Tất cả',
  user: 'Người dùng',
  role: 'Quyền hạn',
  log: 'Log',
};
export const actionMapping = {
  create: 'Tạo',
  read: 'Đọc',
  update: 'Cập nhật',
  delete: 'Xóa',
  manage: 'Toàn quyền',
};
