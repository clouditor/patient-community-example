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
            <li>
                <Link to={{ pathname: "/diseases" }}>Diseases</Link>
            </li>
            <li>
                <Link to={{ pathname: "/phr" }}>Submit PHR Data</Link>
            </li>
            <li>
                <Link to={{ pathname: "/getgroupphr" }}>Get PHR Data</Link>
            </li>
        </ul>
    </div >
