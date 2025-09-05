import React, { useState } from 'react'
import { useNavigate, Link } from "react-router-dom"

function Login() {

  const [form, setForm] = useState({email: "", password: ""})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      })
      const data = await res.json()

      if(res.ok){
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        navigate("/")
      }
      else{
        alert(data.message || "signup failed")
      }


    } catch (error) {
        alert("Signup - something went wrong")
    }
    finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-xl bg-base-100">
        <form onSubmit={handleLogin} className="card-body">
          <h2 className="card-title justify-center">Login</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered"
            value={form.password}
            onChange={handleChange}
            required
          />

          <div className="form-control mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          {/* Signup redirect */}
          <p className="text-center mt-2 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-semibold">
              Sign Up
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Login
