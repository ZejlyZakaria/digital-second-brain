// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabase';

// export default function AuthPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleSignIn = async () => {
//     const { error } = await supabase.auth.signInWithPassword({ email, password });
//     if (error) setError(error.message);
//     else router.push('/dashboard');
//   };

//   const handleSignUp = async () => {
//     const { error } = await supabase.auth.signUp({ email, password });
//     if (error) setError(error.message);
//     else alert('Check ton email pour confirmer !');
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
//       <div className="p-8 bg-gray-800 rounded-lg">
//         <h1 className="text-2xl mb-4">Login / Signup</h1>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={e => setEmail(e.target.value)}
//           className="block w-full p-2 mb-2 text-black"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           className="block w-full p-2 mb-4 text-black"
//         />
//         <button onClick={handleSignIn} className="bg-blue-500 p-2 w-full mb-2">Login</button>
//         <button onClick={handleSignUp} className="bg-green-500 p-2 w-full">Signup</button>
//         {error && <p className="text-red-500 mt-2">{error}</p>}
//       </div>
//     </div>
//   );
// }


import { AuthForm } from "../../components/AuthForm"

export default function Page() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top right swirl */}
        <div 
          className="absolute -top-1/4 -right-1/4 w-200 h-200 rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.2) 30%, transparent 70%)",
            transform: "rotate(-30deg)",
          }}
        />
        
        {/* Main blue swirl */}
        <div 
          className="absolute top-1/4 right-0 w-150 h-300"
          style={{
            background: "linear-gradient(180deg, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.6) 50%, rgba(29, 78, 216, 0.3) 100%)",
            borderRadius: "50% 0 0 50%",
            transform: "rotate(-20deg) translateX(30%)",
            filter: "blur(40px)",
          }}
        />
        
        {/* Bottom blue glow */}
        <div 
          className="absolute -bottom-1/4 left-1/4 w-200 h-150 rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.5) 0%, rgba(37, 99, 235, 0.3) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        
        {/* Accent highlights */}
        <div 
          className="absolute top-1/2 right-1/4 w-75 h-150"
          style={{
            background: "linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.1) 50%, transparent 100%)",
            transform: "rotate(-45deg)",
            filter: "blur(30px)",
          }}
        />
        
        {/* Purple accent */}
        <div 
          className="absolute top-1/3 right-1/3 w-50 h-100"
          style={{
            background: "linear-gradient(180deg, rgba(168, 85, 247, 0.3) 0%, rgba(139, 92, 246, 0.2) 100%)",
            transform: "rotate(-30deg)",
            filter: "blur(50px)",
          }}
        />
      </div>

      {/* Auth form */}
      <AuthForm />
    </main>
  )
}
