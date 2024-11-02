import { useNavigate } from "@solidjs/router";
import { login, logout, Protected } from "../firebase/auth";
import { createSignal } from "solid-js";
import { Button, H2 } from "../components/Core";

function LoginForm() {
  const navigate = useNavigate();

  const [error, setError] = createSignal("");

  const handleLogin = async (event: Event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      console.error("Login failed:", err.name, err.code);
      if (err.code === "auth/invalid-credential") {
        setError("invalid credentials");
      } else {
        setError("something went wrong..");
      }
    }
  };
  return (
    <form
      onSubmit={handleLogin}
      class="bg-neutral-900 text-white p-6 rounded-lg shadow-md w-full max-w-sm mx-auto"
    >
      <H2>Login</H2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        autocomplete="off"
        required
        class="w-full p-3 mb-4 text-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        autocomplete="off"
        required
        class="w-full p-3 mb-6 text-neutral-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Button type="submit">Login</Button>
      {error() && <p class="text-red-700">{error()}</p>}
    </form>
  );
}

export default function Login() {
  return (
    <Protected fallback={<LoginForm />}>
      <Button onClick={logout}>Logout</Button>
    </Protected>
  );
}
