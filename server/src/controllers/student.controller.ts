import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import Student from '@/database/models/studentSchema';
import Subject from '@/database/models/subjectSchema';

// Define the function for student registration
export const studentRegister = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  try {
    const { rollNum, email, studentName, sClassName, adminID, ...otherData } =
      req.body;

    // Validate required fields (consider using Joi or similar library)
    if (!rollNum || !email || !studentName || !sClassName || !adminID) {
      return res.status(400).send({ message: 'Missing required fields' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    // Check for existing student using findOne (more efficient)
    const existingStudent = await Student.findOne({ rollNum });
    if (existingStudent) {
      return res.status(409).send({ message: 'Roll Number already exists' });
    }

    const student = new Student({
      rollNum,
      studentName,
      sClassName,
      adminID,
      password: hashedPass,
      ...otherData, // Include any other relevant data from req.body
    });

    const savedStudent = await student.save();
    const { password, ...studentWithoutPassword } = savedStudent.toObject();

    return res.status(201).send(studentWithoutPassword); // 201 Created for successful registration
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).send({ message: 'Internal server error' }); // Generic error message for client
  }
};

// Define the function for student login
export const studentLogIn = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  try {
    const { rollNum, email, studentName, password } = req.body;

    // const student = await Student.findOne({ rollNum, name: studentName });
    // Chain .select() on the query before population
    const student = await Student.findOne({
      email,
      // name: studentName,
    }).select('-password -examResult -attendance');

    if (!student) {
      return res.status(404).send({ message: 'Student not found' });
    }

    const validPassword = await bcrypt.compare(password, student.password);

    if (!validPassword) {
      return res.status(401).send({ message: 'Invalid password' });
    }

    // Combine population and data filtering in a single step
    // const studentData = await (await student.populate('school', 'schoolName'))
    //   .populate('sClassName', 'sClassName')
    //   .select('-password -examResult -attendance'); // Exclude sensitive data
    // Combine population in a single step (no change)
    const studentData = await (
      await student.populate('school', 'schoolName')
    ).populate('sClassName', 'sClassName');

    if (studentData.hasPaidSchoolFee === false) {
      return res.status(403).send({ message: 'School Fee not yet paid' });
    }

    return res.send(studentData);
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).send({ message: 'Internal server error' }); // Generic error message for client
  }
};

// Define the function to get all students
export const getStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const students = await Student.find({ school: req.params.id }).populate(
      'sClassName',
      'sClassName'
    );
    if (students.length > 0) {
      const modifiedStudents = students.map((student) => {
        const { password, ...studentWithoutPassword } = student.toObject();
        return studentWithoutPassword;
      });
      res.send(modifiedStudents);
    } else {
      res.send({ message: 'No students found' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Define the function to get student detail
export const getStudentDetail = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('school', 'schoolName')
      .populate('sclassName', 'sclassName')
      // Populate examResult with just subName
      .populate('examResult.subName', 'subName')
      // Populate attendance with subName and sessions
      .populate({
        path: 'attendance',
        populate: {
          path: 'subName',
          select: 'subName sessions',
        },
      });

    if (!student) {
      return res.status(404).send({ message: 'No student found' });
    }

    const { password, ...studentWithoutPassword } = student.toObject();
    return res.send(studentWithoutPassword);
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).send({ message: 'Internal server error' }); // Generic error message for client
  }
};

// Define the function to delete a student
export const deleteStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await Student.findByIdAndDelete(req.params.id);
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Function to delete students based on a filter (school or class)
export const deleteStudents = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  try {
    const filter = req.params.schoolId
      ? { school: req.params.schoolId }
      : { sClassName: req.params.classId };
    const result = await Student.deleteMany(filter);

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: 'No students found to delete' });
    }

    return res.send({
      message: `${result.deletedCount} students deleted successfully`,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).send({ message: 'Internal server error' }); // Generic error message for client
  }
};

// Define the function to delete students by class
export const deleteStudentsByClass = async (
  req: Request,
  res: Response<any, { message?: string }>
): Promise<Response<any, Record<string, any>>> => {
  try {
    const result = await Student.deleteMany({ sClassName: req.params.id });
    if (result.deletedCount === 0) {
      return res.send({ message: 'No students found to delete' });
    } else {
      return res.send(result);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Function to update student details (including optional password hashing)
export const updateStudent = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );

    if (!updatedStudent) {
      return res.status(404).send({ message: 'Student not found' });
    }

    const { password, ...studentWithoutPassword } = updatedStudent.toObject();
    return res.send(studentWithoutPassword);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).send({ message: 'Internal server error' }); // Generic error message for client
  }
};

// Define the function to update exam results
export const updateExamResult = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { subName, marksObtained } = req.body;

  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.send({ message: 'Student not found' });
    }

    const existingResult = student.examResult.find(
      (result) => result.subName.toString() === subName
    );

    if (existingResult) {
      existingResult.marksObtained = marksObtained;
    } else {
      student.examResult.push({ subName, marksObtained });
    }

    const result = await student.save();
    return res.send(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Define the function to update student attendance
export const studentAttendance = async (
  req: Request,
  res: Response
): Promise<Response<any, Record<string, any>>> => {
  const { subName, status, date } = req.body;

  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.send({ message: 'Student not found' });
    }

    const subject = await Subject.findById(subName);
    if (!subject) {
      return res.send({ message: 'Subject not found' });
    }

    const existingAttendance = student.attendance.find(
      (a) =>
        a.date.toDateString() === new Date(date).toDateString() &&
        a.subName.toString() === subName
    );

    if (existingAttendance) {
      existingAttendance.status = status;
    } else {
      const attendedSessions = student.attendance.filter(
        (a) => a.subName.toString() === subName
      ).length;

      if (attendedSessions >= subject.sessions) {
        return res.send({ message: 'Maximum attendance limit reached' });
      }

      student.attendance.push({ date, status, subName });
    }

    const result = await student.save();
    return res.send(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Define the function to clear attendance by subject for all students
export const clearAllStudentsAttendanceBySubject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const subName = req.params.id;

  try {
    const result = await Student.updateMany(
      { 'attendance.subName': subName },
      { $pull: { attendance: { subName } } }
    );
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Define the function to clear attendance for all students
export const clearAllStudentsAttendance = async (
  req: Request,
  res: Response
): Promise<void> => {
  const schoolId = req.params.id;

  try {
    const result = await Student.updateMany(
      { school: schoolId },
      { $set: { attendance: [] } }
    );
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Define the function to remove attendance by subject for a student
export const removeStudentAttendanceBySubject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const studentId = req.params.id;
  const subName = req.body.subId;

  try {
    const result = await Student.updateOne(
      { _id: studentId },
      { $pull: { attendance: { subName } } }
    );
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Define the function to remove all attendance for a student
export const removeStudentAttendance = async (
  req: Request,
  res: Response
): Promise<void> => {
  const studentId = req.params.id;

  try {
    const result = await Student.updateOne(
      { _id: studentId },
      { $set: { attendance: [] } }
    );
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
