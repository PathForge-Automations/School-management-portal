import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, GraduationCap } from "lucide-react";

interface Props {
  onLogin: (username: string, password: string) => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [show, setShow] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={show ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            onClick={() => onLogin(form.username, form.password)}
            className="w-full"
            size="lg"
          >
            Sign In
          </Button>
        </div>

        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground font-medium mb-2">
            Demo Credentials:
          </p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>Admin: admin / welcome</p>
            <p>Faculty: faculty1 / welcome</p>
            <p>Parent: parent1 / welcome</p>
            <p>Accounts: accounts / welcome</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
