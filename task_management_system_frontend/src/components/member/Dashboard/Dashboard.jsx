import { useEffect, useState } from 'react';
import DashboardCSS from './Dashboard.module.css';
import { useParams } from 'react-router-dom';
import { FetchAllMembersService } from '../../../services/admin/member/MemberService';
import { FetchALLTaskService } from '../../../services/admin/dashboard/TaskService';
import { FetchMemberTaskSubmissionService } from '../../../services/member/TaskSubmissionService';

export default function Dashboard(params) {

    const { memberId } = useParams();
    const [member, setMember] = useState();
    const [allTasks, setAllTasks] = useState([]);
    const [inProgressTask, setInProgressTask] = useState([]);
    const [completedTask, setCompletedTask] = useState([]);
    const [count, setCount] = useState(0);
    const [start5, setStar5] = useState(0);
    const [start4, setStar4] = useState(0);
    const [start3, setStar3] = useState(0);
    const [start2, setStar2] = useState(0);
    const [start1, setStar1] = useState(0);

    useEffect(() => {
        async function fetchData() {
            const allTasksResponse = await FetchALLTaskService();
            if (allTasksResponse.success) {
                const filteredTasks = allTasksResponse.tasks.filter(task => task.taskAssigned.toString() === memberId);
                setAllTasks(filteredTasks);
            }
    
            const allMembersResponse = await FetchAllMembersService();
            if (allMembersResponse.success) {
                const member = allMembersResponse.members.find(member => member.memberId == memberId);
                setMember(member);
            }
    
            const memberTaskSubmissionResponse = await FetchMemberTaskSubmissionService(memberId);
            if (memberTaskSubmissionResponse.success) {
                const taskSubmissions = memberTaskSubmissionResponse.taskSubmission;
                setCount(taskSubmissions.length);
    
                // Count stars using a loop to ensure synchronous updates
                let starCounts = {
                    5: 0,
                    4: 0,
                    3: 0,
                    2: 0,
                    1: 0,
                };
                taskSubmissions.forEach(submission => {
                    const rating = submission.taskRating;
                    starCounts[rating] = starCounts[rating] + 1;
                });
                setStar5(starCounts[5]);
                setStar4(starCounts[4]);
                setStar3(starCounts[3]);
                setStar2(starCounts[2]);
                setStar1(starCounts[1]);
            }
        }
    
        fetchData();
    }, [memberId]);
    

    useEffect(() => {
        if (allTasks) {
            setInProgressTask(allTasks.filter((task) => task.progress == true));
            setCompletedTask(allTasks.filter((task) => task.progress == false));
        }
    }, [allTasks])

    return (
        <>
            <div className='pb-5'>
                <div className="my-3 p-3 bg-body rounded shadow mx-3">
                    <div className="d-flex align-items-center justify-content-center">
                        <div className="lh-1">
                            <h1 className={`${DashboardCSS.dashboard_heading} mb-0 lh-1`}><b>Dashboard</b></h1>
                        </div>
                    </div>
                    <div className='row'>
                        <div className={`mt-4`}>
                            <div className={`${DashboardCSS['panel-body']} ${DashboardCSS['bio-graph-info']}`}>
                                <div className={`${DashboardCSS['bio-row']}`}>
                                    <p><span>Member Id</span>: {member ? member.memberId : ''}</p>
                                </div>
                                <div className={`${DashboardCSS['bio-row']}`}>
                                    <p><span>Member Name</span>: {member ? member.memberName : ''}</p>
                                </div>
                                <div className={`${DashboardCSS['bio-row']}`}>
                                    <p><span>Username </span>: {member ? member.username : ''}</p>
                                </div>
                                <div className={`${DashboardCSS['bio-row']}`}>
                                    <p><span>Password</span>: {member ? member.password : ''}</p>
                                </div>
                                <div className={`${DashboardCSS['bio-row']}`}>
                                    <p><span>Date of Birth </span>: {member ? member.dob : ''}</p>
                                </div>
                                <div className={`${DashboardCSS['bio-row']}`}>
                                    <p><span>Status </span>: {member ?
                                        member.status == "true" ?
                                            <span class="badge text-bg-success rounded-pill px-2 py-2" style={{ width: '70px' }}>Active</span> :
                                            <span class="badge text-bg-danger rounded-pill px-2 py-2" style={{ width: '70px' }}>Inactive</span>

                                        : ''}</p>
                                </div>
                                <div className={`${DashboardCSS['bio-row']}`}>
                                    <p><span>Created Date </span>: {member ? member.createdDate : ''}</p>
                                </div>
                                <div className={`${DashboardCSS['bio-row']}`}>
                                    <p><span>Updated Date </span>: {member ? member.updatedDate : ''}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="my-3 p-3 bg-body rounded shadow mx-3">
                    <div className="col-md-12 ">
                        <div className="row ">
                            <div className="col-xl-3 col-lg-6">
                                <div className={`${DashboardCSS.card} ${DashboardCSS['l-bg-cherry']}`}>
                                    <div className={`${DashboardCSS['card-statistic-3']} p-4`}>
                                        <div className={`${DashboardCSS['card-icon']} ${DashboardCSS['card-icon-large']}`}>
                                            <i className={`${DashboardCSS.fas} fa fa-pencil-square-o`} />
                                        </div>
                                        <div className="mb-4">
                                            <h5 className="card-title mb-0">Total Tasks</h5>
                                        </div>
                                        <div className="row align-items-center mb-2 d-flex">
                                            <div className="col-8">
                                                <h2 className="d-flex align-items-center mb-0">{allTasks ? allTasks.length : 0}</h2>
                                            </div>
                                            <div className="col-4 text-right">
                                                <span>
                                                    {allTasks ? allTasks.length / 10 : 0}% <i className="fa fa-arrow-up" />
                                                </span>
                                            </div>
                                        </div>
                                        <div className="progress mt-1 " data-height={8} style={{ height: 8 }}>
                                            <div
                                                className={`${DashboardCSS['l-bg-cyan']} progress-bar`}
                                                role="progressbar"
                                                data-width="25%"
                                                aria-valuenow={25}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                                style={{ width: allTasks ? allTasks.length * 10 : 0 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-6">
                                <div className={`${DashboardCSS.card} ${DashboardCSS['l-bg-blue-dark']}`}>
                                    <div className={`${DashboardCSS['card-statistic-3']} p-4`}>
                                        <div className={`${DashboardCSS['card-icon']} ${DashboardCSS['card-icon-large']}`}>
                                            <i className={`${DashboardCSS['fas']} fa fa-pencil-square-o`} />
                                        </div>
                                        <div className="mb-4">
                                            <h5 className="card-title mb-0">In Progress Task</h5>
                                        </div>
                                        <div className="row align-items-center mb-2 d-flex">
                                            <div className="col-8">
                                                <h2 className="d-flex align-items-center mb-0">{inProgressTask ? inProgressTask.length : 0}</h2>
                                            </div>
                                            <div className="col-4 text-right">
                                                <span>
                                                    {inProgressTask ? inProgressTask.length / 10 : 0} <i className="fa fa-arrow-up" />
                                                </span>
                                            </div>
                                        </div>
                                        <div className="progress mt-1 " data-height={8} style={{ height: 8 }}>
                                            <div
                                                className={`${DashboardCSS['l-bg-green']} progress-bar`}
                                                role="progressbar"
                                                data-width="25%"
                                                aria-valuenow={25}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                                style={{ width: inProgressTask ? inProgressTask.length * 10 : 0 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-6">
                                <div className={`${DashboardCSS.card} ${DashboardCSS['l-bg-green-dark']}`}>
                                    <div className={`${DashboardCSS['card-statistic-3']} p-4`}>
                                        <div className={`${DashboardCSS['card-icon']} ${DashboardCSS['card-icon-large']}`}>
                                            <i className={`${DashboardCSS.fas} fa fa-pencil-square-o`} />
                                        </div>
                                        <div className="mb-4">
                                            <h5 className="card-title mb-0">Completed Task</h5>
                                        </div>
                                        <div className="row align-items-center mb-2 d-flex">
                                            <div className="col-8">
                                                <h2 className="d-flex align-items-center mb-0">{completedTask ? completedTask.length : 0}</h2>
                                            </div>
                                            <div className="col-4 text-right">
                                                <span>
                                                    {completedTask ? completedTask.length / 10 : 0} <i className="fa fa-arrow-up" />
                                                </span>
                                            </div>
                                        </div>
                                        <div className="progress mt-1 " data-height={8} style={{ height: 8 }}>
                                            <div
                                                className={`${DashboardCSS['l-bg-orange']} progress-bar`}
                                                role="progressbar"
                                                data-width="25%"
                                                aria-valuenow={25}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                                style={{ width: completedTask ? completedTask.length * 10 : 0 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-6">
                                <div className={`${DashboardCSS.card} ${DashboardCSS['l-bg-orange-dark']}`}>
                                    <div className={`${DashboardCSS['card-statistic-3']} p-4`}>
                                        <div className={`${DashboardCSS['card-icon']} ${DashboardCSS['card-icon-large']}`}>
                                            <i className={`${DashboardCSS.fas} fa fa-pencil-square-o`} />
                                        </div>
                                        <div className="mb-4">
                                            <h5 className="card-title mb-0">Total Ratings</h5>
                                        </div>
                                        <div className="row align-items-center mb-2 d-flex">
                                            <div className="col-8">
                                                <h2 className="d-flex align-items-center mb-0">{completedTask ? completedTask.length : 0}</h2>
                                            </div>
                                            <div className="col-4 text-right">
                                                <span>
                                                    {completedTask ? completedTask.length / 10 : 0} <i className="fa fa-arrow-up" />
                                                </span>
                                            </div>
                                        </div>
                                        <div className="progress mt-1 " data-height={8} style={{ height: 8 }}>
                                            <div
                                                className={`${DashboardCSS['l-bg-cyan']} progress-bar`}
                                                role="progressbar"
                                                data-width="25%"
                                                aria-valuenow={25}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                                style={{ width: completedTask ? completedTask.length * 10 : 0 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="my-3 p-3 bg-body rounded shadow mx-3">
                    <div className="d-flex align-items-center justify-content-center">
                        <div className="lh-1">
                            <h1 className={`${DashboardCSS.dashboard_heading} mb-0 lh-1`}><b>Ratings</b></h1>
                        </div>
                    </div>
                    <div>
                        <div className={`${DashboardCSS['graph-star-rating']} bg-white rounded shadow-sm p-4 mb-4 clearfix`}>
                            {/* <h5 className="mb-0 mb-4">Ratings and Reviews</h5> */}
                            <div className={`${DashboardCSS["graph-star-rating-header"]}`}>
                                <div className={`${DashboardCSS["star-rating"]}`}>
                                    {" "}
                                    <a href="#">
                                        <i className="icofont-ui-rating active" />
                                    </a>{" "}
                                    <a href="#">
                                        <i className="icofont-ui-rating active" />
                                    </a>{" "}
                                    <a href="#">
                                        <i className="icofont-ui-rating active" />
                                    </a>{" "}
                                    <a href="#">
                                        <i className="icofont-ui-rating active" />
                                    </a>{" "}
                                    <a href="#">
                                        <i className="icofont-ui-rating" />
                                    </a>{" "}
                                </div>
                            </div>
                            <div className={`${DashboardCSS['graph-star-rating-body']}`}>
                                <div className={`${DashboardCSS['rating-list']}`}>
                                    <div className={`${DashboardCSS["rating-list-left"]} ${DashboardCSS["text-black"]}`}> 5 Star</div>
                                    <div className={`${DashboardCSS["rating-list-center"]}`}>
                                        <div className={`${DashboardCSS["progress"]}`}>
                                            <div
                                                style={{ width: (start5==0 && count==0)?0:(start5/count)*100, height: "30px" }}
                                                aria-valuemax={5}
                                                aria-valuemin={0}
                                                aria-valuenow={5}
                                                role="progressbar"
                                                className="progress-bar bg-primary"
                                            >
                                                {" "}
                                                <span className="sr-only">80% Complete (danger)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${DashboardCSS["rating-list-right"]} ${DashboardCSS['text-black']}`}>{(start5==0 && count==0)?0:(start5/count)*100}%</div>
                                </div>
                                <div className={`${DashboardCSS['rating-list']}`}>
                                    <div className={`${DashboardCSS["rating-list-left"]} ${DashboardCSS["text-black"]}`}> 4 Star</div>
                                    <div className={`${DashboardCSS["rating-list-center"]}`}>
                                        <div className={`${DashboardCSS["progress"]}`}>
                                            <div
                                                style={{ width: (start4==0 && count==0)?0:(start4/count)*100, height: "30px" }}
                                                aria-valuemax={5}
                                                aria-valuemin={0}
                                                aria-valuenow={5}
                                                role="progressbar"
                                                className="progress-bar bg-primary"
                                            >
                                                {" "}
                                                <span className="sr-only">80% Complete (danger)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${DashboardCSS["rating-list-right"]} ${DashboardCSS['text-black']}`}>{(start4==0 && count==0)?0:(start4/count)*100}%</div>
                                </div>
                                <div className={`${DashboardCSS['rating-list']}`}>
                                    <div className={`${DashboardCSS["rating-list-left"]} ${DashboardCSS["text-black"]}`}> 3 Star</div>
                                    <div className={`${DashboardCSS["rating-list-center"]}`}>
                                        <div className={`${DashboardCSS["progress"]}`}>
                                            <div
                                                style={{ width: (start3==0 && count==0)?0:(start3/count)*100, height: "30px" }}
                                                aria-valuemax={5}
                                                aria-valuemin={0}
                                                aria-valuenow={5}
                                                role="progressbar"
                                                className="progress-bar bg-primary"
                                            >
                                                {" "}
                                                <span className="sr-only">80% Complete (danger)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${DashboardCSS["rating-list-right"]} ${DashboardCSS['text-black']}`}>{(start3==0 && count==0)?0:(start3/count)*100}%</div>
                                </div>
                                <div className={`${DashboardCSS['rating-list']}`}>
                                    <div className={`${DashboardCSS["rating-list-left"]} ${DashboardCSS["text-black"]}`}> 2 Star</div>
                                    <div className={`${DashboardCSS["rating-list-center"]}`}>
                                        <div className={`${DashboardCSS["progress"]}`}>
                                            <div
                                                style={{ width: (start2==0 && count==0)?0:(start2/count)*100, height: "30px" }}
                                                aria-valuemax={5}
                                                aria-valuemin={0}
                                                aria-valuenow={5}
                                                role="progressbar"
                                                className="progress-bar bg-primary"
                                            >
                                                {" "}
                                                <span className="sr-only">80% Complete (danger)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${DashboardCSS["rating-list-right"]} ${DashboardCSS['text-black']}`}>{(start2==0 && count==0)?0:(start2/count)*100}%</div>
                                </div>
                                {console.log(start1, count)}
                                <div className={`${DashboardCSS['rating-list']}`}>
                                    <div className={`${DashboardCSS["rating-list-left"]} ${DashboardCSS["text-black"]}`}> 1 Star</div>
                                    <div className={`${DashboardCSS["rating-list-center"]}`}>
                                        <div className={`${DashboardCSS["progress"]}`}>
                                            <div
                                                style={{ width: (start1==0 && count==0)?0:(start1/count)*100, height: "30px" }}
                                                aria-valuemax={5}
                                                aria-valuemin={0}
                                                aria-valuenow={5}
                                                role="progressbar"
                                                className="progress-bar bg-primary"
                                            >
                                                {" "}
                                                <span className="sr-only">80% Complete (danger)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${DashboardCSS["rating-list-right"]} ${DashboardCSS['text-black']}`}>{(start1==0 && count==0)?0:(start1/count)*100}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}