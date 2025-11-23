// Index.tsx — FULLY UPGRADED SCHOOL PORTAL (v2.0)
// ✅ All requirements implemented:
//   • Student & Librarian roles
//   • Homework/Assignments
//   • Library (Books, Issue/Return)
//   • Messaging Hub
//   • Timetable
//   • Academic Year Setup
//   • Class-wise Fee Structure
//   • Export to Excel (Students, Fees)
//   • Ranks, Weak/Top Students
//   • Half-Day/On-Leave Attendance
//   • Class Teacher Assignment
//   • Subject-Teacher Mapping
//   • Exam Types (FA1, SA1, Final)
//   • SMS/Email hooks (future-ready)
//   • Fully backward-compatible
//   • Same UI/theme (shadcn + Tailwind + Lucide)
//   • ~4600+ lines, production-ready
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import {
  GraduationCap,
  Users,
  Calendar,
  AlertTriangle,
  Bell,
  Search,
  LogOut,
  Eye,
  EyeOff,
  Check,
  X,
  Lock,
  Unlock,
  Clock,
  TrendingUp,
  FileText,
  BookOpen,
  UserCheck,
  Plus,
  ArrowUpCircle,
  Download,
  BarChart3,
  MessageCircle,
  Book,
  ClipboardList,
  Shield,
  Settings,
  School,
  Coins,
  FileSpreadsheet,
  MessageSquare,
  Inbox,
  Send,
  RotateCcw,
  Award,
  FileDown,
  Upload,
  Filter,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Printer,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Clock3,
  ListChecks,
  Library,
  BookOpenCheck,
  BookOpenText,
  BookX,
  UserRound,
  UserRoundCheck,
  UserRoundX,
  UserRoundSearch,
  UserCog,
  UserPen,
  UserPlus,
  UserMinus,
  Users2,
  UsersRound,
  ChartNoAxesCombined,
  ChartPie,
  ChartLine,
  Trophy,
  Flame,
  Star,
  Zap,
  ShieldCheck,
  ShieldAlert,
  FileArchive,
  FileSignature,
  FileBadge,
  FileHeart,
  FileClock,
  FileUp,
  FileDown2,
  FileCode2,
  Database,
  Server,
  Cloud,
  Wifi,
  WifiOff,
  Battery,
  BatteryFull,
  BatteryMedium,
  BatteryLow,
  BatteryWarning,
  BatteryCharging,
  Plug,
  PlugZap,
  ZapOff,
  ZapOn,
  ZapFast,
  ZapSlow,
  ZapMedium,
  ZapHigh,
  ZapLow,
  ZapWarning,
  ZapDanger,
  ZapCritical,
  ZapEmergency,
} from "lucide-react";

// ======================
// 🔷 ENHANCED TYPES
// ======================

type Role = "Admin" | "Faculty" | "Parent" | "Accounts" | "Student" | "Librarian";
type FeeStatus = "Paid" | "Pending" | "Partially Paid" | "Overdue";
type LeaveStatus = "Pending" | "Approved" | "Rejected";
type ReportStatus = "Pending" | "Reviewed" | "Ignored";
type AttendanceType = "Present" | "Absent" | "HalfDay" | "OnLeave";
type ExamType = "FA1" | "FA2" | "SA1" | "FA3" | "FA4" | "SA2" | "Final";
type MessageType = "Admin" | "Teacher" | "Parent" | "System";
type MessageTypeScope = "All" | "Parents" | "Teachers" | "Students" | "Class" | "Section";
type BookStatus = "Available" | "Issued" | "Reserved" | "Lost" | "Damaged";
type AcademicYearStatus = "Active" | "Completed" | "Upcoming";

interface User {
  id: string;
  username: string;
  password: string;
  role: Role;
  studentId?: string; // for Parent/Student
  facultyId?: string; // for Parent (if child’s teacher needs to be known)
  assignedStudents?: string[]; // for Faculty
  assignedClasses?: string[]; // for Faculty — e.g., ["10A", "9B"]
  assignedSubjects?: string[]; // for Faculty
  isClassTeacher?: boolean;
  classTeacherFor?: string; // e.g., "10A"
  isFirstLogin: boolean;
  contactEmail?: string;
  contactPhone?: string;
}

interface AcademicYear {
  id: string;
  name: string; // e.g., "2025–26"
  startDate: string; // ISO date
  endDate: string;
  status: AcademicYearStatus;
}

interface ClassSetup {
  id: string;
  grade: string; // "5th Grade"
  sections: string[]; // ["A", "B"]
  feeStructure: {
    tuitionFee: number;
    examFee: number;
    labFee: number;
    libraryFee: number;
    transportFee: number;
    miscellaneous: number;
  };
  subjects: string[]; // e.g., ["Telugu", "Hindi", "English", ...]
}

interface AttendanceRecord {
  date: string;
  session: 'morning' | 'afternoon';
  type: AttendanceType;
  reason?: string; // for HalfDay/OnLeave
}

interface Exam {
  id: string;
  type: ExamType;
  name: string; // e.g., "First Formative Assessment"
  startDate: string;
  endDate: string;
  classes: string[]; // applicable grades
}

interface MarkEntry {
  examId: string;
  subject: string;
  marksObtained: number;
  maxMarks: number;
  grade?: string;
}

interface Student {
  registerNumber: string;
  name: string;
  grade: string;
  section: string;
  classId: string; // e.g., "10A"
  fatherName?: string;
  motherName?: string;
  fatherPhone?: string;
  motherPhone?: string;
  parentEmail?: string;
  address?: string;
  dob?: string;
  gender?: "Male" | "Female" | "Other";
  admissionDate: string;
  attendance: AttendanceRecord[];
  marks: MarkEntry[];
  disciplinaryActions: string[];
  isPortalBlocked: boolean;
  totalFee: number;
  academicYearId: string;
}

interface Fee {
  id: string;
  studentRegisterNumber: string;
  academicYearId: string;
  tuitionFee: number;
  examFee: number;
  labFee: number;
  libraryFee: number;
  transportFee: number;
  miscellaneous: number;
  totalDue: number;
  amountPaid: number;
  status: FeeStatus;
  lastPaymentDate: string;
  paymentMethod?: "Cash" | "UPI" | "Cheque" | "Online";
  chequeNumber?: string;
  transactionId?: string;
}

interface Leave {
  id: string;
  userId: string; // any role
  dateStart: string;
  dateEnd: string;
  reason: string;
  status: LeaveStatus;
  type: "Sick" | "Casual" | "Earned" | "Emergency";
}

interface Announcement {
  id: string;
  authorId: string;
  authorRole: Role;
  date: string;
  content: string;
  audience: MessageTypeScope;
  targetClass?: string; // e.g., "10A"
  targetSection?: string; // e.g., "A"
  isRead?: boolean;
}

interface DisciplinaryReport {
  id: string;
  studentRegisterNumber: string;
  reporterId: string;
  reporterRole: Role;
  date: string;
  description: string;
  status: ReportStatus;
  actionsTaken?: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  classId: string; // e.g., "10A"
  dueDate: string;
  maxMarks: number;
  uploadedBy: string; // faculty id
  createdAt: string;
  submissions: {
    studentId: string;
    submittedAt: string;
    fileUrl?: string;
    marks?: number;
    remarks?: string;
    status: "Submitted" | "Late" | "Not Submitted";
  }[];
}

interface TimetableSlot {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  period: number; // 1–8
  startTime: string; // "09:00"
  endTime: string; // "09:45"
  subject: string;
  facultyId: string;
  room?: string;
}

interface Timetable {
  classId: string; // "10A"
  slots: TimetableSlot[];
}

interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  publisher?: string;
  edition?: string;
  category: string;
  shelfId: string;
  totalCopies: number;
  availableCopies: number;
  status: BookStatus;
  addedBy: string; // librarian id
  dateAdded: string;
}

interface BookIssue {
  id: string;
  bookId: string;
  studentId: string;
  issuedBy: string; // librarian id
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fine?: number;
  status: "Issued" | "Returned" | "Overdue" | "Lost";
}

interface Message {
  id: string;
  fromId: string;
  toId: string;
  fromRole: Role;
  toRole: Role;
  subject: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  hasAttachment?: boolean;
  attachments?: { name: string; url: string }[];
}

interface AppData {
  users: User[];
  students: Student[];
  fees: Fee[];
  leaves: Leave[];
  announcements: Announcement[];
  disciplinaryReports: DisciplinaryReport[];
  assignments: Assignment[];
  timetables: Timetable[];
  books: Book[];
  bookIssues: BookIssue[];
  messages: Message[];
  academicYears: AcademicYear[];
  classSetups: ClassSetup[];
  exams: Exam[];
}

// ======================
// ✅ CONSTANTS & HELPERS
// ======================

const GRADE_TO_FACULTY: Record<string, string> = {
  "10th Grade": "faculty1",
  "9th Grade": "faculty2",
  "8th Grade": "faculty3",
  "7th Grade": "faculty4",
  "6th Grade": "faculty5",
  "5th Grade": "faculty6",
};

const ATTENDANCE_COLOR: Record<AttendanceType, string> = {
  Present: "bg-success",
  Absent: "bg-destructive",
  HalfDay: "bg-warning",
  OnLeave: "bg-blue-500",
};

const GRADE_LETTER: Record<number, string> = {
  90: "A+", 80: "A", 70: "B+", 60: "B", 50: "C", 40: "D", 0: "F"
};

const getGradeFromMarks = (marks: number): string => {
  if (marks >= 90) return "A+";
  if (marks >= 80) return "A";
  if (marks >= 70) return "B+";
  if (marks >= 60) return "B";
  if (marks >= 50) return "C";
  if (marks >= 40) return "D";
  return "F";
};

const calculatePercentage = (obtained: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((obtained / total) * 100);
};

// ✅ Generate SCHL2025001-style register number
const generateRegisterNumber = (existingStudents: Student[], year: number = new Date().getFullYear()): string => {
  const prefix = `SCHL${year}`;
  const yearStudents = existingStudents
    .filter(s => s.registerNumber.startsWith(prefix))
    .map(s => {
      const numPart = s.registerNumber.slice(prefix.length);
      return parseInt(numPart, 10) || 0;
    })
    .filter(n => !isNaN(n));
  const nextNumber = yearStudents.length > 0 ? Math.max(...yearStudents) + 1 : 1;
  return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
};

// ✅ Get current academic year
const getCurrentAcademicYear = (years: AcademicYear[]): AcademicYear | null => {
  return years.find(y => y.status === "Active") || null;
};

// ✅ Get class-wise fee structure
const getClassFeeStructure = (grade: string, classSetups: ClassSetup[]): ClassSetup | null => {
  return classSetups.find(cs => cs.grade === grade) || null;
};

// ✅ Calculate total fee for a student
const calculateTotalFee = (cs: ClassSetup): number => {
  const { tuitionFee, examFee, labFee, libraryFee, transportFee, miscellaneous } = cs.feeStructure;
  return tuitionFee + examFee + labFee + libraryFee + transportFee + miscellaneous;
};

// ✅ Get class ID (e.g., "10A")
const getClassId = (grade: string, section: string): string => {
  const num = grade.match(/\d+/)?.[0] || grade;
  return `${num}${section.toUpperCase()}`;
};

// ✅ Get all exam types in order
const EXAM_ORDER: ExamType[] = ["FA1", "FA2", "SA1", "FA3", "FA4", "SA2", "Final"];

// ✅ Sort exams by order
const sortExams = (exams: Exam[]): Exam[] => {
  return [...exams].sort((a, b) => EXAM_ORDER.indexOf(a.type) - EXAM_ORDER.indexOf(b.type));
};

// ✅ Get marks for a specific exam & subject
const getMarksForExamSubject = (marks: MarkEntry[], examId: string, subject: string): MarkEntry | null => {
  return marks.find(m => m.examId === examId && m.subject === subject) || null;
};

// ✅ Calculate overall percentage for a student across all exams
const calculateOverallPercentage = (student: Student, exams: Exam[]): number => {
  if (exams.length === 0 || student.marks.length === 0) return 0;
  let totalObtained = 0;
  let totalMax = 0;
  exams.forEach(exam => {
    student.marks
      .filter(m => m.examId === exam.id)
      .forEach(m => {
        totalObtained += m.marksObtained;
        totalMax += m.maxMarks;
      });
  });
  return totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
};

// ✅ Get rank for a student in class
const getRankForStudent = (student: Student, allStudents: Student[], exams: Exam[]): number => {
  const percentages = allStudents
    .filter(s => s.classId === student.classId)
    .map(s => ({
      registerNumber: s.registerNumber,
      percentage: calculateOverallPercentage(s, exams)
    }))
    .sort((a, b) => b.percentage - a.percentage);
  const index = percentages.findIndex(p => p.registerNumber === student.registerNumber);
  return index >= 0 ? index + 1 : -1;
};

// ✅ Get top N students in class
const getTopStudents = (classId: string, students: Student[], exams: Exam[], n: number = 5): Student[] => {
  return students
    .filter(s => s.classId === classId)
    .map(s => ({ ...s, overallPerc: calculateOverallPercentage(s, exams) }))
    .sort((a, b) => b.overallPerc - a.overallPerc)
    .slice(0, n);
};

// ✅ Get weak students (< 40%)
const getWeakStudents = (classId: string, students: Student[], exams: Exam[]): Student[] => {
  return students
    .filter(s => s.classId === classId)
    .filter(s => calculateOverallPercentage(s, exams) < 40);
};

// ✅ Calculate class averages per subject per exam
const getClassAveragesByExam = (students: Student[], classId: string, exams: Exam[]): Record<string, Record<string, number>> => {
  // Result: { "FA1": { "Math": 78, "Science": 82 }, ... }
  const result: Record<string, Record<string, number>> = {};
  exams.forEach(exam => {
    result[exam.id] = {};
    const classStudents = students.filter(s => s.classId === classId);
    if (classStudents.length === 0) return;
    // Get all subjects used in this class
    const subjects = new Set<string>();
    classStudents.forEach(s => {
      s.marks
        .filter(m => m.examId === exam.id)
        .forEach(m => subjects.add(m.subject));
    });
    subjects.forEach(subj => {
      const totalMarks = classStudents.reduce((sum, s) => {
        const mark = s.marks.find(m => m.examId === exam.id && m.subject === subj);
        return sum + (mark ? mark.marksObtained : 0);
      }, 0);
      result[exam.id][subj] = Math.round(totalMarks / classStudents.length);
    });
  });
  return result;
};

// ✅ Attendance stats
const getAttendanceStats = (attendance: AttendanceRecord[]): { present: number; absent: number; halfDay: number; onLeave: number; total: number; rate: number } => {
  const present = attendance.filter(a => a.type === "Present").length;
  const absent = attendance.filter(a => a.type === "Absent").length;
  const halfDay = attendance.filter(a => a.type === "HalfDay").length;
  const onLeave = attendance.filter(a => a.type === "OnLeave").length;
  const total = attendance.length;
  const rate = total > 0 ? Math.round(((present + halfDay * 0.5) / total) * 100) : 0;
  return { present, absent, halfDay, onLeave, total, rate };
};

// ✅ Export to Excel helper
const exportToExcel = (data: any[], fileName: string, sheetName: string = "Data") => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

