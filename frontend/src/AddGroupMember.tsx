import { AddGroupMemberForm } from "./AddGroupMemberForm";
import { GroupForm } from "./GroupForm";
import { UserForm } from "./UserForm";
import {
    useParams
} from "react-router-dom";

export const AddGroupMember: React.FunctionComponent = () => {
    let { id } = useParams<{ id?: string }>();

    return <div>
        <div style={{ width: 200, marginLeft: "auto", marginRight: "auto" }}>
            {id ? <AddGroupMemberForm groupId={+id}></AddGroupMemberForm> : {}}
        </div>
    </div >
}