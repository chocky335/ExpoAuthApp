import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthService';

const fetchGoogleEmail = (token: string) => fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`)
const fetchFacebookEmail = (token: string) => fetch(`https://graph.facebook.com/me?fields=email,name&access_token=${token}`)

export default function useEmail(): string | null {
  const { state: authState } = useContext(AuthContext)
  const [email, setEmail] = useState(null)

  useEffect(() => {
    if (authState && authState !== 'init' && 'token' in authState) {
      const emailFetch = authState.provider === 'google' ? fetchGoogleEmail : fetchFacebookEmail

      emailFetch(authState.token.accessToken)
        .then(res => res.json())
        .then(res => setEmail(res.email))
    }
  }, [])

  return email
}
