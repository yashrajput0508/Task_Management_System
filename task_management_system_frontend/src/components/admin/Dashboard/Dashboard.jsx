import React, { useEffect, useState } from 'react';
import { Form, Tab, Tabs } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardCSS from './Dashboard.module.css';
import Card from '../Card/Card';
import { Constants } from '../../Constants';
import { FetchALLTaskService } from '../../../services/admin/dashboard/TaskService';
import Alert from '../Alert/Alert';
import { useDispatch } from 'react-redux';
import { setInitialTasks } from '../../../redux/counter/adminTask';

export default function Dashboard(params) {

    const navigate = useNavigate();
    const [allTasks, setAllTasks] = useState([]);
    const [show,setShow] = useState(false);
    const [link,setLink] = useState('');
    const [message, setMessage] = useState('');
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const dispatch = useDispatch();

    const priorities = [Constants.LOW,Constants.MEDIUM,Constants.HIGH];
    const [selectedPriorities, setSelectedPriorities] = useState([]);

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [selectedProgress, setSelectedProgress] = useState(Constants.ALL);

    function filter() {
        const lowercaseTitle = title.toLowerCase();
        console.log(selectedPriorities,allTasks);
        const filteredTasks = allTasks.filter(task =>
            task.taskTitle.toLowerCase().includes(lowercaseTitle) &&
            (selectedProgress == Constants.ALL || (selectedProgress.match(Constants.PROGRESS) && task.progress) || (selectedProgress.match(Constants.COMPLETED) && !task.progress)) &&
            (selectedPriorities.length == 0 || selectedPriorities.includes(task.priority))
        );
        setTasks(filteredTasks);
    }

    function handlePriorityChange(priority) {
        if (selectedPriorities.includes(priority)) {
            setSelectedPriorities(selectedPriorities.filter(item => item !== priority));
        } else {
            setSelectedPriorities([...selectedPriorities, priority]);
        }
    }

    function handleProgressChange(selectedType) {
        setSelectedProgress(selectedType);
    }

    function searchFilter(title) {
        setTitle(title);
    }

    useEffect(() => {
        FetchALLTaskService().then((response)=>{
            if(response.success){
                setAllTasks(response.tasks);
                setTasks(response.tasks);
                dispatch(setInitialTasks(response.tasks));
            }else{
                setMessage(response.message);
                handleShow();
            }
        }).catch(()=>{
            setMessage("Server Error");
            handleShow();
        })

    }, [])

    useEffect(() => {
        filter(); // Call the filter function after selectedProgress is updated
    }, [selectedProgress, title, selectedPriorities]);

    return (
        <>
            <div className='pb-5'>
                {/* Navbar section */}

                {show && <Alert title={"Message"} message={message} link={link} show={show} handleClose={handleClose} />}

                <nav className=" navbar-light bg-white mx-3">
                    <div className="d-flex align-items-center justify-content-center p-3 my-3 text-white rounded shadow">
                        <div className="lh-1">
                            <h1 className={`${DashboardCSS.dashboard_heading} mb-0 lh-1`}><b>Task List</b></h1>
                        </div>
                    </div>
                </nav>
                <div className="my-3 p-3 bg-body rounded shadow mx-3">
                    <div style={{ display: 'flow-root' }}>
                        <section id={`${DashboardCSS.sidebar}`}>
                            <div className="border-bottom pb-2 ml-2">
                                <h4 id={`${DashboardCSS.burgundy}`}>Filters</h4>
                            </div>
                            <div className="py-3 border-bottom ml-3">
                                <h6 className={`${DashboardCSS.h6} font-weight-bold mb-3`}>Search Bar</h6>
                                <form>
                                    <div className={`${DashboardCSS.form_group}`}>
                                        <div className="input-group">
                                            <input type="text" className="form-control" placeholder="Search" name="q" onChange={(data) => searchFilter(data.currentTarget.value)} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="py-2 border-bottom ml-3">
                                <h6 className={`${DashboardCSS.h6} font-weight-bold mb-3`}>Categories</h6>
                                <Form>
                                    <div key={`inline-radio`} className="mb-3">
                                        {[Constants.ALL, Constants.COMPLETED, Constants.PROGRESS].map((type, index) => (
                                            <div key={index}>
                                                <Form.Check
                                                    inline
                                                    label={type.toUpperCase()}
                                                    name="group1"
                                                    type="radio"
                                                    id={`inline-radio-1`}
                                                    checked={selectedProgress === type}
                                                    onChange={() => handleProgressChange(type)}
                                                />
                                                <br />
                                            </div>
                                        ))}

                                    </div>
                                </Form>
                            </div>
                            <div className="py-2 border-bottom ml-3">
                                <h6 className={`${DashboardCSS.h6} font-weight-bold mb-3`}>Task Priority</h6>
                                <Form>
                                    {priorities.map((priority,index) => (
                                        <div key={index}>
                                            <Form.Check
                                                inline
                                                label={priority.toUpperCase()}
                                                key={`priority-${priority}`}
                                                checked={selectedPriorities.includes(priority)}
                                                onChange={() => handlePriorityChange(priority)}
                                            />
                                            <br />
                                        </div>
                                    ))}
                                </Form>
                            </div>
                        </section>

                        <div className="row row-cols-1 row-cols-lg-3 g-2">

                            {
                                tasks.map((task) =>
                                    <div key={task.taskId} className="col">
                                        <Card taskId={task.taskId} taskDescription={task.taskDescription} taskTitle={task.taskTitle} priority={task.priority} progress={task.progress} />
                                    </div>
                                )
                            }
                        </div>
                    </div>

                    <button type="button" className={`btn btn-primary rounded-pill ${DashboardCSS.add_task_button}`} onClick={() => navigate("/admin/addtask")}>+ Add Task</button>
                </div>
            </div>
        </>
    );
}
