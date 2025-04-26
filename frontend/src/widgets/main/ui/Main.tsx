'use client'

import { selectUser } from "#/services/slices/user"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux"

export const Main = () => {
    const user = useSelector(selectUser);
    const router = useRouter();

    useEffect(() => {
        if (!user.isAuthenticated) {
            router.push('/register')
        } else {
            router.push('/tasks')
        }
    }, [router, user.isAuthenticated])

    return (
        <div>

        </div>
    )
}