import { Request, Response } from 'express';
import StudentClass from '@/database/models/studentClassSchema';
import Student from '@/database/models/studentSchema';
import Subject from '@/database/models/subjectSchema';
import Teacher from '@/database/models/teacherSchema';

export const sClassCreate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sClass = new StudentClass({
      sClassName: req.body.sClassName,
      school: req.body.adminID,
    });

    const existingClassByName = await StudentClass.findOne({
      sClassName: req.body.sClassName,
      school: req.body.adminID,
    });

    if (existingClassByName) {
      res.send({ message: 'Sorry this class name already exists' });
    } else {
      const result = await sClass.save();
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const sClassList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let sClasses = await StudentClass.find({ school: req.params.id });
    if (sClasses.length > 0) {
      res.send(sClasses);
    } else {
      res.send({ message: 'No sClasses found' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getClassDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let sClass = await StudentClass.findById(req.params.id);
    if (sClass) {
      sClass = await sClass.populate('school', 'schoolName');
      res.send(sClass);
    } else {
      res.send({ message: 'No class found' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getSClassStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let students = await Student.find({ sClassName: req.params.id });
    if (students.length > 0) {
      let modifiedStudents = students.map((student) => {
        return { ...student.toObject(), password: undefined }; // toObject() to convert Mongoose document to plain JavaScript object
      });
      res.send(modifiedStudents);
    } else {
      res.send({ message: 'No students found' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedClass = await StudentClass.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      res.send({ message: 'Class not found' });
      return; // Ensure the function returns here without returning any value
    }
    await Student.deleteMany({ sClassName: req.params.id });
    await Subject.deleteMany({ sClassName: req.params.id });
    await Teacher.deleteMany({ teachSClass: req.params.id });
    res.send(deletedClass);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteSClasses = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  try {
    const deletedClasses = await StudentClass.deleteMany({
      school: req.params.id,
    });
    if (deletedClasses.deletedCount === 0) {
      return res.send({ message: 'No classes found to delete' });
    }
    await Student.deleteMany({ school: req.params.id });
    await Subject.deleteMany({ school: req.params.id });
    await Teacher.deleteMany({ school: req.params.id });
    return res.send(deletedClasses);
  } catch (error) {
    return res.status(500).json(error);
  }
};
