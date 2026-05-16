    import { Link } from "react-router-dom";

    export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        <div className="text-center max-w-lg">

            {/* 404 */}
            <h1
            className="
                text-[120px] md:text-[160px] font-extrabold
                bg-gradient-to-r from-sky-400 to-blue-500
                bg-clip-text text-transparent
                animate-pulse"> 404 </h1>


            {/* Title */}
            <h2
            className="
                text-2xl md:text-3xl font-semibold mb-4
                bg-gradient-to-r from-sky-300 to-blue-400
                bg-clip-text text-transparent
                transition-all duration-300
                hover:from-sky-200 hover:to-blue-300" >
            Page Not Found
            </h2>

            {/* Description */}
            <p className="text-gray-400 mb-10">
            Sorry, the page you are looking for doesn’t exist or has been moved.
            </p>

            {/* Buttons */}
            <div className="flex gap-4 justify-center">
            <Link
                to="/"
                className="
                px-7 py-3 rounded-xl
                bg-sky-500 text-white
                hover:bg-sky-400
                transition-colors duration-300
                shadow-md" >
                Go Home
            </Link>

            <button
                onClick={() => window.history.back()}
                className="
                px-7 py-3 rounded-xl
                bg-gray-800 text-gray-200
                hover:bg-gray-700
                transition-colors duration-300
                shadow-md">
                Go Back
            </button>
            </div>

        </div>
        </div>
    );
    }


            