import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { insforge } from "@/lib/insforgeClient";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Github, Chrome } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await insforge.auth.signUp({
      email,
      password,
      name,
    });

    setLoading(false);

    if (error || !data) {
      setError(error?.message || "Unable to sign up.");
      return;
    }

    if (data.requireEmailVerification) {
      // For now just send them to login; email verification flow is handled via InsForge config.
      navigate("/login");
      return;
    }

    navigate("/");
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setError(null);
    try {
      await insforge.auth.signInWithOAuth({
        provider,
        redirectTo: window.location.origin,
      });
    } catch (err: any) {
      setError(err?.message || "Unable to start social signup.");
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-black/60 border-white/10">
          <div className="p-6">
            <h1 className="font-display text-2xl font-bold text-white mb-2">
              Create account
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Join PitchLive to follow matches, chat, and compete on the
              leaderboard.
            </p>
            <form className="space-y-4" onSubmit={handleSignup}>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? "Creating account..." : "Sign up"}
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Or sign up with
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-white/5 border-white/20 hover:bg-white/10"
                  onClick={() => handleOAuth("google")}
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-white/5 border-white/20 hover:bg-white/10"
                  onClick={() => handleOAuth("github")}
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Signup;
