import { FC, Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import FileAttachmentCard from "./FileAttachmetCard";
import { RootState } from "reducers";
import { ReactComponent as ProjectIcon } from 'assets/illustrations/icons/project.svg';
import { ReactComponent as CategoryIcon } from 'assets/illustrations/icons/category.svg';
import { ReactComponent as LinkIcon } from 'assets/illustrations/icons/link.svg';
import { ReactComponent as CoinIcon } from 'assets/illustrations/icons/coin.svg';
import styles from './index.module.scss';
import calculateTaskXP from "utils/calculateTaskXp";
import { useDispatch } from "react-redux";
import { SET_TASK_XP } from "actions/flProject/types";

interface ITaskDetail {
    setViewTalentList: Dispatch<SetStateAction<boolean>>;
    project_name: string;
    handleCommit: any;
    project_founder: string;
}

const TaskDetail: FC<ITaskDetail> = ({ setViewTalentList, project_name, project_founder, handleCommit }) => {

    const dispatch = useDispatch();

    const { selectedTask, taskXP } = useSelector((state: RootState) => state.flProject);
    const walletId = useSelector((state: RootState) => state.user.user?.walletId);

    useEffect(() => {
        const getXP = async () => {
            const _xp = await calculateTaskXP(walletId, selectedTask?.estimatedDifficulty);
            dispatch({
                type: SET_TASK_XP,
                payload: Number(_xp)
            });
        }
        if (selectedTask !== null) {
            getXP();
        }
    }, [selectedTask]);

    return (
        <div>
            <div className={styles['avatar-container']}>
                <button>{selectedTask?.status}</button>
                {
                    selectedTask?.profileTask.length > 0 && <div onClick={() => setViewTalentList(true)}>
                        {
                            selectedTask?.status !== 'open' && selectedTask?.profileTask.filter((profile: any) => profile.applicationStatus === 'accepted').length > 0 ?
                                selectedTask?.profileTask.filter((profile: any) => profile.applicationStatus === 'accepted').map((item: any, index: number) =>
                                    item.Profile.picture !== null ?
                                        <img src="" alt="" key={index} /> :
                                        <div className={styles['builder-avatar']} key={index}></div>
                                ) : (
                                    <>
                                        {
                                            selectedTask?.profileTask.map((item: any, index: number) => item.Profile.picture !== null ?
                                                <img src="" alt="" key={index} /> :
                                                <div className={styles['builder-avatar']} key={index}></div>
                                            )
                                        }
                                    </>
                                )
                        }
                    </div>
                }
            </div>
            <div className={styles['project-details']}>
                <div>
                    <div className={styles['project-detail-item']}>
                        <ProjectIcon width={24} height={24} />
                        <div>Project: {project_name}</div>
                    </div>
                    <div className={styles['project-detail-item']}>
                        <i className='material-icons'>star</i>
                        <div><span>Difficulty:</span>&nbsp;
                            {
                                [0, 1, 2, 3, 4].slice(0, selectedTask?.estimatedDifficulty).map((item: number, index: number) => (
                                    <i className={clsx('material-icons', styles['rating-star'])} key={index}>star</i>
                                ))
                            }
                            {
                                [0, 1, 2, 3, 4].slice(0, 5 - selectedTask?.estimatedDifficulty).map((item: number, index: number) => (
                                    <i className='material-icons' key={index}>star</i>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div>
                    <div className={styles['project-detail-item']}>
                        <CategoryIcon width={24} height={24} />
                        <div>Category: {selectedTask?.flProjectCategory?.categoryName}</div>
                    </div>
                    <div className={styles['project-detail-item']}>
                        <i className='material-icons'>attach_money</i>
                        <div>Value: {selectedTask?.price} USDC</div>
                    </div>
                </div>
                <div>
                    <div className={styles['project-detail-item']}>
                        <span>&nbsp;XP</span>
                        <div>Point: {taskXP}XP</div>
                    </div>
                    <div className={styles['project-detail-item']}>
                        <i className='material-icons'>local_fire_department</i>
                        <div>Burned: 10 &emsp;<CoinIcon width={20} height={20} /></div>
                    </div>
                </div>
            </div>
            <div className={styles['project-description']}>
                <p>
                    {selectedTask?.description}
                </p>
                {selectedTask?.taskAttachment.length > 0 && <div className={styles['project-attachments']}>
                    {
                        selectedTask?.taskAttachment.map((file: any, index: number) => <FileAttachmentCard key={index} label="Wireframes v1.0" />)
                    }
                </div>}
            </div>
            <div className={styles['project-check-list']}>
                <p>Checklist: </p>
                {
                    selectedTask?.taskChecklist.map((item: any, index: number) => (
                        <p key={index}>
                            <span></span>
                            <div>{item.title}</div>
                            <LinkIcon width={18} height={18} />
                        </p>
                    ))
                }
            </div>
            <div className={styles['project-action-delete']}>
                {
                    project_founder.toLowerCase() === walletId?.toLowerCase() ? (
                        <span>
                            <i className='material-icons'>delete</i>
                            <span>Delete Task</span>
                        </span>
                    ) : selectedTask?.status === 'open' ? (
                        <button>Apply for task</button>
                    ) : (selectedTask?.status === 'interviewing' &&
                        selectedTask?.profileTask.filter((item: any) => item?.Profile?.user?.walletId.toLowerCase() === walletId?.toLowerCase() && item?.applicationStatus === 'accepted').length > 0) ? (
                        <button onClick={handleCommit}>Commit to task</button>
                    ) : <></>
                }
            </div>
        </div>
    )
}

export default TaskDetail;