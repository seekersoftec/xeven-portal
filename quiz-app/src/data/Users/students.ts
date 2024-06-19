export type Student = {
  name: string
  rollNum: number
  email: string
  password: string
  role: string
  hasPaidSchoolFee: boolean
}

export const students: Record<string, Student> = {
  '1': {
    name: 'Chinedu Okeke',
    rollNum: 101,
    email: 'chineduokeke@example.com',
    password: 'password123',
    role: 'student',
    hasPaidSchoolFee: true,
  },
  '2': {
    name: 'Ngozi Uche',
    rollNum: 102,
    email: 'ngouziuche@example.com',
    password: 'password123',
    role: 'student',
    hasPaidSchoolFee: false,
  },
  '3': {
    name: 'Emeka Nwosu',
    rollNum: 103,
    email: 'emekanwosu@example.com',
    password: 'password123',
    role: 'student',
    hasPaidSchoolFee: true,
  },
  '4': {
    name: 'Adetola Adebayo',
    rollNum: 104,
    email: 'adetolaadebayo@example.com',
    password: 'password123',
    role: 'student',
    hasPaidSchoolFee: true,
  },
  '5': {
    name: 'Kelechi Eze',
    rollNum: 105,
    email: 'kelechieze@example.com',
    password: 'password123',
    role: 'student',
    hasPaidSchoolFee: false,
  },
  '6': {
    name: 'Chioma Obi',
    rollNum: 106,
    email: 'chiomaobi@example.com',
    password: 'password123',
    role: 'student',
    hasPaidSchoolFee: true,
  },
  '7': {
    name: 'Olumide Ayodele',
    rollNum: 107,
    email: 'olumideayodele@example.com',
    password: 'password123',
    role: 'student',
    hasPaidSchoolFee: false,
  },
  '8': {
    name: 'Funke Adeola',
    rollNum: 108,
    email: 'funkeadeola@example.com',
    password: 'password123',
    role: 'student',
    hasPaidSchoolFee: true,
  },
  '9': {
    name: 'Ifeanyi Nwachukwu',
    rollNum: 109,
    email: 'ifeanyinwachukwu@example.com',
    password: 'password123',
    role: 'student',
    hasPaidSchoolFee: true,
  },
  '10': {
    name: 'Aisha Bello',
    rollNum: 110,
    email: 'aishabello@example.com',
    password: 'password123',
    role: 'student',
    hasPaidSchoolFee: false,
  },
}
