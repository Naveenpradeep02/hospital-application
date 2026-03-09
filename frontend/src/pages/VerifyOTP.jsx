import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

function VerifyOTP() {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState("");
  const [timer, setTimer] = useState(30);

  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const inputs = useRef([]);

  /* ---------------- OTP INPUT ---------------- */

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputs.current[index - 1].focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const resetOTP = () => {
    setOtp(["", "", "", "", "", ""]);
    inputs.current[0]?.focus();
  };

  /* ---------------- VERIFY OTP ---------------- */

  const verify = async () => {
    if (verifyLoading) return;

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter full OTP");
      return;
    }

    setVerifyLoading(true);

    try {
      const res = await API.post("/auth/verify-otp", {
        email,
        otp: otpCode,
      });

      localStorage.setItem("token", res.data.token);

      setStatus("success");
      toast.success("OTP Verified Successfully");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      setStatus("error");
      toast.error("Invalid OTP");
      resetOTP();
    } finally {
      setVerifyLoading(false);
    }
  };

  /* ---------------- RESEND OTP ---------------- */

  const resendOTP = async () => {
    if (resendLoading) return;

    setResendLoading(true);

    try {
      await API.post("/auth/resend-otp", { email });

      toast.success("OTP resent successfully");

      setTimer(30);
      resetOTP();
    } catch (err) {
      toast.error("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  /* ---------------- TIMER ---------------- */

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-700">
      <div className="w-[420px] backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-2xl p-10 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Verify OTP</h2>

        <p className="text-white/80 mb-8">
          Enter the 6 digit code sent to your email
        </p>

        {/* OTP BOXES */}
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              value={digit}
              maxLength={1}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`w-12 h-12 text-center text-xl rounded-lg outline-none border transition
              ${
                status === "success"
                  ? "border-green-400"
                  : status === "error"
                    ? "border-red-400"
                    : "border-white/40"
              }
              bg-white/20 text-white`}
            />
          ))}
        </div>

        {/* VERIFY BUTTON */}
        <button
          onClick={verify}
          disabled={verifyLoading}
          className="w-full bg-white text-gray-700 font-semibold py-3 rounded-lg hover:bg-white/80 transition mb-4 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {verifyLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span>
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </button>

        {/* RESEND OTP */}
        {timer > 0 ? (
          <p className="text-white/80 text-sm">Resend OTP in {timer}s</p>
        ) : (
          <button
            onClick={resendOTP}
            disabled={resendLoading}
            className="text-white font-semibold underline flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {resendLoading ? (
              <>
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Resending...
              </>
            ) : (
              "Resend OTP"
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default VerifyOTP;
