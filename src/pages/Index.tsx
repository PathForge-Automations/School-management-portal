// Index.tsx (FULL UPDATED VERSION)
// Implements:
// - Auto registration number: SCHL2025001
// - Remove subjects/marks from "My Students" attendance view
// - Student register number = Parent username, default password = "welcome", force change on first login
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import html2pdf from 'html2pdf.js';
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
} from "lucide-react";

// Types
type Role = "Admin" | "Faculty" | "Parent" | "Accounts";
type FeeStatus = "Paid" | "Pending";
type LeaveStatus = "Pending" | "Approved" | "Rejected";
type ReportStatus = "Pending" | "Reviewed" | "Ignored";

interface User {
  id: string;
  username: string;
  password: string;
  role: Role;
  studentId?: string;
  assignedStudents?: string[];
  isFirstLogin: boolean;
}

interface AttendanceRecord {
  date: string;
  session: 'morning' | 'afternoon';
  present: boolean;
}

interface Student {
  registerNumber: string;
  name: string;
  grade: string;
  section: string;
  fatherName?: string;
  motherName?: string;
  fatherPhone?: string;
  motherPhone?: string;
  address?: string;
  attendance: AttendanceRecord[];
  marks: Record<string, number>;
  disciplinaryActions: string[];
  isPortalBlocked: boolean;
  totalFee: number;
}

interface Fee {
  id: string;
  studentRegisterNumber: string;
  totalDue: number;
  amountPaid: number;
  status: FeeStatus;
  lastPaymentDate: string;
}

interface Leave {
  id: string;
  facultyId: string;
  dateStart: string;
  dateEnd: string;
  reason: string;
  status: LeaveStatus;
}

interface Announcement {
  id: string;
  adminId: string;
  date: string;
  content: string;
  audience: string;
}

interface DisciplinaryReport {
  id: string;
  studentRegisterNumber: string;
  facultyId: string;
  date: string;
  description: string;
  status: ReportStatus;
}

interface AppData {
  users: User[];
  students: Student[];
  fees: Fee[];
  leaves: Leave[];
  announcements: Announcement[];
  disciplinaryReports: DisciplinaryReport[];
}

