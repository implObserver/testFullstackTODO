'use client';
import { BeatLoader } from "react-spinners"

export const SpinnerLoader = () => {
    return (
        <div className="flex justify-center items-center">
            <BeatLoader
                color={'var(--color-theme)'}
                loading={true}
                size={'2vw'}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    )
}