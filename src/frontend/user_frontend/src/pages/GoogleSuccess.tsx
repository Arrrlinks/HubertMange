import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const GoogleSuccess = () => {
    const { googleLogin } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const run = async () => {
            try {
                await googleLogin()
                navigate('/') // Redirection après succès
            } catch (err) {
                console.error(err)
                navigate('/login') // Ou autre fallback
            }
        }

        run()
    }, [])

    return <p>Connexion avec Google en cours...</p>
}

export default GoogleSuccess
