import { useNavigate, useParams } from 'react-router-dom';
import MyTaskCSS from './MyTask.module.css';
import { Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Card from '../Card/Card';
import { FetchALLTaskService } from '../../../services/admin/dashboard/TaskService';
import { FetchAllMembersService } from '../../../services/admin/member/MemberService';
import { FetchMemberTaskSubmissionService } from '../../../services/member/TaskSubmissionService';

export default function MyTask(params) {

    const navigate = useNavigate();
    const {memberId} = useParams();
    const [selectedPriorities, setSelectedPriorities] = useState([]);
    const priorities = ['low', 'medium', 'high'];

    const [oldTasks,setOldTasks] = useState([]);

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [selectedProgress, setSelectedProgress] = useState('All');

    function filter() {
        const lowercaseTitle = title.toLowerCase();
        const filteredTasks = oldTasks.filter(task =>
            task.taskTitle.toLowerCase().includes(lowercaseTitle) &&
            (selectedProgress == 'All' || (selectedProgress.match('Progress') && task.progress) || (selectedProgress.match('Completed') && !task.progress)) && 
            (selectedPriorities.length==0 || selectedPriorities.includes(task.priority))
        );
        setTasks(filteredTasks);
    }

    function handlePriorityChange(priority){
        if (selectedPriorities.includes(priority)) {
            setSelectedPriorities(selectedPriorities.filter(item => item !== priority));
        } else {
            setSelectedPriorities([...selectedPriorities, priority]);
        }
;    }

    function handleProgressChange(selectedType) {
        setSelectedProgress(selectedType);
    }

    function searchFilter(title) {
        setTitle(title);
    }

    useEffect(() => {
        FetchALLTaskService().then((response)=>{
            if(response.success){
                const filterTasks = response.tasks.filter((task)=>task.taskAssigned==memberId);
                setOldTasks(filterTasks);
                setTasks(filterTasks);
            }
        })

        FetchMemberTaskSubmissionService(memberId).then((response)=>{
            if(response.success){

            }
        })
    }, [])

    useEffect(() => {
        filter(); // Call the filter function after selectedProgress is updated
    }, [selectedProgress, title, selectedPriorities]);

    return (
        <>
            <div className='pb-5'>
                {/* Navbar section */}
                <nav className=" navbar-light bg-white mx-3">
                    <div className="d-flex align-items-center justify-content-center p-3 my-3 text-white rounded shadow">
                        <div className="lh-1">
                            <h1 className={`${MyTaskCSS.dashboard_heading} mb-0 lh-1`}><b>Task List</b></h1>
                        </div>
                    </div>
                </nav>
                <div className="my-3 p-3 bg-body rounded shadow mx-3">
                    <div style={{ display: 'flow-root' }}>
                        <section id={`${MyTaskCSS.sidebar}`}>
                            <div className="border-bottom pb-2 ml-2">
                                <h4 id={`${MyTaskCSS.burgundy}`}>Filters</h4>
                            </div>
                            <div className="py-3 border-bottom ml-3">
                                <h6 className={`${MyTaskCSS.h6} font-weight-bold mb-3`}>Search Bar</h6>
                                <form>
                                    <div className={`${MyTaskCSS.form_group}`}>
                                        <div className="input-group">
                                            <input type="text" className="form-control" placeholder="Search" name="q" onChange={(data) => searchFilter(data.currentTarget.value)} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="py-2 border-bottom ml-3">
                                <h6 className={`${MyTaskCSS.h6} font-weight-bold mb-3`}>Categories</h6>
                                <Form>
                                    <div key={`inline-radio`} className="mb-3">
                                        {['All', 'Completed', 'Progress'].map((type) => (
                                            <>
                                                <Form.Check
                                                    inline
                                                    label={type}
                                                    name="group1"
                                                    type="radio"
                                                    id={`inline-radio-1`}
                                                    checked={selectedProgress === type}
                                                    onChange={() => handleProgressChange(type)}
                                                />
                                                <br />
                                            </>
                                        ))}

                                    </div>
                                </Form>
                            </div>
                            <div className="py-2 border-bottom ml-3">
                                <h6 className={`${MyTaskCSS.h6} font-weight-bold mb-3`}>Task Priority</h6>
                                <Form>
                                    {priorities.map((priority) => (
                                        <>
                                            <Form.Check
                                                inline
                                                label={priority.toUpperCase()}
                                                key={`priority-${priority}`}
                                                checked={selectedPriorities.includes(priority)}
                                                onChange={() => handlePriorityChange(priority)}
                                            />
                                            <br />
                                        </>
                                    ))}
                                </Form>
                            </div>
                        </section>
                        {console.log("hi")}
                        <div className="row row-cols-1 row-cols-lg-3 g-2">

                            {
                                tasks.map((task) =>
                                    <div key={task.taskId} className="col">
                                        <Card taskId={task.taskId} memberId={memberId} taskDescription={task.taskDescription} taskTitle={task.taskTitle} priority={task.priority} progress={task.progress} />
                                    </div>
                                )
                            }
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}