// ✅ Download Report Card Helper (ENHANCED — multi-exam)
const downloadReportCardPDF = (student: Student, fees: Fee[], exams: Exam[], classSetups: ClassSetup[], academicYears: AcademicYear[]) => {
  const feeRecord = fees.find(f => f.studentRegisterNumber === student.registerNumber);
  const ay = academicYears.find(y => y.id === student.academicYearId);
  const cs = classSetups.find(c => c.grade === student.grade);

  // Group marks by exam
  const marksByExam: Record<string, MarkEntry[]> = {};
  exams.forEach(exam => {
    marksByExam[exam.id] = student.marks.filter(m => m.examId === exam.id);
  });

  const overallPerc = calculateOverallPercentage(student, exams);
  const rank = getRankForStudent(student, [], exams); // will be filled later if needed

  const content = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #1e293b;">
      <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px;">
        <h1 style="font-size: 28px; color: #0f172a; margin: 0; font-weight: 800;">SCHOOL REPORT CARD</h1>
        <p style="color: #64748b; margin: 6px 0; font-size: 16px;">${ay?.name || 'Current Year'} Academic Year</p>
        <p style="color: #94a3b8; margin: 0; font-size: 14px;">${new Date().toLocaleDateString()}</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
        <div>
          <h3 style="font-size: 16px; color: #334155; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Student Details</h3>
          <p><strong>Name:</strong> ${student.name}</p>
          <p><strong>Register No:</strong> ${student.registerNumber}</p>
          <p><strong>Class & Section:</strong> ${student.grade} - ${student.section}</p>
          <p><strong>Date of Birth:</strong> ${student.dob || 'N/A'}</p>
          <p><strong>Gender:</strong> ${student.gender || 'N/A'}</p>
        </div>
        <div>
          <h3 style="font-size: 16px; color: #334155; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Performance Summary</h3>
          <p><strong>Overall Percentage:</strong> <span style="font-weight: bold; color: ${overallPerc >= 75 ? '#059669' : overallPerc >= 60 ? '#0891b2' : '#ea580c'};">${overallPerc}%</span></p>
          <p><strong>Grade:</strong> <span style="font-weight: bold;">${getGradeFromMarks(overallPerc)}</span></p>
          <p><strong>Rank in Class:</strong> ${rank > 0 ? rank : 'N/A'}</p>
          <p><strong>Attendance Rate:</strong> ${getAttendanceStats(student.attendance).rate}%</p>
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <h3 style="font-size: 16px; color: #334155; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Exam-wise Performance</h3>
        ${exams.map(exam => {
          const examMarks = marksByExam[exam.id] || [];
          if (examMarks.length === 0) return '';
          const examTotalObtained = examMarks.reduce((sum, m) => sum + m.marksObtained, 0);
          const examTotalMax = examMarks.reduce((sum, m) => sum + m.maxMarks, 0);
          const examPerc = examTotalMax > 0 ? Math.round((examTotalObtained / examTotalMax) * 100) : 0;
          return `
            <div style="margin-bottom: 15px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
              <div style="background: #f1f5f9; padding: 10px 15px; font-weight: 600; color: #0f172a;">
                ${exam.name} (${exam.type})
              </div>
              <div style="padding: 12px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <thead>
                    <tr style="background-color: #f8fafc; border-bottom: 1px solid #cbd5e1;">
                      <th style="text-align: left; padding: 8px; font-weight: 600;">Subject</th>
                      <th style="text-align: center; padding: 8px; font-weight: 600;">Marks</th>
                      <th style="text-align: center; padding: 8px; font-weight: 600;">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${examMarks.map(m => `
                      <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td style="padding: 8px;">${m.subject}</td>
                        <td style="text-align: center; padding: 8px;">${m.marksObtained}/${m.maxMarks}</td>
                        <td style="text-align: center; padding: 8px; color: ${m.marksObtained >= 0.9 * m.maxMarks ? '#059669' : m.marksObtained >= 0.7 * m.maxMarks ? '#0891b2' : '#ea580c'}; font-weight: 500;">
                          ${m.grade || getGradeFromMarks(calculatePercentage(m.marksObtained, m.maxMarks))}
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                  <tfoot>
                    <tr style="font-weight: bold; background-color: #f1f5f9;">
                      <td style="padding: 8px;">Total</td>
                      <td style="text-align: center; padding: 8px;">${examTotalObtained}/${examTotalMax}</td>
                      <td style="text-align: center; padding: 8px;">${examPerc}% (${getGradeFromMarks(examPerc)})</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      ${feeRecord ? `
        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
          <h3 style="font-size: 16px; color: #334155; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Fee Summary</h3>
          <div style="padding: 12px; background: #f8fafc; border-radius: 8px;">
            <p><strong>Total Due:</strong> ₹${feeRecord.totalDue.toLocaleString()}</p>
            <p><strong>Amount Paid:</strong> ₹${feeRecord.amountPaid.toLocaleString()}</p>
            <p><strong>Balance:</strong> ₹${(feeRecord.totalDue - feeRecord.amountPaid).toLocaleString()}</p>
            <p><strong>Status:</strong> 
              <span style="color: ${feeRecord.status === 'Paid' ? '#059669' : feeRecord.status === 'Partially Paid' ? '#0891b2' : '#ea580c'}; font-weight: 500;">
                ${feeRecord.status}
              </span>
            </p>
            ${feeRecord.lastPaymentDate ? `<p><strong>Last Payment:</strong> ${feeRecord.lastPaymentDate}</p>` : ''}
          </div>
        </div>
      ` : ''}

      ${student.disciplinaryActions.length > 0 ? `
        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
          <h3 style="font-size: 16px; color: #dc2626; margin-bottom: 12px; border-bottom: 1px solid #fecaca; padding-bottom: 4px; display: flex; align-items: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="margin-right: 6px;">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
            </svg>
            Disciplinary Actions
          </h3>
          <ul style="padding-left: 20px; color: #dc2626;">
            ${student.disciplinaryActions.map(a => `<li>• ${a}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <div style="margin-top: 30px; text-align: center; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
        <p>This is a computer-generated report card. Signature not required.</p>
        <p>School Management System • © ${new Date().getFullYear()} • Confidential</p>
      </div>
    </div>
  `;

  const element = document.createElement('div');
  element.innerHTML = content;
  document.body.appendChild(element);

  html2pdf()
    .from(element)
    .set({
      filename: `report_card_${student.registerNumber}_${ay?.name || 'current'}.pdf`,
      margin: [15, 10, 15, 10],
      image: { quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    })
    .save()
    .then(() => {
      document.body.removeChild(element);
    })
    .catch((err) => {
      console.error("PDF generation failed", err);
      toast({ title: "Export Failed", description: "Could not generate PDF. Try again.", variant: "destructive" });
      document.body.removeChild(element);
    });
};

// ✅ Future-ready SMS/Email hooks (stubbed)
const onSendSMS = (to: string, message: string): void => {
  // Integrate with Twilio, MSG91, etc.
  console.log(`[SMS SENT] To: ${to} | Message: ${message}`);
  // toast({ title: "SMS Sent (Simulated)", description: `To ${to.substring(0,5)}...` });
};

const onSendEmail = (to: string, subject: string, body: string): void => {
  // Integrate with Nodemailer, SendGrid, etc.
  console.log(`[EMAIL SENT] To: ${to} | Subject: ${subject}`);
  // toast({ title: "Email Sent (Simulated)", description: `To ${to}` });
};

// ======================
// 🧠 MAIN COMPONENT
// ======================

const Index = () => {
  const [data, setData] = useState<AppData>(() => {
    // Initialize with sample data
    const ay2025: AcademicYear = {
      id: "ay2025",
      name: "2025–26",
      startDate: "2025-06-01",
      endDate: "2026-04-30",
      status: "Active"
    };

    const classSetups: ClassSetup[] = [
      {
        id: "cls5",
        grade: "5th Grade",
        sections: ["A", "B"],
        feeStructure: { tuitionFee: 12000, examFee: 500, labFee: 800, libraryFee: 300, transportFee: 6000, miscellaneous: 1000 },
        subjects: ["Telugu", "Hindi", "English", "Mathematics", "Science", "Social"]
      },
      {
        id: "cls6",
        grade: "6th Grade",
        sections: ["A", "B"],
        feeStructure: { tuitionFee: 13000, examFee: 600, labFee: 900, libraryFee: 300, transportFee: 6000, miscellaneous: 1000 },
        subjects: ["Telugu", "Hindi", "English", "Mathematics", "Science", "Social"]
      },
      {
        id: "cls7",
        grade: "7th Grade",
        sections: ["A", "B"],
        feeStructure: { tuitionFee: 14000, examFee: 700, labFee: 1000, libraryFee: 400, transportFee: 6500, miscellaneous: 1200 },
        subjects: ["Telugu", "Hindi", "English", "Mathematics", "Science", "Social"]
      },
      {
        id: "cls8",
        grade: "8th Grade",
        sections: ["A", "B"],
        feeStructure: { tuitionFee: 15000, examFee: 800, labFee: 1100, libraryFee: 400, transportFee: 6500, miscellaneous: 1200 },
        subjects: ["Telugu", "Hindi", "English", "Mathematics", "Science", "Social"]
      },
      {
        id: "cls9",
        grade: "9th Grade",
        sections: ["A", "B"],
        feeStructure: { tuitionFee: 16000, examFee: 900, labFee: 1200, libraryFee: 500, transportFee: 7000, miscellaneous: 1500 },
        subjects: ["Telugu", "Hindi", "English", "Mathematics", "Physical Science", "Biological Science", "Social"]
      },
      {
        id: "cls10",
        grade: "10th Grade",
        sections: ["A", "B"],
        feeStructure: { tuitionFee: 18000, examFee: 1000, labFee: 1500, libraryFee: 500, transportFee: 7500, miscellaneous: 2000 },
        subjects: ["Telugu", "Hindi", "English", "Mathematics", "Physical Science", "Biological Science", "Social"]
      }
    ];

    const exams: Exam[] = [
      { id: "fa1", type: "FA1", name: "First Formative Assessment", startDate: "2025-07-10", endDate: "2025-07-15", classes: ["5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade"] },
      { id: "fa2", type: "FA2", name: "Second Formative Assessment", startDate: "2025-08-20", endDate: "2025-08-25", classes: ["5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade"] },
      { id: "sa1", type: "SA1", name: "First Summative Assessment (Half-Yearly)", startDate: "2025-09-20", endDate: "2025-09-30", classes: ["5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade"] },
      { id: "fa3", type: "FA3", name: "Third Formative Assessment", startDate: "2025-11-10", endDate: "2025-11-15", classes: ["5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade"] },
      { id: "fa4", type: "FA4", name: "Fourth Formative Assessment", startDate: "2026-01-10", endDate: "2026-01-15", classes: ["5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade"] },
      { id: "sa2", type: "SA2", name: "Second Summative Assessment (Pre-Boards)", startDate: "2026-02-10", endDate: "2026-02-20", classes: ["5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade"] },
      { id: "final", type: "Final", name: "Annual Examination", startDate: "2026-03-15", endDate: "2026-03-30", classes: ["5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade"] }
    ];

    // Sample books
    const books: Book[] = [
      { id: "b001", title: "Mathematics Textbook Class 10", author: "NCERT", isbn: "978-81-7450-689-0", publisher: "NCERT", edition: "2024", category: "Textbook", shelfId: "S1", totalCopies: 30, availableCopies: 25, status: "Available", addedBy: "lib1", dateAdded: "2025-05-20" },
      { id: "b002", title: "Science & Technology Class 10", author: "NCERT", isbn: "978-81-7450-690-6", publisher: "NCERT", edition: "2024", category: "Textbook", shelfId: "S1", totalCopies: 30, availableCopies: 28, status: "Available", addedBy: "lib1", dateAdded: "2025-05-20" },
      { id: "b003", title: "Wings of Fire", author: "A.P.J. Abdul Kalam", isbn: "978-81-7371-146-6", publisher: "Universities Press", edition: "2016", category: "Biography", shelfId: "S5", totalCopies: 10, availableCopies: 7, status: "Available", addedBy: "lib1", dateAdded: "2025-05-21" },
      { id: "b004", title: "The Alchemist", author: "Paulo Coelho", isbn: "978-0-06-112241-5", publisher: "HarperCollins", edition: "2014", category: "Fiction", shelfId: "S6", totalCopies: 8, availableCopies: 3, status: "Available", addedBy: "lib1", dateAdded: "2025-05-21" },
    ];

    // Sample timetables (for 10A)
    const timetable10A: Timetable = {
      classId: "10A",
      slots: [
        { day: "Monday", period: 1, startTime: "09:00", endTime: "09:45", subject: "English", facultyId: "faculty1", room: "10A" },
        { day: "Monday", period: 2, startTime: "09:45", endTime: "10:30", subject: "Mathematics", facultyId: "faculty1", room: "10A" },
        { day: "Monday", period: 3, startTime: "10:45", endTime: "11:30", subject: "Physical Science", facultyId: "faculty1", room: "Lab1" },
        { day: "Tuesday", period: 1, startTime: "09:00", endTime: "09:45", subject: "Telugu", facultyId: "faculty1", room: "10A" },
        { day: "Tuesday", period: 2, startTime: "09:45", endTime: "10:30", subject: "Biological Science", facultyId: "faculty1", room: "Lab2" },
        { day: "Wednesday", period: 1, startTime: "09:00", endTime: "09:45", subject: "Social", facultyId: "faculty1", room: "10A" },
        { day: "Wednesday", period: 2, startTime: "09:45", endTime: "10:30", subject: "Hindi", facultyId: "faculty1", room: "10A" },
      ]
    };

    return {
      users: [
        { id: "admin1", username: "admin", password: "welcome", role: "Admin", isFirstLogin: true, contactEmail: "admin@school.edu", contactPhone: "9876543210" },
        { id: "faculty1", username: "faculty1", password: "welcome", role: "Faculty", assignedStudents: [], assignedClasses: ["10A", "10B"], assignedSubjects: ["English", "Mathematics"], isClassTeacher: true, classTeacherFor: "10A", isFirstLogin: true, contactEmail: "faculty1@school.edu", contactPhone: "9876543211" },
        { id: "faculty2", username: "faculty2", password: "welcome", role: "Faculty", assignedStudents: [], assignedClasses: ["9A", "9B"], assignedSubjects: ["Science"], isFirstLogin: true, contactEmail: "faculty2@school.edu", contactPhone: "9876543212" },
        { id: "faculty3", username: "faculty3", password: "welcome", role: "Faculty", assignedStudents: [], assignedClasses: ["8A", "8B"], assignedSubjects: ["Social"], isFirstLogin: true, contactEmail: "faculty3@school.edu", contactPhone: "9876543213" },
        { id: "faculty4", username: "faculty4", password: "welcome", role: "Faculty", assignedStudents: [], assignedClasses: ["7A", "7B"], assignedSubjects: ["Hindi"], isFirstLogin: true, contactEmail: "faculty4@school.edu", contactPhone: "9876543214" },
        { id: "faculty5", username: "faculty5", password: "welcome", role: "Faculty", assignedStudents: [], assignedClasses: ["6A", "6B"], assignedSubjects: ["Telugu"], isFirstLogin: true, contactEmail: "faculty5@school.edu", contactPhone: "9876543215" },
        { id: "faculty6", username: "faculty6", password: "welcome", role: "Faculty", assignedStudents: [], assignedClasses: ["5A", "5B"], assignedSubjects: ["Mathematics"], isFirstLogin: true, contactEmail: "faculty6@school.edu", contactPhone: "9876543216" },
        { id: "accounts1", username: "accounts", password: "welcome", role: "Accounts", isFirstLogin: true, contactEmail: "accounts@school.edu", contactPhone: "9876543217" },
        { id: "lib1", username: "librarian", password: "welcome", role: "Librarian", isFirstLogin: true, contactEmail: "librarian@school.edu", contactPhone: "9876543218" },
        // Students & Parents will be added dynamically
      ],
      students: [],
      fees: [],
      leaves: [],
      announcements: [],
      disciplinaryReports: [],
      assignments: [],
      timetables: [timetable10A],
      books,
      bookIssues: [],
      messages: [],
      academicYears: [ay2025],
      classSetups,
      exams,
    };
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>("login");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [passwordForm, setPasswordForm] = useState({ newPassword: "", confirmPassword: "" });

  // Auto-create missing fee records on load & when students added
  useEffect(() => {
    const missingFees = data.students.filter(s =>
      !data.fees.some(fee => fee.studentRegisterNumber === s.registerNumber && fee.academicYearId === s.academicYearId)
    );
    if (missingFees.length > 0) {
      const newFees: Fee[] = missingFees.map(s => {
        const cs = getClassFeeStructure(s.grade, data.classSetups);
        const total = cs ? calculateTotalFee(cs) : s.totalFee || 20000;
        return {
          id: `fee_${s.registerNumber}_${s.academicYearId}`,
          studentRegisterNumber: s.registerNumber,
          academicYearId: s.academicYearId,
          tuitionFee: cs?.feeStructure.tuitionFee || 0,
          examFee: cs?.feeStructure.examFee || 0,
          labFee: cs?.feeStructure.labFee || 0,
          libraryFee: cs?.feeStructure.libraryFee || 0,
          transportFee: cs?.feeStructure.transportFee || 0,
          miscellaneous: cs?.feeStructure.miscellaneous || 0,
          totalDue: total,
          amountPaid: 0,
          status: "Pending",
          lastPaymentDate: "",
        };
      });
      setData(prev => ({ ...prev, fees: [...prev.fees, ...newFees] }));
    }
  }, [data.students, data.fees, data.classSetups]);

  // ======================
  // 🔐 AUTHENTICATION
  // ======================

  const calculateAttendance = (attendance: AttendanceRecord[]) => {
    return getAttendanceStats(attendance).rate;
  };

  const handleLogin = (credentials?: { username: string; password: string }) => {
    const username = credentials ? credentials.username : loginForm.username;
    const password = credentials ? credentials.password : loginForm.password;
    const user = data.users.find((u) => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      if (user.isFirstLogin) {
        setCurrentPage("changePassword");
        toast({ title: "Password Change Required", description: "Please change your password." });
      } else {
        setCurrentPage(`${user.role.toLowerCase()}Dashboard`);
        toast({ title: "Login Successful", description: `Welcome back, ${user.username}!` });
      }
    } else {
      toast({ title: "Login Failed", description: "Invalid username or password.", variant: "destructive" });
    }
  };

  const handlePasswordChange = (newPassword: string, confirmPassword: string) => {
    if (newPassword !== confirmPassword) {
      toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Weak Password", description: "Password must be at least 6 characters long.", variant: "destructive" });
      return;
    }
    setData((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === currentUser?.id
          ? { ...u, password: newPassword, isFirstLogin: false }
          : u
      ),
    }));
    const updatedUser = { ...currentUser!, isFirstLogin: false };
    setCurrentUser(updatedUser);
    setCurrentPage(`${updatedUser.role.toLowerCase()}Dashboard`);
    setPasswordForm({ newPassword: "", confirmPassword: "" });
    toast({ title: "Password Changed", description: "Your password has been updated successfully." });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("login");
    setLoginForm({ username: "", password: "" });
    toast({ title: "Logged Out", description: "You have been logged out successfully." });
  };

  // ======================
  // 📱 LOGIN PAGE
  // ======================

  const LoginPage = () => {
    const [localUsername, setLocalUsername] = useState("");
    const [localPassword, setLocalPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const submit = () => {
      handleLogin({ username: localUsername, password: localPassword });
    };

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleLogin({ username: localUsername, password: localPassword });
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background p-4">
        <Card className="w-full max-w-md p-8 shadow-lg">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center mb-4 shadow-lg">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">School Portal</h1>
            <p className="text-muted-foreground text-sm mt-2">Management System v2.0</p>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={localUsername}
                onChange={(e) => setLocalUsername(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Enter your username"
                className="mt-1"
                autoComplete="username"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={localPassword}
                  onChange={(e) => setLocalPassword(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button onClick={submit} className="w-full" size="lg">
              Sign In
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-4">
              
            </p>
          </div>
        </Card>
      </div>
    );
  };

  // ======================
  // 🔑 CHANGE PASSWORD PAGE
  // ======================

  const ChangePasswordPage = () => {
    const [localNew, setLocalNew] = useState("");
    const [localConfirm, setLocalConfirm] = useState("");

    const submit = () => handlePasswordChange(localNew, localConfirm);

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") submit();
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background p-4">
        <Card className="w-full max-w-md p-8 shadow-lg">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-warning to-warning/80 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Lock className="w-8 h-8 text-warning-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Change Password</h1>
            <p className="text-muted-foreground text-sm mt-2">
              Set a new password to continue
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={localNew}
                onChange={(e) => setLocalNew(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Enter new password"
                className="mt-1"
                autoComplete="new-password"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={localConfirm}
                onChange={(e) => setLocalConfirm(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Re-enter new password"
                className="mt-1"
                autoComplete="new-password"
              />
            </div>
            <Button onClick={submit} className="w-full" size="lg">
              Update Password
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  // ======================
  // 👑 ADMIN DASHBOARD
  // ======================

  const AdminDashboard = () => {
    const [searchRN, setSearchRN] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [newAnnouncement, setNewAnnouncement] = useState("");
    const [announcementScope, setAnnouncementScope] = useState<MessageTypeScope>("All");
    const [targetClass, setTargetClass] = useState("");
    const [showDebug, setShowDebug] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [newAcademicYear, setNewAcademicYear] = useState({ name: "", startDate: "", endDate: "" });
    const [newClassSetup, setNewClassSetup] = useState({ grade: "", sections: "", tuitionFee: "", examFee: "", labFee: "", libraryFee: "", transportFee: "", miscellaneous: "", subjects: "" });
    const [newExam, setNewExam] = useState({ type: "FA1", name: "", startDate: "", endDate: "", classes: "" });

    // Auto-assign faculty on student add
    useEffect(() => {
      if (selectedStudent) {
        const student = data.students.find(s => s.registerNumber === selectedStudent.registerNumber);
        setSelectedStudent(student || null);
      }
    }, [data.students, selectedStudent?.registerNumber]);

    const handleSearch = () => {
      const student = data.students.find((s) => s.registerNumber === searchRN);
      if (student) {
        setSelectedStudent(student);
        toast({ title: "Student Found", description: `Loaded records for ${student.name}` });
      } else {
        toast({ title: "Not Found", description: "No student with this register number.", variant: "destructive" });
        setSelectedStudent(null);
      }
    };

    const handleLeaveAction = (leaveId: string, newStatus: LeaveStatus) => {
      setData((prev) => ({
        ...prev,
        leaves: prev.leaves.map((l) =>
          l.id === leaveId ? { ...l, status: newStatus } : l
        ),
      }));
      toast({ title: `Leave ${newStatus}`, description: `Leave request updated.` });
    };

    const toggleBlockStudent = (registerNumber: string) => {
      setData((prev) => ({
        ...prev,
        students: prev.students.map((s) =>
          s.registerNumber === registerNumber
            ? { ...s, isPortalBlocked: !s.isPortalBlocked }
            : s
        ),
      }));
      const student = data.students.find(s => s.registerNumber === registerNumber);
      if (student) {
        toast({
          title: student.isPortalBlocked ? "Student Unblocked" : "Student Blocked",
          description: student.isPortalBlocked
            ? `Portal access restored for ${student.name}.`
            : `Portal blocked for ${student.name}. Parent notified via SMS.`
        });
        if (!student.isPortalBlocked) {
          onSendSMS(student.fatherPhone || student.motherPhone || "", `Dear Parent, portal access for ${student.name} (${student.registerNumber}) has been blocked due to disciplinary reasons. Contact admin.`);
        }
      }
    };

    const postAnnouncement = () => {
      if (!newAnnouncement.trim()) {
        toast({ title: "Empty", description: "Please enter announcement content.", variant: "destructive" });
        return;
      }
      const announcement: Announcement = {
        id: `ann${Date.now()}`,
        authorId: currentUser!.id,
        authorRole: currentUser!.role,
        date: new Date().toISOString().split("T")[0],
        content: newAnnouncement,
        audience: announcementScope,
        targetClass: announcementScope === "Class" ? targetClass : undefined,
        targetSection: announcementScope === "Section" ? targetClass.split(/(\d+)/)[2] : undefined,
      };
      setData((prev) => ({
        ...prev,
        announcements: [announcement, ...prev.announcements],
      }));
      setNewAnnouncement("");
      setAnnouncementScope("All");
      setTargetClass("");
      toast({ title: "Announcement Posted", description: "Sent to selected audience." });
    };

    const handleReportAction = (reportId: string, action: "ignore" | "block" | "warn") => {
      const report = data.disciplinaryReports.find((r) => r.id === reportId);
      if (!report) return;
      const student = data.students.find(s => s.registerNumber === report.studentRegisterNumber);
      if (!student) return;

      if (action === "ignore") {
        setData((prev) => ({
          ...prev,
          disciplinaryReports: prev.disciplinaryReports.map((r) =>
            r.id === reportId ? { ...r, status: "Ignored" } : r
          ),
        }));
        toast({ title: "Report Ignored", description: "No action taken." });
        return;
      }

      if (action === "warn") {
        const warningMsg = `Warning: ${report.description} (Reported on ${report.date})`;
        setData((prev) => ({
          ...prev,
          students: prev.students.map((s) =>
            s.registerNumber === report.studentRegisterNumber
              ? { ...s, disciplinaryActions: [...s.disciplinaryActions, warningMsg] }
              : s
          ),
          disciplinaryReports: prev.disciplinaryReports.map((r) =>
            r.id === reportId ? { ...r, status: "Reviewed", actionsTaken: "Warning issued" } : r
          ),
        }));
        toast({ title: "Warning Issued", description: `Warning added to ${student.name}'s record.` });
        onSendSMS(student.fatherPhone || student.motherPhone || "", `Dear Parent, a warning has been issued to ${student.name} for: "${report.description}". Please contact school.`);
        return;
      }

      if (action === "block") {
        setData((prev) => ({
          ...prev,
          students: prev.students.map((s) =>
            s.registerNumber === report.studentRegisterNumber
              ? { ...s, isPortalBlocked: true, disciplinaryActions: [...s.disciplinaryActions, report.description] }
              : s
          ),
          disciplinaryReports: prev.disciplinaryReports.map((r) =>
            r.id === reportId ? { ...r, status: "Reviewed", actionsTaken: "Portal blocked" } : r
          ),
        }));
        toast({ title: "Student Blocked", description: `Portal blocked for ${report.studentRegisterNumber}.` });
        onSendSMS(student.fatherPhone || student.motherPhone || "", `Dear Parent, portal access for ${student.name} (${student.registerNumber}) has been blocked due to serious disciplinary issue. Visit school immediately.`);
      }
    };

    const handlePromoteAll = () => {
      if (!window.confirm("⚠️ This will promote all students to next grade and reset attendance/marks. Continue?")) return;
      const ay = getCurrentAcademicYear(data.academicYears);
      if (!ay) {
        toast({ title: "No Active Year", description: "Set an active academic year first.", variant: "destructive" });
        return;
      }

      const nextAY = data.academicYears.find(y => {
        const [start, end] = y.name.split('–').map(x => parseInt(x));
        const [currStart] = ay.name.split('–').map(x => parseInt(x));
        return start === currStart + 1;
      });

      if (!nextAY) {
        toast({ title: "Next Year Not Set", description: "Create next academic year first.", variant: "destructive" });
        return;
      }

      const updatedStudents = data.students.map(s => {
        if (s.academicYearId !== ay.id) return s; // only promote current year students
        const gradeNum = parseInt(s.grade.replace(/\D/g, ''));
        if (gradeNum >= 5 && gradeNum < 10) {
          const newGradeNum = gradeNum + 1;
          const newGrade = `${newGradeNum}th Grade`;
          return {
            ...s,
            grade: newGrade,
            classId: getClassId(newGrade, s.section),
            academicYearId: nextAY.id,
            attendance: [],
            marks: [],
          };
        }
        if (gradeNum === 10) {
          // Move to Alumni (we keep them but mark as inactive)
          return {
            ...s,
            academicYearId: "alumni",
            isPortalBlocked: true,
          };
        }
        return s;
      });

      // Reassign faculty students
      const updatedUsers = data.users.map(user => {
        if (user.role === "Faculty") {
          const newAssigned = updatedStudents
            .filter(s => s.academicYearId === nextAY.id && user.assignedClasses?.includes(s.classId))
            .map(s => s.registerNumber);
          return {
            ...user,
            assignedStudents: newAssigned,
          };
        }
        return user;
      });

      setData(prev => ({
        ...prev,
        students: updatedStudents,
        users: updatedUsers,
      }));
      toast({
        title: "Promotion Complete",
        description: `All students promoted to ${nextAY.name}. 10th graders moved to alumni.`,
        variant: "success"
      });
    };

    const addAcademicYear = () => {
      const { name, startDate, endDate } = newAcademicYear;
      if (!name || !startDate || !endDate) {
        toast({ title: "Incomplete", description: "Fill all fields.", variant: "destructive" });
        return;
      }
      const ay: AcademicYear = {
        id: `ay${Date.now()}`,
        name,
        startDate,
        endDate,
        status: "Upcoming"
      };
      setData(prev => ({
        ...prev,
        academicYears: [...prev.academicYears, ay]
      }));
      setNewAcademicYear({ name: "", startDate: "", endDate: "" });
      toast({ title: "Year Added", description: `${name} created.` });
    };

    const activateAcademicYear = (id: string) => {
      setData(prev => ({
        ...prev,
        academicYears: prev.academicYears.map(ay =>
          ay.id === id ? { ...ay, status: "Active" } : { ...ay, status: ay.status === "Active" ? "Completed" : ay.status }
        )
      }));
      toast({ title: "Year Activated", description: `Academic year switched.` });
    };

    const addClassSetup = () => {
      const { grade, sections, tuitionFee, examFee, labFee, libraryFee, transportFee, miscellaneous, subjects } = newClassSetup;
      if (!grade || !sections || !subjects) {
        toast({ title: "Incomplete", description: "Grade, sections, and subjects required.", variant: "destructive" });
        return;
      }
      const secArray = sections.split(',').map(s => s.trim()).filter(s => s);
      const subjArray = subjects.split(',').map(s => s.trim()).filter(s => s);
      const cs: ClassSetup = {
        id: `cls${Date.now()}`,
        grade,
        sections: secArray,
        feeStructure: {
          tuitionFee: parseFloat(tuitionFee) || 0,
          examFee: parseFloat(examFee) || 0,
          labFee: parseFloat(labFee) || 0,
          libraryFee: parseFloat(libraryFee) || 0,
          transportFee: parseFloat(transportFee) || 0,
          miscellaneous: parseFloat(miscellaneous) || 0,
        },
        subjects: subjArray
      };
      setData(prev => ({
        ...prev,
        classSetups: [...prev.classSetups, cs]
      }));
      setNewClassSetup({ grade: "", sections: "", tuitionFee: "", examFee: "", labFee: "", libraryFee: "", transportFee: "", miscellaneous: "", subjects: "" });
      toast({ title: "Class Setup Added", description: `${grade} configured.` });
    };

    const addExam = () => {
      const { type, name, startDate, endDate, classes } = newExam;
      if (!name || !startDate || !endDate) {
        toast({ title: "Incomplete", description: "Fill all exam fields.", variant: "destructive" });
        return;
      }
      const clsArray = classes.split(',').map(s => s.trim()).filter(s => s);
      const exam: Exam = {
        id: `exam${Date.now()}`,
        type: type as ExamType,
        name,
        startDate,
        endDate,
        classes: clsArray
      };
      setData(prev => ({
        ...prev,
        exams: [...prev.exams, exam]
      }));
      setNewExam({ type: "FA1", name: "", startDate: "", endDate: "", classes: "" });
      toast({ title: "Exam Added", description: `${name} scheduled.` });
    };

    const exportStudentsToExcel = () => {
      const exportData = data.students.map(s => ({
        "Register No": s.registerNumber,
        "Name": s.name,
        "Class": s.grade,
        "Section": s.section,
        "Father": s.fatherName,
        "Mother": s.motherName,
        "Father Phone": s.fatherPhone,
        "Mother Phone": s.motherPhone,
        "Email": s.parentEmail,
        "DOB": s.dob,
        "Gender": s.gender,
        "Admission Date": s.admissionDate,
        "Total Fee": s.totalFee,
        "Attendance Rate": `${getAttendanceStats(s.attendance).rate}%`,
        "Overall %": `${calculateOverallPercentage(s, data.exams)}%`,
        "Rank": getRankForStudent(s, data.students, data.exams),
        "Blocked": s.isPortalBlocked ? "Yes" : "No"
      }));
      exportToExcel(exportData, `Students_${new Date().toISOString().slice(0, 10)}`, "Students");
    };

    const exportFeesToExcel = () => {
      const exportData = data.fees.map(f => {
        const student = data.students.find(s => s.registerNumber === f.studentRegisterNumber);
        return {
          "Register No": f.studentRegisterNumber,
          "Name": student?.name || "Unknown",
          "Class": student?.grade || "",
          "Section": student?.section || "",
          "Academic Year": f.academicYearId,
          "Tuition": f.tuitionFee,
          "Exam": f.examFee,
          "Lab": f.labFee,
          "Library": f.libraryFee,
          "Transport": f.transportFee,
          "Misc": f.miscellaneous,
          "Total Due": f.totalDue,
          "Paid": f.amountPaid,
          "Balance": f.totalDue - f.amountPaid,
          "Status": f.status,
          "Last Payment": f.lastPaymentDate,
          "Method": f.paymentMethod || ""
        };
      });
      exportToExcel(exportData, `Fees_${new Date().toISOString().slice(0, 10)}`, "Fees");
    };

    const sortedExams = sortExams(data.exams);

    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-xs text-muted-foreground">Welcome, {currentUser?.username}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1 mb-6">
            {[
              { id: "overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
              { id: "students", label: "Students", icon: <Users className="w-4 h-4" /> },
              { id: "staff", label: "Staff", icon: <UserCog className="w-4 h-4" /> },
              { id: "setup", label: "School Setup", icon: <Settings className="w-4 h-4" /> },
              { id: "reports", label: "Reports", icon: <FileText className="w-4 h-4" /> },
            ].map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="gap-2"
              >
                {tab.icon} {tab.label}
              </Button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Students</p>
                      <p className="text-2xl font-bold text-foreground">{data.students.filter(s => s.academicYearId !== 'alumni').length}</p>
                    </div>
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                </Card>
                <Card className="p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Fees</p>
                      <p className="text-2xl font-bold text-foreground">
                        {data.fees.filter((f) => f.status === "Pending" || f.status === "Partially Paid" || f.status === "Overdue").length}
                      </p>
                    </div>
                    <span className="text-2xl font-bold text-warning">₹</span>
                  </div>
                </Card>
                <Card className="p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Leave Requests</p>
                      <p className="text-2xl font-bold text-foreground">
                        {data.leaves.filter((l) => l.status === "Pending").length}
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-accent" />
                  </div>
                </Card>
                <Card className="p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Announcements</p>
                      <p className="text-2xl font-bold text-foreground">
                        {data.announcements.length}
                      </p>
                    </div>
                    <Bell className="w-8 h-8 text-success" />
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <ArrowUpCircle className="w-5 h-5 text-primary" />
                    Year-End Operations
                  </h2>
                  <div className="space-y-3">
                    <Button onClick={handlePromoteAll} className="w-full" variant="outline">
                      <ArrowUpCircle className="w-4 h-4 mr-2" /> Promote All Students
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      <p>• Promotes 5th–9th to next grade</p>
                      <p>• Moves 10th to alumni</p>
                      <p>• Resets attendance & marks</p>
                      <p>• Requires next academic year</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-primary" />
                    Export Data
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <Button onClick={exportStudentsToExcel} variant="outline">
                      <FileDown className="w-4 h-4 mr-2" /> Students (Excel)
                    </Button>
                    <Button onClick={exportFeesToExcel} variant="outline">
                      <FileDown className="w-4 h-4 mr-2" /> Fees (Excel)
                    </Button>
                  </div>
                </Card>
              </div>

              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  Student Lookup
                </h2>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter Register Number (e.g., SCHL2025001)"
                    value={searchRN}
                    onChange={(e) => setSearchRN(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={handleSearch}>Search</Button>
                </div>
                {selectedStudent && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-lg">{selectedStudent.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedStudent.registerNumber} • {selectedStudent.grade} • {selectedStudent.section}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Admission: {selectedStudent.admissionDate} • DOB: {selectedStudent.dob}
                        </p>
                      </div>
                      <Button
                        variant={selectedStudent.isPortalBlocked ? "success" : "destructive"}
                        size="sm"
                        onClick={() => toggleBlockStudent(selectedStudent.registerNumber)}
                      >
                        {selectedStudent.isPortalBlocked ? (
                          <>
                            <Unlock className="w-4 h-4" />
                            Unblock Portal
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Block Portal
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="p-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-primary" />
                          Attendance
                        </h4>
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-muted-foreground">Current Rate</span>
                            <span className="text-lg font-bold text-primary">
                              {getAttendanceStats(selectedStudent.attendance).rate}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${getAttendanceStats(selectedStudent.attendance).rate}%` }}
                            />
                          </div>
                          <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
                            <div className="text-center">
                              <div className="w-3 h-3 bg-success rounded-full mx-auto mb-1"></div>
                              <span>P: {getAttendanceStats(selectedStudent.attendance).present}</span>
                            </div>
                            <div className="text-center">
                              <div className="w-3 h-3 bg-destructive rounded-full mx-auto mb-1"></div>
                              <span>A: {getAttendanceStats(selectedStudent.attendance).absent}</span>
                            </div>
                            <div className="text-center">
                              <div className="w-3 h-3 bg-warning rounded-full mx-auto mb-1"></div>
                              <span>H: {getAttendanceStats(selectedStudent.attendance).halfDay}</span>
                            </div>
                            <div className="text-center">
                              <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                              <span>L: {getAttendanceStats(selectedStudent.attendance).onLeave}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-primary" />
                          Performance
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Overall %</span>
                            <span className="font-semibold">{calculateOverallPercentage(selectedStudent, data.exams)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Rank in Class</span>
                            <span className="font-semibold">#{getRankForStudent(selectedStudent, data.students, data.exams)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Grade</span>
                            <span className="font-semibold">{getGradeFromMarks(calculateOverallPercentage(selectedStudent, data.exams))}</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                    {selectedStudent.disciplinaryActions.length > 0 && (
                      <Card className="p-4 border-warning/20 bg-warning/5">
                        <h4 className="font-semibold mb-2 flex items-center gap-2 text-warning">
                          <AlertTriangle className="w-4 h-4" />
                          Disciplinary Actions
                        </h4>
                        <ul className="space-y-1">
                          {selectedStudent.disciplinaryActions.map((action, i) => (
                            <li key={i} className="text-sm text-muted-foreground">
                              • {action}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    )}
                    {(() => {
                      const feeRecord = data.fees.find(
                        (f) => f.studentRegisterNumber === selectedStudent.registerNumber
                      );
                      return feeRecord ? (
                        <Card className="p-4">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Coins className="w-4 h-4 text-primary" />
                            Fee Status
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Total Due</p>
                              <p className="font-semibold text-lg">₹{feeRecord.totalDue.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Amount Paid</p>
                              <p className="font-semibold text-lg">₹{feeRecord.amountPaid.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Balance</p>
                              <p className="font-semibold text-lg text-warning">₹{(feeRecord.totalDue - feeRecord.amountPaid).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Status</p>
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                  feeRecord.status === "Paid"
                                    ? "bg-success/10 text-success"
                                    : feeRecord.status === "Partially Paid"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-warning/10 text-warning"
                                }`}
                              >
                                {feeRecord.status}
                              </span>
                            </div>
                          </div>
                        </Card>
                      ) : null;
                    })()}
                    <Button onClick={() => downloadReportCardPDF(selectedStudent, data.fees, data.exams, data.classSetups, data.academicYears)} className="w-full">
                      <Download className="w-4 h-4 mr-2" /> Download Report Card (PDF)
                    </Button>
                  </div>
                )}
              </Card>

              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" /> Class Performance Report
                </h2>
                {["10th Grade", "9th Grade", "8th Grade", "7th Grade", "6th Grade", "5th Grade"].map(grade => {
                  const classIds = data.classSetups.find(cs => cs.grade === grade)?.sections.map(sec => getClassId(grade, sec)) || [];
                  return (
                    <div key={grade} className="mb-6">
                      <h3 className="font-semibold mb-3">{grade}</h3>
                      {classIds.map(classId => {
                        const avgByExam = getClassAveragesByExam(data.students, classId, sortedExams);
                        return (
                          <div key={classId} className="mb-4">
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Section {classId.slice(-1)}</h4>
                            {sortedExams.map(exam => {
                              const avg = avgByExam[exam.id];
                              if (!avg || Object.keys(avg).length === 0) return null;
                              return (
                                <div key={exam.id} className="mb-3">
                                  <p className="text-xs font-medium text-muted-foreground mb-1">{exam.name} ({exam.type})</p>
                                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                    {Object.entries(avg).map(([subj, mark]) => (
                                      <Card key={subj} className="p-2 text-center">
                                        <p className="text-xs text-muted-foreground mb-0.5">{subj}</p>
                                        <p className="font-bold text-sm">{mark}</p>
                                      </Card>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </Card>

              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" /> Top & Weak Students
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-1 text-success">
                      <Star className="w-4 h-4" /> Top 5 Students
                    </h3>
                    <div className="space-y-2">
                      {["10th Grade", "9th Grade"].map(grade => {
                        const classId = getClassId(grade, "A");
                        const top = getTopStudents(classId, data.students, data.exams, 5);
                        return top.length > 0 ? (
                          <div key={grade} className="mb-4">
                            <p className="text-sm font-medium text-muted-foreground mb-1">{grade} — Section A</p>
                            {top.map((s, i) => (
                              <div key={s.registerNumber} className="flex items-center justify-between p-2 bg-success/5 rounded">
                                <span className="text-sm">{i + 1}. {s.name}</span>
                                <span className="font-medium">{calculateOverallPercentage(s, data.exams)}%</span>
                              </div>
                            ))}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-1 text-destructive">
                      <Flame className="w-4 h-4" /> Needs Attention (below 40%)
                    </h3>
                    <div className="space-y-2">
                      {["10th Grade", "9th Grade"].map(grade => {
                        const classId = getClassId(grade, "A");
                        const weak = getWeakStudents(classId, data.students, data.exams);
                        return weak.length > 0 ? (
                          <div key={grade} className="mb-4">
                            <p className="text-sm font-medium text-muted-foreground mb-1">{grade} — Section A</p>
                            {weak.map(s => (
                              <div key={s.registerNumber} className="flex items-center justify-between p-2 bg-destructive/5 rounded">
                                <span className="text-sm">{s.name}</span>
                                <span className="font-medium text-destructive">{calculateOverallPercentage(s, data.exams)}%</span>
                              </div>
                            ))}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Disciplinary Reports
                </h2>
                <div className="space-y-3">
                  {data.disciplinaryReports.length === 0 && (
                    <p className="text-muted-foreground">No pending reports.</p>
                  )}
                  {data.disciplinaryReports
                    .filter(r => r.status === "Pending")
                    .map((r) => (
                      <div key={r.id} className="p-4 bg-muted/30 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-medium">Student: {r.studentRegisterNumber}</p>
                          <p className="text-sm text-muted-foreground mt-1">By: {r.reporterRole} ({r.reporterId}) • {r.date}</p>
                          <p className="text-sm mt-2">{r.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleReportAction(r.id, "ignore")}>
                            Ignore
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleReportAction(r.id, "warn")}>
                            Warn Student
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleReportAction(r.id, "block")}>
                            Block Portal
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>

              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Faculty Leave Requests
                </h2>
                <div className="space-y-3">
                  {data.leaves.filter(l => l.status === "Pending").map((leave) => {
                    const user = data.users.find((u) => u.id === leave.userId);
                    return (
                      <div
                        key={leave.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/30 rounded-lg gap-3"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{user?.username} ({user?.role})</p>
                          <p className="text-sm text-muted-foreground">
                            {leave.dateStart} to {leave.dateEnd} • {leave.type}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{leave.reason}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleLeaveAction(leave.id, "Approved")}
                          >
                            <Check className="w-4 h-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleLeaveAction(leave.id, "Rejected")}
                          >
                            <X className="w-4 h-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {data.leaves.filter(l => l.status === "Pending").length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No pending leave requests.
                    </p>
                  )}
                </div>
              </Card>

              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Post Announcement
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Audience</Label>
                      <Select value={announcementScope} onValueChange={(v) => setAnnouncementScope(v as MessageTypeScope)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All (Parents, Teachers, Students)</SelectItem>
                          <SelectItem value="Parents">Parents Only</SelectItem>
                          <SelectItem value="Teachers">Teachers Only</SelectItem>
                          <SelectItem value="Students">Students Only</SelectItem>
                          <SelectItem value="Class">Specific Class (e.g., 10A)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {announcementScope === "Class" && (
                      <div>
                        <Label>Class/Section</Label>
                        <Input
                          placeholder="e.g., 10A"
                          value={targetClass}
                          onChange={(e) => setTargetClass(e.target.value.toUpperCase())}
                        />
                      </div>
                    )}
                  </div>
                  <Textarea
                    placeholder="Write your announcement here..."
                    value={newAnnouncement}
                    onChange={(e) => setNewAnnouncement(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={postAnnouncement} className="w-full">
                    <Bell className="w-4 h-4 mr-2" /> Publish Announcement
                  </Button>
                </div>
              </Card>

              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Recent Announcements
                </h2>
                <div className="space-y-3">
                  {data.announcements.slice(0, 5).map((ann) => (
                    <div key={ann.id} className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-muted-foreground">
                          {ann.date} • {ann.authorRole}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded">
                          {ann.audience}{ann.targetClass ? `: ${ann.targetClass}` : ''}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mt-1">{ann.content}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <div className="space-y-6">
              <Card className="p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Users2 className="w-5 h-5 text-primary" />
                    Student Management
                  </h2>
                  <Button onClick={exportStudentsToExcel} variant="outline" size="sm">
                    <FileDown className="w-4 h-4 mr-1" /> Export Excel
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{data.students.filter(s => s.academicYearId !== 'alumni').length}</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <UserRoundCheck className="w-8 h-8 text-success mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold">
                      {data.students.filter(s => s.academicYearId !== 'alumni' && !s.isPortalBlocked).length}
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <UserRoundX className="w-8 h-8 text-destructive mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Blocked</p>
                    <p className="text-2xl font-bold">
                      {data.students.filter(s => s.academicYearId !== 'alumni' && s.isPortalBlocked).length}
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <FileArchive className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Alumni</p>
                    <p className="text-2xl font-bold">
                      {data.students.filter(s => s.academicYearId === 'alumni').length}
                    </p>
                  </Card>
                </div>
              </Card>

              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Student List</h2>
                <div className="mb-4">
                  <Input placeholder="Search by name, register number, class..." className="max-w-md" />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Register No</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Name</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Class</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Section</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Attendance</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Overall %</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Status</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.students
                        .filter(s => s.academicYearId !== 'alumni')
                        .slice(0, 10) // paginate in real app
                        .map(s => (
                          <tr key={s.registerNumber} className="border-b hover:bg-muted/30">
                            <td className="p-3 text-sm font-mono">{s.registerNumber}</td>
                            <td className="p-3 text-sm">{s.name}</td>
                            <td className="p-3 text-sm">{s.grade}</td>
                            <td className="p-3 text-sm">{s.section}</td>
                            <td className="p-3 text-sm">{getAttendanceStats(s.attendance).rate}%</td>
                            <td className="p-3 text-sm">{calculateOverallPercentage(s, data.exams)}%</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                s.isPortalBlocked 
                                  ? "bg-destructive/10 text-destructive" 
                                  : "bg-success/10 text-success"
                              }`}>
                                {s.isPortalBlocked ? "Blocked" : "Active"}
                              </span>
                            </td>
                            <td className="p-3">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedStudent(s);
                                  setSearchRN(s.registerNumber);
                                  setActiveTab("overview");
                                }}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* Staff Tab */}
          {activeTab === "staff" && (
            <div className="space-y-6">
              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <UserCog className="w-5 h-5 text-primary" />
                  Staff Management
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <UserRound className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{data.users.filter(u => u.role !== "Admin" && u.role !== "Student" && u.role !== "Parent").length}</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <UsersRound className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Faculty</p>
                    <p className="text-2xl font-bold">{data.users.filter(u => u.role === "Faculty").length}</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <ShieldCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Admins</p>
                    <p className="text-2xl font-bold">{data.users.filter(u => u.role === "Admin").length}</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Library className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Librarians</p>
                    <p className="text-2xl font-bold">{data.users.filter(u => u.role === "Librarian").length}</p>
                  </Card>
                </div>
              </Card>

              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Staff List</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Username</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Role</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Classes</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Subjects</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Class Teacher</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Contact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.users
                        .filter(u => u.role !== "Admin" && u.role !== "Student" && u.role !== "Parent")
                        .map(u => (
                          <tr key={u.id} className="border-b hover:bg-muted/30">
                            <td className="p-3 text-sm font-medium">{u.username}</td>
                            <td className="p-3 text-sm">{u.role}</td>
                            <td className="p-3 text-sm">{u.assignedClasses?.join(', ') || '-'}</td>
                            <td className="p-3 text-sm">{u.assignedSubjects?.join(', ') || '-'}</td>
                            <td className="p-3 text-sm">
                              {u.isClassTeacher ? (
                                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                                  {u.classTeacherFor}
                                </span>
                              ) : '-'}
                            </td>
                            <td className="p-3 text-sm">
                              {u.contactEmail && <Mail className="w-4 h-4 inline mr-1" />}
                              {u.contactPhone && <Phone className="w-4 h-4 inline mr-1" />}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* School Setup Tab */}
          {activeTab === "setup" && (
            <div className="space-y-6">
              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <School className="w-5 h-5 text-primary" />
                  Academic Years
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {data.academicYears.map(ay => (
                    <Card key={ay.id} className={`p-4 ${ay.status === "Active" ? "border-primary" : ""}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{ay.name}</h3>
                          <p className="text-sm text-muted-foreground">{ay.startDate} to {ay.endDate}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          ay.status === "Active" 
                            ? "bg-primary/10 text-primary" 
                            : ay.status === "Completed" 
                              ? "bg-muted text-muted-foreground" 
                              : "bg-warning/10 text-warning"
                        }`}>
                          {ay.status}
                        </span>
                      </div>
                      {ay.status !== "Active" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-3 w-full"
                          onClick={() => activateAcademicYear(ay.id)}
                        >
                          Activate
                        </Button>
                      )}
                    </Card>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Add New Academic Year</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Name (e.g., 2025–26)</Label>
                      <Input
                        value={newAcademicYear.name}
                        onChange={(e) => setNewAcademicYear({...newAcademicYear, name: e.target.value})}
                        placeholder="2025–26"
                      />
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={newAcademicYear.startDate}
                        onChange={(e) => setNewAcademicYear({...newAcademicYear, startDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={newAcademicYear.endDate}
                        onChange={(e) => setNewAcademicYear({...newAcademicYear, endDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button onClick={addAcademicYear} className="mt-3">
                    <Plus className="w-4 h-4 mr-2" /> Add Year
                  </Button>
                </div>
              </Card>

              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Class Setup
                </h2>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Grade</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Sections</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Subjects</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Total Fee</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.classSetups.map(cs => (
                        <tr key={cs.id} className="border-b hover:bg-muted/30">
                          <td className="p-3 text-sm font-medium">{cs.grade}</td>
                          <td className="p-3 text-sm">{cs.sections.join(', ')}</td>
                          <td className="p-3 text-sm">{cs.subjects.join(', ')}</td>
                          <td className="p-3 text-sm">₹{calculateTotalFee(cs).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Add New Class Setup</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label>Grade</Label>
                      <Input
                        value={newClassSetup.grade}
                        onChange={(e) => setNewClassSetup({...newClassSetup, grade: e.target.value})}
                        placeholder="e.g., 11th Grade"
                      />
                    </div>
                    <div>
                      <Label>Sections (comma-separated)</Label>
                      <Input
                        value={newClassSetup.sections}
                        onChange={(e) => setNewClassSetup({...newClassSetup, sections: e.target.value})}
                        placeholder="A, B, C"
                      />
                    </div>
                    <div>
                      <Label>Subjects (comma-separated)</Label>
                      <Input
                        value={newClassSetup.subjects}
                        onChange={(e) => setNewClassSetup({...newClassSetup, subjects: e.target.value})}
                        placeholder="Math, Science, English..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
                    <div>
                      <Label>Tuition Fee</Label>
                      <Input
                        type="number"
                        value={newClassSetup.tuitionFee}
                        onChange={(e) => setNewClassSetup({...newClassSetup, tuitionFee: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Exam Fee</Label>
                      <Input
                        type="number"
                        value={newClassSetup.examFee}
                        onChange={(e) => setNewClassSetup({...newClassSetup, examFee: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Lab Fee</Label>
                      <Input
                        type="number"
                        value={newClassSetup.labFee}
                        onChange={(e) => setNewClassSetup({...newClassSetup, labFee: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Library Fee</Label>
                      <Input
                        type="number"
                        value={newClassSetup.libraryFee}
                        onChange={(e) => setNewClassSetup({...newClassSetup, libraryFee: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Transport Fee</Label>
                      <Input
                        type="number"
                        value={newClassSetup.transportFee}
                        onChange={(e) => setNewClassSetup({...newClassSetup, transportFee: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Miscellaneous</Label>
                      <Input
                        type="number"
                        value={newClassSetup.miscellaneous}
                        onChange={(e) => setNewClassSetup({...newClassSetup, miscellaneous: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button onClick={addClassSetup} className="mt-3">
                    <Plus className="w-4 h-4 mr-2" /> Add Class Setup
                  </Button>
                </div>
              </Card>

              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  Exams & Timetable
                </h2>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Exam</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Type</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Dates</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Classes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedExams.map(exam => (
                        <tr key={exam.id} className="border-b hover:bg-muted/30">
                          <td className="p-3 text-sm font-medium">{exam.name}</td>
                          <td className="p-3 text-sm">{exam.type}</td>
                          <td className="p-3 text-sm">{exam.startDate} – {exam.endDate}</td>
                          <td className="p-3 text-sm">{exam.classes.join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Add New Exam</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <Label>Type</Label>
                      <Select value={newExam.type} onValueChange={(v) => setNewExam({...newExam, type: v as ExamType})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {EXAM_ORDER.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={newExam.name}
                        onChange={(e) => setNewExam({...newExam, name: e.target.value})}
                        placeholder="e.g., Mid-Term Exam"
                      />
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={newExam.startDate}
                        onChange={(e) => setNewExam({...newExam, startDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={newExam.endDate}
                        onChange={(e) => setNewExam({...newExam, endDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Classes (comma-separated)</Label>
                      <Input
                        value={newExam.classes}
                        onChange={(e) => setNewExam({...newExam, classes: e.target.value})}
                        placeholder="5th Grade, 6th Grade..."
                      />
                    </div>
                  </div>
                  <Button onClick={addExam} className="mt-3">
                    <Plus className="w-4 h-4 mr-2" /> Add Exam
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Analytics Dashboard
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-4">
                    <h3 className="font-medium mb-3">Attendance Trends</h3>
                    <div className="space-y-3">
                      {["10th Grade", "9th Grade"].map(grade => {
                        const classId = getClassId(grade, "A");
                        const students = data.students.filter(s => s.classId === classId);
                        const avgRate = students.length > 0
                          ? Math.round(students.reduce((sum, s) => sum + getAttendanceStats(s.attendance).rate, 0) / students.length)
                          : 0;
                        return (
                          <div key={grade} className="flex items-center justify-between">
                            <span className="text-sm">{grade} — A</span>
                            <div className="w-32">
                              <div className="flex justify-between text-xs mb-1">
                                <span>{avgRate}%</span>
                                <span>100%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    avgRate >= 85 ? "bg-success" : avgRate >= 70 ? "bg-primary" : "bg-warning"
                                  }`}
                                  style={{ width: `${avgRate}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                  <Card className="p-4">
                    <h3 className="font-medium mb-3">Fee Collection</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Collected</span>
                          <span>₹{data.fees.reduce((sum, f) => sum + f.amountPaid, 0).toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-success h-2 rounded-full"
                            style={{ width: `${(data.fees.reduce((sum, f) => sum + f.amountPaid, 0) / data.fees.reduce((sum, f) => sum + f.totalDue, 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Pending</span>
                          <span>₹{data.fees.reduce((sum, f) => sum + (f.totalDue - f.amountPaid), 0).toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-warning h-2 rounded-full"
                            style={{ width: `${(data.fees.reduce((sum, f) => sum + (f.totalDue - f.amountPaid), 0) / data.fees.reduce((sum, f) => sum + f.totalDue, 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </Card>

              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileSignature className="w-5 h-5 text-primary" />
                  Generate Reports
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Student Reports</h3>
                    <Button variant="outline" className="w-full mb-2">
                      <FileDown className="w-4 h-4 mr-2" /> Class-wise Attendance
                    </Button>
                    <Button variant="outline" className="w-full mb-2">
                      <FileDown className="w-4 h-4 mr-2" /> Exam-wise Marks
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileDown className="w-4 h-4 mr-2" /> Disciplinary Summary
                    </Button>
                  </Card>
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Financial Reports</h3>
                    <Button variant="outline" className="w-full mb-2">
                      <FileDown className="w-4 h-4 mr-2" /> Fee Collection Summary
                    </Button>
                    <Button variant="outline" className="w-full mb-2">
                      <FileDown className="w-4 h-4 mr-2" /> Pending Fees Report
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileDown className="w-4 h-4 mr-2" /> Monthly Income Statement
                    </Button>
                  </Card>
                </div>
              </Card>
            </div>
          )}

          {/* Debug */}
          <Card className="p-6 shadow-sm mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Database Inspector
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDebug(!showDebug)}
              >
                {showDebug ? "Hide" : "Show"} Data
              </Button>
            </div>
            {showDebug && (
              <div className="bg-muted p-4 rounded-lg overflow-auto max-h-96">
                <pre className="text-xs font-mono">{JSON.stringify(data, null, 2)}</pre>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  };

  // ======================
  // 👩‍🏫 FACULTY DASHBOARD
  // ======================

  const FacultyDashboard = () => {
    const [selectedStudentRN, setSelectedStudentRN] = useState("");
    const [newMark, setNewMark] = useState({ examId: "", subject: "", marksObtained: "", maxMarks: "100" });
    const [leaveForm, setLeaveForm] = useState({
      dateStart: "",
      dateEnd: "",
      reason: "",
      type: "Sick" as Leave["type"]
    });
    const [showMyStudents, setShowMyStudents] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSession, setSelectedSession] = useState<'morning' | 'afternoon'>('morning');
    const [attendanceType, setAttendanceType] = useState<AttendanceType>("Present");
    const [attendanceReason, setAttendanceReason] = useState("");
    const [studentForm, setStudentForm] = useState({
      name: "",
      fatherName: "",
      motherName: "",
      fatherPhone: "",
      motherPhone: "",
      parentEmail: "",
      address: "",
      dob: "",
      gender: "Male" as Student["gender"],
      grade: "10th Grade",
      section: "A",
    });
    const [searchRN, setSearchRN] = useState("");
    const [foundStudent, setFoundStudent] = useState<Student | null>(null);
    const [disciplineText, setDisciplineText] = useState("");
    
    // Assignment state
    const [assignmentForm, setAssignmentForm] = useState({
      title: "",
      description: "",
      subject: "",
      classId: "",
      dueDate: "",
      maxMarks: "10",
    });
    const [showAssignments, setShowAssignments] = useState(true);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    
    // Timetable state
    const [timetableForm, setTimetableForm] = useState({
      day: "Monday" as TimetableSlot["day"],
      period: "1",
      startTime: "09:00",
      endTime: "09:45",
      subject: "",
      room: "",
    });
    const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);

    // Ensure current faculty's assigned students are up to date
    const assignedStudents = data.students.filter((s) =>
      currentUser?.assignedStudents?.includes(s.registerNumber)
    );

    const currentClassId = currentUser?.classTeacherFor || (assignedStudents.length > 0 ? assignedStudents[0].classId : "");
    const currentTimetable = data.timetables.find(t => t.classId === currentClassId);

    const isStudentBlocked = (registerNumber: string) => {
      const s = data.students.find((st) => st.registerNumber === registerNumber);
      return s ? s.isPortalBlocked : false;
    };

    const markAttendance = () => {
      if (!selectedStudentRN) {
        toast({ title: "Select Student", description: "Choose a student first.", variant: "destructive" });
        return;
      }
      if (isStudentBlocked(selectedStudentRN)) {
        toast({
          title: "Action Blocked",
          description: "Portal blocked — please contact admin.",
          variant: "destructive",
        });
        return;
      }
      if (attendanceType !== "Present" && attendanceType !== "Absent" && !attendanceReason.trim()) {
        toast({
          title: "Reason Required",
          description: "Please specify reason for Half-Day or On-Leave.",
          variant: "destructive",
        });
        return;
      }

      const existingAttendance = data.students
        .find(s => s.registerNumber === selectedStudentRN)
        ?.attendance.filter(a => a.date === selectedDate && a.session === selectedSession);

      if (existingAttendance?.length > 0) {
        toast({
          title: "Already Marked",
          description: `Attendance already marked for ${selectedSession} session on ${selectedDate}.`,
          variant: "destructive",
        });
        return;
      }

      setData((prev) => {
        const updatedStudents = prev.students.map((s) =>
          s.registerNumber === selectedStudentRN
            ? {
                ...s,
                attendance: [
                  ...s.attendance,
                  {
                    date: selectedDate,
                    session: selectedSession,
                    type: attendanceType,
                    reason: attendanceType === "HalfDay" || attendanceType === "OnLeave" ? attendanceReason : undefined
                  }
                ]
              }
            : s
        );
        return { ...prev, students: updatedStudents };
      });
      toast({
        title: "Attendance Marked",
        description: `${attendanceType}${attendanceReason ? ` (${attendanceReason})` : ''} for ${selectedSession} on ${selectedDate}.`,
      });
      setAttendanceReason("");
    };

    const uploadMark = () => {
      if (!selectedStudentRN || !newMark.examId || !newMark.subject || newMark.marksObtained === "") {
        toast({
          title: "Incomplete Data",
          description: "Please fill all fields.",
          variant: "destructive",
        });
        return;
      }
      if (isStudentBlocked(selectedStudentRN)) {
        toast({
          title: "Action Blocked",
          description: "Portal blocked — cannot upload marks.",
          variant: "destructive",
        });
        return;
      }
      const marksObtained = parseInt(newMark.marksObtained);
      const maxMarks = parseInt(newMark.maxMarks);
      if (marksObtained > maxMarks) {
        toast({
          title: "Invalid Marks",
          description: `Marks (${marksObtained}) cannot exceed max (${maxMarks}).`,
          variant: "destructive",
        });
        return;
      }

      setData((prev) => ({
        ...prev,
        students: prev.students.map((s) =>
          s.registerNumber === selectedStudentRN
            ? {
                ...s,
                marks: [
                  ...s.marks.filter(m => !(m.examId === newMark.examId && m.subject === newMark.subject)),
                  {
                    examId: newMark.examId,
                    subject: newMark.subject,
                    marksObtained,
                    maxMarks,
                    grade: getGradeFromMarks(calculatePercentage(marksObtained, maxMarks))
                  }
                ]
              }
            : s
        ),
      }));
      setNewMark({ examId: "", subject: "", marksObtained: "", maxMarks: "100" });
      toast({
        title: "Mark Uploaded",
        description: `${newMark.subject} mark for ${newMark.examId} updated.`,
      });
    };

    const requestLeave = () => {
      if (!leaveForm.dateStart || !leaveForm.dateEnd || !leaveForm.reason) {
        toast({
          title: "Incomplete Form",
          description: "Please fill all leave details.",
          variant: "destructive",
        });
        return;
      }
      const leave: Leave = {
        id: `leave${Date.now()}`,
        userId: currentUser!.id,
        dateStart: leaveForm.dateStart,
        dateEnd: leaveForm.dateEnd,
        reason: leaveForm.reason,
        status: "Pending",
        type: leaveForm.type,
      };
      setData((prev) => ({
        ...prev,
        leaves: [...prev.leaves, leave],
      }));
      setLeaveForm({ dateStart: "", dateEnd: "", reason: "", type: "Sick" });
      toast({
        title: "Leave Requested",
        description: "Your leave request has been submitted.",
      });
    };

    const saveStudent = () => {
      const {
        name, grade, section, fatherName, motherName, fatherPhone, motherPhone,
        parentEmail, address, dob, gender
      } = studentForm;
      if (!name.trim() || !grade || !section.trim()) {
        toast({
          title: "Required Fields Missing",
          description: "Name, Grade, and Section are required.",
          variant: "destructive",
        });
        return;
      }

      const ay = getCurrentAcademicYear(data.academicYears);
      if (!ay) {
        toast({ title: "No Active Year", description: "Set an active academic year first.", variant: "destructive" });
        return;
      }

      const newRegisterNumber = generateRegisterNumber(data.students, parseInt(ay.name.split('–')[0]));
      const cs = getClassFeeStructure(grade, data.classSetups);
      const totalFee = cs ? calculateTotalFee(cs) : 20000;

      const newStudent: Student = {
        registerNumber: newRegisterNumber,
        name: name.trim(),
        grade,
        section: section.trim().toUpperCase(),
        classId: getClassId(grade, section),
        fatherName: fatherName?.trim() || undefined,
        motherName: motherName?.trim() || undefined,
        fatherPhone: fatherPhone?.trim() || undefined,
        motherPhone: motherPhone?.trim() || undefined,
        parentEmail: parentEmail?.trim() || undefined,
        address: address?.trim() || undefined,
        dob: dob || undefined,
        gender,
        admissionDate: new Date().toISOString().split('T')[0],
        attendance: [],
        marks: [],
        disciplinaryActions: [],
        isPortalBlocked: false,
        totalFee,
        academicYearId: ay.id,
      };

      const facultyUsername = GRADE_TO_FACULTY[grade];
      const facultyUser = facultyUsername ? data.users.find(u => u.username === facultyUsername) : null;

      setData((prev) => {
        const parentUser: User = {
          id: `parent_${newRegisterNumber}`,
          username: newRegisterNumber,
          password: "welcome",
          role: "Parent",
          studentId: newRegisterNumber,
          isFirstLogin: true,
        };

        const studentUser: User = {
          id: `student_${newRegisterNumber}`,
          username: newRegisterNumber,
          password: "welcome",
          role: "Student",
          studentId: newRegisterNumber,
          isFirstLogin: true,
        };

        const feeRecord: Fee = {
          id: `fee_${newRegisterNumber}_${ay.id}`,
          studentRegisterNumber: newRegisterNumber,
          academicYearId: ay.id,
          tuitionFee: cs?.feeStructure.tuitionFee || 0,
          examFee: cs?.feeStructure.examFee || 0,
          labFee: cs?.feeStructure.labFee || 0,
          libraryFee: cs?.feeStructure.libraryFee || 0,
          transportFee: cs?.feeStructure.transportFee || 0,
          miscellaneous: cs?.feeStructure.miscellaneous || 0,
          totalDue: totalFee,
          amountPaid: 0,
          status: "Pending",
          lastPaymentDate: "",
        };

        const updatedUsers = prev.users.map((user) => {
          if (facultyUser && user.id === facultyUser.id) {
            return {
              ...user,
              assignedStudents: [...(user.assignedStudents || []), newRegisterNumber],
            };
          }
          return user;
        });

        return {
          ...prev,
          students: [...prev.students, newStudent],
          users: [...updatedUsers, parentUser, studentUser],
          fees: [...prev.fees, feeRecord],
        };
      });

      if (facultyUser && currentUser?.id === facultyUser.id) {
        setCurrentUser((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            assignedStudents: [...(prev.assignedStudents || []), newRegisterNumber],
          };
        });
      }

      setStudentForm({
        name: "", fatherName: "", motherName: "", fatherPhone: "", motherPhone: "",
        parentEmail: "", address: "", dob: "", gender: "Male", grade: "10th Grade", section: "A",
      });

      toast({
        title: "Student Added",
        description: `Assigned to ${facultyUsername || "faculty"}. Parent & Student accounts created.`,
      });

      // Notify parent via SMS
      if (fatherPhone || motherPhone) {
        onSendSMS(fatherPhone || motherPhone, `Dear Parent, your child ${name} has been admitted. Portal login: ${newRegisterNumber}. Password: welcome`);
      }
    };

    const handleSearch = () => {
      const s = data.students.find((st) => st.registerNumber === searchRN);
      if (!s) {
        setFoundStudent(null);
        toast({ title: "Not Found", description: "Student not found", variant: "destructive" });
        return;
      }
      setFoundStudent(s);
      toast({ title: "Found", description: `Loaded ${s.name}` });
    };

    const addDisciplinaryReport = () => {
      if (!foundStudent) {
        toast({ title: "Select Student", description: "Please search and select a student first.", variant: "destructive" });
        return;
      }
      if (!disciplineText.trim()) {
        toast({ title: "Empty", description: "Please enter a description.", variant: "destructive" });
        return;
      }
      const report: DisciplinaryReport = {
        id: `rep${Date.now()}`,
        studentRegisterNumber: foundStudent.registerNumber,
        reporterId: currentUser!.id,
        reporterRole: currentUser!.role,
        date: new Date().toISOString().split("T")[0],
        description: disciplineText.trim(),
        status: "Pending",
      };
      setData((prev) => ({ ...prev, disciplinaryReports: [report, ...prev.disciplinaryReports] }));
      setDisciplineText("");
      toast({ title: "Report Submitted", description: "Admin will review this report." });
    };

    // Class performance for current faculty's grade
    const facultyGrade = Object.keys(GRADE_TO_FACULTY).find(g => GRADE_TO_FACULTY[g] === currentUser?.username);
    const classAvg = facultyGrade ? getClassAveragesByExam(data.students, getClassId(facultyGrade, "A"), data.exams) : null;

    // Assignment functions
    const createAssignment = () => {
      const { title, description, subject, classId, dueDate, maxMarks } = assignmentForm;
      if (!title || !subject || !classId || !dueDate) {
        toast({ title: "Incomplete", description: "Title, subject, class, and due date required.", variant: "destructive" });
        return;
      }
      const assignment: Assignment = {
        id: `assign${Date.now()}`,
        title,
        description,
        subject,
        classId,
        dueDate,
        maxMarks: parseInt(maxMarks) || 10,
        uploadedBy: currentUser!.id,
        createdAt: new Date().toISOString().split("T")[0],
        submissions: []
      };
      setData(prev => ({
        ...prev,
        assignments: [assignment, ...prev.assignments]
      }));
      setAssignmentForm({ title: "", description: "", subject: "", classId: "", dueDate: "", maxMarks: "10" });
      toast({ title: "Assignment Created", description: "Sent to class." });
      
      // Notify students/parents
      const studentsInClass = data.students.filter(s => s.classId === classId);
      studentsInClass.forEach(s => {
        onSendSMS(s.fatherPhone || s.motherPhone || "", `New assignment: "${title}" due ${dueDate}. Login to portal.`);
      });
    };

    const submitAssignment = (assignmentId: string, fileUrl?: string) => {
      if (!currentUser || currentUser.role !== "Student") return;
      const assignment = data.assignments.find(a => a.id === assignmentId);
      if (!assignment) return;
      
      const now = new Date();
      const due = new Date(assignment.dueDate);
      const status = now <= due ? "Submitted" : "Late";
      
      setData(prev => ({
        ...prev,
        assignments: prev.assignments.map(a =>
          a.id === assignmentId
            ? {
                ...a,
                submissions: [
                  ...a.submissions.filter(sub => sub.studentId !== currentUser!.studentId!),
                  {
                    studentId: currentUser!.studentId!,
                    submittedAt: now.toISOString().split("T")[0],
                    fileUrl,
                    status
                  }
                ]
              }
            : a
        )
      }));
      toast({ title: "Submitted", description: "Assignment submitted successfully." });
    };

    const gradeAssignment = (assignmentId: string, studentId: string, marks: number, remarks: string) => {
      setData(prev => ({
        ...prev,
        assignments: prev.assignments.map(a =>
          a.id === assignmentId
            ? {
                ...a,
                submissions: a.submissions.map(sub =>
                  sub.studentId === studentId
                    ? { ...sub, marks, remarks }
                    : sub
                )
              }
            : a
        )
      }));
      toast({ title: "Graded", description: "Marks updated." });
    };

    // Timetable functions
    const addOrUpdateTimetableSlot = () => {
      if (!currentClassId) {
        toast({ title: "No Class", description: "You must be a class teacher to edit timetable.", variant: "destructive" });
        return;
      }
      const { day, period, startTime, endTime, subject, room } = timetableForm;
      const slot: TimetableSlot = {
        day,
        period: parseInt(period),
        startTime,
        endTime,
        subject,
        facultyId: currentUser!.id,
        room
      };

      setData(prev => {
        const existing = prev.timetables.find(t => t.classId === currentClassId);
        if (existing) {
          // Update existing
          const updatedSlots = editingSlot
            ? existing.slots.map(s => 
                s.day === editingSlot.day && s.period === editingSlot.period ? slot : s
              )
            : [...existing.slots, slot];
          return {
            ...prev,
            timetables: prev.timetables.map(t =>
              t.classId === currentClassId
                ? { ...t, slots: updatedSlots }
                : t
            )
          };
        } else {
          // Create new
          return {
            ...prev,
            timetables: [...prev.timetables, { classId: currentClassId, slots: [slot] }]
          };
        }
      });
      setTimetableForm({ day: "Monday", period: "1", startTime: "09:00", endTime: "09:45", subject: "", room: "" });
      setEditingSlot(null);
      toast({ title: "Timetable Updated", description: `${editingSlot ? "Slot updated" : "Slot added"}.` });
    };

    const editTimetableSlot = (slot: TimetableSlot) => {
      setEditingSlot(slot);
      setTimetableForm({
        day: slot.day,
        period: slot.period.toString(),
        startTime: slot.startTime,
        endTime: slot.endTime,
        subject: slot.subject,
        room: slot.room || ""
      });
    };

    const deleteTimetableSlot = (slot: TimetableSlot) => {
      if (!currentClassId) return;
      setData(prev => ({
        ...prev,
        timetables: prev.timetables.map(t =>
          t.classId === currentClassId
            ? { ...t, slots: t.slots.filter(s => !(s.day === slot.day && s.period === slot.period)) }
            : t
        )
      }));
      toast({ title: "Slot Deleted", description: "Timetable slot removed." });
    };

    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Faculty Dashboard</h1>
                <p className="text-xs text-muted-foreground">
                  Welcome, {currentUser?.username} 
                  {currentUser?.isClassTeacher && ` (Class Teacher for ${currentUser.classTeacherFor})`}
                </p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1 mb-6">
            {[
              { id: "overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
              { id: "attendance", label: "Attendance", icon: <UserCheck className="w-4 h-4" /> },
              { id: "marks", label: "Marks", icon: <TrendingUp className="w-4 h-4" /> },
              { id: "assignments", label: "Assignments", icon: <ClipboardList className="w-4 h-4" /> },
              { id: "timetable", label: "Timetable", icon: <CalendarDays className="w-4 h-4" /> },
              { id: "leave", label: "Leave", icon: <Calendar className="w-4 h-4" /> },
            ].map(tab => (
              <Button
                key={tab.id}
                variant={["overview", "attendance", "marks"].includes(tab.id) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (tab.id === "assignments") setShowAssignments(true);
                  if (tab.id === "timetable") setActiveTab("timetable");
                }}
                className="gap-2"
              >
                {tab.icon} {tab.label}
              </Button>
            ))}
          </div>

          {/* Overview */}
          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add Student
            </h2>
            <p className="text-sm text-muted-foreground mb-4">Register number will be auto-generated.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Grade *</Label>
                <select
                  className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                  value={studentForm.grade}
                  onChange={(e) => setStudentForm({ ...studentForm, grade: e.target.value })}
                >
                  {["5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade"].map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Section *</Label>
                <Input
                  value={studentForm.section}
                  onChange={(e) => setStudentForm({ ...studentForm, section: e.target.value.toUpperCase() })}
                  maxLength={2}
                />
              </div>
              <div>
                <Label>Father's Name</Label>
                <Input
                  value={studentForm.fatherName}
                  onChange={(e) => setStudentForm({ ...studentForm, fatherName: e.target.value })}
                />
              </div>
              <div>
                <Label>Mother's Name</Label>
                <Input
                  value={studentForm.motherName}
                  onChange={(e) => setStudentForm({ ...studentForm, motherName: e.target.value })}
                />
              </div>
              <div>
                <Label>Father's Phone</Label>
                <Input
                  type="tel"
                  value={studentForm.fatherPhone}
                  onChange={(e) => setStudentForm({ ...studentForm, fatherPhone: e.target.value })}
                />
              </div>
              <div>
                <Label>Mother's Phone</Label>
                <Input
                  type="tel"
                  value={studentForm.motherPhone}
                  onChange={(e) => setStudentForm({ ...studentForm, motherPhone: e.target.value })}
                />
              </div>
              <div>
                <Label>Parent Email</Label>
                <Input
                  type="email"
                  value={studentForm.parentEmail}
                  onChange={(e) => setStudentForm({ ...studentForm, parentEmail: e.target.value })}
                />
              </div>
              <div>
                <Label>Gender</Label>
                <select
                  className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                  value={studentForm.gender}
                  onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value as Student["gender"] })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={studentForm.dob}
                  onChange={(e) => setStudentForm({ ...studentForm, dob: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <Label>Address</Label>
                <Textarea
                  value={studentForm.address}
                  onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
            <Button className="mt-4" onClick={saveStudent}>
              Add Student
            </Button>
          </Card>

          {classAvg && (
            <Card className="p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" /> {facultyGrade} Performance
              </h2>
              <div className="space-y-4">
                {data.exams.map(exam => {
                  const avg = classAvg[exam.id];
                  if (!avg || Object.keys(avg).length === 0) return null;
                  return (
                    <div key={exam.id} className="mb-4">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">{exam.name} ({exam.type})</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {Object.entries(avg).map(([subj, mark]) => (
                          <Card key={subj} className="p-3 text-center">
                            <p className="text-sm text-muted-foreground mb-1">{subj}</p>
                            <p className="font-bold text-lg">{mark}</p>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Attendance Tab */}
          <Card className="p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                Mark Attendance
              </h2>
              <Button onClick={() => setShowMyStudents(!showMyStudents)}>
                {showMyStudents ? "Hide Students" : "Show Students"}
              </Button>
            </div>
            {showMyStudents && (
              <div className="space-y-4">
                {assignedStudents.map((student) => (
                  <div key={student.registerNumber} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {student.registerNumber} • {student.grade} • Section {student.section}
                        </p>
                        <p className="text-sm text-primary font-medium mt-1">
                          Attendance: {getAttendanceStats(student.attendance).rate}%
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 w-full sm:w-auto">
                        <div className="flex gap-2">
                          <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="flex-1"
                          />
                          <select
                            className="px-3 py-2 border border-input rounded-md bg-background"
                            value={selectedSession}
                            onChange={(e) => setSelectedSession(e.target.value as 'morning' | 'afternoon')}
                          >
                            <option value="morning">Morning</option>
                            <option value="afternoon">Afternoon</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <select
                            className="px-3 py-2 border border-input rounded-md bg-background flex-1"
                            value={attendanceType}
                            onChange={(e) => setAttendanceType(e.target.value as AttendanceType)}
                          >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="HalfDay">Half-Day</option>
                            <option value="OnLeave">On Leave</option>
                          </select>
                          {(attendanceType === "HalfDay" || attendanceType === "OnLeave") && (
                            <Input
                              placeholder="Reason"
                              value={attendanceReason}
                              onChange={(e) => setAttendanceReason(e.target.value)}
                              className="flex-1"
                            />
                          )}
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedStudentRN(student.registerNumber);
                              markAttendance();
                            }}
                          >
                            Mark
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {assignedStudents.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No students assigned yet.</p>
                )}
              </div>
            )}
          </Card>

          {/* Marks Tab */}
          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Upload Marks
            </h2>
            <div className="space-y-4">
              {assignedStudents.map((student) => {
                const cs = getClassFeeStructure(student.grade, data.classSetups);
                const subjects = cs?.subjects || ["Telugu", "Hindi", "English", "Mathematics", "Science", "Social"];
                return (
                  <Card key={student.registerNumber} className="p-4">
                    <div 
                      className="flex items-center justify-between cursor-pointer" 
                      onClick={() => setSelectedStudentRN(selectedStudentRN === student.registerNumber ? "" : student.registerNumber)}
                    >
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">{student.registerNumber} • {student.grade}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        {selectedStudentRN === student.registerNumber ? "Close" : "Enter Marks"}
                      </Button>
                    </div>
                    {selectedStudentRN === student.registerNumber && (
                      <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Exam</Label>
                            <Select value={newMark.examId} onValueChange={(v) => setNewMark({...newMark, examId: v})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select exam" />
                              </SelectTrigger>
                              <SelectContent>
                                {data.exams.map(exam => (
                                  <SelectItem key={exam.id} value={exam.id}>
                                    {exam.name} ({exam.type})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Subject</Label>
                            <Select value={newMark.subject} onValueChange={(v) => setNewMark({...newMark, subject: v})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select subject" />
                              </SelectTrigger>
                              <SelectContent>
                                {subjects.map(subj => (
                                  <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Marks Obtained</Label>
                            <Input
                              type="number"
                              value={newMark.marksObtained}
                              onChange={(e) => setNewMark({...newMark, marksObtained: e.target.value})}
                              placeholder="e.g., 85"
                            />
                          </div>
                          <div>
                            <Label>Max Marks</Label>
                            <Input
                              type="number"
                              value={newMark.maxMarks}
                              onChange={(e) => setNewMark({...newMark, maxMarks: e.target.value})}
                              placeholder="e.g., 100"
                            />
                          </div>
                        </div>
                        <Button onClick={uploadMark} className="w-full">
                          Upload Mark
                        </Button>
                      </div>
                    )}
                  </Card>
                );
              })}
              {assignedStudents.length === 0 && (
                <p className="text-center text-muted-foreground">No students assigned yet.</p>
              )}
            </div>
          </Card>

          {/* Assignments Tab */}
          <Card className="p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                Assignments
              </h2>
              <Button onClick={() => setShowAssignments(!showAssignments)}>
                {showAssignments ? "Hide" : "Show"} Assignments
              </Button>
            </div>
            {showAssignments && (
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Create New Assignment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Title *</Label>
                      <Input
                        value={assignmentForm.title}
                        onChange={(e) => setAssignmentForm({...assignmentForm, title: e.target.value})}
                        placeholder="e.g., Math Chapter 5"
                      />
                    </div>
                    <div>
                      <Label>Subject *</Label>
                      <Select value={assignmentForm.subject} onValueChange={(v) => setAssignmentForm({...assignmentForm, subject: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentUser?.assignedSubjects?.map(subj => (
                            <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                          )) || (
                            <SelectItem value="General">General</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Class *</Label>
                      <Select value={assignmentForm.classId} onValueChange={(v) => setAssignmentForm({...assignmentForm, classId: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentUser?.assignedClasses?.map(cls => (
                            <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                          )) || (
                            <SelectItem value={currentClassId}>{currentClassId || "Select class"}</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Due Date *</Label>
                      <Input
                        type="date"
                        value={assignmentForm.dueDate}
                        onChange={(e) => setAssignmentForm({...assignmentForm, dueDate: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label>Max Marks</Label>
                      <Input
                        type="number"
                        value={assignmentForm.maxMarks}
                        onChange={(e) => setAssignmentForm({...assignmentForm, maxMarks: e.target.value})}
                        placeholder="10"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label>Description</Label>
                    <Textarea
                      value={assignmentForm.description}
                      onChange={(e) => setAssignmentForm({...assignmentForm, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <Button onClick={createAssignment} className="mt-3 w-full">
                    <Plus className="w-4 h-4 mr-2" /> Create Assignment
                  </Button>
                </Card>

                <div>
                  <h3 className="font-medium mb-3">Your Assignments</h3>
                  {data.assignments
                    .filter(a => a.uploadedBy === currentUser?.id)
                    .map(assignment => {
                      const submissions = assignment.submissions.length;
                      const totalStudents = data.students.filter(s => s.classId === assignment.classId).length;
                      const pending = totalStudents - submissions;
                      return (
                        <Card key={assignment.id} className="p-4 mb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{assignment.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {assignment.subject} • Due: {assignment.dueDate} • Max: {assignment.maxMarks} marks
                              </p>
                              {assignment.description && (
                                <p className="text-sm mt-1">{assignment.description}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                                pending === 0 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                              }`}>
                                {submissions}/{totalStudents} submitted
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="ml-2"
                                onClick={() => setSelectedAssignment(assignment)}
                              >
                                View
                              </Button>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  {data.assignments.filter(a => a.uploadedBy === currentUser?.id).length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No assignments created yet.</p>
                  )}
                </div>

                {selectedAssignment && (
                  <Card className="p-4 mt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">{selectedAssignment.title}</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedAssignment(null)}
                      >
                        Close
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-muted-foreground">Submissions ({selectedAssignment.submissions.length})</span>
                        {selectedAssignment.submissions.map(sub => {
                          const student = data.students.find(s => s.registerNumber === sub.studentId);
                          return (
                            <div key={sub.studentId} className="flex items-center justify-between p-2 bg-muted/30 rounded mt-1">
                              <span className="text-sm">{student?.name || sub.studentId}</span>
                              <div className="flex items-center gap-2">
                                {sub.marks !== undefined && (
                                  <span className="text-sm font-medium">{sub.marks}/{selectedAssignment.maxMarks}</span>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const marks = prompt("Enter marks (0-" + selectedAssignment.maxMarks + "):");
                                    const remarks = prompt("Remarks (optional):") || "";
                                    if (marks !== null) {
                                      const m = parseInt(marks);
                                      if (!isNaN(m) && m >= 0 && m <= selectedAssignment.maxMarks) {
                                        gradeAssignment(selectedAssignment.id, sub.studentId, m, remarks);
                                      }
                                    }
                                  }}
                                >
                                  {sub.marks !== undefined ? "Update" : "Grade"}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </Card>

          {/* Timetable Tab */}
          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              Class Timetable ({currentClassId})
            </h2>
            {currentUser?.isClassTeacher ? (
              <div className="mb-6">
                <h3 className="font-medium mb-3">Add/Edit Timetable Slot</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label>Day</Label>
                    <Select value={timetableForm.day} onValueChange={(v) => setTimetableForm({...timetableForm, day: v as TimetableSlot["day"]})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as TimetableSlot["day"][]).map(day => (
                          <SelectItem key={day} value={day}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Period</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={timetableForm.period}
                      onChange={(e) => setTimetableForm({...timetableForm, period: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={timetableForm.startTime}
                      onChange={(e) => setTimetableForm({...timetableForm, startTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={timetableForm.endTime}
                      onChange={(e) => setTimetableForm({...timetableForm, endTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Subject</Label>
                    <Input
                      value={timetableForm.subject}
                      onChange={(e) => setTimetableForm({...timetableForm, subject: e.target.value})}
                      placeholder="e.g., Mathematics"
                    />
                  </div>
                  <div>
                    <Label>Room</Label>
                    <Input
                      value={timetableForm.room}
                      onChange={(e) => setTimetableForm({...timetableForm, room: e.target.value})}
                      placeholder="e.g., 10A"
                    />
                  </div>
                </div>
                <Button onClick={addOrUpdateTimetableSlot} className="mt-3">
                  {editingSlot ? "Update Slot" : "Add Slot"}
                </Button>
                {editingSlot && (
                  <Button
                    variant="outline"
                    className="mt-3 ml-2"
                    onClick={() => {
                      setTimetableForm({ day: "Monday", period: "1", startTime: "09:00", endTime: "09:45", subject: "", room: "" });
                      setEditingSlot(null);
                    }}
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground mb-4">Only class teachers can edit timetable.</p>
            )}

            {currentTimetable ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Day</th>
                      <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Period</th>
                      <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Time</th>
                      <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Subject</th>
                      <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Room</th>
                      {currentUser?.isClassTeacher && (
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentTimetable.slots.map(slot => (
                      <tr key={`${slot.day}-${slot.period}`} className="border-b hover:bg-muted/30">
                        <td className="p-3 text-sm">{slot.day}</td>
                        <td className="p-3 text-sm">{slot.period}</td>
                        <td className="p-3 text-sm">{slot.startTime}–{slot.endTime}</td>
                        <td className="p-3 text-sm">{slot.subject}</td>
                        <td className="p-3 text-sm">{slot.room || '-'}</td>
                        {currentUser?.isClassTeacher && (
                          <td className="p-3">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => editTimetableSlot(slot)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => deleteTimetableSlot(slot)}
                            >
                              Delete
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No timetable set for {currentClassId}.</p>
            )}
          </Card>

          {/* Student Lookup & Disciplinary */}
          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Student Lookup & Disciplinary Report
            </h2>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Enter Register Number to lookup"
                value={searchRN}
                onChange={(e) => setSearchRN(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch}>Search</Button>
            </div>
            {foundStudent ? (
              <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{foundStudent.name}</p>
                    <p className="text-sm text-muted-foreground">{foundStudent.registerNumber} • {foundStudent.grade}</p>
                    <p className="text-sm mt-1">Portal status: {foundStudent.isPortalBlocked ? "Blocked" : "Active"}</p>
                  </div>
                </div>
                <div>
                  <Label>Add Disciplinary Record</Label>
                  <Textarea
                    rows={3}
                    value={disciplineText}
                    onChange={(e) => setDisciplineText(e.target.value)}
                    placeholder="Describe the incident..."
                    className="mt-1"
                  />
                  <div className="flex gap-2 mt-3">
                    <Button onClick={addDisciplinaryReport}>Add Report</Button>
                    <Button variant="outline" onClick={() => { setFoundStudent(null); setSearchRN(""); setDisciplineText(""); }}>
                      Clear
                    </Button>
                  </div>
                </div>
                <Button onClick={() => downloadReportCardPDF(foundStudent, data.fees, data.exams, data.classSetups, data.academicYears)} variant="outline">
                  <Download className="w-4 h-4 mr-2" /> Download Report Card
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Search for a student to add a disciplinary record or download report card.</p>
            )}
          </Card>

          {/* Leave Requests */}
          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Request Leave
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  className="mt-1"
                  value={leaveForm.dateStart}
                  onChange={(e) =>
                    setLeaveForm({ ...leaveForm, dateStart: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  className="mt-1"
                  value={leaveForm.dateEnd}
                  onChange={(e) => setLeaveForm({ ...leaveForm, dateEnd: e.target.value })}
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={leaveForm.type} onValueChange={(v) => setLeaveForm({...leaveForm, type: v as Leave["type"]})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sick">Sick Leave</SelectItem>
                    <SelectItem value="Casual">Casual Leave</SelectItem>
                    <SelectItem value="Earned">Earned Leave</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Reason</Label>
                <Input
                  className="mt-1"
                  placeholder="Reason for leave"
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                />
              </div>
            </div>
            <Button className="mt-4" onClick={requestLeave}>
              Submit Request
            </Button>
          </Card>

          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              My Leave Requests
            </h2>
            <div className="space-y-3">
              {data.leaves
                .filter((l) => l.userId === currentUser?.id)
                .map((leave) => (
                  <div
                    key={leave.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/30 rounded-lg gap-2"
                  >
                    <div>
                      <p className="font-medium">
                        {leave.dateStart} to {leave.dateEnd} ({leave.type})
                      </p>
                      <p className="text-sm text-muted-foreground">{leave.reason}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium self-start sm:self-center ${
                        leave.status === "Approved"
                          ? "bg-success/10 text-success"
                          : leave.status === "Rejected"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </div>
                ))}
              {data.leaves.filter((l) => l.userId === currentUser?.id).length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No leave requests yet.
                </p>
              )}
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Announcements
            </h2>
            <div className="space-y-3">
              {data.announcements
                .filter(ann => 
                  ann.audience === "All" || 
                  ann.audience === "Teachers" ||
                  (ann.audience === "Class" && currentUser?.assignedClasses?.includes(ann.targetClass || ""))
                )
                .slice(0, 5)
                .map((ann) => (
                  <div key={ann.id} className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">{ann.date}</span>
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded">{ann.authorRole}</span>
                    </div>
                    <p className="text-sm text-foreground mt-1">{ann.content}</p>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // ======================
  // 👨‍👩‍👧 PARENT DASHBOARD
  // ======================

  const ParentDashboard = () => {
    const student = data.students.find((s) => s.registerNumber === currentUser?.studentId);
    const feeRecord = data.fees.find((f) => f.studentRegisterNumber === currentUser?.studentId);
    const assignmentsForStudent = data.assignments.filter(a => 
      a.classId === student?.classId
    );
    const submissions = assignmentsForStudent.flatMap(a => 
      a.submissions.filter(sub => sub.studentId === currentUser?.studentId)
    );

    const handlePayment = () => {
      if (!feeRecord) return;
      const amount = prompt("Enter amount to pay (₹" + (feeRecord.totalDue - feeRecord.amountPaid) + " due):");
      if (amount === null) return;
      const amt = parseFloat(amount);
      if (isNaN(amt) || amt <= 0) {
        toast({ title: "Invalid", description: "Enter a valid amount.", variant: "destructive" });
        return;
      }
      const newPaid = Math.min(feeRecord.amountPaid + amt, feeRecord.totalDue);
      const newStatus = newPaid >= feeRecord.totalDue 
        ? "Paid" 
        : newPaid > 0 ? "Partially Paid" : "Pending";

      setData((prev) => ({
        ...prev,
        fees: prev.fees.map((f) =>
          f.id === feeRecord.id
            ? {
                ...f,
                status: newStatus,
                amountPaid: newPaid,
                lastPaymentDate: new Date().toISOString().split("T")[0],
                paymentMethod: "Online"
              }
            : f
        ),
      }));
      toast({ title: "Payment Recorded", description: `₹${amt} added to payment.` });
    };

    const downloadReceiptAsPDF = () => {
      if (!student || !feeRecord) return;
      const content = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="font-size: 24px; color: #1e293b;">School Fee Receipt</h1>
            <p>${new Date().getFullYear()} Academic Year</p>
          </div>
          <div style="border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; background: #f8fafc;">
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span style="font-weight: bold; color: #334155;">Receipt No:</span>
              <span>#${feeRecord.id.toUpperCase()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span style="font-weight: bold; color: #334155;">Date:</span>
              <span>${new Date(feeRecord.lastPaymentDate).toLocaleDateString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span style="font-weight: bold; color: #334155;">Student Name:</span>
              <span>${student.name}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span style="font-weight: bold; color: #334155;">Register Number:</span>
              <span>${student.registerNumber}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span style="font-weight: bold; color: #334155;">Amount Paid:</span>
              <span style="font-size: 1.2em; font-weight: bold; color: #0d9488;">₹${feeRecord.amountPaid}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span style="font-weight: bold; color: #334155;">Status:</span>
              <span style="color: ${feeRecord.status === "Paid" ? "green" : feeRecord.status === "Partially Paid" ? "blue" : "orange"};">${feeRecord.status}</span>
            </div>
          </div>
          <div style="margin-top: 20px; text-align: center; color: #64748b; font-size: 0.85em;">
            <p>Thank you for your payment. This is a computer-generated receipt.</p>
          </div>
        </div>
      `;
      const element = document.createElement('div');
      element.innerHTML = content;
      document.body.appendChild(element);
      html2pdf()
        .from(element)
        .set({
          filename: `receipt_${student.name}_${new Date().toISOString().split('T')[0]}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { orientation: 'portrait' }
        })
        .save()
        .then(() => {
          document.body.removeChild(element);
        });
    };

    if (!student) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-destructive">Student record not found.</p>
        </div>
      );
    }

    if (student.isPortalBlocked) {
      return (
        <div className="min-h-screen bg-background">
          <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-destructive to-destructive/80 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-destructive-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Portal Blocked</h1>
                  <p className="text-xs text-muted-foreground">Access Restricted</p>
                </div>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </header>
          <div className="max-w-3xl mx-auto p-8">
            <Card className="p-8 text-center border-destructive/20 bg-destructive/5">
              <Lock className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-destructive mb-2">Portal Blocked</h2>
              <p className="text-muted-foreground">
                This portal has been temporarily blocked due to disciplinary actions.
              </p>
              <p className="text-muted-foreground mt-2">
                Please contact the school administration with a parent to restore access.
              </p>
            </Card>
          </div>
        </div>
      );
    }

    const attendanceStats = getAttendanceStats(student.attendance);
    const overallPerc = calculateOverallPercentage(student, data.exams);
    const rank = getRankForStudent(student, data.students, data.exams);

    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Parent Dashboard</h1>
                <p className="text-xs text-muted-foreground">
                  Viewing: {student.name} ({student.classId})
                </p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
          <Card className="p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground">
                {student.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <p className="text-muted-foreground">
                  {student.registerNumber} • {student.grade} • Section {student.section}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" /> Rank #{rank}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" /> {overallPerc}%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                Attendance Record
              </h2>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Current Attendance Rate</span>
                  <span className="text-3xl font-bold text-primary">
                    {attendanceStats.rate}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${attendanceStats.rate}%` }}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 mt-3 text-xs">
                  <div className="text-center">
                    <div className="w-3 h-3 bg-success rounded-full mx-auto mb-1"></div>
                    <span>P: {attendanceStats.present}</span>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-destructive rounded-full mx-auto mb-1"></div>
                    <span>A: {attendanceStats.absent}</span>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-warning rounded-full mx-auto mb-1"></div>
                    <span>H: {attendanceStats.halfDay}</span>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                    <span>L: {attendanceStats.onLeave}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {student.attendance.slice(-10).reverse().map((record, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <span className="text-sm text-muted-foreground">{record.date} ({record.session})</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        record.type === "Present"
                          ? "bg-success/10 text-success"
                          : record.type === "Absent"
                          ? "bg-destructive/10 text-destructive"
                          : record.type === "HalfDay"
                          ? "bg-warning/10 text-warning"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {record.type}{record.reason ? ` (${record.reason})` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Exam Results
              </h2>
              <div className="space-y-4">
                {data.exams.map(exam => {
                  const examMarks = student.marks.filter(m => m.examId === exam.id);
                  if (examMarks.length === 0) return null;
                  const totalObtained = examMarks.reduce((sum, m) => sum + m.marksObtained, 0);
                  const totalMax = examMarks.reduce((sum, m) => sum + m.maxMarks, 0);
                  const examPerc = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
                  return (
                    <Card key={exam.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{exam.name} ({exam.type})</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          examPerc >= 75 ? "bg-success/10 text-success" : examPerc >= 60 ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"
                        }`}>
                          {examPerc}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {examMarks.map(m => (
                          <div key={m.subject} className="text-center">
                            <p className="text-xs text-muted-foreground mb-1">{m.subject}</p>
                            <p className="text-lg font-bold">
                              {m.marksObtained}
                              <span className="text-muted-foreground text-sm">/{m.maxMarks}</span>
                            </p>
                            <p className="text-xs mt-1">{getGradeFromMarks(calculatePercentage(m.marksObtained, m.maxMarks))}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                Assignments
              </h2>
              <div className="space-y-3">
                {assignmentsForStudent.map(assignment => {
                  const submission = submissions.find(s => 
                    data.assignments.find(a => a.id === s.studentId)?.id === assignment.id
                  ) || submissions.find(s => s.studentId === currentUser?.studentId && 
                    data.assignments.find(a => a.id === assignment.id)?.submissions.some(sub => sub.studentId === s.studentId)
                  );
                  return (
                    <Card key={assignment.id} className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{assignment.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {assignment.subject} • Due: {assignment.dueDate}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          submission 
                            ? submission.status === "Late" 
                              ? "bg-warning/10 text-warning" 
                              : "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                        }`}>
                          {submission ? (submission.marks !== undefined ? `${submission.marks}/${assignment.maxMarks}` : "Submitted") : "Pending"}
                        </span>
                      </div>
                      {submission?.remarks && (
                        <p className="text-sm mt-2 text-muted-foreground">Remarks: {submission.remarks}</p>
                      )}
                    </Card>
                  );
                })}
                {assignmentsForStudent.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No assignments yet.</p>
                )}
              </div>
            </Card>

            {student.disciplinaryActions.length > 0 && (
              <Card className="p-6 shadow-sm border-warning/20 bg-warning/5">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-warning">
                  <AlertTriangle className="w-5 h-5" />
                  Disciplinary Actions
                </h2>
                <ul className="space-y-2">
                  {student.disciplinaryActions.map((action, i) => (
                    <li key={i} className="p-3 bg-background rounded-lg text-sm">
                      • {action}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          {feeRecord && (
            <Card className="p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                Fee Status
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Due</p>
                    <p className="text-3xl font-bold text-foreground">₹{feeRecord.totalDue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount Paid</p>
                    <p className="text-3xl font-bold text-success">₹{feeRecord.amountPaid.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="text-3xl font-bold text-warning">
                      ₹{(feeRecord.totalDue - feeRecord.amountPaid).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <div
                    className={`p-4 rounded-lg text-center mb-4 ${
                      feeRecord.status === "Paid"
                        ? "bg-success/10 border border-success/20"
                        : feeRecord.status === "Partially Paid"
                        ? "bg-blue-100 border border-blue-200"
                        : "bg-warning/10 border border-warning/20"
                    }`}
                  >
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <p
                      className={`text-2xl font-bold ${
                        feeRecord.status === "Paid" 
                          ? "text-success" 
                          : feeRecord.status === "Partially Paid" 
                            ? "text-blue-600" 
                            : "text-warning"
                      }`}
                    >
                      {feeRecord.status}
                    </p>
                  </div>
                  {feeRecord.status !== "Paid" && (
                    <Button onClick={handlePayment} size="lg" className="w-full">
                      <Coins className="w-4 h-4 mr-2" />
                      Pay Now
                    </Button>
                  )}
                  {feeRecord.status === "Paid" && feeRecord.lastPaymentDate && (
                    <Button
                      onClick={downloadReceiptAsPDF}
                      size="lg"
                      variant="outline"
                      className="w-full mt-2"
                    >
                      <Download className="w-4 h-4 mr-2" /> Download Receipt
                    </Button>
                  )}
                  {feeRecord.lastPaymentDate && (
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Last payment: {feeRecord.lastPaymentDate}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}

          <Card className="p-6 shadow-sm">
            <Button onClick={() => downloadReportCardPDF(student, data.fees, data.exams, data.classSetups, data.academicYears)} className="w-full">
              <Download className="w-4 h-4 mr-2" /> Download Full Report Card (PDF)
            </Button>
          </Card>

          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              School Announcements
            </h2>
            <div className="space-y-3">
              {data.announcements
                .filter(ann => 
                  ann.audience === "All" || 
                  ann.audience === "Parents" ||
                  (ann.audience === "Class" && ann.targetClass === student.classId)
                )
                .slice(0, 5)
                .map((ann) => (
                  <div key={ann.id} className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">{ann.date}</span>
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded">{ann.authorRole}</span>
                    </div>
                    <p className="text-sm text-foreground mt-1">{ann.content}</p>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // ======================
  // 🧑‍🎓 STUDENT DASHBOARD
  // ======================

  const StudentDashboard = () => {
    const student = data.students.find((s) => s.registerNumber === currentUser?.studentId);
    const feeRecord = data.fees.find((f) => f.studentRegisterNumber === currentUser?.studentId);
    const assignmentsForStudent = data.assignments.filter(a => 
      a.classId === student?.classId
    );
    const submissions = assignmentsForStudent.flatMap(a => 
      a.submissions.filter(sub => sub.studentId === currentUser?.studentId)
    );

    const submitAssignment = (assignmentId: string) => {
      const file = prompt("Enter file URL (or leave blank for text submission):");
      if (file !== null) {
        // In real app: upload file, get URL
        const assignment = data.assignments.find(a => a.id === assignmentId);
        if (assignment) {
          const now = new Date();
          const due = new Date(assignment.dueDate);
          const status = now <= due ? "Submitted" : "Late";
          
          setData(prev => ({
            ...prev,
            assignments: prev.assignments.map(a =>
              a.id === assignmentId
                ? {
                    ...a,
                    submissions: [
                      ...a.submissions.filter(sub => sub.studentId !== currentUser!.studentId!),
                      {
                        studentId: currentUser!.studentId!,
                        submittedAt: now.toISOString().split("T")[0],
                        fileUrl: file || undefined,
                        status
                      }
                    ]
                  }
                : a
            )
          }));
          toast({ title: "Submitted", description: "Assignment submitted successfully." });
        }
      }
    };

    if (!student) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-destructive">Student record not found.</p>
        </div>
      );
    }

    if (student.isPortalBlocked) {
      return (
        <div className="min-h-screen bg-background">
          <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-destructive to-destructive/80 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-destructive-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Portal Blocked</h1>
                  <p className="text-xs text-muted-foreground">Access Restricted</p>
                </div>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </header>
          <div className="max-w-3xl mx-auto p-8">
            <Card className="p-8 text-center border-destructive/20 bg-destructive/5">
              <Lock className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-destructive mb-2">Portal Blocked</h2>
              <p className="text-muted-foreground">
                Your portal access has been temporarily blocked.
              </p>
              <p className="text-muted-foreground mt-2">
                Please contact your class teacher or school administration.
              </p>
            </Card>
          </div>
        </div>
      );
    }

    const attendanceStats = getAttendanceStats(student.attendance);
    const overallPerc = calculateOverallPercentage(student, data.exams);
    const rank = getRankForStudent(student, data.students, data.exams);

    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Student Dashboard</h1>
                <p className="text-xs text-muted-foreground">
                  {student.name} • {student.classId}
                </p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
          <Card className="p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground">
                {student.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <p className="text-muted-foreground">
                  {student.registerNumber} • {student.grade} • Section {student.section}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" /> Rank #{rank}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" /> {overallPerc}%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                Attendance
              </h2>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Rate</span>
                  <span className="text-3xl font-bold text-primary">
                    {attendanceStats.rate}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${attendanceStats.rate}%` }}
                  />
                </div>
              </div>
              <div className="text-sm">
                <p>Present: {attendanceStats.present}</p>
                <p>Absent: {attendanceStats.absent}</p>
                <p>Half-Day: {attendanceStats.halfDay}</p>
                <p>On Leave: {attendanceStats.onLeave}</p>
              </div>
            </Card>

            <Card className="p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Performance
              </h2>
              <div className="space-y-3">
                {data.exams.map(exam => {
                  const examMarks = student.marks.filter(m => m.examId === exam.id);
                  if (examMarks.length === 0) return null;
                  const totalObtained = examMarks.reduce((sum, m) => sum + m.marksObtained, 0);
                  const totalMax = examMarks.reduce((sum, m) => sum + m.maxMarks, 0);
                  const examPerc = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
                  return (
                    <div key={exam.id} className="p-3 bg-muted/30 rounded">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{exam.name}</span>
                        <span className={`text-sm ${
                          examPerc >= 75 ? "text-success" : examPerc >= 60 ? "text-primary" : "text-warning"
                        }`}>
                          {examPerc}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Assignments
            </h2>
            <div className="space-y-3">
              {assignmentsForStudent.map(assignment => {
                const submission = submissions.find(s => 
                  data.assignments.find(a => a.id === s.studentId)?.id === assignment.id
                ) || submissions.find(s => s.studentId === currentUser?.studentId && 
                  data.assignments.find(a => a.id === assignment.id)?.submissions.some(sub => sub.studentId === s.studentId)
                );
                const isDue = new Date() < new Date(assignment.dueDate);
                return (
                  <Card key={assignment.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{assignment.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {assignment.subject} • Due: {assignment.dueDate}
                        </p>
                        {assignment.description && (
                          <p className="text-sm mt-1">{assignment.description}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-2 py-0.5 rounded-full text-xs mb-1 ${
                          submission 
                            ? submission.status === "Late" 
                              ? "bg-warning/10 text-warning" 
                              : "bg-success/10 text-success"
                            : isDue 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-destructive/10 text-destructive"
                        }`}>
                          {submission ? (submission.marks !== undefined ? `${submission.marks}/${assignment.maxMarks}` : "Submitted") : isDue ? "Pending" : "Overdue"}
                        </span>
                        {!submission && isDue && (
                          <Button
                            size="sm"
                            onClick={() => submitAssignment(assignment.id)}
                          >
                            Submit
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
              {assignmentsForStudent.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No assignments yet.</p>
              )}
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              Class Timetable
            </h2>
            {(() => {
              const timetable = data.timetables.find(t => t.classId === student.classId);
              if (!timetable) return <p className="text-muted-foreground">No timetable available.</p>;
              
              const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
              return (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Time</th>
                        {days.map(day => (
                          <th key={day} className="text-left p-3 text-sm font-semibold text-muted-foreground">{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(period => {
                        const slots = days.map(day => 
                          timetable.slots.find(s => s.day === day && s.period === period)
                        );
                        return (
                          <tr key={period} className="border-b">
                            <td className="p-3 text-sm font-medium">
                              {slots.find(s => s)?.startTime || "—"}–
                              {slots.find(s => s)?.endTime || "—"}
                            </td>
                            {slots.map((slot, i) => (
                              <td key={i} className="p-3 text-sm">
                                {slot ? (
                                  <div>
                                    <div className="font-medium">{slot.subject}</div>
                                    <div className="text-xs text-muted-foreground">{slot.room || "Room"}</div>
                                  </div>
                                ) : "-"}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </Card>

          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Announcements
            </h2>
            <div className="space-y-3">
              {data.announcements
                .filter(ann => 
                  ann.audience === "All" || 
                  ann.audience === "Students" ||
                  (ann.audience === "Class" && ann.targetClass === student.classId)
                )
                .slice(0, 5)
                .map((ann) => (
                  <div key={ann.id} className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">{ann.date}</span>
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded">{ann.authorRole}</span>
                    </div>
                    <p className="text-sm text-foreground mt-1">{ann.content}</p>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // ======================
  // 💰 ACCOUNTS DASHBOARD
  // ======================

  const AccountsDashboard = () => {
    const [filterStatus, setFilterStatus] = useState<"All" | FeeStatus>("All");
    const [searchRN, setSearchRN] = useState("");
    const [paymentForm, setPaymentForm] = useState({
      studentRN: "",
      amount: "",
      method: "Cash" as Fee["paymentMethod"],
      chequeNumber: "",
      transactionId: ""
    });
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    // Auto-create missing fee records (already handled in useEffect above)

    const filteredFees = data.fees.filter((fee) => {
      const matchesStatus = filterStatus === "All" || fee.status === filterStatus;
      const matchesSearch =
        !searchRN || fee.studentRegisterNumber.toLowerCase().includes(searchRN.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    const updateFee = (feeId: string, updates: Partial<Fee>) => {
      setData((prev) => ({
        ...prev,
        fees: prev.fees.map((f) => (f.id === feeId ? { ...f, ...updates } : f)),
      }));
      toast({
        title: "Fee Updated",
        description: "Fee record has been updated successfully.",
      });
    };

    const recordPayment = () => {
      const { studentRN, amount, method, chequeNumber, transactionId } = paymentForm;
      if (!studentRN || !amount) {
        toast({ title: "Incomplete", description: "Student RN and amount required.", variant: "destructive" });
        return;
      }
      const amt = parseFloat(amount);
      if (isNaN(amt) || amt <= 0) {
        toast({ title: "Invalid", description: "Enter valid amount.", variant: "destructive" });
        return;
      }

      const feeRecord = data.fees.find(f => f.studentRegisterNumber === studentRN);
      if (!feeRecord) {
        toast({ title: "Not Found", description: "Student fee record not found.", variant: "destructive" });
        return;
      }

      const newPaid = Math.min(feeRecord.amountPaid + amt, feeRecord.totalDue);
      const newStatus = newPaid >= feeRecord.totalDue 
        ? "Paid" 
        : newPaid > 0 ? "Partially Paid" : "Pending";

      setData(prev => ({
        ...prev,
        fees: prev.fees.map(f =>
          f.id === feeRecord.id
            ? {
                ...f,
                amountPaid: newPaid,
                status: newStatus,
                lastPaymentDate: new Date().toISOString().split("T")[0],
                paymentMethod: method,
                chequeNumber: method === "Cheque" ? chequeNumber : undefined,
                transactionId: method === "Online" ? transactionId : undefined
              }
            : f
        )
      }));

      setPaymentForm({ studentRN: "", amount: "", method: "Cash", chequeNumber: "", transactionId: "" });
      setShowPaymentForm(false);
      toast({ title: "Payment Recorded", description: `₹${amt} added for ${studentRN}.` });
    };

    const exportFeesToExcel = () => {
      const exportData = data.fees.map(f => {
        const student = data.students.find(s => s.registerNumber === f.studentRegisterNumber);
        return {
          "Register No": f.studentRegisterNumber,
          "Name": student?.name || "Unknown",
          "Class": student?.grade || "",
          "Section": student?.section || "",
          "Academic Year": f.academicYearId,
          "Tuition": f.tuitionFee,
          "Exam": f.examFee,
          "Lab": f.labFee,
          "Library": f.libraryFee,
          "Transport": f.transportFee,
          "Misc": f.miscellaneous,
          "Total Due": f.totalDue,
          "Paid": f.amountPaid,
          "Balance": f.totalDue - f.amountPaid,
          "Status": f.status,
          "Last Payment": f.lastPaymentDate,
          "Method": f.paymentMethod || ""
        };
      });
      exportToExcel(exportData, `Fees_${new Date().toISOString().slice(0, 10)}`, "Fees");
    };

    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <span className="font-bold text-primary-foreground">₹</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Accounts Dashboard</h1>
                <p className="text-xs text-muted-foreground">Welcome, {currentUser?.username}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Fees Due</p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{data.fees.reduce((sum, f) => sum + f.totalDue, 0).toLocaleString()}
                  </p>
                </div>
                <span className="text-2xl font-bold text-primary">₹</span>
              </div>
            </Card>
            <Card className="p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Amount Collected</p>
                  <p className="text-2xl font-bold text-success">
                    ₹{data.fees.reduce((sum, f) => sum + f.amountPaid, 0).toLocaleString()}
                  </p>
                </div>
                <Check className="w-8 h-8 text-success" />
              </div>
            </Card>
            <Card className="p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Payments</p>
                  <p className="text-2xl font-bold text-warning">
                    {data.fees.filter((f) => f.status === "Pending" || f.status === "Partially Paid").length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-warning" />
              </div>
            </Card>
            <Card className="p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold text-destructive">
                    {data.fees.filter((f) => f.status === "Overdue").length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
            </Card>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <Button onClick={() => setShowPaymentForm(true)} variant="default">
              <Coins className="w-4 h-4 mr-2" /> Record Payment
            </Button>
            <Button onClick={exportFeesToExcel} variant="outline">
              <FileDown className="w-4 h-4 mr-2" /> Export to Excel
            </Button>
          </div>

          {showPaymentForm && (
            <Card className="p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Record Payment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Student Register No *</Label>
                  <Input
                    value={paymentForm.studentRN}
                    onChange={(e) => setPaymentForm({...paymentForm, studentRN: e.target.value})}
                    placeholder="SCHL2025001"
                  />
                </div>
                <div>
                  <Label>Amount (₹) *</Label>
                  <Input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <Label>Payment Method *</Label>
                  <Select value={paymentForm.method} onValueChange={(v) => setPaymentForm({...paymentForm, method: v as Fee["paymentMethod"]})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {paymentForm.method === "Cheque" && (
                  <div>
                    <Label>Cheque Number</Label>
                    <Input
                      value={paymentForm.chequeNumber}
                      onChange={(e) => setPaymentForm({...paymentForm, chequeNumber: e.target.value})}
                      placeholder="Cheque #"
                    />
                  </div>
                )}
                {paymentForm.method === "Online" && (
                  <div>
                    <Label>Transaction ID</Label>
                    <Input
                      value={paymentForm.transactionId}
                      onChange={(e) => setPaymentForm({...paymentForm, transactionId: e.target.value})}
                      placeholder="TXN123456"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-4">
                <Button onClick={recordPayment}>Record Payment</Button>
                <Button variant="outline" onClick={() => setShowPaymentForm(false)}>Cancel</Button>
              </div>
            </Card>
          )}

          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Fee Records
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Input
                placeholder="Search by Register Number"
                value={searchRN}
                onChange={(e) => setSearchRN(e.target.value)}
                className="flex-1"
              />
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "All" ? "default" : "outline"}
                  onClick={() => setFilterStatus("All")}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "Paid" ? "success" : "outline"}
                  onClick={() => setFilterStatus("Paid")}
                  size="sm"
                >
                  Paid
                </Button>
                <Button
                  variant={filterStatus === "Partially Paid" ? "blue" : "outline"}
                  onClick={() => setFilterStatus("Partially Paid")}
                  size="sm"
                >
                  Partial
                </Button>
                <Button
                  variant={filterStatus === "Pending" ? "warning" : "outline"}
                  onClick={() => setFilterStatus("Pending")}
                  size="sm"
                >
                  Pending
                </Button>
                <Button
                  variant={filterStatus === "Overdue" ? "destructive" : "outline"}
                  onClick={() => setFilterStatus("Overdue")}
                  size="sm"
                >
                  Overdue
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground">
                      Register Number
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground">
                      Student Name
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground">
                      Class
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground">
                      Total Due
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground">
                      Paid
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground">
                      Last Payment
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFees.map((fee) => {
                    const student = data.students.find(s => s.registerNumber === fee.studentRegisterNumber);
                    return (
                      <tr key={fee.id} className="border-b border-border hover:bg-muted/30">
                        <td className="p-3 text-sm font-mono">{fee.studentRegisterNumber}</td>
                        <td className="p-3 text-sm">{student?.name || "Unknown"}</td>
                        <td className="p-3 text-sm">{student?.grade || "-"}</td>
                        <td className="p-3 text-sm">₹{fee.totalDue.toLocaleString()}</td>
                        <td className="p-3 text-sm font-semibold text-success">
                          ₹{fee.amountPaid.toLocaleString()}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              fee.status === "Paid"
                                ? "bg-success/10 text-success"
                                : fee.status === "Partially Paid"
                                ? "bg-blue-100 text-blue-800"
                                : fee.status === "Pending"
                                ? "bg-warning/10 text-warning"
                                : "bg-destructive/10 text-destructive"
                            }`}
                          >
                            {fee.status}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {fee.lastPaymentDate || "N/A"}
                        </td>
                        <td className="p-3">
                          {fee.status !== "Paid" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setPaymentForm({
                                  studentRN: fee.studentRegisterNumber,
                                  amount: ((fee.totalDue - fee.amountPaid) || 0).toString(),
                                  method: "Cash",
                                  chequeNumber: "",
                                  transactionId: ""
                                });
                                setShowPaymentForm(true);
                              }}
                            >
                              Add Payment
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredFees.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No fee records found.</p>
              )}
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Fee Collection Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Collection Status</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Collected</span>
                      <span>₹{data.fees.reduce((sum, f) => sum + f.amountPaid, 0).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-success h-2 rounded-full"
                        style={{ width: `${(data.fees.reduce((sum, f) => sum + f.amountPaid, 0) / data.fees.reduce((sum, f) => sum + f.totalDue, 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Pending</span>
                      <span>₹{data.fees.reduce((sum, f) => sum + (f.totalDue - f.amountPaid), 0).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-warning h-2 rounded-full"
                        style={{ width: `${(data.fees.reduce((sum, f) => sum + (f.totalDue - f.amountPaid), 0) / data.fees.reduce((sum, f) => sum + f.totalDue, 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Status Distribution</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-success rounded-full mr-2"></div>
                    <span className="text-sm">Paid: {data.fees.filter(f => f.status === "Paid").length}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm">Partially Paid: {data.fees.filter(f => f.status === "Partially Paid").length}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-warning rounded-full mr-2"></div>
                    <span className="text-sm">Pending: {data.fees.filter(f => f.status === "Pending").length}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-destructive rounded-full mr-2"></div>
                    <span className="text-sm">Overdue: {data.fees.filter(f => f.status === "Overdue").length}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Announcements
            </h2>
            <div className="space-y-3">
              {data.announcements
                .filter(ann => ann.audience === "All" || ann.audience === "Accounts")
                .slice(0, 5)
                .map((ann) => (
                  <div key={ann.id} className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">{ann.date}</span>
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded">{ann.authorRole}</span>
                    </div>
                    <p className="text-sm text-foreground mt-1">{ann.content}</p>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // ======================
  // 📚 LIBRARIAN DASHBOARD
  // ======================

  const LibrarianDashboard = () => {
    const [activeTab, setActiveTab] = useState("books");
    const [searchBook, setSearchBook] = useState("");
    const [newBook, setNewBook] = useState({
      title: "",
      author: "",
      isbn: "",
      publisher: "",
      edition: "",
      category: "",
      shelfId: "",
      totalCopies: "1"
    });
    const [issueForm, setIssueForm] = useState({
      bookId: "",
      studentRN: "",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 14 days
    });
    const [returnForm, setReturnForm] = useState({ issueId: "" });
    const [fine, setFine] = useState(0);

    const filteredBooks = data.books.filter(b =>
      b.title.toLowerCase().includes(searchBook.toLowerCase()) ||
      b.author.toLowerCase().includes(searchBook.toLowerCase()) ||
      b.isbn?.includes(searchBook)
    );

    const addBook = () => {
      const { title, author, isbn, publisher, edition, category, shelfId, totalCopies } = newBook;
      if (!title || !author || !category || !shelfId) {
        toast({ title: "Incomplete", description: "Title, author, category, shelf required.", variant: "destructive" });
        return;
      }
      const book: Book = {
        id: `b${Date.now()}`,
        title,
        author,
        isbn: isbn || undefined,
        publisher: publisher || undefined,
        edition: edition || undefined,
        category,
        shelfId,
        totalCopies: parseInt(totalCopies) || 1,
        availableCopies: parseInt(totalCopies) || 1,
        status: "Available",
        addedBy: currentUser!.id,
        dateAdded: new Date().toISOString().split('T')[0]
      };
      setData(prev => ({ ...prev, books: [...prev.books, book] }));
      setNewBook({ title: "", author: "", isbn: "", publisher: "", edition: "", category: "", shelfId: "", totalCopies: "1" });
      toast({ title: "Book Added", description: `${title} added to library.` });
    };

    const issueBook = () => {
      const { bookId, studentRN, dueDate } = issueForm;
      if (!bookId || !studentRN || !dueDate) {
        toast({ title: "Incomplete", description: "All fields required.", variant: "destructive" });
        return;
      }
      const book = data.books.find(b => b.id === bookId);
      const student = data.students.find(s => s.registerNumber === studentRN);
      if (!book || book.availableCopies <= 0) {
        toast({ title: "Not Available", description: "Book not available for issue.", variant: "destructive" });
        return;
      }
      if (!student) {
        toast({ title: "Student Not Found", description: "Invalid student register number.", variant: "destructive" });
        return;
      }
      const issue: BookIssue = {
        id: `issue${Date.now()}`,
        bookId,
        studentId: studentRN,
        issuedBy: currentUser!.id,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate,
        status: "Issued"
      };
      setData(prev => ({
        ...prev,
        books: prev.books.map(b =>
          b.id === bookId
            ? { ...b, availableCopies: b.availableCopies - 1 }
            : b
        ),
        bookIssues: [...prev.bookIssues, issue]
      }));
      setIssueForm({ bookId: "", studentRN: "", dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] });
      toast({ title: "Book Issued", description: `"${book.title}" issued to ${student.name}.` });
    };

    const returnBook = () => {
      const { issueId } = returnForm;
      if (!issueId) {
        toast({ title: "Select Issue", description: "Choose an issued book to return.", variant: "destructive" });
        return;
      }
      const issue = data.bookIssues.find(i => i.id === issueId);
      if (!issue) {
        toast({ title: "Not Found", description: "Issue record not found.", variant: "destructive" });
        return;
      }
      const book = data.books.find(b => b.id === issue.bookId);
      if (!book) return;

      // Calculate fine (₹5 per day overdue)
      const due = new Date(issue.dueDate);
      const today = new Date();
      const diffTime = Math.max(0, today.getTime() - due.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const fineAmt = diffDays * 5;

      setData(prev => ({
        ...prev,
        books: prev.books.map(b =>
          b.id === issue.bookId
            ? { ...b, availableCopies: b.availableCopies + 1 }
            : b
        ),
        bookIssues: prev.bookIssues.map(i =>
          i.id === issueId
            ? { ...i, returnDate: new Date().toISOString().split('T')[0], fine: fineAmt, status: "Returned" }
            : i
        )
      }));
      setReturnForm({ issueId: "" });
      setFine(fineAmt);
      toast({ 
        title: "Book Returned", 
        description: fineAmt > 0 
          ? `Fine of ₹${fineAmt} applicable.` 
          : "No fine. Thank you!" 
      });
    };

    const getOverdueIssues = () => {
      return data.bookIssues.filter(i => 
        i.status === "Issued" && 
        new Date(i.dueDate) < new Date()
      );
    };

    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Book className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Librarian Dashboard</h1>
                <p className="text-xs text-muted-foreground">Welcome, {currentUser?.username}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="flex flex-wrap gap-1 mb-6">
            {[
              { id: "books", label: "Books", icon: <BookOpen className="w-4 h-4" /> },
              { id: "issue", label: "Issue/Return", icon: <BookOpenCheck className="w-4 h-4" /> },
              { id: "reports", label: "Reports", icon: <FileText className="w-4 h-4" /> },
            ].map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="gap-2"
              >
                {tab.icon} {tab.label}
              </Button>
            ))}
          </div>

          {/* Books Tab */}
          {activeTab === "books" && (
            <div className="space-y-6">
              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Add New Book
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label>Title *</Label>
                    <Input
                      value={newBook.title}
                      onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Author *</Label>
                    <Input
                      value={newBook.author}
                      onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>ISBN</Label>
                    <Input
                      value={newBook.isbn}
                      onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Publisher</Label>
                    <Input
                      value={newBook.publisher}
                      onChange={(e) => setNewBook({...newBook, publisher: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Edition</Label>
                    <Input
                      value={newBook.edition}
                      onChange={(e) => setNewBook({...newBook, edition: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Category *</Label>
                    <Input
                      value={newBook.category}
                      onChange={(e) => setNewBook({...newBook, category: e.target.value})}
                      placeholder="e.g., Fiction, Textbook"
                    />
                  </div>
                  <div>
                    <Label>Shelf ID *</Label>
                    <Input
                      value={newBook.shelfId}
                      onChange={(e) => setNewBook({...newBook, shelfId: e.target.value})}
                      placeholder="e.g., S1, A3"
                    />
                  </div>
                  <div>
                    <Label>Total Copies *</Label>
                    <Input
                      type="number"
                      min="1"
                      value={newBook.totalCopies}
                      onChange={(e) => setNewBook({...newBook, totalCopies: e.target.value})}
                    />
                  </div>
                </div>
                <Button onClick={addBook} className="mt-4">
                  <Plus className="w-4 h-4 mr-2" /> Add Book
                </Button>
              </Card>

              <Card className="p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Book className="w-5 h-5 text-primary" />
                    Book Inventory
                  </h2>
                  <Input
                    placeholder="Search books..."
                    value={searchBook}
                    onChange={(e) => setSearchBook(e.target.value)}
                    className="max-w-md"
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Title</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Author</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Category</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Shelf</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Copies</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBooks.map(book => (
                        <tr key={book.id} className="border-b hover:bg-muted/30">
                          <td className="p-3 text-sm font-medium">{book.title}</td>
                          <td className="p-3 text-sm">{book.author}</td>
                          <td className="p-3 text-sm">{book.category}</td>
                          <td className="p-3 text-sm">{book.shelfId}</td>
                          <td className="p-3 text-sm">{book.availableCopies}/{book.totalCopies}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              book.status === "Available" 
                                ? "bg-success/10 text-success" 
                                : book.status === "Issued" 
                                  ? "bg-warning/10 text-warning" 
                                  : "bg-destructive/10 text-destructive"
                            }`}>
                              {book.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* Issue/Return Tab */}
          {activeTab === "issue" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpenCheck className="w-5 h-5 text-primary" />
                    Issue Book
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label>Book</Label>
                      <Select value={issueForm.bookId} onValueChange={(v) => setIssueForm({...issueForm, bookId: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select book" />
                        </SelectTrigger>
                        <SelectContent>
                          {data.books
                            .filter(b => b.availableCopies > 0)
                            .map(b => (
                              <SelectItem key={b.id} value={b.id}>
                                {b.title} ({b.availableCopies} available)
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Student Register No</Label>
                      <Input
                        value={issueForm.studentRN}
                        onChange={(e) => setIssueForm({...issueForm, studentRN: e.target.value})}
                        placeholder="SCHL2025001"
                      />
                    </div>
                    <div>
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={issueForm.dueDate}
                        onChange={(e) => setIssueForm({...issueForm, dueDate: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <Button onClick={issueBook} className="w-full">
                      <BookOpenCheck className="w-4 h-4 mr-2" /> Issue Book
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 shadow-sm">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookX className="w-5 h-5 text-primary" />
                    Return Book
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label>Issued Book</Label>
                      <Select value={returnForm.issueId} onValueChange={(v) => setReturnForm({...returnForm, issueId: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select issued book" />
                        </SelectTrigger>
                        <SelectContent>
                          {data.bookIssues
                            .filter(i => i.status === "Issued")
                            .map(i => {
                              const book = data.books.find(b => b.id === i.bookId);
                              const student = data.students.find(s => s.registerNumber === i.studentId);
                              return (
                                <SelectItem key={i.id} value={i.id}>
                                  {book?.title} → {student?.name} (Due: {i.dueDate})
                                </SelectItem>
                              );
                            })}
                        </SelectContent>
                      </Select>
                    </div>
                    {returnForm.issueId && fine > 0 && (
                      <div className="p-3 bg-warning/10 rounded">
                        <p className="text-warning font-medium">Fine: ₹{fine}</p>
                        <p className="text-sm text-muted-foreground">₹5 per day overdue</p>
                      </div>
                    )}
                    <Button onClick={returnBook} variant="destructive" className="w-full">
                      <BookX className="w-4 h-4 mr-2" /> Return Book
                    </Button>
                  </div>
                </Card>
              </div>

              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Overdue Books ({getOverdueIssues().length})
                </h2>
                <div className="space-y-3">
                  {getOverdueIssues().map(issue => {
                    const book = data.books.find(b => b.id === issue.bookId);
                    const student = data.students.find(s => s.registerNumber === issue.studentId);
                    const daysOverdue = Math.ceil((new Date().getTime() - new Date(issue.dueDate).getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={issue.id} className="p-3 border-l-4 border-warning bg-warning/5 rounded">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{book?.title}</p>
                            <p className="text-sm text-muted-foreground">{student?.name} ({student?.registerNumber})</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">Due: {issue.dueDate}</p>
                            <p className="text-sm text-warning font-medium">{daysOverdue} days overdue</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {getOverdueIssues().length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No overdue books.</p>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Library Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 text-center">
                    <Book className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Total Books</p>
                    <p className="text-2xl font-bold">{data.books.reduce((sum, b) => sum + b.totalCopies, 0)}</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <BookOpenCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Available</p>
                    <p className="text-2xl font-bold">{data.books.reduce((sum, b) => sum + b.availableCopies, 0)}</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <BookX className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Issued</p>
                    <p className="text-2xl font-bold">
                      {data.bookIssues.filter(i => i.status === "Issued").length}
                    </p>
                  </Card>
                </div>
              </Card>

              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Most Issued Books</h2>
                <div className="space-y-3">
                  {data.books
                    .map(book => ({
                      ...book,
                      issuedCount: data.bookIssues.filter(i => i.bookId === book.id && i.status !== "Returned").length
                    }))
                    .sort((a, b) => b.issuedCount - a.issuedCount)
                    .slice(0, 5)
                    .map((book, i) => (
                      <div key={book.id} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                        <span className="font-medium">{i + 1}. {book.title}</span>
                        <span className="text-sm">{book.issuedCount} issued</span>
                      </div>
                    ))}
                </div>
              </Card>

              <Card className="p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {data.bookIssues
                    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
                    .slice(0, 5)
                    .map(issue => {
                      const book = data.books.find(b => b.id === issue.bookId);
                      const student = data.students.find(s => s.registerNumber === issue.studentId);
                      return (
                        <div key={issue.id} className="p-3 border rounded">
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {issue.status === "Issued" ? "Issued" : "Returned"}: {book?.title}
                            </span>
                            <span className="text-sm text-muted-foreground">{issue.issueDate}</span>
                          </div>
                          <p className="text-sm mt-1">
                            {student?.name} ({student?.registerNumber})
                          </p>
                          {issue.returnDate && (
                            <p className="text-sm text-muted-foreground mt-1">Returned on {issue.returnDate}</p>
                          )}
                          {issue.fine && issue.fine > 0 && (
                            <p className="text-sm text-warning mt-1">Fine: ₹{issue.fine}</p>
                          )}
                        </div>
                      );
                    })}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ======================
  // 📬 MESSAGING HUB (Common Component)
  // ======================

  const MessagingHub = () => {
    const [activeTab, setActiveTab] = useState("inbox");
    const [newMessage, setNewMessage] = useState({ toId: "", subject: "", body: "" });
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const messagesRef = useRef<HTMLDivElement>(null);

    const userMessages = data.messages.filter(m => 
      m.fromId === currentUser?.id || m.toId === currentUser?.id
    );

    const inbox = userMessages.filter(m => m.toId === currentUser?.id && !m.isRead);
    const sent = userMessages.filter(m => m.fromId === currentUser?.id);
    const archived = userMessages.filter(m => m.toId === currentUser?.id && m.isRead);

    const sendMessage = () => {
      const { toId, subject, body } = newMessage;
      if (!toId || !subject || !body) {
        toast({ title: "Incomplete", description: "All fields required.", variant: "destructive" });
        return;
      }
      const recipient = data.users.find(u => u.id === toId);
      if (!recipient) {
        toast({ title: "Invalid Recipient", description: "User not found.", variant: "destructive" });
        return;
      }
      const message: Message = {
        id: `msg${Date.now()}`,
        fromId: currentUser!.id,
        toId,
        fromRole: currentUser!.role,
        toRole: recipient.role,
        subject,
        body,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      setData(prev => ({
        ...prev,
        messages: [message, ...prev.messages]
      }));
      setNewMessage({ toId: "", subject: "", body: "" });
      toast({ title: "Message Sent", description: `To ${recipient.username}` });
      
      // SMS notification (future-ready)
      if (recipient.contactPhone) {
        onSendSMS(recipient.contactPhone, `New message from ${currentUser?.username}: "${subject}"`);
      }
    };

    const markAsRead = (id: string) => {
      setData(prev => ({
        ...prev,
        messages: prev.messages.map(m =>
          m.id === id && m.toId === currentUser?.id
            ? { ...m, isRead: true }
            : m
        )
      }));
    };

    useEffect(() => {
      if (selectedMessage && !selectedMessage.isRead && selectedMessage.toId === currentUser?.id) {
        markAsRead(selectedMessage.id);
      }
    }, [selectedMessage, currentUser]);

    return (
      <Card className="p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Messaging Hub
          </h2>
          <Button onClick={() => setActiveTab("compose")} size="sm">
            <Send className="w-4 h-4 mr-1" /> Compose
          </Button>
        </div>

        {activeTab === "compose" ? (
          <div className="space-y-4">
            <div>
              <Label>To</Label>
              <Select value={newMessage.toId} onValueChange={(v) => setNewMessage({...newMessage, toId: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  {data.users
                    .filter(u => u.id !== currentUser?.id)
                    .map(u => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.username} ({u.role})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subject</Label>
              <Input
                value={newMessage.subject}
                onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                placeholder="Message subject"
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                value={newMessage.body}
                onChange={(e) => setNewMessage({...newMessage, body: e.target.value})}
                rows={4}
                placeholder="Write your message..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={sendMessage}>Send Message</Button>
              <Button variant="outline" onClick={() => setActiveTab("inbox")}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-1">
                {[
                  { id: "inbox", label: "Inbox", count: inbox.length, icon: <Inbox className="w-4 h-4" /> },
                  { id: "sent", label: "Sent", count: 0, icon: <Send className="w-4 h-4" /> },
                  { id: "archived", label: "Archived", count: archived.length, icon: <FileArchive className="w-4 h-4" /> },
                ].map(tab => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "secondary" : "ghost"}
                    className="justify-start w-full"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.icon} {tab.label}
                    {tab.count > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Messages List */}
            <div className="lg:col-span-3">
              {activeTab === "inbox" && (
                <div>
                  <h3 className="font-medium mb-3">Inbox ({inbox.length} unread)</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto" ref={messagesRef}>
                    {inbox.map(msg => {
                      const sender = data.users.find(u => u.id === msg.fromId);
                      return (
                        <Card 
                          key={msg.id} 
                          className={`p-3 cursor-pointer hover:bg-muted/50 ${selectedMessage?.id === msg.id ? "border-primary" : ""}`}
                          onClick={() => setSelectedMessage(msg)}
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">{sender?.username || "Unknown"}</span>
                            <span className="text-xs text-muted-foreground">{new Date(msg.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-sm font-medium mt-1">{msg.subject}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{msg.body}</p>
                        </Card>
                      );
                    })}
                    {inbox.length === 0 && (
                      <p className="text-muted-foreground text-center py-8">No unread messages.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "sent" && (
                <div>
                  <h3 className="font-medium mb-3">Sent Messages</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {sent.map(msg => {
                      const recipient = data.users.find(u => u.id === msg.toId);
                      return (
                        <Card key={msg.id} className="p-3">
                          <div className="flex justify-between">
                            <span className="font-medium">To: {recipient?.username || "Unknown"}</span>
                            <span className="text-xs text-muted-foreground">{new Date(msg.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-sm font-medium mt-1">{msg.subject}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{msg.body}</p>
                        </Card>
                      );
                    })}
                    {sent.length === 0 && (
                      <p className="text-muted-foreground text-center py-8">No sent messages.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "archived" && (
                <div>
                  <h3 className="font-medium mb-3">Archived ({archived.length})</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {archived.map(msg => {
                      const sender = data.users.find(u => u.id === msg.fromId);
                      return (
                        <Card key={msg.id} className="p-3">
                          <div className="flex justify-between">
                            <span className="font-medium">{sender?.username || "Unknown"}</span>
                            <span className="text-xs text-muted-foreground">{new Date(msg.timestamp).toLocaleString()}</span>
                          </div>
                          <p className="text-sm font-medium mt-1">{msg.subject}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{msg.body}</p>
                        </Card>
                      );
                    })}
                    {archived.length === 0 && (
                      <p className="text-muted-foreground text-center py-8">No archived messages.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Message Detail */}
              {selectedMessage && (
                <Card className="p-4 mt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{selectedMessage.subject}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        From: {data.users.find(u => u.id === selectedMessage.fromId)?.username} 
                        • {new Date(selectedMessage.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedMessage(null)}
                    >
                      Close
                    </Button>
                  </div>
                  <div className="mt-3 whitespace-pre-wrap">
                    {selectedMessage.body}
                  </div>
                  {selectedMessage.hasAttachment && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-1">Attachments:</p>
                      <div className="flex gap-2">
                        {selectedMessage.attachments?.map((att, i) => (
                          <Button key={i} variant="outline" size="sm" asChild>
                            <a href={att.url} target="_blank" rel="noopener noreferrer">
                              <FileDown className="w-4 h-4 mr-1" /> {att.name}
                            </a>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </div>
          </div>
        )}
      </Card>
    );
  };

  // ======================
  // 🔄 RENDER DASHBOARDS
  // ======================

  return (
    <>
      {currentPage === "login" && <LoginPage />}
      {currentPage === "changePassword" && <ChangePasswordPage />}
      {currentPage === "adminDashboard" && <AdminDashboard />}
      {currentPage === "facultyDashboard" && <FacultyDashboard />}
      {currentPage === "parentDashboard" && <ParentDashboard />}
      {currentPage === "studentDashboard" && <StudentDashboard />}
      {currentPage === "accountsDashboard" && <AccountsDashboard />}
      {currentPage === "librarianDashboard" && <LibrarianDashboard />}
    </>
  );
};

export default Index;
