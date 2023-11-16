import React, { useEffect, useState } from 'react'
import { getProviders, signIn, useSession } from "next-auth/react"
import { authOptions } from './api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import spot from '../public/images/spotify.png'



function Login({ providers }) {

  
  const { data: session } = useSession();
  const [x, setX] = useState('')

  useEffect(() => {
      if (session && session.accessToken) {
          setX(session.accessToken)
      }
  },[session])
  return (
    <div className='flex flex-col items-center min-h-screen w-full justify-center'>
      <img className='w-52 mb-5' src='https://links.papareact.com/9xl' alt=''/>

       {(providers ? Object.values(providers) : []).map((provider) => (
        <div key={provider.name}>
          <button className='bg-[#18d860] p-5 rounded-full'
           onClick={() => signIn(provider.id, { callbackUrl: "/"})}>
            Login with {provider.name}
          </button>
        </div>
      ))}
      
    </div>
  )
}

export default Login

export async function getServerSideProps() {
    const providers = await getProviders(authOptions);

    return {
        props: {
            providers,
            
        },
    };
}