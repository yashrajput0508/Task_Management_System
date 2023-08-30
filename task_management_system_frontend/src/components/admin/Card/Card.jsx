import { useEffect, useState } from 'react';
import CardCSS from './Card.module.css';
import { useNavigate } from 'react-router-dom';
import { Constants } from '../../Constants';

export default function Card(params) {

    const [isProgress, setIsProgress] = useState(false);
    const [priority, setPriority] = useState(Constants.LOW);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskId, setTaskId] = useState(0);
    const navigate = useNavigate();

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        }
        return text.slice(0, maxLength) + '...';
    };

    useEffect(() => {
        if (params.progress) {
            setIsProgress(params.progress);
        }

        if(params.priority){
            setPriority(params.priority);
        }

        if(params.taskTitle){
            setTaskTitle(params.taskTitle);
        }

        if(params.taskDescription){
            setTaskDescription(params.taskDescription);
        }

        if(params.taskId){
            setTaskId(params.taskId);
        }

    }, [params])

    return (
        <>
            <div className={`${CardCSS.section_our_solution} ${CardCSS.cards}`}>
                <div className={`${CardCSS.row}`}>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className={`${CardCSS.our_solution_category}`}>
                            <div className={`${CardCSS.solution_cards_box}`}>
                                <div className={`${CardCSS.solution_card}`}>
                                    <div className={`${CardCSS.hover_color_bubble}`}></div>
                                    <div className={`${CardCSS.solu_title} d-flex justify-content-between align-items-center`}>
                                        <h3>{taskTitle}</h3>
                                        {
                                            isProgress ?
                                                <span className={`${CardCSS.icon_in_progress} fa fa-spinner`}></span> :
                                                <span id="boot-icon" className={`${CardCSS.success_icon} fa fa-check-circle`} style={{ fontSize: 20, color: "rgb(0, 128, 55)", opacity: 0.4 }}></span>
                                        }
                                    </div>
                                    <div className={`${CardCSS.solu_description}`}>
                                        <p>
                                        {truncateText(taskDescription, 145)}
                                        </p>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className={`${CardCSS.priority_section}`}>
                                                <span className={`${CardCSS.priority_badge} ${CardCSS[`${priority}_priority`]}`}>
                                                    {priority.toUpperCase()}
                                                </span>
                                            </div>
                                            <button type="button" className="read_more_btn" onClick={()=>navigate(`/admin/dashboard/${taskId}`)}>Read More</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}