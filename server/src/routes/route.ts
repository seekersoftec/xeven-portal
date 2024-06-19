import { Router } from 'express';
import {
  adminRegister,
  adminLogIn,
  getAdminDetail,
} from '@/controllers/admin.controller';
// const { adminRegister, adminLogIn, deleteAdmin, getAdminDetail, updateAdmin } = require('../controllers/admin-controller.js');

import {
  sClassCreate,
  sClassList,
  deleteClass,
  deleteSClasses,
  getClassDetail,
  getSClassStudents,
} from '@/controllers/student.class.controller';
import {
  complainCreate,
  complainList,
} from '@/controllers/complain.controller';
import {
  noticeCreate,
  noticeList,
  deleteNotices,
  deleteNotice,
  updateNotice,
} from '@/controllers/notice.controller';
import {
  studentRegister,
  studentLogIn,
  getStudents,
  getStudentDetail,
  deleteStudents,
  deleteStudent,
  updateStudent,
  studentAttendance,
  deleteStudentsByClass,
  updateExamResult,
  clearAllStudentsAttendanceBySubject,
  clearAllStudentsAttendance,
  removeStudentAttendanceBySubject,
  removeStudentAttendance,
} from '@/controllers/student.controller';
import {
  subjectCreate,
  classSubjects,
  deleteSubjectsByClass,
  getSubjectDetail,
  deleteSubject,
  freeSubjectList,
  allSubjects,
  deleteSubjects,
} from '@/controllers/subject.controller';
import {
  teacherRegister,
  teacherLogIn,
  getTeachers,
  getTeacherDetail,
  deleteTeachers,
  deleteTeachersByClass,
  deleteTeacher,
  updateTeacherSubject,
  teacherAttendance,
} from '@/controllers/teacher.controller';

const router = Router();

// Admin
router.post('/admin/register', adminRegister);
router.post('/admin/login', adminLogIn);
router.get('/admin/:id', getAdminDetail);
// router.delete("/Admin/:id", deleteAdmin)
// router.put("/Admin/:id", updateAdmin)

// Student
router.post('/student/register', studentRegister);
router.post('/student/login', studentLogIn);
router.get('/students/:id', getStudents);
router.get('/student/:id', getStudentDetail);
router.delete('/students/:id', deleteStudents);
router.delete('/student/class/:id', deleteStudentsByClass);
router.delete('/student/:id', deleteStudent);
router.put('/student/:id', updateStudent);
router.put('/UpdateExamResult/:id', updateExamResult);
router.put('/StudentAttendance/:id', studentAttendance);
router.put(
  '/RemoveAllStudentsSubAtten/:id',
  clearAllStudentsAttendanceBySubject
);
router.put('/RemoveAllStudentsAtten/:id', clearAllStudentsAttendance);
router.put('/RemoveStudentSubAtten/:id', removeStudentAttendanceBySubject);
router.put('/RemoveStudentAtten/:id', removeStudentAttendance);

// Teacher
router.post('/teacher/register', teacherRegister);
router.post('/teacherLogin', teacherLogIn);
router.get('/teachers/:id', getTeachers);
router.get('/teacher/:id', getTeacherDetail);
router.delete('/teachers/:id', deleteTeachers);
router.delete('/teachers/class/:id', deleteTeachersByClass);
router.delete('/teacher/:id', deleteTeacher);
router.put('/teacher/subject', updateTeacherSubject);
router.post('/teacher/attendance/:id', teacherAttendance);

// Notice
router.post('/notice/create', noticeCreate);
router.get('/NoticeList/:id', noticeList);
router.delete('/Notices/:id', deleteNotices);
router.delete('/Notice/:id', deleteNotice);
router.put('/Notice/:id', updateNotice);

// Complain
router.post('/complain/create', complainCreate);
router.get('/complainList/:id', complainList);

// Sclass
router.post('/Sclass/create', sClassCreate);
router.get('/SclassList/:id', sClassList);
router.get('/Sclass/:id', getClassDetail);
router.get('/Sclass/Students/:id', getSClassStudents);
router.delete('/Sclasses/:id', deleteSClasses);
router.delete('/Sclass/:id', deleteClass);

// Subject
router.post('/subject/create', subjectCreate);
router.get('/AllSubjects/:id', allSubjects);
router.get('/ClassSubjects/:id', classSubjects);
router.get('/FreeSubjectList/:id', freeSubjectList);
router.get('/Subject/:id', getSubjectDetail);
router.delete('/Subject/:id', deleteSubject);
router.delete('/Subjects/:id', deleteSubjects);
router.delete('/SubjectsClass/:id', deleteSubjectsByClass);

export default router;
