import {
	Button,
	Container,
	Text,
	Title,
	Modal,
	TextInput,
	Group,
	Card,
	ActionIcon,
	Code,
} from '@mantine/core';
import { useState, useRef, useEffect } from 'react';
import { MoonStars, Sun, Trash } from 'tabler-icons-react';

import {
	MantineProvider,
	ColorSchemeProvider,
	ColorScheme,
} from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';

export default function TodoList() {
	const [tasks, setTasks] = useState([]);
	const [opened, setOpened] = useState(false);

	const preferredColorScheme = useColorScheme();
	const [colorScheme, setColorScheme] = useLocalStorage({
		key: 'mantine-color-scheme',
		defaultValue: 'light',
		getInitialValueInEffect: true,
	});
	const toggleColorScheme = value =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

	useHotkeys([['mod+J', () => toggleColorScheme()]]);

	const taskTitle = useRef('');
	const taskSummary = useRef('');

	function createTask() {
		setTasks([
			...tasks,
			{
				title: taskTitle.current.value,
				summary: taskSummary.current.value,
			},
		]);

		saveTasks([
			...tasks,
			{
				title: taskTitle.current.value,
				summary: taskSummary.current.value,
			},
		]);
	}

	function deleteTask(index) {
		var clonedTasks = [...tasks];

		clonedTasks.splice(index, 1);

		setTasks(clonedTasks);

		saveTasks([...clonedTasks]);
	}

	function loadTasks() {
		let loadedTasks = localStorage.getItem('tasks');

		let tasks = JSON.parse(loadedTasks);

		if (tasks) {
			setTasks(tasks);
		}
	}

	function saveTasks(tasks) {
		localStorage.setItem('tasks', JSON.stringify(tasks));
	}

	useEffect(() => {
		loadTasks();
	}, []);

	return (
		<ColorSchemeProvider
			colorScheme={colorScheme}
			toggleColorScheme={toggleColorScheme}>
			<MantineProvider
				theme={{ colorScheme, defaultRadius: 'md' }}
				withGlobalStyles
				withNormalizeCSS>
				<div className='App'>
					<Modal
						opened={opened}
						size={'md'}
						title={'일정 생성'}
						withCloseButton={false}
						onClose={() => {
							setOpened(false);
						}}
						centered>
						<TextInput
							mt={'md'}
							ref={taskTitle}
							placeholder={'제목 입력하세요.'}
							required
							label={'제목'}
						/>
						<TextInput
							ref={taskSummary}
							mt={'md'}
							placeholder={'일정 내용 입력하세요.'}
							label={'일정 내용'}
						/>
						<Group mt={'md'} position={'apart'}>
							<Button
								onClick={() => {
									setOpened(false);
								}}
								variant={'subtle'}>
								취소
							</Button>
							<Button
								onClick={() => {
		




							createTask();
									setOpened(false);
								}}>
								추가
							</Button>
						</Group>
					</Modal>
					<Container size="xs" my={40}>
						<Group position={'apart'}>
							<Title
								sx={theme => ({
									fontFamily: `Greycliff CF, ${theme.fontFamily}`,
									fontWeight: 900,
								})}>
                                Todo
							</Title>
							<ActionIcon
								color={'blue'}
								onClick={() => toggleColorScheme()}
								size='lg'>
								{colorScheme === 'dark' ? (
									<Sun size={16} />
								) : (
									<MoonStars size={16} />
								)}
							</ActionIcon>
						</Group>
						{tasks.length > 0 ? (
							tasks.map((task, index) => {
								if (task.title) {
									return (
										<Card withBorder key={index} mt={'sm'}>
											<Group position={'apart'}>
												<Text weight={'bold'}>{task.title}</Text>
												<ActionIcon
													onClick={() => {
														deleteTask(index);
													}}
													color={'red'}
													variant={'transparent'}>
													<Trash />
												</ActionIcon>
											</Group>
											<Text color={'dimmed'} size={'md'} mt={'sm'}>
												{task.summary
													? task.summary
													: 'No summary was provided for this task'}
											</Text>
										</Card>
									);
								}
							})
						) : (
							<Text size={'lg'} mt={'md'} color={'dimmed'}>
								천리길도 한 걸음부터
							</Text>
						)}
						<Button
							onClick={() => {
								setOpened(true);
							}}
							fullWidth
							mt={'md'}>
							새로운 일정
						</Button>
					</Container>
				</div>
			</MantineProvider>
		</ColorSchemeProvider>
	);
}