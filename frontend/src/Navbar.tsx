import React from "react"
import { Link } from "react-router-dom"

export const Navbar: React.FunctionComponent = () =>
    <div>
        <ul>
            <li>
                <Link to={{ pathname: "/" }}>Home</Link>
            </li>
            <li>
                <Link to={{ pathname: "/users" }}>Users</Link>
            </li>
            <li>
                <Link to={{ pathname: "/groups" }}>Groups</Link>
            </li>
            <li>
                <Link to={{ pathname: "/login" }}>Login</Link>
            </li>
        </ul>
    </div >