const Index = () => {
  const currentYear = new Date().getFullYear();

  const [data, setData] = useState<AppData>({
    users: [
      {
        id: "admin1",
        username: "admin",
        password: "welcome",
        role: "Admin",
        isFirstLogin: true,
      },
      {
        id: "faculty1",
        username: "faculty1",
        password: "welcome",
        role: "Faculty",
        assignedStudents: ["SCHL2025001", "SCHL2025002"],
        isFirstLogin: true,
      },
      {
        id: "parent1",
        username: "SCHL2025001",
        password: "welcome",
        role: "Parent",
        studentId: "SCHL2025001",
        isFirstLogin: true,
      },
      {
  id: "parent2",
  username: "SCHL2025002",
  password: "welcome",
  role: "Parent",
  studentId: "SCHL2025002",
  isFirstLogin: true,
},
      {
        id: "accounts1",
        username: "accounts",
        password: "welcome",
        role: "Accounts",
        isFirstLogin: true,
      },
    ],
    students: [
      {
        registerNumber: "SCHL2025001",
        name: "Alice Johnson",
        grade: "10th Grade",
        section: "A",
        fatherName: "John Johnson",
        motherName: "Jane Johnson",
        fatherPhone: "9876543210",
        motherPhone: "9876543211",
        address: "123 Main St, City",
        totalFee: 20000,
        attendance: [
          { date: "2025-01-15", session: "morning", present: true },
          { date: "2025-01-15", session: "afternoon", present: true },
          { date: "2025-01-16", session: "morning", present: true },
          { date: "2025-01-16", session: "afternoon", present: false },
          { date: "2025-01-17", session: "morning", present: false },
        ],
        marks: {
          Telugu: 80,
          Hindi: 75,
          English: 88,
          Mathematics: 85,
          Science: 92,
          Social: 82,
          Biology: 90,
        },
        disciplinaryActions: [],
        isPortalBlocked: false,
      },
      {
        registerNumber: "SCHL2025002",
        name: "Bob Smith",
        grade: "10th Grade",
        section: "B",
        fatherName: "Robert Smith",
        motherName: "Emily Smith",
        fatherPhone: "8765432109",
        motherPhone: "8765432108",
        address: "456 Oak Ave, Town",
        totalFee: 20000,
        attendance: [
          { date: "2025-01-15", session: "morning", present: true },
          { date: "2025-01-15", session: "afternoon", present: true },
          { date: "2025-01-16", session: "morning", present: false },
          { date: "2025-01-16", session: "afternoon", present: true },
          { date: "2025-01-17", session: "morning", present: false },
        ],
        marks: {
          Telugu: 70,
          Hindi: 65,
          English: 75,
          Mathematics: 78,
          Science: 82,
          Social: 88,
          Biology: 79,
        },
        disciplinaryActions: ["Late submission of homework - Jan 10, 2025"],
        isPortalBlocked: false,
      },
    ],
    fees: [
      {
        id: "fee1",
        studentRegisterNumber: "SCHL2025001",
        totalDue: 5000,
        amountPaid: 5000,
        status: "Paid",
        lastPaymentDate: "2025-01-10",
      },
      {
        id: "fee2",
        studentRegisterNumber: "SCHL2025002",
        totalDue: 5000,
        amountPaid: 0,
        status: "Pending",
        lastPaymentDate: "",
      },
    ],
    leaves: [
      {
        id: "leave1",
        facultyId: "faculty1",
        dateStart: "2025-02-01",
        dateEnd: "2025-02-03",
        reason: "Medical appointment",
        status: "Pending",
      },
    ],
    announcements: [
      {
        id: "ann1",
        adminId: "admin1",
        date: "2025-01-20",
        content: "Winter break starts from February 15th. Classes will resume on March 1st.",
        audience: "All",
      },
    ],
    disciplinaryReports: [],
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>("login");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [passwordForm, setPasswordForm] = useState({ newPassword: "", confirmPassword: "" });

  const calculateAttendance = (attendance: AttendanceRecord[]) => {
    if (attendance.length === 0) return 0;
    const present = attendance.filter((a) => a.present).length;
    return Math.round((present / attendance.length) * 100);
  };

  const handleLogin = (credentials?: { username: string; password: string }) => {
    const username = credentials ? credentials.username : loginForm.username;
    const password = credentials ? credentials.password : loginForm.password;
    const user = data.users.find((u) => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      if (user.isFirstLogin) {
        setCurrentPage("changePassword");
        toast({
          title: "Password Change Required",
          description: "Please change your password to continue.",
        });
      } else {
        setCurrentPage(`${user.role.toLowerCase()}Dashboard`);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.username}!`,
        });
      }
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = (newPassword: string, confirmPassword: string) => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
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
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("login");
    setLoginForm({ username: "", password: "" });
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

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
            <p className="text-muted-foreground text-sm mt-2">Management System</p>
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
          </div>
        </Card>
      </div>
    );
  };

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

  const AdminDashboard = () => {
    const [searchRN, setSearchRN] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [newAnnouncement, setNewAnnouncement] = useState("");
    const [showDebug, setShowDebug] = useState(false);

    const handleSearch = () => {
      const student = data.students.find((s) => s.registerNumber === searchRN);
      if (student) {
        setSelectedStudent(student);
        toast({
          title: "Student Found",
          description: `Loaded records for ${student.name}`,
        });
      } else {
        toast({
          title: "Not Found",
          description: "No student with this register number.",
          variant: "destructive",
        });
      }
    };

    const handleLeaveAction = (leaveId: string, newStatus: LeaveStatus) => {
      setData((prev) => ({
        ...prev,
        leaves: prev.leaves.map((l) =>
          l.id === leaveId ? { ...l, status: newStatus } : l
        ),
      }));
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
    };

    const postAnnouncement = () => {
      if (!newAnnouncement.trim()) return;
      const announcement: Announcement = {
        id: `ann${Date.now()}`,
        adminId: currentUser!.id,
        date: new Date().toISOString().split("T")[0],
        content: newAnnouncement,
        audience: "All",
      };
      setData((prev) => ({
        ...prev,
        announcements: [announcement, ...prev.announcements],
      }));
      setNewAnnouncement("");
    };

    const handleReportAction = (reportId: string, action: "ignore" | "block") => {
      const report = data.disciplinaryReports.find((r) => r.id === reportId);
      if (!report) return;
      if (action === "ignore") {
        setData((prev) => ({
          ...prev,
          disciplinaryReports: prev.disciplinaryReports.map((r) =>
            r.id === reportId ? { ...r, status: "Ignored" } : r
          ),
        }));
        toast({ title: "Report Ignored", description: "Report has been ignored." });
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
            r.id === reportId ? { ...r, status: "Reviewed" } : r
          ),
        }));
        toast({
          title: "Student Blocked",
          description: `Portal blocked for ${report.studentRegisterNumber}.`,
        });
      }
    };

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
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">{data.students.length}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </Card>
            <Card className="p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Fees</p>
                  <p className="text-2xl font-bold text-foreground">
                    {data.fees.filter((f) => f.status === "Pending").length}
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
                      {selectedStudent.registerNumber} • {selectedStudent.grade}
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
                          {calculateAttendance(selectedStudent.attendance)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${calculateAttendance(selectedStudent.attendance)}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      {Array.from(new Set(selectedStudent.attendance.map(a => a.date))).slice(-5).map(date => {
                        const dayRecords = selectedStudent.attendance.filter(a => a.date === date);
                        return (
                          <div key={date} className="flex items-center justify-between border-b pb-1">
                            <span className="text-muted-foreground">{date}</span>
                            <div className="flex gap-4">
                              <span className={dayRecords.find(r => r.session === 'morning')?.present ? "text-success font-medium" : "text-destructive"}>
                                Morning: {dayRecords.find(r => r.session === 'morning')?.present ? "Present" : "Absent"}
                              </span>
                              <span className={dayRecords.find(r => r.session === 'afternoon')?.present ? "text-success font-medium" : "text-destructive"}>
                                Afternoon: {dayRecords.find(r => r.session === 'afternoon')?.present ? "Present" : "Absent"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      Exam Marks
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(selectedStudent.marks).map(([subject, mark]) => (
                        <div key={subject} className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{subject}</span>
                          <span className="font-semibold text-foreground">{mark}/100</span>
                        </div>
                      ))}
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
                        <span className="w-4 h-4 text-primary">₹</span>
                        Fee Status
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total Due</p>
                          <p className="font-semibold text-lg">₹{feeRecord.totalDue}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Amount Paid</p>
                          <p className="font-semibold text-lg">₹{feeRecord.amountPaid}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              feeRecord.status === "Paid"
                                ? "bg-success/10 text-success"
                                : "bg-warning/10 text-warning"
                            }`}
                          >
                            {feeRecord.status}
                          </span>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Payment</p>
                          <p className="font-medium">
                            {feeRecord.lastPaymentDate || "N/A"}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ) : null;
                })()}
                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="w-4 h-4 text-primary">₹</span>
                    Total Fee
                  </h4>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{selectedStudent.totalFee?.toLocaleString() || "N/A"}
                  </p>
                </Card>
              </div>
            )}
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
              {data.disciplinaryReports.map((r) => (
                <div key={r.id} className="p-4 bg-muted/30 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium">Student: {r.studentRegisterNumber}</p>
                    <p className="text-sm text-muted-foreground mt-1">By: {r.facultyId} • {r.date}</p>
                    <p className="text-sm mt-2">{r.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Status: {r.status}</p>
                  </div>
                  <div className="flex gap-2">
                    {r.status === "Pending" && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleReportAction(r.id, "ignore")}>
                          Ignore
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReportAction(r.id, "block")}>
                          Block Student
                        </Button>
                      </>
                    )}
                    {r.status !== "Pending" && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium self-start sm:self-center">
                        {r.status}
                      </span>
                    )}
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
              {data.leaves.map((leave) => {
                const faculty = data.users.find((u) => u.id === leave.facultyId);
                return (
                  <div
                    key={leave.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/30 rounded-lg gap-3"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{faculty?.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {leave.dateStart} to {leave.dateEnd}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{leave.reason}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          leave.status === "Approved"
                            ? "bg-success/10 text-success"
                            : leave.status === "Rejected"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {leave.status}
                      </span>
                      {leave.status === "Pending" && (
                        <>
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
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              {data.leaves.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No leave requests at the moment.
                </p>
              )}
            </div>
          </Card>
          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Post Announcement
            </h2>
            <div className="space-y-3">
              <Textarea
                placeholder="Write your announcement here..."
                value={newAnnouncement}
                onChange={(e) => setNewAnnouncement(e.target.value)}
                rows={3}
              />
              <Button onClick={postAnnouncement}>
                <Bell className="w-4 h-4" />
                Publish Announcement
              </Button>
            </div>
          </Card>
          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Recent Announcements
            </h2>
            <div className="space-y-3">
              {data.announcements.map((ann) => (
                <div key={ann.id} className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <span className="text-xs text-muted-foreground">{ann.date}</span>
                  <p className="text-sm text-foreground mt-1">{ann.content}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
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

  const FacultyDashboard = () => {
    const [selectedStudentRN, setSelectedStudentRN] = useState("");
    const [newMark, setNewMark] = useState({ subject: "", mark: "" });
    const [leaveForm, setLeaveForm] = useState({
      dateStart: "",
      dateEnd: "",
      reason: "",
    });
    const [showMyStudents, setShowMyStudents] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSession, setSelectedSession] = useState<'morning' | 'afternoon'>('morning');
    const [studentForm, setStudentForm] = useState({
      registerNumber: "",
      name: "",
      fatherName: "",
      motherName: "",
      fatherPhone: "",
      motherPhone: "",
      address: "",
      grade: "8th Grade",
      section: "A",
      totalFee: 20000,
    });
    const [searchRN, setSearchRN] = useState("");
    const [foundStudent, setFoundStudent] = useState<Student | null>(null);
    const [disciplineText, setDisciplineText] = useState("");

    const assignedStudents = data.students.filter((s) =>
      currentUser?.assignedStudents?.includes(s.registerNumber)
    );

    const isStudentBlocked = (registerNumber: string) => {
      const s = data.students.find((st) => st.registerNumber === registerNumber);
      return s ? s.isPortalBlocked : false;
    };

    const markAttendance = (registerNumber: string, present: boolean, date: string, session: 'morning' | 'afternoon') => {
      if (isStudentBlocked(registerNumber)) {
        toast({
          title: "Action Blocked",
          description: "Portal blocked — please contact admin.",
          variant: "destructive",
        });
        return;
      }
      const existingAttendance = data.students
        .find(s => s.registerNumber === registerNumber)
        ?.attendance.filter(a => a.date === date);
      if (existingAttendance?.length === 2) {
        toast({
          title: "Attendance Already Marked",
          description: "Both morning and afternoon attendance already marked for this date.",
          variant: "destructive",
        });
        return;
      }
      if (existingAttendance?.some(a => a.session === session)) {
        toast({
          title: "Session Already Marked",
          description: `${session.charAt(0).toUpperCase() + session.slice(1)} attendance already marked for this date.`,
          variant: "destructive",
        });
        return;
      }
      setData((prev) => {
        const updatedStudents = prev.students.map((s) =>
          s.registerNumber === registerNumber
            ? { ...s, attendance: [...s.attendance, { date, session, present }] }
            : s
        );
        return { ...prev, students: updatedStudents };
      });
      toast({
        title: "Attendance Marked",
        description: `Student marked as ${present ? "present" : "absent"} for ${session} session on ${date}.`,
      });
    };

    const uploadMark = () => {
      if (!selectedStudentRN || !newMark.subject || newMark.mark === "") {
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
          description: "Portal blocked — cannot upload marks for this student.",
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
                marks: { ...s.marks, [newMark.subject]: parseInt(newMark.mark) },
              }
            : s
        ),
      }));
      setNewMark({ subject: "", mark: "" });
      toast({
        title: "Mark Uploaded",
        description: `${newMark.subject} mark updated successfully.`,
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
        facultyId: currentUser!.id,
        dateStart: leaveForm.dateStart,
        dateEnd: leaveForm.dateEnd,
        reason: leaveForm.reason,
        status: "Pending",
      };
      setData((prev) => ({
        ...prev,
        leaves: [...prev.leaves, leave],
      }));
      setLeaveForm({ dateStart: "", dateEnd: "", reason: "" });
      toast({
        title: "Leave Requested",
        description: "Your leave request has been submitted.",
      });
    };

    // ✅ FIXED: Now generates SCHL2025001 format
    const generateRegisterNumber = () => {
      const year = new Date().getFullYear();
      const existingStudents = data.students
        .filter(s => s.registerNumber.startsWith(`SCHL${year}`))
        .map(s => parseInt(s.registerNumber.slice(9))); // "SCHL2025" = 8 chars, so slice(8) → but we use 9 for 3-digit
      const nextNumber = existingStudents.length > 0 ? Math.max(...existingStudents) + 1 : 1;
      return `SCHL${year}${nextNumber.toString().padStart(3, '0')}`;
    };

    const saveStudent = () => {
      const {
        name,
        grade,
        section,
        fatherName,
        motherName,
        fatherPhone,
        motherPhone,
        address,
      } = studentForm;
      if (!name || !grade || !section) {
        toast({
          title: "Required Fields Missing",
          description: "Name, Grade, and Section are required.",
          variant: "destructive",
        });
        return;
      }

      const newRegisterNumber = generateRegisterNumber();
      const baseSubjects = ["Telugu", "Hindi", "English", "Mathematics", "Science", "Social"];
      const gradeNum = parseInt(grade.replace(/\D/g, ""));
      const subjects = gradeNum >= 8 && gradeNum <= 10 ? [...baseSubjects, "Biology"] : baseSubjects;
      const newMarks: Record<string, number> = {};
      subjects.forEach((sub) => {
        newMarks[sub] = 0;
      });

      const existingStudentIndex = data.students.findIndex((s) => s.registerNumber === studentForm.registerNumber);
      if (existingStudentIndex >= 0) {
        setData((prev) => {
          const updatedStudents = [...prev.students];
          updatedStudents[existingStudentIndex] = {
            ...updatedStudents[existingStudentIndex],
            name,
            grade,
            section,
            fatherName,
            motherName,
            fatherPhone,
            motherPhone,
            address,
            marks: { ...updatedStudents[existingStudentIndex].marks, ...newMarks },
          };
          return { ...prev, students: updatedStudents };
        });
        toast({
          title: "Student Updated",
          description: `Student ${name} updated successfully.`,
        });
      } else {
        const newStudent: Student = {
          registerNumber: newRegisterNumber,
          name,
          grade,
          section,
          fatherName,
          motherName,
          fatherPhone,
          motherPhone,
          address,
          attendance: [],
          marks: newMarks,
          disciplinaryActions: [],
          isPortalBlocked: false,
          totalFee: studentForm.totalFee,
        };
        setData((prev) => {
          const parentUser: User = {
            id: `parent${Date.now()}`,
            username: newRegisterNumber,
            password: "welcome",
            role: "Parent",
            studentId: newRegisterNumber,
            isFirstLogin: true,
          };
          const updatedUsers = [
            ...prev.users.map((u) =>
              u.id === currentUser?.id
                ? {
                    ...u,
                    assignedStudents: u.assignedStudents
                      ? [...u.assignedStudents, newRegisterNumber]
                      : [newRegisterNumber],
                  }
                : u
            ),
            parentUser,
          ];
          return {
            ...prev,
            students: [...prev.students, newStudent],
            users: updatedUsers,
          };
        });
        setCurrentUser((prev) => {
          if (!prev) return prev;
          const currentAssigned = prev.assignedStudents ? [...prev.assignedStudents, newRegisterNumber] : [newRegisterNumber];
          return { ...prev, assignedStudents: currentAssigned };
        });
        toast({
          title: "Student Added",
          description: `New student ${name} added and assigned to you.`,
        });
      }
      setStudentForm({
        registerNumber: "",
        name: "",
        fatherName: "",
        motherName: "",
        fatherPhone: "",
        motherPhone: "",
        address: "",
        grade: "8th Grade",
        section: "A",
        totalFee: 20000,
      });
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
        facultyId: currentUser!.id,
        date: new Date().toISOString().split("T")[0],
        description: disciplineText.trim(),
        status: "Pending",
      };
      setData((prev) => ({ ...prev, disciplinaryReports: [report, ...prev.disciplinaryReports] }));
      setDisciplineText("");
      toast({ title: "Report Submitted", description: "Admin will review this report." });
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
          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add / Update Student
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Register Number *</Label>
                <Input
                  value={studentForm.registerNumber}
                  onChange={(e) => setStudentForm({ ...studentForm, registerNumber: e.target.value })}
                  placeholder="e.g., SCHL2025101"
                />
              </div>
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
                  {["6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade"].map((g) => (
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
                <Label>Total Fee (₹)</Label>
                <Input
                  type="number"
                  value={studentForm.totalFee}
                  onChange={(e) => setStudentForm({ ...studentForm, totalFee: parseFloat(e.target.value) || 0 })}
                  placeholder="Enter total fee"
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
              {data.students.some((s) => s.registerNumber === studentForm.registerNumber)
                ? "Update Student"
                : "Add Student"}
            </Button>
          </Card>

          {/* ✅ My Students Section — MARKS REMOVED FROM ATTENDANCE VIEW */}
          <Card className="p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                My Students
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
                          Attendance: {calculateAttendance(student.attendance)}%
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
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
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => markAttendance(student.registerNumber, true, selectedDate, selectedSession)}
                          >
                            <Check className="w-4 h-4" />
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => markAttendance(student.registerNumber, false, selectedDate, selectedSession)}
                          >
                            <X className="w-4 h-4" />
                            Absent
                          </Button>
                        </div>
                      </div>
                    </div>
                    {/* ✅ REMOVED: No marks grid here anymore */}
                  </div>
                ))}
                {assignedStudents.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No students assigned yet.</p>
                )}
              </div>
            )}
          </Card>

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
                  <div>
                    <Button onClick={() => {
                      if (!currentUser?.assignedStudents?.includes(foundStudent.registerNumber)) {
                        setData((prev) => ({
                          ...prev,
                          users: prev.users.map((u) =>
                            u.id === currentUser?.id
                              ? { ...u, assignedStudents: [...(u.assignedStudents || []), foundStudent.registerNumber] }
                              : u
                          ),
                        }));
                        setCurrentUser((prev) => {
                          if (!prev) return prev;
                          return { ...prev, assignedStudents: [...(prev.assignedStudents || []), foundStudent.registerNumber] };
                        });
                        toast({ title: "Assigned", description: `${foundStudent.name} assigned to you.` });
                      } else {
                        toast({ title: "Already Assigned", description: "This student is already in your list." });
                      }
                    }}>
                      Assign to me
                    </Button>
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
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Search for a student to add a disciplinary record.</p>
            )}
          </Card>

          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Upload Marks
            </h2>
            <div className="space-y-4">
              {assignedStudents.map((student) => {
                const baseSubjects = ["Telugu", "Hindi", "English", "Mathematics", "Science", "Social"];
                const gradeNum = parseInt(student.grade.replace(/\D/g, ""));
                const subjects = gradeNum >= 8 && gradeNum <= 10 ? [...baseSubjects, "Biology"] : baseSubjects;
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
                      <div className="mt-4 grid gap-4">
                        {subjects.map((subject) => (
                          <div key={subject} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                            <div>
                              <p className="font-medium">{subject}</p>
                              <p className="text-sm text-muted-foreground">Current: {student.marks[subject] || 0}/100</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                placeholder="Enter mark"
                                className="w-24"
                                value={newMark.subject === subject ? newMark.mark : ""}
                                onChange={(e) => setNewMark({ subject, mark: e.target.value })}
                                min="0"
                                max="100"
                              />
                              <Button
                                size="sm"
                                variant={newMark.subject === subject && newMark.mark ? "default" : "secondary"}
                                onClick={() => {
                                  if (newMark.subject === subject && newMark.mark) {
                                    uploadMark();
                                  } else {
                                    setNewMark({ subject, mark: "" });
                                  }
                                }}
                              >
                                {newMark.subject === subject && newMark.mark ? "Save" : "Update"}
                              </Button>
                            </div>
                          </div>
                        ))}
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

          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Request Leave
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
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
                .filter((l) => l.facultyId === currentUser?.id)
                .map((leave) => (
                  <div
                    key={leave.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/30 rounded-lg gap-2"
                  >
                    <div>
                      <p className="font-medium">
                        {leave.dateStart} to {leave.dateEnd}
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
              {data.leaves.filter((l) => l.facultyId === currentUser?.id).length === 0 && (
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
              {data.announcements.map((ann) => (
                <div key={ann.id} className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <span className="text-xs text-muted-foreground">{ann.date}</span>
                  <p className="text-sm text-foreground mt-1">{ann.content}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const ParentDashboard = () => {
    const student = data.students.find((s) => s.registerNumber === currentUser?.studentId);
    const feeRecord = data.fees.find((f) => f.studentRegisterNumber === currentUser?.studentId);

    const handlePayment = () => {
      if (!feeRecord) return;
      setData((prev) => ({
        ...prev,
        fees: prev.fees.map((f) =>
          f.id === feeRecord.id
            ? {
                ...f,
                status: "Paid",
                amountPaid: f.totalDue,
                lastPaymentDate: new Date().toISOString().split("T")[0],
              }
            : f
        ),
      }));
      toast({
        title: "Payment Successful",
        description: "Fee payment has been processed.",
      });
    };

    const downloadReceiptAsPDF = () => {
      const student = data.students.find((s) => s.registerNumber === currentUser?.studentId);
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Fee Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1 { margin: 0; color: #1e293b; }
            .header p { margin: 4px 0; color: #64748b; }
            .receipt { border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; background: #f8fafc; }
            .row { display: flex; justify-content: space-between; margin: 8px 0; }
            .label { font-weight: bold; color: #334155; }
            .value { color: #1e293b; }
            .amount { font-size: 1.2em; font-weight: bold; color: #0d9488; }
            .footer { margin-top: 20px; text-align: center; color: #64748b; font-size: 0.85em; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>School Fee Receipt</h1>
            <p>${new Date().getFullYear()} Academic Year</p>
          </div>
          <div class="receipt">
            <div class="row"><span class="label">Receipt No:</span><span class="value">#${feeRecord?.id.toUpperCase()}</span></div>
            <div class="row"><span class="label">Date:</span><span class="value">${new Date(feeRecord?.lastPaymentDate || "").toLocaleDateString()}</span></div>
            <div class="row"><span class="label">Student Name:</span><span class="value">${student?.name || "N/A"}</span></div>
            <div class="row"><span class="label">Register Number:</span><span class="value">${currentUser?.studentId || "N/A"}</span></div>
            <div class="row"><span class="label">Amount Paid:</span><span class="value amount">₹${feeRecord?.amountPaid}</span></div>
            <div class="row"><span class="label">Status:</span><span class="value">Paid ✅</span></div>
          </div>
          <div class="footer">
            <p>Thank you for your payment. This is a computer-generated receipt.</p>
          </div>
        </body>
        </html>
      `;
      const element = document.createElement('div');
      element.innerHTML = printContent;
      document.body.appendChild(element);
      html2pdf()
        .from(element)
        .set({
          filename: `receipt_${student?.name || 'student'}_${new Date().toISOString().split('T')[0]}.pdf`,
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
                  Viewing: {student.name}
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
                  {student.registerNumber} • {student.grade}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              Attendance Record
            </h2>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Current Attendance Rate</span>
                <span className="text-3xl font-bold text-primary">
                  {calculateAttendance(student.attendance)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all"
                  style={{ width: `${calculateAttendance(student.attendance)}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              {student.attendance.slice(-10).reverse().map((record, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <span className="text-sm text-muted-foreground">{record.date}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      record.present
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {record.present ? "Present" : "Absent"}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(student.marks).map(([subject, mark]) => (
                <div key={subject} className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">{subject}</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-foreground">{mark}</span>
                    <span className="text-muted-foreground mb-1">/100</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        mark >= 80
                          ? "bg-success"
                          : mark >= 60
                          ? "bg-primary"
                          : "bg-warning"
                      }`}
                      style={{ width: `${mark}%` }}
                    />
                  </div>
                </div>
              ))}
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
          {feeRecord && (
            <Card className="p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-5 h-5 text-primary">₹</span>
                Fee Status
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Due</p>
                    <p className="text-3xl font-bold text-foreground">₹{feeRecord.totalDue}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount Paid</p>
                    <p className="text-3xl font-bold text-success">₹{feeRecord.amountPaid}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="text-3xl font-bold text-warning">
                      ₹{feeRecord.totalDue - feeRecord.amountPaid}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <div
                    className={`p-4 rounded-lg text-center mb-4 ${
                      feeRecord.status === "Paid"
                        ? "bg-success/10 border border-success/20"
                        : "bg-warning/10 border border-warning/20"
                    }`}
                  >
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <p
                      className={`text-2xl font-bold ${
                        feeRecord.status === "Paid" ? "text-success" : "text-warning"
                      }`}
                    >
                      {feeRecord.status}
                    </p>
                  </div>
                  {feeRecord.status === "Pending" && (
                    <Button onClick={handlePayment} size="lg" className="w-full">
                      <span className="w-4 h-4 inline-flex items-center justify-center">₹</span>
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
                      Download Receipt as PDF
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
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              School Announcements
            </h2>
            <div className="space-y-3">
              {data.announcements.map((ann) => (
                <div key={ann.id} className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <span className="text-xs text-muted-foreground">{ann.date}</span>
                  <p className="text-sm text-foreground mt-1">{ann.content}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const AccountsDashboard = () => {
    const [filterStatus, setFilterStatus] = useState<"All" | FeeStatus>("All");
    const [searchRN, setSearchRN] = useState("");
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Fees Due</p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{data.fees.reduce((sum, f) => sum + f.totalDue, 0)}
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
                    ₹{data.fees.reduce((sum, f) => sum + f.amountPaid, 0)}
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
                    {data.fees.filter((f) => f.status === "Pending").length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-warning" />
              </div>
            </Card>
          </div>
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
                  variant={filterStatus === "Pending" ? "warning" : "outline"}
                  onClick={() => setFilterStatus("Pending")}
                  size="sm"
                >
                  Pending
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
  {filteredFees.map((fee) => (
    <tr key={fee.id} className="border-b border-border hover:bg-muted/30">
      <td className="p-3 text-sm">{fee.studentRegisterNumber}</td>
      <td className="p-3 text-sm">₹{fee.totalDue}</td>
      <td className="p-3 text-sm font-semibold text-success">
        ₹{fee.amountPaid}
      </td>
      <td className="p-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            fee.status === "Paid"
              ? "bg-success/10 text-success"
              : "bg-warning/10 text-warning"
          }`}
        >
          {fee.status}
        </span>
      </td>
      <td className="p-3 text-sm text-muted-foreground">
        {fee.lastPaymentDate || "N/A"}
      </td>
      <td className="p-3">
        {fee.status === "Pending" && (
          <Button
            size="sm"
            variant="success"
            onClick={() =>
              updateFee(fee.id, {
                status: "Paid",
                amountPaid: fee.totalDue,
                lastPaymentDate: new Date().toISOString().split("T")[0],
              })
            }
          >
            Mark Paid
          </Button>
        )}
      </td>
    </tr>
  ))}
</tbody>
</table>
              {filteredFees.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No fee records found.</p>
              )}
            </div>
          </Card>
          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Announcements
            </h2>
            <div className="space-y-3">
              {data.announcements.map((ann) => (
                <div key={ann.id} className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <span className="text-xs text-muted-foreground">{ann.date}</span>
                  <p className="text-sm text-foreground mt-1">{ann.content}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <>
      {currentPage === "login" && <LoginPage />}
      {currentPage === "changePassword" && <ChangePasswordPage />}
      {currentPage === "adminDashboard" && <AdminDashboard />}
      {currentPage === "facultyDashboard" && <FacultyDashboard />}
      {currentPage === "parentDashboard" && <ParentDashboard />}
      {currentPage === "accountsDashboard" && <AccountsDashboard />}
    </>
  );
};

export default Index;