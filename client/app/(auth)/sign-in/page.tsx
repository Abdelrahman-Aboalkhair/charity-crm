"use client";
import { useForm } from "react-hook-form";
import Input from "@/app/components/atoms/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MainLayout from "@/app/components/templates/MainLayout";
import { Loader2 } from "lucide-react";
import LoginButtons from "../(oAuth)/LoginButtons";
import { useSignInMutation } from "@/app/store/apis/AuthApi";
import { useAppDispatch } from "@/app/store/hooks";
import { setUser } from "@/app/store/slices/AuthSlice";

interface InputForm {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
}

const SignIn = () => {
  const dispatch = useAppDispatch();
  const [signIn, { error, isLoading }] = useSignInMutation();
  console.log("error: ", error);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InputForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData: InputForm) => {
    try {
      const result = await signIn(formData).unwrap();
      console.log("result: ", result);
      if (result.success) {
        dispatch(setUser(result.user));
        router.push("/dashboard");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-row-reverse justify-between items-center w-full py-[3%] px-[10%]">
        <main className="w-full max-w-[37%] p-[3rem]">
          <h2 className="text-3xl font-medium tracking-wide text-start text-gray-700 mb-6">
            Log in to your account
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-center text-red-700 w-full px-4 py-[18px] rounded relative mb-4">
              <span className="block sm:inline">
                {error?.data?.message || "An unexpected error occurred"}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            <Input
              name="email"
              type="text"
              placeholder="Email"
              control={control}
              validation={{ required: "Email is required" }}
              error={errors.email?.message}
              className="py-[18px]"
            />

            <Input
              name="password"
              type="password"
              placeholder="Password"
              control={control}
              validation={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              }}
              error={errors.password?.message}
              className="py-[18px]"
            />

            <Link
              href="/password-reset"
              className="block text-[15px] text-gray-800 hover:underline mb-4"
            >
              Forgot password?
            </Link>

            <button
              type="submit"
              className={`flex items-center justify-center w-full mx-auto py-[16px] bg-blue-500 text-white rounded font-medium hover:opacity-90 ${
                isLoading ? "cursor-not-allowed bg-gray-400 text-gray-800" : ""
              }`}
            >
              {isLoading ? (
                <Loader2 className="animate-spin text-white" size={27} />
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="flex gap-2 items-center justify-center text-center text-gray-500 pt-4">
            <p>Don&apos;t have an account?</p>
            <Link href="/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
          <p
            className="relative text-center text-gray-500 py-2 before:content-[''] 
              before:absolute before:left-0 before:top-1/2 before:w-[45%] before:h-[1px] before:bg-gray-300 after:content-[''] 
              after:absolute after:right-0 after:top-1/2 after:w-[45%] after:h-[1px] after:bg-gray-300 mb-2"
          >
            or
          </p>

          <LoginButtons />
        </main>
      </div>
    </MainLayout>
  );
};

export default SignIn;
