import LoginForm from 'components/auth/LoginForm'
import Image from 'next/image'
function Login() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 mb-8">
        <Image src={'/Logo.svg'} width={115} height={32} alt={'logo'} />
        <Image src={'/sub_logo.svg'} width={55} height={19} alt={'logo'} />
      </div>
      <div>
        <h1 className="text-center font-semibold text-gray-700 mb-6">
          Login to your account
        </h1>
      </div>
      <LoginForm />
    </div>
  )
}

export default Login
