'use client'
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface RedirectProps {
    route: string,
}
export const Redirect: React.FC<RedirectProps> = ({ route }) => {
    const router = useRouter()
    useEffect(() => {
        router.push(route)
    }, [route, router])
    return null
}