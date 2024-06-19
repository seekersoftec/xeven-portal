import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Admin from '@/database/models/adminSchema';
// import SClass from '@/database/models/sClassSchema';
// import Student from '@/database/models/studentSchema';
// import Teacher from '@/database/models/teacherSchema';
// import Subject from '@/database/models/subjectSchema';
// import Notice from '@/database/models/noticeSchema';
// import Complain from '@/database/models/complainSchema';

// const adminRegister = async (req: Request, res: Response) => {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPass = await bcrypt.hash(req.body.password, salt);

//         const admin = new Admin({
//             ...req.body,
//             password: hashedPass
//         });

//         const existingAdminByEmail = await Admin.findOne({ email: req.body.email });
//         const existingSchool = await Admin.findOne({ schoolName: req.body.schoolName });

//         if (existingAdminByEmail) {
//             res.send({ message: 'Email already exists' });
//         }
//         else if (existingSchool) {
//             res.send({ message: 'School name already exists' });
//         }
//         else {
//             let result = await admin.save();
//             result.password = undefined;
//             res.send(result);
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };

const adminRegister = async (req: Request, res: Response): Promise<void> => {
  try {
    const admin = new Admin({
      ...req.body,
    });

    const existingAdminByEmail = await Admin.findOne({ email: req.body.email });
    const existingSchool = await Admin.findOne({
      schoolName: req.body.schoolName,
    });

    if (existingAdminByEmail) {
      res.send({ message: 'Email already exists' });
    } else if (existingSchool) {
      res.send({ message: 'School name already exists' });
    } else {
      const result = await admin.save();
      const { password, ...resultWithoutPassword } = result.toObject();
      res.send(resultWithoutPassword);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const adminLogIn = async (req: Request, res: Response) => {
  if (req.body.email && req.body.password) {
    let admin = await Admin.findOne({ email: req.body.email }).lean();
    if (admin) {
      const validated = await bcrypt.compare(req.body.password, admin.password);
      if (validated) {
        const { password, ...adminWithoutPassword } = admin;
        res.send(adminWithoutPassword);
      } else {
        res.send({ message: 'Invalid password' });
      }
    } else {
      res.send({ message: 'User not found' });
    }
  } else {
    res.send({ message: 'Email and password are required' });
  }
};

const getAdminDetail = async (req: Request, res: Response) => {
  try {
    let admin = await Admin.findById(req.params.id).lean();
    if (admin) {
      const { password, ...adminWithoutPassword } = admin;
      res.send(adminWithoutPassword);
    } else {
      res.send({ message: 'No admin found' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// const deleteAdmin = async (req: Request, res: Response) => {
//     try {
//         const result = await Admin.findByIdAndDelete(req.params.id)

//         await Sclass.deleteMany({ school: req.params.id });
//         await Student.deleteMany({ school: req.params.id });
//         await Teacher.deleteMany({ school: req.params.id });
//         await Subject.deleteMany({ school: req.params.id });
//         await Notice.deleteMany({ school: req.params.id });
//         await Complain.deleteMany({ school: req.params.id });

//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

// const updateAdmin = async (req: Request, res: Response) => {
//     try {
//         if (req.body.password) {
//             const salt = await bcrypt.genSalt(10)
//             res.body.password = await bcrypt.hash(res.body.password, salt)
//         }
//         let result = await Admin.findByIdAndUpdate(req.params.id,
//             { $set: req.body },
//             { new: true })

//         result.password = undefined;
//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

export { adminRegister, adminLogIn, getAdminDetail };
