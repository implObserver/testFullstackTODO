import { GoogleColorizedText } from "#/shared/ui/googleColorizedText"
import Link from "next/link"

export const Footer = () => {
    return (
        <div className="grid p-2 !h-[40px] bg-color-red">
            <div className="flex gap-2 justify-center">
                Made by
                <Link href='https://github.com/implObserver'>
                    <div>
                        <GoogleColorizedText word={'Observer'}></GoogleColorizedText>
                    </div>
                </Link>
            </div>
        </div>
    )
}