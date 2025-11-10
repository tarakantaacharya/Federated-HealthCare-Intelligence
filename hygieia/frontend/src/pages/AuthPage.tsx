// === Phase 1 Start ===
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type AuthFormState = {
  username: string
  password: string
  email?: string
}

type ApiResponse = {
  success: boolean
  message: string
}

const defaultCentralState: AuthFormState = {
  username: '',
  password: '',
}

const defaultHospitalAuthState: AuthFormState = {
  username: '',
  password: '',
}

const defaultHospitalRegisterState: AuthFormState = {
  username: '',
  email: '',
  password: '',
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const AuthPage: React.FC = () => {
  const navigate = useNavigate()
  const [centralState, setCentralState] = useState<AuthFormState>(defaultCentralState)
  const [hospitalRegisterState, setHospitalRegisterState] = useState<AuthFormState>(
    defaultHospitalRegisterState,
  )
  const [hospitalLoginState, setHospitalLoginState] = useState<AuthFormState>(
    defaultHospitalAuthState,
  )
  const [statusMessage, setStatusMessage] = useState<string>('')

  const handleInputChange = (
    form: 'central' | 'register' | 'login',
    field: keyof AuthFormState,
    value: string,
  ) => {
    if (form === 'central') {
      setCentralState((prev) => ({ ...prev, [field]: value }))
    }

    if (form === 'register') {
      setHospitalRegisterState((prev) => ({ ...prev, [field]: value }))
    }

    if (form === 'login') {
      setHospitalLoginState((prev) => ({ ...prev, [field]: value }))
    }
  }

  const postAuthRequest = async (endpoint: string, data: Record<string, string>) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorPayload = await response.json()
        throw new Error(errorPayload?.detail ?? 'Request failed')
      }

      const payload: ApiResponse = await response.json()

      if (!payload.success) {
        throw new Error(payload.message)
      }

      setStatusMessage('Authentication successful. Redirecting...')
      setTimeout(() => navigate('/work-in-progress'), 1200)
    } catch (error) {
      if (error instanceof Error) {
        setStatusMessage(error.message)
      } else {
        setStatusMessage('An unexpected error occurred. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-slate-800">
            Hygieia Authentication Portal
          </h1>
          <p className="mt-2 text-slate-600">
            Secure access for central administrators and hospital partners.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2">
          <section className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-medium text-slate-800">Central Server Login</h2>
            <p className="text-sm text-slate-500 mb-4">
              Enter your administrator credentials to access the central console.
            </p>
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault()
                void postAuthRequest('/login_central', {
                  username: centralState.username,
                  password: centralState.password,
                })
              }}
            >
              <div>
                <label className="block text-sm font-medium text-slate-700" htmlFor="central-username">
                  Username
                </label>
                <input
                  id="central-username"
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm"
                  value={centralState.username}
                  onChange={(event) =>
                    handleInputChange('central', 'username', event.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700" htmlFor="central-password">
                  Password
                </label>
                <input
                  id="central-password"
                  type="password"
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm"
                  value={centralState.password}
                  onChange={(event) =>
                    handleInputChange('central', 'password', event.target.value)
                  }
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-slate-800 py-2 text-sm font-medium text-white hover:bg-slate-900"
              >
                Login
              </button>
            </form>
          </section>

          <section className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-medium text-slate-800">Hospital Registration</h2>
            <p className="text-sm text-slate-500 mb-4">
              Request onboarding for your hospital to join the federated network.
            </p>
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault()
                void postAuthRequest('/register_hospital', {
                  username: hospitalRegisterState.username,
                  email: hospitalRegisterState.email ?? '',
                  password: hospitalRegisterState.password,
                })
              }}
            >
              <div>
                <label className="block text-sm font-medium text-slate-700" htmlFor="hospital-register-username">
                  Hospital Name
                </label>
                <input
                  id="hospital-register-username"
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm"
                  value={hospitalRegisterState.username}
                  onChange={(event) =>
                    handleInputChange('register', 'username', event.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700" htmlFor="hospital-register-email">
                  Email
                </label>
                <input
                  id="hospital-register-email"
                  type="email"
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm"
                  value={hospitalRegisterState.email ?? ''}
                  onChange={(event) => handleInputChange('register', 'email', event.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700" htmlFor="hospital-register-password">
                  Password
                </label>
                <input
                  id="hospital-register-password"
                  type="password"
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm"
                  value={hospitalRegisterState.password}
                  onChange={(event) =>
                    handleInputChange('register', 'password', event.target.value)
                  }
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Register Hospital
              </button>
            </form>
          </section>

          <section className="rounded-lg bg-white p-6 shadow sm:col-span-2">
            <h2 className="text-xl font-medium text-slate-800">Hospital Login</h2>
            <p className="text-sm text-slate-500 mb-4">
              Access the hospital console to manage local federated learning jobs.
            </p>
            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault()
                void postAuthRequest('/login_hospital', {
                  username: hospitalLoginState.username,
                  password: hospitalLoginState.password,
                })
              }}
            >
              <div>
                <label className="block text-sm font-medium text-slate-700" htmlFor="hospital-login-username">
                  Username
                </label>
                <input
                  id="hospital-login-username"
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm"
                  value={hospitalLoginState.username}
                  onChange={(event) =>
                    handleInputChange('login', 'username', event.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700" htmlFor="hospital-login-password">
                  Password
                </label>
                <input
                  id="hospital-login-password"
                  type="password"
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm"
                  value={hospitalLoginState.password}
                  onChange={(event) =>
                    handleInputChange('login', 'password', event.target.value)
                  }
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full rounded-md bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Login to Hospital Portal
                </button>
              </div>
            </form>
          </section>
        </div>

        {statusMessage && (
          <div className="mt-6 rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700">
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthPage
// === Phase 1 End ===