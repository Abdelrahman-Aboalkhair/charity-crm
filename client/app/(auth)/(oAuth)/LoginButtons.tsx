"use client";
import Image from "next/image";
import FacebookIcon from "@/app/assets/icons/facebook.png";
import GoogleIcon from "@/app/assets/icons/google.png";
import XIcon from "@/app/assets/icons/twitter.png";

export default function LoginButtons() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/google";
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/facebook";
  };

  const handleXLogin = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/twitter";
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-full mx-auto">
      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-3 w-full px-4 py-4 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md border border-gray-300 transition-all"
      >
        <div className="flex-shrink-0 relative">
          <Image width={23} src={GoogleIcon} alt="Google" objectFit="contain" />
        </div>
        <span>Continue with Google</span>
      </button>

      <button
        onClick={handleFacebookLogin}
        className="flex items-center justify-center gap-3 w-full px-4 py-4 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md border border-gray-300 transition-all"
      >
        <div className="flex-shrink-0 relative">
          <Image
            width={27}
            src={FacebookIcon}
            alt="Facebook"
            objectFit="contain"
          />
        </div>
        <span>Continue with Facebook</span>
      </button>

      <button
        onClick={handleXLogin}
        className="flex items-center justify-center gap-3 w-full px-4 py-4 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md border border-gray-300 transition-all"
      >
        <div className="flex-shrink-0 relative">
          <Image width={20} src={XIcon} alt="X" objectFit="contain" />
        </div>
        <span>Continue with X</span>
      </button>
    </div>
  );
}
