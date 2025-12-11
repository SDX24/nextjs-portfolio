// "use client";
// import { useEffect, useRef } from "react";

// export default function GitHubCalendar() {
//     const calendarRef = useRef(null);

//     useEffect(() => {
//         const element = calendarRef.current;
        
//         // Cleanup function to prevent memory leaks
//         return () => {
//             if (element) {
//                 // Clear the calendar content on unmount
//                 element.innerHTML = '';
//             }
//         };
//     }, []);

//     return (
//         <>
//             <div
//                 ref={calendarRef}
//                 id="calendar-component"
//                 username="aguilarxnldoz"
//                 className="m-auto p-4"
//                 theme-color="#DC143C"
//             ></div>
//         </>
//     );
// }