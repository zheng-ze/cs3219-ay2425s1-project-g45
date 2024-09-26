"use client";

import { useFormState, useFormStatus } from "react-dom";
import Textfield from "@/components/text-field";
import Button from "@/components/button";
import TextButton from "@/components/text-button";
import { login } from "@/app/actions/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [state, action] = useFormState(login, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.message) {
      localStorage.setItem("token", state.message);
      router.push("/home");
    } else if (state?.errors?.errorMessage) {
      alert(state.errors.errorMessage);
    }
  }, [state]);

  // TODO: Make errors look better
  return (
    <div>
      <form action={action}>
        <Textfield name="username" secure={false} placeholder_text="Name" />
        {state?.errors?.name && <p>{state.errors.name}</p>}
        <Textfield name="password" secure={true} placeholder_text="Password" />
        {state?.errors?.password && <p>{state.errors.password}</p>}
        <Button type="submit" text="Login" />
      </form>

      <div className="mt-5">
        <p className="text-sm font-hairline">
          Need an account? <TextButton text="Sign Up" link="/auth/signup" />
        </p>
      </div>
    </div>
  );
}
