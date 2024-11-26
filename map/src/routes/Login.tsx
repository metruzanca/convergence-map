import { useNavigate } from "@solidjs/router";
import { login, logout, Protected } from "../firebase/auth";
import { createSignal } from "solid-js";
import { EnvelopeIcon, KeyIcon } from "../components/Icons";

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
      class="text-white p-6 rounded-lg shadow-2xl w-full max-w-sm mx-auto flex flex-col gap-4"
    >
      <h2>Login</h2>

      <label class="input input-bordered flex items-center gap-2">
        <EnvelopeIcon class="opacity-70" />
        <input
          type="text"
          name="email"
          placeholder="Email"
          autocomplete="off"
          required
          class="grow"
        />
      </label>

      <label class="input input-bordered flex items-center gap-2">
        <KeyIcon class="opacity-70" />
        <input
          type="password"
          name="password"
          placeholder="Password"
          autocomplete="off"
          required
          class="grow"
        />
      </label>

      <button type="submit" class="btn btn-primary w-full">
        Login
      </button>
      <a class="btn-link cursor-pointer" onClick={() => navigate("/")}>
        back to map
      </a>
      {error() && <p class="text-red-700">{error()}</p>}
    </form>
  );
}

export default function Login() {
  const navigate = useNavigate();

  return (
    <Protected
      fallback={<LoginForm />}
      loading
      class="h-screen flex flex-col items-center justify-center"
    >
      <div class="w-36 flex flex-col gap-4">
        <button class="btn btn-primary w-full" onClick={() => navigate("/")}>
          back to map
        </button>
        <button class="btn w-full btn-neutral" onClick={logout}>
          Logout
        </button>
        <button
          class="btn btn-secondary w-full"
          onClick={() => navigate("/admin")}
        >
          Admin Panel
        </button>
      </div>
    </Protected>
  );
}
