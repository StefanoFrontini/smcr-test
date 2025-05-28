"use client";
import { LoginForm } from "@/components/auth/login";
import { SignupForm } from "@/components/auth/signup";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import { useState } from "react";
import { flushSync } from "react-dom";
type FormType = "login" | "signup";

const Home = () => {
  const [formType, setFormType] = useState<FormType>("login");

  function handleLogIn() {
    document.startViewTransition(() => {
      flushSync(() => {
        setFormType("login");
      });
    });
  }
  function handleSignUp() {
    document.startViewTransition(() => {
      flushSync(() => {
        setFormType("signup");
      });
    });
  }
  function selectForm(formType: FormType) {
    switch (formType) {
      case "login":
        return (
          <Card className="shadow-2xl" style={{ viewTransitionName: "login" }}>
            <CardHeader>
              <CardTitle className="text-2xl">Log In</CardTitle>

              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>

            <CardContent>
              <LoginForm />

              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <button
                  onClick={handleSignUp}
                  className="underline underline-offset-4"
                >
                  Sign Up
                </button>
              </div>
            </CardContent>
          </Card>
        );

      case "signup":
        return (
          <Card className="shadow-2xl" style={{ viewTransitionName: "signup" }}>
            <CardHeader>
              <CardTitle className="text-2xl">Sign Up</CardTitle>

              <CardDescription>
                Enter your email address to create your account.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <SignupForm />

              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <button
                  onClick={handleLogIn}
                  className="underline underline-offset-4"
                >
                  Log In
                </button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        throw new Error(`Invalid formType: ${formType satisfies never}`);
    }
  }
  return (
    // <div className="bg-white min-h-screen flex items-center justify-center ">
    <div className="min-h-screen flex sm:items-center sm:justify-center sm:bg-radial-[at_0%_100%] to-pagopa-primary  from-[#fff] from-0% to-100%">
      <main className="flex items-center  2xl:container flex-col sm:flex-row">
        <article className=" text-white bg-pagopa-primary sm:basis-2/3 flex flex-col gap-8 pt-10 pb-30 px-10 sm:py-40 sm:pr-50 sm:pl-20">
          <h1 className="text-5xl leading-15">
            Service Management Control Room
          </h1>
          <p className="leading-7">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ex fugit
            aspernatur ipsa in illo, nihil dolor eos voluptatibus perspiciatis
            accusantium placeat earum vel optio amet fuga asperiores magnam
            ipsum consequatur!
          </p>
        </article>
        <article className="w-5/6 sm:w-full sm:basis-1/3 -translate-y-1/8 sm:-translate-x-1/4 sm:translate-y-0">
          {selectForm(formType)}
        </article>
      </main>
    </div>
  );
};

export default Home;
