import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "../components/auth/login/Login";
import Admin from "../components/admin/Admin";
import AdminDashboard from "../components/admin/Dashboard/Dashboard";
import AddTask from "../components/admin/AddTask/AddTask";
import MemberList from "../components/admin/Member/Member";
import AdminTaskDetail from "../components/admin/TaskDetail/TaskDetail";
import AddMember from "../components/admin/AddMember/AddMember";
import EditMember from "../components/admin/EditMember/EditMember";
import MemberDashboard from "../components/member/Dashboard/Dashboard";
import Member from "../components/member/Member";
import MemberTaskDetail from "../components/member/TaskDetail/TaskDetail";
import EditTask from "../components/admin/EditTask/EditTask";
import MyTask from "../components/member/MyTask/MyTask";

const router = createBrowserRouter([
    { path: "/", Component: Login },
    {
        path: "/admin/*", Component: Admin,
        children: [
            { path: "dashboard", Component: AdminDashboard },
            { path: "dashboard/:taskId", Component: AdminTaskDetail },
            { path: "dashboard/editTask/:taskId",Component : EditTask},
            { path: "member", Component: MemberList },
            { path: "member/addMember", Component: AddMember },
            { path: "member/editMember/:memberId", Component: EditMember },
            { path: "addtask", Component: AddTask }
        ]
    },
    {
        path: "/member/:memberId/*", Component: Member,
        children: [
            { path: "dashboard/", Component: MemberDashboard},
            { path: "mytask/", Component:MyTask},
            
            { path: "mytask/:taskId", Component: MemberTaskDetail},
        ]
    }
]);

export default function Routers(params) {
    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}
