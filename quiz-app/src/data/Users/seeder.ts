import faker from 'faker'
import { Student } from '.'

export function generateFakeStudents(numStudents: number): Student[] {
  const students: Student[] = []
  for (let i = 0; i < numStudents; i++) {
    students.push({
      name: faker.name.findName(),
      rollNum: faker.random.number(10000), // Adjust max roll number as needed
      email: faker.internet.email(),
      password: 'password123', // Consider a more secure approach for passwords
      role: 'Student',
      hasPaidSchoolFee: Math.random() > 0.5, // Randomly assign fee payment status
    })
  }
  return students
}

const fakeStudents = generateFakeStudents(10) // Generate 10 fake students
console.log(fakeStudents)
