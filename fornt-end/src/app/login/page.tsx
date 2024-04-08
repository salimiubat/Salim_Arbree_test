'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import baseURL from '../apiConfig';

export default function LoginPage() {
	const router = useRouter();

	const [user, setUser] = React.useState({
		username: '',
		password: '',
	});

	const [buttonDisabled, setButtonDisabled] = React.useState(false);

	const [loading, setLoading] = React.useState(false);


	const onLogin = async () => {
		try {
			setLoading(true);
			const response = await baseURL.post('/token/', user);
			
			const token = response.data.access;
	
			localStorage.setItem('token', token);
	
			console.log('Login successful');
			
			router.push('/blog');
		} catch (error) {
			window.alert('Login failed. Please check your credentials and try again.');

			console.log('Login failed', error.message);
		} finally {
			setLoading(false);
		}
	};
	
	useEffect(() => {
		if (user.username.length > 0 && user.password.length > 0) {
			setButtonDisabled(false);
		} else {
			setButtonDisabled(true);
		}
	}, [user]);

	console.log(user);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<h1 className="py-10 mb-10 text-5xl">
				{loading ? "We're logging you in..." : 'Account Login'}
			</h1>

			<input
				className="w-[350px] text-slate-800 p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
				id="username"
				type="text"
				value={user.username}
				onChange={(e) => setUser({ ...user, username: e.target.value })}
				placeholder="Your username..."
			/>

			<input
				className="w-[350px] text-slate-800 p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
				id="password"
				type="password"
				value={user.password}
				onChange={(e) => setUser({ ...user, password: e.target.value })}
				placeholder="Your Password..."
			/>

			<button
				onClick={onLogin}
				className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 uppercase px-40 py-3 mt-10 font-bold">
				Login
			</button>

			<Link href="/sign-up">
				<p className="mt-10">
					Do not have an account yet?
					<span className="font-bold text-green-600 ml-2 cursor-pointer underline">
						Register your free account now
					</span>
				</p>
			</Link>

			
		</div>
	);
}
