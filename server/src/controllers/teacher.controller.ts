import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Teacher, { ITeacher } from '@/database/models/teacherSchema';
import Subject from '@/database/models/subjectSchema';

export const teacherRegister = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password, role, school, teachSubject, teachsClass } =
    req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const teacher = new Teacher({
      name,
      email,
      password: hashedPass,
      role,
      school,
      teachSubject,
      teachSClass: teachsClass,
    });

    const existingTeacherByEmail = await Teacher.findOne({ email });

    if (existingTeacherByEmail) {
      res.send({ message: 'Email already exists' });
    } else {
      let result = await teacher.save();
      await Subject.findByIdAndUpdate(teachSubject, { teacher: teacher._id });

      // Remove password field from the Mongoose document
      const { password: removedPassword, ...teacherWithoutPassword } =
        result.toObject();

      res.send(teacherWithoutPassword);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const teacherLogIn = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const teacher = await Teacher.findOne({ email: req.body.email });

    if (!teacher) {
      res.send({ message: 'Teacher not found' });
      return;
    }

    const validated = await bcrypt.compare(req.body.password, teacher.password);
    if (!validated) {
      res.send({ message: 'Invalid password' });
      return;
    }

    await teacher.populate('teachSubject', 'subName sessions'); //.execPopulate();
    await teacher.populate('school', 'schoolName'); //.execPopulate();
    await teacher.populate('teachSClass', 'sClassName'); //.execPopulate();

    // Remove password field from the Mongoose document
    const { password, ...teacherWithoutPassword } = teacher.toObject();

    res.send(teacherWithoutPassword);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getTeachers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const teachers = await Teacher.find({ school: req.params.id })
      .populate('teachSubject', 'subName')
      .populate('teachsClass', 'sClassName');

    if (teachers.length > 0) {
      const modifiedTeachers = teachers.map((teacher) => {
        const { password, ...teacherWithoutPassword } = teacher.toObject();
        return teacherWithoutPassword;
      });
      res.send(modifiedTeachers);
    } else {
      res.send({ message: 'No teachers found' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getTeacherDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('teachSubject', 'subName sessions')
      .populate('school', 'schoolName')
      .populate('teachSClass', 'sClassName');

    if (teacher) {
      // Convert the Mongoose document to a plain object and omit the password
      const { password, ...teacherWithoutPassword } = teacher.toObject();
      res.send(teacherWithoutPassword);
    } else {
      res.send({ message: 'No teacher found' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateTeacherSubject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { teacherId, teachSubject } = req.body;
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { teachSubject },
      { new: true }
    );

    if (!updatedTeacher) {
      res.status(404).send({ message: 'Teacher not found' });
      return;
    }

    await Subject.findByIdAndUpdate(teachSubject, {
      teacher: updatedTeacher._id,
    });

    res.send(updatedTeacher);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteTeacher = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!deletedTeacher) {
      res.status(404).send({ message: 'Teacher not found' });
      return;
    }

    await Subject.updateOne(
      { teacher: deletedTeacher._id },
      { $unset: { teacher: 1 } }
    );

    res.send(deletedTeacher);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteTeachers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletionResult = await Teacher.deleteMany({ school: req.params.id });

    const deletedCount = deletionResult.deletedCount || 0;

    if (deletedCount === 0) {
      res.send({ message: 'No teachers found to delete' });
      return;
    }

    // Using deletionResult.deletedCount to avoid querying again for deletedTeachers
    await Subject.updateMany(
      {
        teacher: {
          $in: deletionResult.deletedCount ? deletionResult.deletedCount : [],
        },
      },
      { $unset: { teacher: '' } }
    );

    res.send(deletionResult);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteTeachersByClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletionResult = await Teacher.deleteMany({
      sClassName: req.params.id,
    });

    const deletedCount = deletionResult.deletedCount || 0;

    if (deletedCount === 0) {
      res.send({ message: 'No teachers found to delete' });
      return;
    }

    const deletedTeachers = await Teacher.find({ sClassName: req.params.id });

    await Subject.updateMany(
      {
        teacher: {
          $in: deletedTeachers.map((teacher) => teacher._id),
          $exists: true,
        },
      },
      { $unset: { teacher: 1 } } // Corrected $unset operation
    );

    res.send(deletionResult);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const teacherAttendance = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { status, date } = req.body;

  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      res.send({ message: 'Teacher not found' });
      return;
    }

    const existingAttendance = teacher.attendance.find(
      (a) => a.date.toDateString() === new Date(date).toDateString()
    );

    if (existingAttendance) {
      existingAttendance.status = status;
    } else {
      teacher.attendance.push({ date, status });
    }

    const result = await teacher.save();
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
