import "./auth.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import ForgotPasswordForm from "./ForgotPasswordForm";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const renderForm = () => {
    switch (path) {
      case "/signup":
        return <SignUp />;
      case "/forgot-password":
        return <ForgotPasswordForm />;
      default:
        return <SignIn />;
    }
  };

  const renderSwitchButtons = () => {
    switch (path) {
      case "/signup":
        return (
          <p className="text-white text-sm mt-4">
            Already have an account?
            <Button
              onClick={() => navigate("/signin")}
              variant="ghost"
              className="ml-2 text-blue-200 hover:text-white"
            >
              Sign in
            </Button>
          </p>
        );
      case "/forgot-password":
        return (
          <p className="text-white text-sm mt-4">
            Remembered your password?
            <Button
              onClick={() => navigate("/signin")}
              variant="ghost"
              className="ml-2 text-blue-200 hover:text-white"
            >
              Sign in
            </Button>
          </p>
        );
      default:
        return (
          <div className="flex flex-col items-center gap-3 mt-6">
            <p className="text-white text-sm">
              Don’t have an account?
              <Button
                onClick={() => navigate("/signup")}
                variant="ghost"
                className="ml-2 text-blue-200 hover:text-white"
              >
                Sign up
              </Button>
            </p>
            <p className="text-white text-sm">
              Forgot your password?
              <Button
                onClick={() => navigate("/forgot-password")}
                variant="ghost"
                className="ml-2 text-blue-200 hover:text-white"
              >
                Reset
              </Button>
            </p>
          </div>
        );
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/src/assets/pexels-worldspectrum-844124.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-black/50 flex justify-center items-center z-10">
        <div className="bg-white/30 backdrop-blur-lg shadow-2xl rounded-2xl w-[32rem] p-10 min-h-[36rem] flex flex-col justify-between items-center">
          <div className="w-full flex flex-col items-center">
            <h2 className="text-4xl font-bold text-white mb-8">Bulls Trading</h2>
            <section className="w-full">{renderForm()}</section>
          </div>
          <div className="w-full flex flex-col items-center">
            {renderSwitchButtons()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
