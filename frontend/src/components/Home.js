import React, { useState} from 'react'

const Home = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

    return (
        <form>
            <input
             type="text"
             value={username}
             onChange={(e) => setUsername(e.target.value)}
            /> 
            <input
              type="password"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
            />
            <button>Login</button>
            <button>Signup</button>
        </form>
    )
}

export default Home
