import { useEffect, useState } from 'react';
import MemberCSS from './Member.module.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeMember, setInitialMembers } from '../../../redux/counter/memberCounter';
import { DeleteMemberService, FetchAllMembersService } from '../../../services/admin/member/MemberService';
import Alert from '../Alert/Alert';

export default function Member(params) {

    const [membersList,setMembersList] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [show,setShow] = useState(false);
    const [link,setLink] = useState('');
    const [message, setMessage] = useState('');
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // You can adjust this as needed
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = membersList.slice(indexOfFirstItem, indexOfLastItem);

    function deleteMember(memberId) {

        const deleteMemberService = DeleteMemberService(memberId);

        deleteMemberService.then((response)=>{
            if(response.success){
                setMessage(response.message);
                dispatch(removeMember(memberId));
                setMembersList(membersList.filter((member)=>member.memberId!=memberId));        
            }else{
                setMessage(response.message);
            }
            
            handleShow();
        }).catch((reason)=>{
            setMessage(reason.message);
            handleShow();
        })

    }

    useEffect(()=>{
        FetchAllMembersService().then((response)=>{
            console.log(response);
            if(response.success){
                setMembersList(response.members);
                dispatch(setInitialMembers(response.members));
            }else{
                setMessage(response.message);
                handleShow();
            }
        }).catch(()=>{
            setMessage("Couldn't connect to server");
            handleShow();
        })
    },[])

    return (
        <>
            <>
                {show && <Alert title={"Message"} message={message} link={link} show={show} handleClose={handleClose} />}

                <div className={`${MemberCSS.mainContent}`}>
                    <div className={`${MemberCSS.container} mt-7`}>
                        <div className={`${MemberCSS.col}`}>
                            <div className={`${MemberCSS.card} ${MemberCSS.shadow}`}>
                                <div className={`${MemberCSS.cardHeader} ${MemberCSS.border0}`}>
                                    <h2 className={`${MemberCSS.dashboard_heading} mb-0 text-center`}>Member List</h2>
                                </div>
                                <div className="table-responsive">
                                    <table className={`${MemberCSS.tableFlush} ${MemberCSS.table} ${MemberCSS.alignItemsCenter}`}>
                                        <thead className={`${MemberCSS.theadLight}`}>
                                            <tr>
                                                <th scope="col">Member Id</th>
                                                <th scope="col">Member Name</th>
                                                <th scope="col">Username</th>
                                                <th scope="col">Password</th>
                                                <th scope="col">DOB</th>
                                                <th scope="col">Created Date</th>
                                                <th scope="col">Updated Date</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                currentItems.map((member) =>
                                                    <>
                                                        <tr className={`${MemberCSS.tableRow} border-bottom mb-3`}>
                                                            <th scope="row">
                                                                <div className={`${MemberCSS.media} ${MemberCSS.alignItemsCenter}`}>
                                                                    <div className={`${MemberCSS.mediaBody}`}>
                                                                        <span className="mb-0 text-sm">
                                                                            {member.memberId}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </th>
                                                            <td>{member.memberName}</td>
                                                            <td>{member.username}</td>
                                                            <td>{member.password}</td>
                                                            <td>{member.dob}</td>
                                                            <td>{member.createdDate}</td>
                                                            <td>{member.updatedDate}</td>
                                                            <td>
                                                                {
                                                                    member.status=="true" ?
                                                                        <span class="badge text-bg-success rounded-pill px-3 py-2">Active</span> :
                                                                        <span class="badge text-bg-danger rounded-pill px-3 py-2">Inactive</span>
                                                                }
                                                            </td>
                                                            <td>
                                                                <div class="d-flex gap-2">
                                                                    <button class="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Edit" onClick={()=>navigate(`/admin/member/editMember/${member.memberId}`)}><i class="fa fa-edit"></i></button>
                                                                    <button class="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Delete" onClick={()=>deleteMember(`${member.memberId}`)}><i class="fa fa-trash"></i></button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <div className={`${MemberCSS.cardFooter} py-4`}>
                                    <div className='d-flex flex-wrap justify-content-between'>
                                        <div className='col-md-2'>
                                            <button className={`btn btn-primary rounded-pill px-3 mb-1 justify-cotent-center`} type="button" onClick={()=>navigate("/admin/member/addMember")}>Add Member</button>
                                        </div>
                                        <nav aria-label="..." className='justify-content-end col-md-auto'>
                                            <ul className={`${MemberCSS.pagination} justify-content-end mb-0`}>
                                                <li className={`${MemberCSS.pageItem}`}>
                                                    <button
                                                        className={`${MemberCSS.pageLink} ${MemberCSS.a}`}
                                                        href="#"
                                                        onClick={() => setCurrentPage(currentPage - 1)}
                                                        disabled={currentPage===1}
                                                    >
                                                        <i className="fa fa-angle-left"></i>
                                                        <span className={`${MemberCSS.srOnly}`}>Previous</span>
                                                    </button>
                                                </li>
                                                {Array.from({ length: Math.ceil(membersList.length / itemsPerPage) }).map((_, index) => (
                                                    <li
                                                        key={index}
                                                        className={`${MemberCSS.pageItem} ${currentPage === index + 1 ? MemberCSS.active : ''}`}
                                                    >
                                                        <a
                                                            className={`${MemberCSS.pageLink} ${MemberCSS.a}`}
                                                            href="#"
                                                            onClick={() => setCurrentPage(index + 1)}
                                                        >
                                                            {index + 1}
                                                        </a>
                                                    </li>
                                                ))}
                                                <li className={`${MemberCSS.pageItem}`}>
                                                    <button
                                                        className={`${MemberCSS.pageLink} ${MemberCSS.a}`}
                                                        href="#"
                                                        onClick={() => setCurrentPage(currentPage + 1)}
                                                        disabled={indexOfLastItem >= membersList.length || currentPage === Math.ceil(membersList.length / itemsPerPage)}
                                                    >
                                                        <i className="fa fa-angle-right"></i>
                                                        <span className={`${MemberCSS.srOnly}`}>Next</span>
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </>
    )
}