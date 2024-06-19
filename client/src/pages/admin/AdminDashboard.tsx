import React, { useState } from "react";
import {
  CssBaseline,
  Box,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppBar, Drawer } from "../../components/styles";
import Logout from "../Logout";
import SideBar from "./SideBar";
import AdminProfile from "./AdminProfile";
import AdminHomePage from "./AdminHomePage";

import AddStudent from "./studentRelated/AddStudent";
import SeeComplains from "./studentRelated/SeeComplains";
import ShowStudents from "./studentRelated/ShowStudents";
import StudentAttendance from "./studentRelated/StudentAttendance";
import StudentExamMarks from "./studentRelated/StudentExamMarks";
import ViewStudent from "./studentRelated/ViewStudent";

import AddNotice from "./noticeRelated/AddNotice";
import ShowNotices from "./noticeRelated/ShowNotices";

import ShowSubjects from "./subjectRelated/ShowSubjects";
import SubjectForm from "./subjectRelated/SubjectForm";
import ViewSubject from "./subjectRelated/ViewSubject";

import AddTeacher from "./teacherRelated/AddTeacher";
import ChooseClass from "./teacherRelated/ChooseClass";
import ChooseSubject from "./teacherRelated/ChooseSubject";
import ShowTeachers from "./teacherRelated/ShowTeachers";
import TeacherDetails from "./teacherRelated/TeacherDetails";

import AddClass from "./classRelated/AddClass";
import ClassDetails from "./classRelated/ClassDetails";
import ShowClasses from "./classRelated/ShowClasses";
import AccountMenu from "../../components/AccountMenu";

const AdminDashboard: React.FC = () => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar open={open} position="absolute">
          <Toolbar sx={{ pr: "24px" }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Admin Dashboard
            </Typography>
            <AccountMenu />
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          open={open}
          sx={open ? styles.drawerStyled : styles.hideDrawer}
        >
          <Toolbar sx={styles.toolBarStyled}>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <SideBar />
          </List>
        </Drawer>
        <Box component="main" sx={styles.boxStyled}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<AdminHomePage />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/admin/dashboard" element={<AdminHomePage />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/complains" element={<SeeComplains />} />

            {/* Notice */}
            <Route path="/admin/add/notice" element={<AddNotice />} />
            <Route path="/admin/notices" element={<ShowNotices />} />

            {/* Subject */}
            <Route path="/admin/subjects" element={<ShowSubjects />} />
            <Route
              path="/admin/subjects/subject/:classID/:subjectID"
              element={<ViewSubject />}
            />
            <Route
              path="/admin/subjects/choose/class"
              element={<ChooseClass situation="Subject" />}
            />

            <Route path="/admin/add/subject/:id" element={<SubjectForm />} />
            <Route
              path="/admin/class/subject/:classID/:subjectID"
              element={<ViewSubject />}
            />

            <Route
              path="/admin/subject/student/attendance/:studentID/:subjectID"
              element={<StudentAttendance situation="Subject" />}
            />
            <Route
              path="/admin/subject/student/marks/:studentID/:subjectID"
              element={<StudentExamMarks situation="Subject" />}
            />

            {/* Class */}
            <Route path="/admin/add/class" element={<AddClass />} />
            <Route path="/admin/classes" element={<ShowClasses />} />
            <Route path="/admin/classes/class/:id" element={<ClassDetails />} />
            <Route
              path="/admin/class/add/students/:id"
              element={<AddStudent situation="Class" />}
            />

            {/* Student */}
            <Route
              path="/admin/add/students"
              element={<AddStudent situation="Student" />}
            />
            <Route path="/admin/students" element={<ShowStudents />} />
            <Route
              path="/admin/students/student/:id"
              element={<ViewStudent />}
            />
            <Route
              path="/admin/students/student/attendance/:id"
              element={<StudentAttendance situation="Student" />}
            />
            <Route
              path="/admin/students/student/marks/:id"
              element={<StudentExamMarks situation="Student" />}
            />

            {/* Teacher */}
            <Route path="/admin/teachers" element={<ShowTeachers />} />
            <Route
              path="/admin/teachers/teacher/:id"
              element={<TeacherDetails />}
            />
            <Route
              path="/admin/teachers/choose/class"
              element={<ChooseClass situation="Teacher" />}
            />
            <Route
              path="/admin/teachers/choose/subject/:id"
              element={<ChooseSubject situation="Norm" />}
            />
            <Route
              path="/admin/teachers/choose/subject/:classID/:teacherID"
              element={<ChooseSubject situation="Teacher" />}
            />
            <Route
              path="/admin/teachers/add/teacher/:id"
              element={<AddTeacher />}
            />

            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Box>
      </Box>
    </>
  );
};

export default AdminDashboard;

const styles = {
  boxStyled: {
    backgroundColor: (theme: any) =>
      theme.palette.mode === "light"
        ? theme.palette.grey[100]
        : theme.palette.grey[900],
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  toolBarStyled: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    px: [1],
  },
  drawerStyled: {
    display: "flex",
  },
  hideDrawer: {
    display: "flex",
    "@media (max-width: 600px)": {
      display: "none",
    },
  },
};
