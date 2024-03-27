import { useEffect, useState } from "preact/hooks";
import Chess from "./components/Chess";

export function App() {

	const [copyString, setCopyString] = useState('')

	useEffect(() => {
		const year = new Date().getFullYear()
		const range = year === 2024 ? '' : ` - ${year}`
		setCopyString(`2024${range}`)
	}, [copyString])

	return (
		<div class="flex flex-col gap-y-10 bg-slate-600 min-h-screen">

			<div class="flex justify-center items-center h-16 bg-slate-900">
				<h1 class="text-white text-4xl text-center">Chess</h1>
			</div>

			<Chess />

			<div class="flex flex-col bg-slate-900 w-full h-fit absolute bottom-0">
				<p class="text-white text-l text-center">Made by Zach Harvey</p>
				<a class="text-white text-l text-center" href="https://github.com/Unknowncall/chess" target="_blank"><p>GitHub</p></a>
				<p class="text-white text-l text-center">&copy; {copyString}</p>
			</div>
		</div>
	)
}
