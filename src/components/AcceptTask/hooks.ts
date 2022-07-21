import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { QueryClient, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { AbiItem } from "web3-utils";
import config from "config";
import { handleApiErrors } from "utils/handleApiErrors";
import { handleError } from "utils/handleUnAuthorization";
import { getWeb3Instance } from "utils/web3EventFn";
import { FNDRAddress, taskContractAddress } from "contracts/contracts";
import { RootState } from "reducers";
import TaskAbi from 'contracts/abi/Task.sol/Task.json';
import ProjectAbi from 'contracts/abi/Project.sol/Project.json';
import USDCAbi from 'contracts/abi/USDCToken.sol/USDCToken.json';
import { getAccessToken } from "utils/authFn";
import { SET_ACCEPTED_BUILDER, SET_REJECTED_BUILDER } from "actions/flProject/types";

const useFetchTaskData = (taskId: number | undefined) => {
    if (taskId) {
        const { data } = useQuery(
            'task_detail',
            async () => {
                const response = await fetch(
                    `${config.ApiBaseUrl}/task/${taskId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const json = await handleApiErrors(response);
                return json;
            },
            {
                retry: 1,
                refetchOnWindowFocus: false,
                onError: (error: any) => {
                    handleError({
                        error,
                        explicitMessage: 'Unable to fetch task data',
                    });
                },
            }
        );
        return { taskData: data };
    }
    return { taskData: null };
};

const useSelectBuilder = () => {

    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const [pending, setPending] = useState('initial');
    const accessToken = getAccessToken();

    const walletId = useSelector((state: RootState) => state.user.user?.walletId);

    const selectBuilder = async (projectAddress: string, builderInfo: any, taskId: number, taskName: string, price: number, xp: number) => {
        try {
            setPending('waiting');
            const web3 = getWeb3Instance();

            const taskContract = new web3.eth.Contract(TaskAbi.abi as AbiItem[], taskContractAddress);
            const result = await taskContract.methods.createTask(projectAddress, builderInfo?.Profile?.user?.walletId, taskName, web3.utils.toWei(String(price), 'ether'), xp)
                .send({ from: walletId });
            const tokenId = result.events.TaskCreated.returnValues.taskId;

            const projectContract = new web3.eth.Contract(ProjectAbi.abi as AbiItem[], projectAddress);
            await projectContract.methods.addTask(tokenId, taskContractAddress).send({ from: walletId });

            saveAcceptedBuilder(taskId, builderInfo?.profileId, queryClient);
            setPending('confirmed');
        } catch (err: any) {
            setPending('failed');
            toast.error(err?.code === 4001 ? 'MetaMask Tx Signature: User denied transaction signature.' : 'Error happens while confirming transaction');
        }
    }

    const saveAcceptedBuilder = async (taskId: number, profileId: number, queryClient: QueryClient) => {
        try {
            const ac = new AbortController();
            const { signal } = ac;

            const payload = { profileId: Number(profileId), taskId: Number(taskId) }
            const response = await fetch(
                `${config.ApiBaseUrl}/task/acceptBuilder`,
                {
                    signal,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(payload)
                }
            );
            await handleApiErrors(response);
            dispatch({
                type: SET_ACCEPTED_BUILDER,
                payload: profileId
            });
            queryClient.invalidateQueries('projectTasks');
        } catch (err) {
            console.log(err);
        }
    }

    const saveRejectedBuilder = async (data: any, taskId: number) => {
        try {
            const ac = new AbortController();
            const { signal } = ac;

            const payload = { profileId: data?.profileId, taskId: taskId }
            const response = await fetch(
                `${config.ApiBaseUrl}/task/rejectBuilder`,
                {
                    signal,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(payload)
                }
            );
            await handleApiErrors(response);
            dispatch({
                type: SET_REJECTED_BUILDER,
                payload: data?.profileId
            });
        } catch (err) {
            console.log(err);
        }
    }

    return { selectBuilder, pending, saveRejectedBuilder }
}

const useCommitToTask = () => {

    const [pending, setPending] = useState('initial');
    const [hash, setHash] = useState('');

    const walletId = useSelector((state: RootState) => state.user.user?.walletId);

    const commitToTask = async (taskId: number, amount: number) => {
        try {
            const web3 = getWeb3Instance();

            // TODO: change USDCAbi to FNDRAbi
            const FNDRContract = new web3.eth.Contract(USDCAbi.abi as AbiItem[], FNDRAddress);
            const balance = await FNDRContract.methods.balanceOf(walletId).call();
            if (balance >= web3.utils.toWei(String(amount), 'ether')) {
                FNDRContract.methods.approve(taskContractAddress, web3.utils.toWei(String(amount), 'ether'))
                    .send({ from: walletId })
                    .on('transactionHash', (hash: any) => {
                        setHash(hash);
                        setPending('approving');
                    })
                    .on('receipt', (receipt: any) => {
                        setPending('confirming');
                        const taskContract = new web3.eth.Contract(TaskAbi.abi as AbiItem[], taskContractAddress);
                        taskContract.methods.commitToTask(taskId, web3.utils.toWei(String(amount), 'ether'))
                            .send({ from: walletId })
                            .on('transactionHash', (hash: any) => {
                                setHash(hash);
                                setPending('confirming');
                            })
                            .on('receipt', (receipt: any) => {
                                setPending('confirmed');
                            })
                            .on('error', (err: any) => {
                                setPending('failed');
                            })
                    })
                    .on('error', (err: any) => {
                        setPending('failed');
                    })

            } else {
                toast.error("Insufficient FNDR balance");
            }
        } catch (err) {
            console.log(err);
            toast.error('Error happens while confirming transaction');
            setPending('failed');
        }
    }
    return { commitToTask, pending, hash }
}

export { useFetchTaskData, useSelectBuilder, useCommitToTask };