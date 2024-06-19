import { Request, Response } from 'express';
import Subject, { ISubject } from '@/database/models/subjectSchema';
import Teacher from '@/database/models/teacherSchema';
import Student from '@/database/models/studentSchema';

// Define the function to create a subject
export const subjectCreate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const subjects: ISubject[] = req.body.subjects.map(
      (subject: { subName: string; subCode: string; sessions: number }) => ({
        subName: subject.subName,
        subCode: subject.subCode,
        sessions: subject.sessions,
      })
    );

    const existingSubjectBySubCode = await Subject.findOne({
      'subjects.subCode': subjects[0].subCode,
      school: req.body.adminID,
    });

    if (existingSubjectBySubCode) {
      res.send({
        message: 'Sorry this subcode must be unique as it already exists',
      });
    } else {
      const newSubjects = subjects.map((subject) => ({
        ...subject,
        sClassName: req.body.sClassName,
        school: req.body.adminID,
      }));

      const result = await Subject.insertMany(newSubjects);
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Define the function to get all subjects
export const allSubjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const subjects = await Subject.find({ school: req.params.id }).populate(
      'sClassName',
      'sClassName'
    );
    if (subjects.length > 0) {
      res.send(subjects);
    } else {
      res.send({ message: 'No subjects found' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Define the function to get subjects by class
export const classSubjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const subjects = await Subject.find({ sClassName: req.params.id });
    if (subjects.length > 0) {
      res.send(subjects);
    } else {
      res.send({ message: 'No subjects found' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Define the function to get free subjects list
export const freeSubjectList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const subjects = await Subject.find({
      sClassName: req.params.id,
      teacher: { $exists: false },
    });
    if (subjects.length > 0) {
      res.send(subjects);
    } else {
      res.send({ message: 'No subjects found' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Define the function to get subject details
export const getSubjectDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let subject = await Subject.findById(req.params.id);
    if (subject) {
      subject = await subject.populate('sClassName', 'sClassName');
      subject = await subject.populate('teacher', 'name');
      res.send(subject);
    } else {
      res.send({ message: 'No subject found' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Define the function to delete a subject
export const deleteSubject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);

    if (deletedSubject) {
      // Set the teachSubject field to null in teachers
      await Teacher.updateOne(
        { teachSubject: deletedSubject._id },
        { $unset: { teachSubject: '' } }
      );

      // Remove the objects containing the deleted subject from students' examResult array
      await Student.updateMany(
        {},
        { $pull: { examResult: { subName: deletedSubject._id } } }
      );

      // Remove the objects containing the deleted subject from students' attendance array
      await Student.updateMany(
        {},
        { $pull: { attendance: { subName: deletedSubject._id } } }
      );

      res.send(deletedSubject);
    } else {
      res.status(404).send({ message: 'Subject not found' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Define the function to delete subjects by school
export const deleteSubjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch the subjects to be deleted
    const subjectsToDelete: ISubject[] = await Subject.find({
      school: req.params.id,
    });

    if (subjectsToDelete.length > 0) {
      const subjectIds = subjectsToDelete.map((subject) => subject._id);

      // Delete the subjects
      const deleteResult = await Subject.deleteMany({
        _id: { $in: subjectIds },
      });

      // Set the teachSubject field to null in teachers
      await Teacher.updateMany(
        { teachSubject: { $in: subjectIds } },
        { $unset: { teachSubject: '' } }
      );

      // Set examResult and attendance to null in all students
      await Student.updateMany(
        {},
        { $set: { examResult: null, attendance: null } }
      );

      res.send(deleteResult);
    } else {
      res.status(404).send({ message: 'No subjects found to delete' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Define the function to delete subjects by class
export const deleteSubjectsByClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch subjects to be deleted
    const subjectsToDelete: ISubject[] = await Subject.find({
      sClassName: req.params.id,
    });

    if (subjectsToDelete.length > 0) {
      const subjectIds = subjectsToDelete.map((subject) => subject._id);

      // Delete the subjects
      const deleteResult = await Subject.deleteMany({
        _id: { $in: subjectIds },
      });

      // Set the teachSubject field to null in teachers
      await Teacher.updateMany(
        { teachSubject: { $in: subjectIds } },
        { $unset: { teachSubject: '' } }
      );

      // Set examResult and attendance to null in all students
      await Student.updateMany(
        {},
        { $set: { examResult: null, attendance: null } }
      );

      res.send(deleteResult);
    } else {
      res.status(404).send({ message: 'No subjects found to delete' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
